import type { IngredientId, Localized, NeedId, RitualId } from "@/lib/catalog";

/* --------------------------------------------------------------------------
 * THE RITUALS — four worlds, one per family the house actually makes.
 * ----------------------------------------------------------------------- */

export type Ritual = {
  id: RitualId;
  index: string;
  title: Localized;
  line: Localized;
  body: Localized;
  texture: string;
  hero: string;
  heroAspect: "tall" | "column" | "jar";
};

export const rituals: Ritual[] = [
  {
    id: "hair",
    index: "I",
    title: { en: "Hair", fr: "Cheveux", ar: "الشعر" },
    line: {
      en: "Wash, condition, mask, scent.",
      fr: "Laver, démêler, masquer, parfumer.",
      ar: "غسلٌ، وبلسمٌ، وقناعٌ، وعطر.",
    },
    body: {
      en: "Quality hair care with argan oil, enhanced by unique fragrance notes.",
      fr: "Des soins capillaires de qualité à l'huile d'argan, sublimés par des notes parfumées uniques",
      ar: "مستحضرات عالية الجودة للعناية بالشعر بزيت الأركان، تتألق بنفحات عطرية مميزة.",
    },
    texture: "/textures/plaster-espresso.jpg",
    hero: "/products/shampoo.webp",
    heroAspect: "column",
  },
  {
    id: "body",
    index: "II",
    title: { en: "Body", fr: "Corps", ar: "الجسد" },
    line: {
      en: "",
      fr: "",
      ar: "",
    },
    body: {
      en: "A collection of hydrating, sensory care to nourish and enhance your body.",
      fr: "Une collection de soins hydratants et sensoriels pour nourrir et sublimer votre corps",
      ar: "مجموعة من مستحضرات العناية المرطبة والحسية لتغذية الجسم وإبراز جماله.",
    },
    texture: "/textures/plaster-terracotta.jpg",
    hero: "/products/body-milk.webp",
    heroAspect: "column",
  },
  {
    id: "hammam",
    index: "III",
    title: { en: "Hammam", fr: "Hammam", ar: "الحمّام" },
    line: {
      en: "",
      fr: "",
      ar: "",
    },
    body: {
      en: "Exceptional exfoliating and purifying care inspired by Morocco’s great beauty rituals.",
      fr: "Des soins exfoliants et purifiants d'exception inspirés des plus grands rituels marocains",
      ar: "مستحضرات استثنائية للتقشير والتنقية، مستوحاة من أعرق طقوس الجمال المغربية.",
    },
    texture: "/editorial/editorial-hammam.jpg",
    hero: "/products/body-scrub.webp",
    heroAspect: "jar",
  },
  {
    id: "scent",
    index: "IV",
    title: { en: "Scent", fr: "Parfum", ar: "العطر" },
    line: {
      en: "The essence of orange blossom for your hair.",
      fr: "L'essence de la fleur d'oranger pour vos cheveux",
      ar: "عبير زهر البرتقال لشعركم.",
    },
    body: {
      en: "10 scents in an exclusive fragrance collection by Maison Lilya Zahra. An invitation to travel, from the vibrant Medina to the exotic notes of Tropical Oud.",
      fr: "10 Senteurs en une collection de parfums exclusifs signée Maison Lilya Zahra. Une invitation au voyage, de la vibrante Medina aux notes exotiques de l'Oud Tropical.",
      ar: "عشر روائح في مجموعة عطور حصرية من دار ليليا زهرة. دعوة إلى السفر، من أجواء المدينة النابضة بالحياة إلى نفحات العود الاستوائي الغريبة.",
    },
    texture: "/textures/plaster-burgundy.jpg",
    hero: "/products/hair-perfume.webp",
    heroAspect: "tall",
  },
  {
    id: "home",
    index: "V",
    title: { en: "Comforts of Home", fr: "Douceur d'intérieur", ar: "دفء المنزل" },
    line: { en: "Fragrances and objects for your home rituals.", fr: "Senteurs et objets pour vos rituels de maison.", ar: "عطور وقطع لطقوس منزلكم." },
    body: {
      en: "Discover a collection devoted entirely to well-being and the atmosphere of your home. Delicate fragrances and thoughtfully designed objects bring a touch of comfort and serenity to every room.",
      fr: "Découvrez une collection entièrement dédiée au bien-être et à l'atmosphère de l'intérieur. Des senteurs délicates et des objets soigneusement conçus pour apporter une touche de douceur et de sérénité à chaque pièce de la maison.",
      ar: "اكتشفوا مجموعة مخصصة بالكامل للراحة وأجواء المنزل. عطور رقيقة وقطع مصممة بعناية لإضفاء لمسة من الدفء والسكينة على كل غرفة في البيت.",
    },
    texture: "/collections/campaigns/home.png",
    hero: "/products/maison/diffuseur-fleur-orientale.png",
    heroAspect: "column",
  },
];

