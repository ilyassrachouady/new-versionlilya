import "server-only";

import { adminObjects } from "@/lib/admin-data";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigState } from "@/lib/supabase/config";

export type AdminProduct = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string | null;
  price_eur: number;
  stock_quantity: number;
  low_stock_threshold: number;
  status: string;
  image_url: string | null;
  metadata: unknown;
};

async function reader() {
  return createAdminClient() ?? (supabaseConfigState.publicReady ? await createClient() : null);
}

function localProducts(): AdminProduct[] {
  return adminObjects.map((product, index) => ({
    id: `local-${index + 1}`,
    sku: product.sku,
    slug: product.sku.toLowerCase(),
    name: product.name,
    description: null,
    price_eur: product.price,
    stock_quantity: product.inventory,
    low_stock_threshold: 10,
    status: "active",
    image_url: product.image,
    metadata: { collection: product.collection, source: "local-fallback" },
  }));
}

export async function getAdminProducts(query = "") {
  const client = await reader();
  if (!client) return filterLocalProducts(query);
  let request = client.from("products").select("id,sku,slug,name,description,price_eur,stock_quantity,low_stock_threshold,status,image_url,metadata").order("name");
  const clean = query.trim();
  if (clean) request = request.or(`name.ilike.%${clean.replaceAll(",", "")}%,sku.ilike.%${clean.replaceAll(",", "")}%,slug.ilike.%${clean.replaceAll(",", "")}%`);
  try {
    const { data, error } = await request;
    if (error) throw error;
    return data as AdminProduct[];
  } catch {
    return filterLocalProducts(query);
  }
}

function filterLocalProducts(query: string) {
  const clean = query.trim().toLocaleLowerCase("fr");
  const products = localProducts();
  if (!clean) return products;
  return products.filter((product) => `${product.name} ${product.sku} ${product.slug}`.toLocaleLowerCase("fr").includes(clean));
}

export async function getAdminProduct(sku: string) {
  const client = await reader();
  if (!client) return localProducts().find((product) => product.sku === sku) ?? null;
  try {
    const { data, error } = await client.from("products").select("id,sku,slug,name,description,price_eur,stock_quantity,low_stock_threshold,status,image_url,metadata").eq("sku", sku).maybeSingle();
    if (error) throw error;
    return data as AdminProduct | null;
  } catch {
    return localProducts().find((product) => product.sku === sku) ?? null;
  }
}
