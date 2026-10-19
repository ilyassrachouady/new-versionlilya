import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";

const paymentLabels: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  failed: "Échouée",
  refunded: "Remboursée",
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  processing: "En préparation",
  fulfilled: "Traitée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refunded: "Remboursée",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Casablanca",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function addressField(address: Json, key: string) {
  if (!address || typeof address !== "object" || Array.isArray(address)) return "";
  const value = (address as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

export async function getAdminOrders() {
  const client = createAdminClient();
  if (!client) return [];
  const { data, error } = await client
    .from("orders")
    .select("id,order_number,email,status,payment_status,total,shipping_address,created_at,customer_id")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Admin orders", error);
    return [];
  }

  const ids = (data ?? []).map((order) => order.id);
  const customerIds = [...new Set((data ?? []).map((order) => order.customer_id).filter(Boolean))] as string[];
  const counts = new Map<string, number>();
  const names = new Map<string, { full_name: string; country: string | null }>();

  await Promise.all([
    ids.length
      ? client
          .from("order_items")
          .select("order_id,quantity")
          .in("order_id", ids)
          .then(({ data: items }) => {
            for (const item of items ?? []) {
              counts.set(item.order_id, (counts.get(item.order_id) ?? 0) + item.quantity);
            }
          })
      : Promise.resolve(),
    customerIds.length
      ? client
          .from("customers")
          .select("id,full_name,country")
          .in("id", customerIds)
          .then(({ data: customers }) => {
            for (const customer of customers ?? []) {
              names.set(customer.id, customer);
            }
          })
      : Promise.resolve(),
  ]);

  return (data ?? []).map((order) => {
    const customer = order.customer_id ? names.get(order.customer_id) : undefined;
    const address = order.shipping_address;
    return {
      id: order.order_number,
      uuid: order.id,
      customer: customer?.full_name || addressField(address, "fullName") || order.email,
      email: order.email,
      items: counts.get(order.id) ?? 0,
      country: customer?.country || addressField(address, "country") || "—",
      total: Number(order.total),
      payment: paymentLabels[order.payment_status] ?? order.payment_status,
      status: statusLabels[order.status] ?? order.status,
      date: formatDate(order.created_at),
    };
  });
}

export async function getAdminOrder(orderNumber: string) {
  const client = createAdminClient();
  if (!client) return null;
  const { data: order, error } = await client.from("orders").select("*").eq("order_number", orderNumber).maybeSingle();
  if (error || !order) return null;
  const [{ data: items }, customerResult] = await Promise.all([
    client.from("order_items").select("name,sku,unit_price,quantity").eq("order_id", order.id).order("created_at"),
    order.customer_id
      ? client.from("customers").select("full_name,phone,country,email").eq("id", order.customer_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const customer = customerResult.data;
  const address = order.shipping_address;
  return {
    id: order.order_number,
    email: order.email,
    customer: customer?.full_name || addressField(address, "fullName") || order.email,
    phone: customer?.phone || addressField(address, "phone"),
    country: customer?.country || addressField(address, "country") || "—",
    city: addressField(address, "city"),
    line1: addressField(address, "line1"),
    status: statusLabels[order.status] ?? order.status,
    payment: paymentLabels[order.payment_status] ?? order.payment_status,
    paymentStatus: order.payment_status,
    fulfillment: order.status,
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping_total),
    total: Number(order.total),
    date: formatDate(order.created_at),
    items: (items ?? []).map((item) => ({
      name: item.name,
      sku: item.sku,
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
    })),
  };
}

export async function getAdminCustomers() {
  const client = createAdminClient();
  if (!client) return [];
  const [{ data: customers, error }, { data: orders }] = await Promise.all([
    client.from("customers").select("id,email,full_name,country,created_at").order("created_at", { ascending: false }),
    client.from("orders").select("customer_id,email,total,created_at"),
  ]);
  if (error) {
    console.error("Admin customers", error);
    return [];
  }
  return (customers ?? []).map((customer) => {
    const related = (orders ?? []).filter(
      (order) => order.customer_id === customer.id || order.email === customer.email,
    );
    const value = related.reduce((sum, order) => sum + Number(order.total), 0);
    const last = related.sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
    return {
      name: customer.full_name,
      email: customer.email,
      country: customer.country || "—",
      orders: related.length,
      value,
      last: last ? formatDate(last.created_at) : "—",
      segment: related.length >= 4 ? "Fidèle" : related.length === 0 ? "Nouveau" : related.length === 1 ? "Première commande" : "Client",
    };
  });
}