export function getRitual(id: RitualId): Ritual {
  return rituals.find((ritual) => ritual.id === id)!;
}

/* --------------------------------------------------------------------------
 * THE INGREDIENTS — only the two the labels actually name.
 * ----------------------------------------------------------------------- */

export type Ingredient = {
  id: IngredientId;
  latin: string;
  name: Localized;
  origin: Localized;
  originShort: Localized;
  story: Localized;
  note: Localized;
  swatch: string;
};

export const ingredients: Ingredient[] = [
  {
    id: "argan",
    latin: "Argania spinosa",
    name: { en: "Argan Oil", fr: "Huile d'Argan", ar: "زيت الأركان" },
    origin: {
      en: "The arganeraie — southwestern Morocco, between Essaouira and Agadir.",
      fr: "L'arganeraie — sud-ouest du Maroc, entre Essaouira et Agadir.",
      ar: "غابة الأركان — جنوب غرب المغرب، بين الصويرة وأݣادير.",
    },
    originShort: { en: "Souss, Morocco", fr: "Souss, Maroc", ar: "سوس، المغرب" },
    story: {
      en: "The argan tree grows almost nowhere else on earth. Its forest, the arganeraie, has been a UNESCO biosphere reserve since 1998, and the kernels inside its fruit have been cracked and pressed by hand — largely by women, largely in cooperatives — for as long as anyone has kept count.",
      fr: "L'arganier ne pousse presque nulle part ailleurs sur terre. Sa forêt, l'arganeraie, est réserve de biosphère de l'UNESCO depuis 1998, et les amandons de son fruit sont concassés et pressés à la main — par des femmes, le plus souvent en coopératives — depuis aussi loin que l'on compte.",
      ar: "لا تكاد شجرة الأركان تنبت في مكان آخر من الأرض. غابتها محميةُ محيطٍ حيوي لدى اليونسكو منذ 1998، وتُكسَر لُبّات ثمارها وتُعصَر باليد — على يد النساء غالباً، وفي تعاونيات — منذ زمنٍ لا يُحصى.",
    },
    note: {
      en: "Named on every hair and body label of the house.",
      fr: "Nommée sur chaque étiquette cheveux et corps de la maison.",
      ar: "مذكور على كل ملصق للشعر والجسد في هذه الدار.",
    },
    swatch: "#A77A45",
  },
  {
    id: "orange-blossom",
    latin: "Citrus aurantium",
    name: { en: "Orange Blossom", fr: "Fleur d'Oranger", ar: "زهر البرتقال" },
    origin: {
      en: "The bitter orange groves of Morocco, distilled in spring.",
      fr: "Les vergers de bigaradiers du Maroc, distillés au printemps.",
      ar: "بساتين النارنج في المغرب، تُقطَّر في الربيع.",
    },
    originShort: { en: "Morocco", fr: "Maroc", ar: "المغرب" },
    story: {
      en: "For a few weeks each spring the bitter orange trees open and the whole country smells of them. The flowers are distilled into ma zhar — orange blossom water — which lives in Moroccan kitchens, on Moroccan tables and in Moroccan hands. It is the single note this entire collection is built on.",
      fr: "Quelques semaines chaque printemps, les bigaradiers s'ouvrent et tout le pays en porte l'odeur. On distille leurs fleurs en ma zhar — l'eau de fleur d'oranger — présente dans les cuisines marocaines, sur les tables, dans les mains. C'est la note unique sur laquelle toute cette collection est bâtie.",
      ar: "أسابيع قليلة في كلّ ربيع، تتفتّح أشجار النارنج فتفوح بها البلاد كلّها. تُقطَّر أزهارها ماءَ زهرٍ يسكن المطابخ المغربية والموائد والأيدي. وهي النغمة الوحيدة التي بُنيت عليها هذه المجموعة بأسرها.",
    },
    note: {
      en: "Printed on every label in the collection.",
      fr: "Imprimée sur chaque étiquette de la collection.",
      ar: "مطبوع على كل ملصق في المجموعة.",
    },
    swatch: "#C9B9A1",
  },
];

export function getIngredient(id: IngredientId): Ingredient {
  return ingredients.find((ingredient) => ingredient.id === id)!;
}

/* --------------------------------------------------------------------------
 * THE RITUAL FINDER
 * ----------------------------------------------------------------------- */

export type Need = { id: NeedId; label: Localized; answer: Localized };

