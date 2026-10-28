import type { Localized, Product } from "@/lib/catalog";

const blank = { en: "", fr: "", ar: "" };

function copy(fr: string, en: string, ar: string): Localized {
  return { fr, en, ar };
}

function product(input: {
  slug: string;
  sku: string;
  productType: Product["productType"];
  fragrance: Product["fragrance"];
  scent: string;
  ritual: Product["ritual"];
  size: string;
  volumeMl: number;
  withArgan: boolean;
  width: number;
  height: number;
  name: Localized;
  description: Localized;
  howToUse: Localized;
}): Product {
  return {
    slug: input.slug,
    sku: input.sku,
    productType: input.productType,
    image: `/products/rituals/${input.slug}.jpg`,
    imagePresentation: "photograph",
    imageWidth: input.width,
    imageHeight: input.height,
    name: input.name,
    labelFr: input.name.fr,
    scent: input.scent,
    fragrance: input.fragrance,
    size: input.size,
    volumeMl: input.volumeMl,
    withArgan: input.withArgan,
    priceEUR: 10,
    stockQuantity: 0,
    ritual: input.ritual,
    needs: [],
    tagline: blank,
    description: input.description,
    ritualNote: blank,
    howToUse: input.howToUse,
    ingredients: input.withArgan ? ["argan"] : [],
    vessel: blank,
    featured: false,
    aspect: "jar",
  };
}

const soapUse = copy(
  "Usage cosmétique externe, selon les indications de l’étiquette.",
  "For external cosmetic use, following the label directions.",
  "للاستخدام التجميلي الخارجي وفق إرشادات الملصق.",
);

