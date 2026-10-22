"use server";

import { revalidatePath, updateTag } from "next/cache";

import { catalogProducts } from "@/lib/catalog";
import { inyadPayment } from "@/lib/payment";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";

export type PlaceOrderError = "unavailable" | "empty" | "required" | "stock" | "limit";

export type PlaceOrderResult =
  | { ok: true; orderNumber: string; totalEUR: number; paymentUrl: string }
  | { ok: false; error: PlaceOrderError };

type IncomingLine = { slug: string; quantity: number };

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseLines(formData: FormData): IncomingLine[] {
  try {
    const parsed: unknown = JSON.parse(String(formData.get("lines") ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((line) => {
        if (!line || typeof line !== "object") return null;
        const slug = String((line as IncomingLine).slug ?? "").trim();
        const quantity = Math.floor(Number((line as IncomingLine).quantity));
        if (!slug || !Number.isFinite(quantity) || quantity < 1) return null;
        return { slug, quantity: Math.min(quantity, 20) };
      })
      .filter((line): line is IncomingLine => line !== null);
  } catch {
    return [];
  }
}

function orderNumber() {
  return `MLZ-${Date.now().toString().slice(-8)}`;
}

function emailLooksValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function placeOrder(formData: FormData): Promise<PlaceOrderResult> {
  const client = createAdminClient();
  if (!client || !inyadPayment.url) return { ok: false, error: "unavailable" };

  const fullName = text(formData, "fullName");
  const email = text(formData, "email").toLowerCase();
  const phone = text(formData, "phone");
  const country = text(formData, "country") || "Maroc";
  const city = text(formData, "city");
  const address = text(formData, "address");
  const lines = parseLines(formData);

  if (!fullName || !emailLooksValid(email) || !phone || !city || !address) {
    return { ok: false, error: "required" };
  }
  if (lines.length === 0) return { ok: false, error: "empty" };

  const { data: rows, error: catalogError } = await client
    .from("products")
    .select("id,sku,slug,name,price_eur,stock_quantity,status")
    .eq("status", "active");
  if (catalogError || !rows) return { ok: false, error: "unavailable" };

  const prepared = [];
  for (const line of lines) {
    const staticProduct = catalogProducts.find((product) => product.slug === line.slug);
    const row =
      rows.find((item) => item.slug === line.slug) ??
      rows.find((item) => staticProduct?.sku && item.sku === staticProduct.sku);
    if (!row) return { ok: false, error: "stock" };
    if (line.quantity > row.stock_quantity) return { ok: false, error: "stock" };
    prepared.push({
      ...line,
      productId: row.id,
      sku: row.sku,
      name: row.name,
      unitPrice: Number(row.price_eur),
      stock: row.stock_quantity,
    });
  }

  const subtotal = prepared.reduce((sum, line) => sum + Math.round(line.unitPrice * 100) * line.quantity, 0) / 100;
  if (subtotal > inyadPayment.maxEUR) return { ok: false, error: "limit" };

  const { data: existingCustomer } = await client.from("customers").select("id").eq("email", email).maybeSingle();
  let customerId = existingCustomer?.id ?? null;
  const customerPayload = {
    email,
    full_name: fullName,
    phone,
    country,
    metadata: { city, address } as Json,
  };
  if (customerId) {
    const { error } = await client.from("customers").update(customerPayload).eq("id", customerId);
    if (error) return { ok: false, error: "unavailable" };
  } else {
    const { data, error } = await client.from("customers").insert(customerPayload).select("id").single();
    if (error || !data) return { ok: false, error: "unavailable" };
    customerId = data.id;
  }

  let number = orderNumber();
  const shippingAddress = { fullName, phone, country, city, line1: address } as Json;
  const { data: order, error: orderError } = await client
    .from("orders")
    .insert({
      order_number: number,
      customer_id: customerId,
      email,
      status: "pending",
      payment_status: "pending",
      currency: "EUR",
      subtotal,
      shipping_total: 0,
      total: subtotal,
      shipping_address: shippingAddress,
    })
    .select("id,order_number")
    .single();

  if (orderError?.code === "23505") {
    number = `${orderNumber()}X`;
    const retry = await client
      .from("orders")
      .insert({
        order_number: number,
        customer_id: customerId,
        email,
        status: "pending",
        payment_status: "pending",
        currency: "EUR",
        subtotal,
        shipping_total: 0,
        total: subtotal,
        shipping_address: shippingAddress,
      })
      .select("id,order_number")
      .single();
    if (retry.error || !retry.data) return { ok: false, error: "unavailable" };
    return finalizeOrder(client, retry.data.id, retry.data.order_number, subtotal, prepared);
  }

  if (orderError || !order) return { ok: false, error: "unavailable" };
  return finalizeOrder(client, order.id, order.order_number, subtotal, prepared);
}

async function finalizeOrder(
  client: NonNullable<ReturnType<typeof createAdminClient>>,
  orderId: string,
  orderNumberValue: string,
  totalEUR: number,
  prepared: { productId: string; sku: string; name: string; unitPrice: number; quantity: number; stock: number }[],
): Promise<PlaceOrderResult> {
  const { error: itemsError } = await client.from("order_items").insert(
    prepared.map((line) => ({
      order_id: orderId,
      product_id: line.productId,
      sku: line.sku,
      name: line.name,
      unit_price: line.unitPrice,
      quantity: line.quantity,
    })),
  );
  if (itemsError) {
    await client.from("orders").delete().eq("id", orderId);
    return { ok: false, error: "unavailable" };
  }

  for (const line of prepared) {
    const next = Math.max(0, line.stock - line.quantity);
    const [{ error: stockError }, { error: movementError }] = await Promise.all([
      client.from("products").update({ stock_quantity: next }).eq("id", line.productId),
      client.from("inventory_movements").insert({
        product_id: line.productId,
        quantity: -line.quantity,
        reason: "commande boutique",
        reference: orderNumberValue,
      }),
    ]);
    if (stockError || movementError) {
      return { ok: false, error: "unavailable" };
    }
  }

  updateTag("storefront-catalog");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/customers");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin");
  return { ok: true, orderNumber: orderNumberValue, totalEUR, paymentUrl: inyadPayment.url };
}