export const needs: Need[] = [
  {
    id: "cleanse",
    label: { en: "Cleanse", fr: "Purifier", ar: "تنقية" },
    answer: {
      en: "Start at the beginning — the wash and the gommage.",
      fr: "Commencez par le commencement — le lavage et le gommage.",
      ar: "ابدئي من البداية — الغسل والتقشير.",
    },
  },
  {
    id: "nourish",
    label: { en: "Nourish", fr: "Nourrir", ar: "تغذية" },
    answer: {
      en: "Argan oil, given time to work.",
      fr: "L'huile d'argan, à qui l'on laisse le temps.",
      ar: "زيت الأركان، ممنوحاً وقته.",
    },
  },
  {
    id: "hydrate",
    label: { en: "Hydrate", fr: "Hydrater", ar: "ترطيب" },
    answer: {
      en: "The lighter register, for every morning.",
      fr: "Le registre léger, pour chaque matin.",
      ar: "النبرة الأخفّ، لكل صباح.",
    },
  },
  {
    id: "glow",
    label: { en: "Glow", fr: "Éclat", ar: "إشراق" },
    answer: {
      en: "Gommage first, oil after. In that order.",
      fr: "Le gommage d'abord, l'huile ensuite. Dans cet ordre.",
      ar: "التقشير أولاً، ثم الزيت. بهذا الترتيب.",
    },
  },
  {
    id: "restore",
    label: { en: "Restore", fr: "Réparer", ar: "استعادة" },
    answer: {
      en: "The long treatments — mask and conditioner.",
      fr: "Les soins longs — masque et après-shampooing.",
      ar: "العناية الطويلة — القناع والبلسم.",
    },
  },
  {
    id: "scent",
    label: { en: "Scent", fr: "Parfumer", ar: "تعطير" },
    answer: {
      en: "Fleur d'oranger, in the hair and on the skin.",
      fr: "La fleur d'oranger, dans les cheveux et sur la peau.",
      ar: "زهر البرتقال، في الشعر وعلى البشرة.",
    },
  },
];

/* --------------------------------------------------------------------------
 * FOR HER / FOR HIM — one house, two edits. Never a gender filter.
 * ----------------------------------------------------------------------- */

export type Edit = {
  id: "her" | "him";
  title: Localized;
  line: Localized;
  body: Localized;
  slugs: string[];
  texture: string;
};

export const edits: Edit[] = [
  {
    id: "her",
    title: { en: "For Her", fr: "Pour Elle", ar: "لها" },
    line: {
      en: "The long ritual.",
      fr: "Le rituel long.",
      ar: "الطقس الطويل.",
    },
    body: {
      en: "Gommage, mask, oil, perfume — the full sequence, given the evening it deserves.",
      fr: "Gommage, masque, huile, parfum — la séquence entière, à qui l'on donne sa soirée.",
      ar: "تقشير، قناع، زيت، عطر — التسلسل كاملاً، ممنوحاً أمسيته.",
    },
    slugs: [
      "body-scrub-argan-fleur-doranger",
      "hair-mask-argan-fleur-doranger",
      "body-oil-fleur-doranger",
      "hair-perfume-fleur-doranger",
    ],
    texture: "/textures/plaster-burgundy.jpg",
  },
  {
    id: "him",
    title: { en: "For Him", fr: "Pour Lui", ar: "له" },
    line: {
      en: "The short one.",
      fr: "Le rituel court.",
      ar: "الطقس القصير.",
    },
    body: {
      en: "Wash, condition, milk. Three objects, four minutes, the same orange blossom.",
      fr: "Laver, démêler, hydrater. Trois objets, quatre minutes, la même fleur d'oranger.",
      ar: "غسلٌ وبلسمٌ وحليب. ثلاثة أشياء، أربع دقائق، وزهر البرتقال نفسه.",
    },
    slugs: [
      "shampoo-argan-fleur-doranger",
      "conditioner-argan-fleur-doranger",
      "body-milk-argan-fleur-doranger",
    ],
    texture: "/textures/plaster-espresso.jpg",
  },
];

/* --------------------------------------------------------------------------
 * THE JOURNAL
 * ----------------------------------------------------------------------- */

export type Article = {
  slug: string;
  kicker: Localized;
  title: Localized;
  standfirst: Localized;
  readingTime: number;
  texture: string;
  product?: string;
  paragraphs: Localized[];
};

