import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import {
  catalogProducts,
  fragrances,
  getProduct as getStaticProduct,
  relatedProducts as relatedStatic,
  type FragranceId,
  type Product,
  type ProductType,
  type RitualId,
} from "@/lib/catalog";
import { shopProductImages } from "@/lib/shop-product-images";
import { getPublicSupabaseConfig, supabaseConfigState } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";
import { fetchWithSupabaseTimeout } from "@/lib/supabase/fetch-with-timeout";

type StorefrontRow = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  price_mad: number;
  stock_quantity: number;
  status: string;
  image_url: string | null;
  metadata: unknown;
};

function metaString(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object" || !(key in metadata)) return "";
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

function inferFragrance(value: string): FragranceId {
  const text = value.toLowerCase();
  if (text.includes("the-vert") || text.includes("thé vert") || text.includes("the vert")) return "the-vert";
  if (text.includes("ambre")) return "ambre-musc";
  if (text.includes("safran")) return "safran";
  return "fleur-doranger";
}

function inferType(value: string): ProductType {
  const text = value.toLowerCase();
  if (text.includes("shampoo")) return "shampoo";
  if (text.includes("condition") || text.includes("après")) return "conditioner";
  if (text.includes("mask") || text.includes("masque")) return "hair-mask";
  if (text.includes("face") && (text.includes("scrub") || text.includes("gommage"))) return "face-scrub";
  if (text.includes("rose")) return "rose-water";
  if (text.includes("scrub") || text.includes("gommage")) return "body-scrub";
  if (text.includes("oil") || text.includes("huile")) return "body-oil";
  if (text.includes("milk") || text.includes("lait")) return "body-milk";
  if (text.includes("perfume") || text.includes("parfum")) return "hair-perfume";
  if (text.includes("shower") || text.includes("douche")) return "shower-gel";
  return "body-milk";
}

function inferRitual(type: ProductType): RitualId {
  if (type === "hair-perfume") return "scent";
  if (type === "body-scrub" || type === "face-scrub" || type === "rose-water") return "hammam";
  if (type === "shampoo" || type === "conditioner" || type === "hair-mask") return "hair";
  return "body";
}

function findStatic(row: StorefrontRow): Product | undefined {
  return (
    catalogProducts.find((product) => product.sku && product.sku === row.sku) ??
    catalogProducts.find((product) => product.slug === row.slug) ??
    getStaticProduct(row.slug)
  );
}

function withPhoto(product: Product, managedImage?: string | null): Product {
  const approved = shopProductImages[product.slug];
  // A dashboard-managed Supabase image remains canonical. Approved local
  // photography is the fallback for the bundled editorial catalog.
  const image = managedImage || approved || product.image;
  const gallery = [...new Set([image, ...(product.gallery ?? []), product.image])];
  return { ...product, image, gallery };
}

function fromRow(row: StorefrontRow): Product {
  const local = findStatic(row);
  const fragrance =
    (metaString(row.metadata, "fragrance") as FragranceId) ||
    inferFragrance(`${row.slug} ${row.name} ${metaString(row.metadata, "scent")}`);
  const productType = (metaString(row.metadata, "productType") as ProductType) || inferType(`${row.slug} ${row.name}`);
  const scent = metaString(row.metadata, "scent") || local?.scent || fragrances[fragrance];
  const localized = (value: string) => ({ en: value, fr: value, ar: value });
  const image = row.image_url || local?.image || "/products/body-oil.webp";

  if (local) {
    return withPhoto({
      ...local,
      id: row.id,
      sku: row.sku,
      priceMAD: Number(row.price_mad),
      stockQuantity: row.stock_quantity,
      image,
      description: local.description,
    }, row.image_url);
  }

  return withPhoto({
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    stockQuantity: row.stock_quantity,
    productType,
    image,
    imageWidth: 800,
    imageHeight: 1000,
    name: localized(row.name),
    labelFr: row.name,
    scent,
    fragrance,
    size: metaString(row.metadata, "size") || "",
    volumeMl: Number(metaString(row.metadata, "volumeMl")) || 200,
    withArgan: metaString(row.metadata, "withArgan") === "true",
    priceMAD: Number(row.price_mad),
    ritual: inferRitual(productType),
    needs: [],
    tagline: localized(""),
    description: localized(""),
    ritualNote: localized(""),
    howToUse: localized(""),
    ingredients: [],
    vessel: localized(""),
    featured: false,
    aspect: "column",
  }, row.image_url);
}

async function loadRows(): Promise<StorefrontRow[]> {
  if (!supabaseConfigState.publicReady) return [];
  const select = "id,sku,slug,name,price_mad,stock_quantity,status,image_url,metadata";
  try {
    const { url, publishableKey } = getPublicSupabaseConfig();
    const supabase = createClient<Database>(url, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: fetchWithSupabaseTimeout },
    });
    const { data, error } = await supabase.from("products").select(select).eq("status", "active").order("name");
    if (error) throw error;
    return (data ?? []) as StorefrontRow[];
  } catch (error) {
    console.error("Storefront catalog", error);
    return [];
  }
}

async function buildCatalog() {
  const rows = await loadRows();
  if (rows.length === 0) return catalogProducts.map((product) => withPhoto(product));
  return rows.filter((row) => row.status === "active").map(fromRow);
}

const loadCatalog = unstable_cache(buildCatalog, ["storefront-catalog"], {
  tags: ["storefront-catalog"],
  revalidate: 120,
});

export const getStorefrontProducts = cache(loadCatalog);

const emptyCopy = { en: "", fr: "", ar: "" };

/** Drops editorial fields the bag and search do not need, shrinking the client payload. */
export function forStoreClient(product: Product): Product {
  return {
    ...product,
    description: emptyCopy,
    ritualNote: emptyCopy,
    howToUse: emptyCopy,
    vessel: emptyCopy,
    ingredients: [],
    gallery: undefined,
  };
}

export function findStorefrontProduct(products: Product[], slug: string) {
  return products.find((product) => product.slug === slug || product.sku === slug);
}

export async function getStorefrontProduct(slug: string) {
  return findStorefrontProduct(await getStorefrontProducts(), slug);
}

export async function relatedStorefrontProducts(product: Product, count = 4) {
  const live = await getStorefrontProducts();
  const related = relatedStatic(product, 12)
    .map((item) => findStorefrontProduct(live, item.slug) ?? (item.sku ? findStorefrontProduct(live, item.sku) : undefined))
    .filter((item): item is Product => Boolean(item));
  const rest = live.filter((item) => item.slug !== product.slug && !related.some((entry) => entry.slug === item.slug));
  return [...related, ...rest].slice(0, count);
}
