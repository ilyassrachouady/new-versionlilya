import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = process.cwd();

function loadTypeScript(file, modules = {}) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loadedModule = { exports: {} };
  const context = vm.createContext({
    module: loadedModule,
    exports: loadedModule.exports,
    require: (id) => {
      if (id in modules) return modules[id];
      throw new Error(`Import non pris en charge: ${id}`);
    },
  });
  new vm.Script(output, { filename: file }).runInContext(context);
  return loadedModule.exports;
}

const imported = loadTypeScript("src/lib/imported-products.ts");
const catalog = loadTypeScript("src/lib/catalog.ts", {
  "@/lib/imported-products": imported,
});
const images = loadTypeScript("src/lib/shop-product-images.ts");

const fragranceCodes = {
  "fleur-doranger": "FO",
  "the-vert": "TV",
  "ambre-musc": "AM",
  safran: "SF",
};
const productCodes = {
  shampoo: "SH",
  conditioner: "CO",
  "hair-mask": "HM",
  "body-scrub": "BS",
  "body-oil": "BO",
  "body-milk": "BM",
  "hair-perfume": "HP",
  "shower-gel": "SG",
  "face-scrub": "FS",
  "rose-water": "RW",
};
const sql = (value) => `'${String(value).replaceAll("'", "''")}'`;

const rows = catalog.catalogProducts.map((product) => {
  const sku = product.sku ?? `MLZ-${fragranceCodes[product.fragrance]}-${productCodes[product.productType]}-${product.volumeMl}`;
  const primaryImage = images.shopProductImages[product.slug] ?? product.image;
  const gallery = [...new Set([primaryImage, ...(product.gallery ?? []), product.image])];
  const metadata = {
    productType: product.productType,
    fragrance: product.fragrance,
    scent: product.scent,
    size: product.size,
    volumeMl: product.volumeMl,
    withArgan: product.withArgan,
    ritual: product.ritual,
    needs: product.needs,
    ingredients: product.ingredients,
    aspect: product.aspect,
    featured: product.featured,
    imageWidth: product.imageWidth,
    imageHeight: product.imageHeight,
    gallery,
    localized: {
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      ritualNote: product.ritualNote,
      howToUse: product.howToUse,
      vessel: product.vessel,
    },
  };
  const description = product.description.fr || product.tagline.fr || `${product.name.fr} · ${product.scent}`;
  return `(${sql(sku)}, ${sql(product.slug)}, ${sql(product.name.fr)}, ${sql(description)}, ${product.priceMAD}, 25, 10, 'active', ${sql(primaryImage)}, ${sql(JSON.stringify(metadata))}::jsonb)`;
});

const output = `-- Généré depuis le catalogue source. Ne pas éditer manuellement.\n-- Retire uniquement les anciennes lignes de démonstration remplacées par le catalogue réel.\ndelete from public.products where slug in ('huile-corporelle-fleur-d-oranger', 'gommage-corporel-fleur-d-oranger', 'masque-capillaire-fleur-d-oranger', 'parfum-cheveux-fleur-d-oranger', 'shampooing-the-vert', 'lait-corporel-ambre-musc');\n\ninsert into public.products (sku, slug, name, description, price_mad, stock_quantity, low_stock_threshold, status, image_url, metadata)\nvalues\n  ${rows.join(",\n  ")}\non conflict (slug) do update set\n  sku = excluded.sku,\n  name = excluded.name,\n  description = excluded.description,\n  price_mad = excluded.price_mad,\n  status = excluded.status,\n  image_url = excluded.image_url,\n  metadata = excluded.metadata,\n  updated_at = now();\n\ninsert into public.collection_products (collection_id, product_id, position)\nselect c.id, p.id, row_number() over (partition by c.id order by p.name, p.slug)::integer\nfrom public.products p\njoin public.collections c on c.slug = p.metadata->>'fragrance'\non conflict (collection_id, product_id) do update set position = excluded.position;\n`;

fs.writeFileSync(path.join(root, "supabase/catalog-seed.sql"), output);
console.log(`Catalogue Supabase généré: ${rows.length} produits.`);