/** Client photos, 28 Oct 2026. Price 10 EUR and stock 0 until the house confirms both. */
export const ritualProducts: Product[] = [
  product({
    slug: "savon-the-vert", sku: "MLZ-TV-SO-100", productType: "soap", fragrance: "the-vert", scent: "Thé Vert", ritual: "body",
    size: "100 G", volumeMl: 100, withArgan: false, width: 764, height: 1024,
    name: copy("Savon Thé Vert", "Green Tea Soap", "صابون الشاي الأخضر"),
    description: copy("Savon Thé Vert, 100 g. 100 % naturel, fabriqué au Maroc.", "Green Tea soap, 100 g. 100% natural, made in Morocco.", "صابون الشاي الأخضر، 100 غ. طبيعي 100٪، صُنع في المغرب."),
    howToUse: soapUse,
  }),
  product({
    slug: "savon-ambre-musc", sku: "MLZ-AM-SO-100", productType: "soap", fragrance: "ambre-musc", scent: "Ambre Musc", ritual: "body",
    size: "100 G", volumeMl: 100, withArgan: false, width: 1024, height: 575,
    name: copy("Savon Ambre Musc", "Amber Musk Soap", "صابون العنبر والمسك"),
    description: copy("Savon Ambre Musc, 100 g. 100 % naturel, fabriqué au Maroc.", "Amber Musk soap, 100 g. 100% natural, made in Morocco.", "صابون العنبر والمسك، 100 غ. طبيعي 100٪، صُنع في المغرب."),
    howToUse: soapUse,
  }),
  product({
    slug: "savon-safran", sku: "MLZ-SF-SO-100", productType: "soap", fragrance: "safran", scent: "Safran", ritual: "body",
    size: "100 G", volumeMl: 100, withArgan: false, width: 1024, height: 575,
    name: copy("Savon Safran", "Saffron Soap", "صابون الزعفران"),
    description: copy("Savon Safran, 100 g. 100 % naturel, fabriqué au Maroc.", "Saffron soap, 100 g. 100% natural, made in Morocco.", "صابون الزعفران، 100 غ. طبيعي 100٪، صُنع في المغرب."),
    howToUse: soapUse,
  }),
  product({
    slug: "savon-fleur-doranger", sku: "MLZ-FO-SO-100", productType: "soap", fragrance: "fleur-doranger", scent: "Fleur d'Oranger", ritual: "body",
    size: "100 G", volumeMl: 100, withArgan: false, width: 1024, height: 575,
    name: copy("Savon Fleur d'Oranger", "Orange Blossom Soap", "صابون زهر البرتقال"),
    description: copy("Savon Fleur d'Oranger, 100 g. 100 % naturel, fabriqué au Maroc.", "Orange Blossom soap, 100 g. 100% natural, made in Morocco.", "صابون زهر البرتقال، 100 غ. طبيعي 100٪، صُنع في المغرب."),
    howToUse: soapUse,
  }),
  product({
    slug: "savon-noir-aker-fassi", sku: "MLZ-AF-NK-250", productType: "black-soap", fragrance: "aker-fassi", scent: "Aker Fassi", ritual: "hammam",
    size: "250 ML", volumeMl: 250, withArgan: true, width: 767, height: 1024,
    name: copy("Savon noir Aker Fassi", "Aker Fassi Black Soap", "الصابون البلدي عكر فاسي"),
    description: copy("Savon noir à l’Aker Fassi et à l’huile d’argan, 250 ml.", "Black soap with Aker Fassi and argan oil, 250 ml.", "صابون بلدي بعكر فاسي وزيت الأركان، 250 مل."),
    howToUse: copy(
      "Au hammam, sur peau humide, selon les indications de l’étiquette.",
      "In the hammam, on damp skin, following the label directions.",
      "في الحمّام، على بشرة رطبة، وفق إرشادات الملصق.",
    ),
  }),
  product({
    slug: "savon-noir-nila", sku: "MLZ-NI-NK-250", productType: "black-soap", fragrance: "nila", scent: "Nila", ritual: "hammam",
    size: "250 ML", volumeMl: 250, withArgan: true, width: 767, height: 1024,
    name: copy("Savon noir Nila", "Nila Black Soap", "الصابون البلدي النيلة"),
    description: copy("Savon noir au Nila et à l’huile d’argan, 250 ml.", "Black soap with Nila and argan oil, 250 ml.", "صابون بلدي بالنيلة وزيت الأركان، 250 مل."),
    howToUse: copy(
      "Au hammam, sur peau humide, selon les indications de l’étiquette.",
      "In the hammam, on damp skin, following the label directions.",
      "في الحمّام، على بشرة رطبة، وفق إرشادات الملصق.",
    ),
  }),
  product({
    slug: "velours-de-karite-the-vert", sku: "MLZ-TV-VK-80", productType: "shea-balm", fragrance: "the-vert", scent: "Thé Vert", ritual: "body",
    size: "80 ML", volumeMl: 80, withArgan: true, width: 767, height: 1024,
    name: copy("Velours de Karité Thé Vert", "Green Tea Shea Balm", "مخمل الشيا بالشاي الأخضر"),
    description: copy("Velours de karité, soin fondant nourrissant à l’huile d’argan, parfum Thé Vert. 80 ml.", "Shea balm, a melting nourishing care with argan oil, scented with Green Tea. 80 ml.", "مخمل الشيا، عناية مغذية ذائبة بزيت الأركان وعطر الشاي الأخضر. 80 مل."),
    howToUse: copy(
      "Appliquer selon les indications de l’étiquette.",
      "Apply following the label directions.",
      "يُوضع وفق إرشادات الملصق.",
    ),
  }),
  product({
    slug: "velours-de-karite-fleur-doranger", sku: "MLZ-FO-VK-80", productType: "shea-balm", fragrance: "fleur-doranger", scent: "Fleur d'Oranger", ritual: "body",
    size: "80 ML", volumeMl: 80, withArgan: true, width: 767, height: 1024,
    name: copy("Velours de Karité Fleur d'Oranger", "Orange Blossom Shea Balm", "مخمل الشيا بزهر البرتقال"),
    description: copy("Velours de karité, soin fondant nourrissant à l’huile d’argan, parfum Fleur d’Oranger. 80 ml.", "Shea balm, a melting nourishing care with argan oil, scented with Orange Blossom. 80 ml.", "مخمل الشيا، عناية مغذية ذائبة بزيت الأركان وعطر زهر البرتقال. 80 مل."),
    howToUse: copy(
      "Appliquer selon les indications de l’étiquette.",
      "Apply following the label directions.",
      "يُوضع وفق إرشادات الملصق.",
    ),
  }),
  product({
    slug: "gommage-visage-safran", sku: "MLZ-SF-FS-100", productType: "face-scrub", fragrance: "safran", scent: "Safran", ritual: "hammam",
    size: "100 ML", volumeMl: 100, withArgan: true, width: 767, height: 1024,
    name: copy("Gommage pour visage Safran", "Saffron Face Scrub", "مقشر الوجه بالزعفران"),
    description: copy("Gommage pour le visage à l’huile d’argan, parfum Safran. 100 ml.", "Face scrub with argan oil, scented with Saffron. 100 ml.", "مقشر للوجه بزيت الأركان وعطر الزعفران. 100 مل."),
    howToUse: copy(
      "Usage visage, selon les indications de l’étiquette. Éviter le contour des yeux.",
      "For the face, following the label directions. Avoid the eye area.",
      "للوجه وفق إرشادات الملصق. يُتجنب محيط العينين.",
    ),
  }),
  product({
    slug: "bain-botanique", sku: "MLZ-BT-BB-200", productType: "botanical-bath", fragrance: "botanique", scent: "Bain botanique", ritual: "body",
    size: "200 G", volumeMl: 200, withArgan: false, width: 767, height: 1024,
    name: copy("Bain botanique", "Botanical Bath", "حمّام نباتي"),
    description: copy("Sel d’Himalaya, badiane, clou de girofle et fleur de calendula. 200 g.", "Himalayan salt, star anise, clove and calendula flower. 200 g.", "ملح الهيمالايا واليانسون النجمي والقرنفل وزهر الآذريون. 200 غ."),
    howToUse: copy(
      "Verser dans le bain selon les indications de l’étiquette.",
      "Add to the bath following the label directions.",
      "يُضاف إلى ماء الحمّام وفق إرشادات الملصق.",
    ),
  }),
];
