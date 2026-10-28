import { writeFileSync } from "node:fs";

export const products = [
  {
    sku: "MLZ-TV-SO-100", slug: "savon-the-vert", collection: "the-vert",
    name: { fr: "Savon Thé Vert", en: "Green Tea Soap", ar: "صابون الشاي الأخضر" },
    description: { fr: "Savon Thé Vert, 100 g. 100 % naturel, fabriqué au Maroc.", en: "Green Tea soap, 100 g. 100% natural, made in Morocco.", ar: "صابون الشاي الأخضر، 100 غ. طبيعي 100٪، صُنع في المغرب." },
    howToUse: { fr: "Usage cosmétique externe, selon les indications de l’étiquette.", en: "For external cosmetic use, following the label directions.", ar: "للاستخدام التجميلي الخارجي وفق إرشادات الملصق." },
    meta: { productType: "soap", fragrance: "the-vert", scent: "Thé Vert", ritual: "body", volumeMl: 100, size: "100 G", withArgan: false },
  },
  {
    sku: "MLZ-AM-SO-100", slug: "savon-ambre-musc", collection: "ambre-musc",
    name: { fr: "Savon Ambre Musc", en: "Amber Musk Soap", ar: "صابون العنبر والمسك" },
    description: { fr: "Savon Ambre Musc, 100 g. 100 % naturel, fabriqué au Maroc.", en: "Amber Musk soap, 100 g. 100% natural, made in Morocco.", ar: "صابون العنبر والمسك، 100 غ. طبيعي 100٪، صُنع في المغرب." },
    howToUse: { fr: "Usage cosmétique externe, selon les indications de l’étiquette.", en: "For external cosmetic use, following the label directions.", ar: "للاستخدام التجميلي الخارجي وفق إرشادات الملصق." },
    meta: { productType: "soap", fragrance: "ambre-musc", scent: "Ambre Musc", ritual: "body", volumeMl: 100, size: "100 G", withArgan: false },
  },
  {
    sku: "MLZ-SF-SO-100", slug: "savon-safran", collection: "safran",
    name: { fr: "Savon Safran", en: "Saffron Soap", ar: "صابون الزعفران" },
    description: { fr: "Savon Safran, 100 g. 100 % naturel, fabriqué au Maroc.", en: "Saffron soap, 100 g. 100% natural, made in Morocco.", ar: "صابون الزعفران، 100 غ. طبيعي 100٪، صُنع في المغرب." },
    howToUse: { fr: "Usage cosmétique externe, selon les indications de l’étiquette.", en: "For external cosmetic use, following the label directions.", ar: "للاستخدام التجميلي الخارجي وفق إرشادات الملصق." },
    meta: { productType: "soap", fragrance: "safran", scent: "Safran", ritual: "body", volumeMl: 100, size: "100 G", withArgan: false },
  },
  {
    sku: "MLZ-FO-SO-100", slug: "savon-fleur-doranger", collection: "fleur-d-oranger",
    name: { fr: "Savon Fleur d'Oranger", en: "Orange Blossom Soap", ar: "صابون زهر البرتقال" },
    description: { fr: "Savon Fleur d'Oranger, 100 g. 100 % naturel, fabriqué au Maroc.", en: "Orange Blossom soap, 100 g. 100% natural, made in Morocco.", ar: "صابون زهر البرتقال، 100 غ. طبيعي 100٪، صُنع في المغرب." },
    howToUse: { fr: "Usage cosmétique externe, selon les indications de l’étiquette.", en: "For external cosmetic use, following the label directions.", ar: "للاستخدام التجميلي الخارجي وفق إرشادات الملصق." },
    meta: { productType: "soap", fragrance: "fleur-doranger", scent: "Fleur d'Oranger", ritual: "body", volumeMl: 100, size: "100 G", withArgan: false },
  },
  {
    sku: "MLZ-AF-NK-250", slug: "savon-noir-aker-fassi", collection: null,
    name: { fr: "Savon noir Aker Fassi", en: "Aker Fassi Black Soap", ar: "الصابون البلدي عكر فاسي" },
    description: { fr: "Savon noir à l’Aker Fassi et à l’huile d’argan, 250 ml.", en: "Black soap with Aker Fassi and argan oil, 250 ml.", ar: "صابون بلدي بعكر فاسي وزيت الأركان، 250 مل." },
    howToUse: { fr: "Au hammam, sur peau humide, selon les indications de l’étiquette.", en: "In the hammam, on damp skin, following the label directions.", ar: "في الحمّام، على بشرة رطبة، وفق إرشادات الملصق." },
    meta: { productType: "black-soap", fragrance: "aker-fassi", scent: "Aker Fassi", ritual: "hammam", volumeMl: 250, size: "250 ML", withArgan: true },
  },
  {
    sku: "MLZ-NI-NK-250", slug: "savon-noir-nila", collection: null,
    name: { fr: "Savon noir Nila", en: "Nila Black Soap", ar: "الصابون البلدي النيلة" },
    description: { fr: "Savon noir au Nila et à l’huile d’argan, 250 ml.", en: "Black soap with Nila and argan oil, 250 ml.", ar: "صابون بلدي بالنيلة وزيت الأركان، 250 مل." },
    howToUse: { fr: "Au hammam, sur peau humide, selon les indications de l’étiquette.", en: "In the hammam, on damp skin, following the label directions.", ar: "في الحمّام، على بشرة رطبة، وفق إرشادات الملصق." },
    meta: { productType: "black-soap", fragrance: "nila", scent: "Nila", ritual: "hammam", volumeMl: 250, size: "250 ML", withArgan: true },
  },
  {
    sku: "MLZ-TV-VK-80", slug: "velours-de-karite-the-vert", collection: "the-vert",
    name: { fr: "Velours de Karité Thé Vert", en: "Green Tea Shea Balm", ar: "مخمل الشيا بالشاي الأخضر" },
    description: { fr: "Velours de karité, soin fondant nourrissant à l’huile d’argan, parfum Thé Vert. 80 ml.", en: "Shea balm, a melting nourishing care with argan oil, scented with Green Tea. 80 ml.", ar: "مخمل الشيا، عناية مغذية ذائبة بزيت الأركان وعطر الشاي الأخضر. 80 مل." },
    howToUse: { fr: "Appliquer selon les indications de l’étiquette.", en: "Apply following the label directions.", ar: "يُوضع وفق إرشادات الملصق." },
    meta: { productType: "shea-balm", fragrance: "the-vert", scent: "Thé Vert", ritual: "body", volumeMl: 80, size: "80 ML", withArgan: true },
  },
  {
    sku: "MLZ-FO-VK-80", slug: "velours-de-karite-fleur-doranger", collection: "fleur-d-oranger",
    name: { fr: "Velours de Karité Fleur d'Oranger", en: "Orange Blossom Shea Balm", ar: "مخمل الشيا بزهر البرتقال" },
    description: { fr: "Velours de karité, soin fondant nourrissant à l’huile d’argan, parfum Fleur d’Oranger. 80 ml.", en: "Shea balm, a melting nourishing care with argan oil, scented with Orange Blossom. 80 ml.", ar: "مخمل الشيا، عناية مغذية ذائبة بزيت الأركان وعطر زهر البرتقال. 80 مل." },
    howToUse: { fr: "Appliquer selon les indications de l’étiquette.", en: "Apply following the label directions.", ar: "يُوضع وفق إرشادات الملصق." },
    meta: { productType: "shea-balm", fragrance: "fleur-doranger", scent: "Fleur d'Oranger", ritual: "body", volumeMl: 80, size: "80 ML", withArgan: true },
  },
  {
    sku: "MLZ-SF-FS-100", slug: "gommage-visage-safran", collection: "safran",
    name: { fr: "Gommage pour visage Safran", en: "Saffron Face Scrub", ar: "مقشر الوجه بالزعفران" },
    description: { fr: "Gommage pour le visage à l’huile d’argan, parfum Safran. 100 ml.", en: "Face scrub with argan oil, scented with Saffron. 100 ml.", ar: "مقشر للوجه بزيت الأركان وعطر الزعفران. 100 مل." },
    howToUse: { fr: "Usage visage, selon les indications de l’étiquette. Éviter le contour des yeux.", en: "For the face, following the label directions. Avoid the eye area.", ar: "للوجه وفق إرشادات الملصق. يُتجنب محيط العينين." },
    meta: { productType: "face-scrub", fragrance: "safran", scent: "Safran", ritual: "hammam", volumeMl: 100, size: "100 ML", withArgan: true },
  },
  {
    sku: "MLZ-BT-BB-200", slug: "bain-botanique", collection: null,
    name: { fr: "Bain botanique", en: "Botanical Bath", ar: "حمّام نباتي" },
    description: { fr: "Sel d’Himalaya, badiane, clou de girofle et fleur de calendula. 200 g.", en: "Himalayan salt, star anise, clove and calendula flower. 200 g.", ar: "ملح الهيمالايا واليانسون النجمي والقرنفل وزهر الآذريون. 200 غ." },
    howToUse: { fr: "Verser dans le bain selon les indications de l’étiquette.", en: "Add to the bath following the label directions.", ar: "يُضاف إلى ماء الحمّام وفق إرشادات الملصق." },
    meta: { productType: "botanical-bath", fragrance: "botanique", scent: "Bain botanique", ritual: "body", volumeMl: 200, size: "200 G", withArgan: false },
  },
];

