import { readFileSync, writeFileSync } from "node:fs";

const products = JSON.parse(readFileSync(new URL("./maison-products.json", import.meta.url), "utf8"));
const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const rows = products.map((product) => {
  const metadata = {
    productType: product.productType, fragrance: product.fragrance, scent: product.scent,
    ritual: "home", volumeMl: product.volumeMl, size: product.volumeMl ? `${product.volumeMl} ML` : "1 pièce",
    imagePresentation: "photograph", withArgan: false,
    localized: { name: product.name, description: product.description, howToUse: product.howToUse },
  };
  return `(${[product.sku, product.slug, product.name.fr, product.description.fr].map(quote).join(", ")}, 10.00, 'EUR', 0, 'active', ${quote(`/products/maison/${product.slug}.png`)}, ${quote(JSON.stringify(metadata))}::jsonb)`;
});
const sql = `-- Run manually in Supabase SQL Editor after the EUR migration.
-- Six Maison products: provisional 10 EUR each, stock 0 until supplied.
-- Re-runnable: preserves existing dashboard prices, stock, copy and images.
begin;
insert into public.collections (slug, name, description, status, color)
values ('home', 'Produits Maison', 'Senteurs et objets pour vos rituels de maison.', 'live', '#b18a58')
on conflict (slug) do nothing;

insert into public.products (sku, slug, name, description, price_eur, currency, stock_quantity, status, image_url, metadata)
values
${rows.join(",\n")}
on conflict (sku) do nothing;

insert into public.collection_products (collection_id, product_id, position)
select c.id, p.id, a.position from public.collections c
cross join (values ${products.map((p, i) => `(${quote(p.sku)}, ${i + 1})`).join(", ")}) a(sku, position)
join public.products p on p.sku = a.sku
where c.slug = 'home'
on conflict (collection_id, product_id) do nothing;
commit;
`;
writeFileSync(new URL("../supabase/migrations/20261023000000_maison_collection.sql", import.meta.url), sql);
console.log("Prepared six Maison products for manual Supabase import.");