export const articles: Article[] = [
  {
    slug: "the-order-of-the-hammam",
    kicker: { en: "The Ritual", fr: "Le Rituel", ar: "الطقس" },
    title: {
      en: "The Art of the Hammam",
      fr: "L'art du Hammam",
      ar: "فن الحمّام",
    },
    standfirst: {
      en: "Enveloping warmth, black soap with Aker Fassi and Nila, a hydrating scrub, a cool rinse and a gentle oil. A timeless beauty secret.",
      fr: "Chaleur enveloppante, savon noir à l'Aker Fassi et Nila, gommage hydratant, rinçage frais et huile de douceur. Un secret de beauté éternel.",
      ar: "دفء يحتضن الجسم، وصابون بلدي بالعكر الفاسي والنيلة، وتقشير مرطب، وشطف منعش وزيت ناعم. سر جمال خالد.",
    },
    readingTime: 4,
    texture: "/editorial/editorial-hammam.jpg",
    product: "body-scrub-argan-fleur-doranger",
    paragraphs: [
      {
        en: "A precious heritage of the Oriental art of living, the hammam is the ultimate ritual for cleansing body and mind. Enveloping warmth prepares the skin for exfoliation with our black soap with Aker Fassi or Nila to remove impurities. This exceptional moment continues with our Tabrima Royale, a traditional body wrap that enhances the complexion and reveals your skin’s radiance.",
        fr: "Héritage précieux de l'art de vivre oriental, le hammam est le rituel ultime de purification du corps et de l'esprit. La chaleur enveloppante prépare la peau à l'exfoliation sacrée avec notre savon noir à l'Aker Fassi ou au Nila pour libérer les impuretés. Ce moment d'exception se prolonge avec notre Tabrima Royale, un enveloppement traditionnel qui sublime le teint et révèle l'éclat absolu de votre peau.",
        ar: "الحمّام إرث ثمين من فن العيش الشرقي وطقس متكامل لتنقية الجسم والروح. يهيئ الدفء البشرة للتقشير بصابوننا البلدي بالعكر الفاسي أو النيلة لإزالة الشوائب. وتتواصل هذه اللحظة الاستثنائية مع التبريمة الملكية، وهي لفافة تقليدية للجسم تبرز جمال لون البشرة وتكشف إشراقها.",
      },
    ],
  },
  {
    slug: "the-arganeraie",
    kicker: { en: "The Ingredient", fr: "L'Ingrédient", ar: "المكوّن" },
    title: { en: "The Arganeraie", fr: "L'Arganeraie", ar: "غابة الأركان" },
    standfirst: {
      en: "Born of a forest unique in the world, our argan oil embodies the excellence of an exceptional terroir.",
      fr: "Née d'une forêt unique au monde, notre huile d'argan incarne l'excellence d'un terroir d'exception.",
      ar: "ينبع زيت الأركان لدينا من غابة فريدة في العالم، ويجسد تميز أرض استثنائية.",
    },
    readingTime: 5,
    texture: "/editorial/ingredient-argan-oil.jpg",
    product: "hair-mask-argan-fleur-doranger",
    paragraphs: [
      {
        en: "Between Essaouira and Agadir lies the argan forest, a natural treasure from which the most precious beauty rituals emerge.",
        fr: "Entre Essaouira et Agadir s'étend l’arganeraie, un trésor de la nature d'où jaillit le plus précieux des rituels de beauté.",
        ar: "بين الصويرة وأكادير تمتد غابة الأركان، كنز طبيعي تنبع منه أثمن طقوس الجمال.",
      },
      {
        en: "Each kernel is harvested, dried and patiently pressed using a preserved artisanal tradition. This meticulous craftsmanship creates an exceptionally pure oil, a true elixir of youth that nourishes and illuminates your skin.",
        fr: "Chaque amandon est récolté, séché et pressé avec patience selon un savoir-faire artisanal préservé. Ce travail d'orfèvre donne vie à une huile d'une pureté exceptionnelle, véritable élixir de jeunesse qui nourrit et illumine votre peau.",
        ar: "تُجمع كل نواة وتُجفف وتُعصر بصبر وفق مهارة حرفية محفوظة. ويثمر هذا العمل المتقن زيتاً استثنائي النقاء، إكسير شباب حقيقياً يغذي بشرتكم ويضيئها.",
      },
    ],
  },
  {
    slug: "why-the-tassel",
    kicker: { en: "The House", fr: "La Maison", ar: "الدار" },
    title: { en: "The Choucha", fr: "La choucha", ar: "الشوشة" },
    standfirst: {
      en: "A reusable touch of silk craftsmanship.",
      fr: "Une touche d’artisanat en soie réutilisable.",
      ar: "لمسة من الحرفية الحريرية قابلة لإعادة الاستخدام.",
    },
    readingTime: 3,
    texture: "/editorial/choucha-soie-marocaine.png",
    product: "shampoo-argan-fleur-doranger",
    paragraphs: [
      {
        en: "Our bottles are adorned with an authentic, handmade Moroccan silk choucha. Detach this lovely cultural detail and reuse it to decorate your keys, bags or door handles!",
        fr: "Nos flacons sont ornés d’une authentique choucha en soie marocaine faite à la main. Un joli détail culturel à détacher et à réutiliser pour décorer vos clés, vos sacs ou vos poignées de porte !",
        ar: "تزين قواريرنا شوشة أصلية من الحرير المغربي مصنوعة يدوياً. لمسة ثقافية جميلة يمكن فصلها وإعادة استخدامها لتزيين مفاتيحكم أو حقائبكم أو مقابض الأبواب!",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