const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const rows = products.map((product) => {
  const metadata = {
    ...product.meta,
    imagePresentation: "photograph",
    localized: { name: product.name, description: product.description, howToUse: product.howToUse },
  };
  return `(${[product.sku, product.slug, product.name.fr, product.description.fr].map(quote).join(", ")}, 10.00, 'EUR', 0, 'active', ${quote(`/products/rituals/${product.slug}.jpg`)}, ${quote(JSON.stringify(metadata))}::jsonb)`;
});
const links = products.filter((product) => product.collection).map((product) => `('${product.collection}', '${product.sku}')`).join(", ");
const sql = `-- Run manually in the Supabase SQL Editor.
-- Ten labeled products from the 28 Oct 2026 client photos.
-- Provisional 10 EUR and stock 0 until the house confirms price and availability.
-- Re-runnable: existing dashboard edits are kept.
begin;
insert into public.products (sku, slug, name, description, price_eur, currency, stock_quantity, status, image_url, metadata)
values
${rows.join(",\n")}
on conflict (sku) do nothing;

insert into public.collection_products (collection_id, product_id, position)
select c.id, p.id, 100
from (values ${links}) as incoming(collection_slug, sku)
join public.collections c on c.slug = incoming.collection_slug
join public.products p on p.sku = incoming.sku
on conflict (collection_id, product_id) do nothing;
commit;
`;
writeFileSync(new URL("../supabase/migrations/20261028000000_ritual_products.sql", import.meta.url), sql);
console.log(`Prepared ${products.length} ritual products.`);
