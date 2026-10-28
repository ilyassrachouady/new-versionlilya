import { products } from "./generate-ritual-sql.mjs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("Missing Supabase URL or server key in .env.local.");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

async function rest(path, { method = "GET", body, prefer } = {}) {
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: { ...headers, ...(prefer ? { Prefer: prefer } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText;
    throw new Error(message);
  }
  return data;
}

const rows = products.map((product) => ({
  sku: product.sku,
  slug: product.slug,
  name: product.name.fr,
  description: product.description.fr,
  price_eur: 10,
  currency: "EUR",
  stock_quantity: 0,
  low_stock_threshold: 10,
  status: "active",
  image_url: `/products/rituals/${product.slug}.jpg`,
  metadata: {
    ...product.meta,
    imagePresentation: "photograph",
    localized: { name: product.name, description: product.description, howToUse: product.howToUse },
  },
}));

const skuList = products.map((product) => product.sku).join(",");
let inserted = [];
try {
  inserted = await rest("products?on_conflict=sku", {
    method: "POST",
    body: rows,
    prefer: "resolution=ignore-duplicates,return=representation",
  });
  const saved = await rest(`products?select=id,sku,slug,price_eur,status&sku=in.(${skuList})`);
  var bySku = new Map(saved.map((row) => [row.sku, row.id]));
  const collectionSlugs = [...new Set(products.map((product) => product.collection).filter(Boolean))];
  const collections = await rest(`collections?select=id,slug&slug=in.(${collectionSlugs.join(",")})`);
  const collectionId = new Map(collections.map((row) => [row.slug, row.id]));
  const links = products.flatMap((product) => {
    if (!product.collection) return [];
    const collection_id = collectionId.get(product.collection);
    const product_id = bySku.get(product.sku);
    return collection_id && product_id ? [{ collection_id, product_id, position: 100 }] : [];
  });
  if (links.length) {
    await rest("collection_products?on_conflict=collection_id,product_id", {
      method: "POST",
      body: links,
      prefer: "resolution=ignore-duplicates,return=minimal",
    });
  }
  console.log(`Database has ${saved.length} of these products. Newly inserted: ${inserted?.length ?? 0}. Collection links: ${links.length}.`);
  for (const product of products) console.log(`${bySku.has(product.sku) ? "ok" : "missing"} ${product.sku} ${product.slug}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Insert failed.");
  process.exit(1);
}
