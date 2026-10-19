"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireLocalAdminClient } from "@/lib/admin-access";
import { resolveProductImageUrl } from "@/lib/admin-product-image";
import {
  fragranceOptions,
  parseFragrance,
  parseProductType,
  productTypeOptions,
  slugify,
  suggestSku,
  suggestSlug,
} from "@/lib/admin-product-form";

export type ProductFormState = { error: string } | null;

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function positiveNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function isRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: string }).digest).includes("NEXT_REDIRECT")
  );
}

function asFormError(error: unknown): ProductFormState {
  if (isRedirect(error)) throw error;
  return { error: error instanceof Error ? error.message : "Enregistrement impossible." };
}

function catalogFields(formData: FormData) {
  const name = text(formData, "name");
  if (!name) throw new Error("Donnez un nom au produit.");
  const type = parseProductType(text(formData, "product_type"));
  const fragrance = parseFragrance(text(formData, "fragrance"));
  const volume = Math.floor(positiveNumber(formData, "volume_ml", productTypeOptions.find((option) => option.id === type)?.volume ?? 200));
  const sku = (text(formData, "sku") || suggestSku(type, fragrance, volume)).toUpperCase();
  const slug =
    slugify(text(formData, "slug")) ||
    suggestSlug(name, type, fragrance) ||
    slugify(sku);
  if (!sku || !slug) throw new Error("Le SKU et le slug n’ont pas pu être composés.");
  const status = text(formData, "status") || "draft";
  if (!["draft", "active", "archived"].includes(status)) throw new Error("Statut produit invalide.");
  const scent = fragranceOptions.find((option) => option.id === fragrance)?.label ?? "";
  return {
    name,
    sku,
    slug,
    description: text(formData, "description") || null,
    price_mad: positiveNumber(formData, "price_mad"),
    stock_quantity: Math.floor(positiveNumber(formData, "stock_quantity")),
    low_stock_threshold: Math.floor(positiveNumber(formData, "low_stock_threshold", 10)),
    status,
    metadata: {
      productType: type,
      fragrance,
      scent,
      size: volume ? `${volume} ML` : "",
      volumeMl: volume,
    },
  };
}

function refreshCatalog(sku?: string) {
  updateTag("storefront-catalog");
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/database");
  if (sku) revalidatePath(`/admin/products/${sku}`);
}

function writeError(error: { code?: string; message: string }, fallback: string) {
  if (error.code === "23505") return "Ce SKU ou cette URL de produit existe déjà.";
  return `${fallback}: ${error.message}`;
}

export async function createProduct(_state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  let sku = "";
  try {
    const client = await requireLocalAdminClient();
    const payload = catalogFields(formData);
    sku = payload.sku;
    const image_url = await resolveProductImageUrl(client, formData, payload.sku);
    const { error } = await client.from("products").insert({ ...payload, image_url, metadata: payload.metadata });
    if (error) throw new Error(writeError(error, "Création impossible"));
    refreshCatalog(payload.sku);
  } catch (error) {
    return asFormError(error);
  }
  redirect(`/admin/products/${encodeURIComponent(sku)}?succes=cree`);
}

export async function updateProduct(id: string, _state: ProductFormState, formData: FormData): Promise<ProductFormState> {
  try {
    const client = await requireLocalAdminClient();
    const payload = catalogFields(formData);
    const image_url = await resolveProductImageUrl(client, formData, payload.sku);
    const { data: current, error: readError } = await client.from("products").select("metadata").eq("id", id).single();
    if (readError) throw new Error(`Produit introuvable: ${readError.message}`);
    const previous =
      current.metadata && typeof current.metadata === "object" && !Array.isArray(current.metadata)
        ? (current.metadata as Record<string, unknown>)
        : {};
    const { error } = await client
      .from("products")
      .update({ ...payload, image_url, metadata: { ...previous, ...payload.metadata } })
      .eq("id", id);
    if (error) throw new Error(writeError(error, "Enregistrement impossible"));
    refreshCatalog(payload.sku);
  } catch (error) {
    return asFormError(error);
  }
  redirect(`/admin/products/${encodeURIComponent(text(formData, "sku").toUpperCase())}?succes=enregistre`);
}

export async function archiveProduct(id: string) {
  const client = await requireLocalAdminClient();
  const { error } = await client.from("products").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(`Archivage impossible: ${error.message}`);
  refreshCatalog();
  redirect("/admin/products?succes=archive");
}

export async function adjustStock(id: string, formData: FormData) {
  const client = await requireLocalAdminClient();
  const quantity = Math.trunc(Number(formData.get("quantity")));
  const reason = text(formData, "reason");
  if (!Number.isFinite(quantity) || quantity === 0 || !reason) throw new Error("Indiquez une quantité non nulle et un motif.");
  const { data: product, error: readError } = await client.from("products").select("stock_quantity").eq("id", id).single();
  if (readError) throw new Error(`Stock introuvable: ${readError.message}`);
  const next = Math.max(0, product.stock_quantity + quantity);
  const [{ error: updateError }, { error: movementError }] = await Promise.all([
    client.from("products").update({ stock_quantity: next }).eq("id", id),
    client.from("inventory_movements").insert({ product_id: id, quantity, reason }),
  ]);
  if (updateError || movementError) throw new Error(`Ajustement impossible: ${(updateError ?? movementError)?.message}`);
  refreshCatalog();
}
