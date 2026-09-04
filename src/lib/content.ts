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
      en: "Four objects in sequence, argan oil through all of them, orange blossom over the top.",
      fr: "Quatre objets dans l'ordre, l'huile d'argan dans chacun, la fleur d'oranger par-dessus.",
      ar: "أربعة أشياء بترتيبها، زيت الأركان في كلٍّ منها، وزهر البرتقال فوقها جميعاً.",
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
      en: "Oil at night, milk in the morning.",
      fr: "L'huile le soir, le lait le matin.",
      ar: "زيتٌ في الليل، وحليبٌ في الصباح.",
    },
    body: {
      en: "Two weights of the same idea, so the ritual fits the hour rather than the other way round.",
      fr: "Deux densités d'une même idée, pour que le rituel s'adapte à l'heure — et non l'inverse.",
      ar: "قوامان لفكرة واحدة، كي يوافق الطقسُ ساعتَه لا العكس.",
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
      en: "Heat, then gommage, then oil.",
      fr: "La chaleur, puis le gommage, puis l'huile.",
      ar: "حرارةٌ، ثم تقشير، ثم زيت.",
    },
    body: {
      en: "The oldest sequence in Moroccan care, kept in the order it has always been done.",
      fr: "La plus ancienne séquence du soin marocain, gardée dans l'ordre où on l'a toujours pratiquée.",
      ar: "أقدم تسلسل في العناية المغربية، محفوظاً بالترتيب الذي جرى عليه دائماً.",
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
      en: "Fleur d'oranger, and nothing else.",
      fr: "La fleur d'oranger, et rien d'autre.",
      ar: "زهر البرتقال، ولا شيء سواه.",
    },
    body: {
      en: "One note across the whole house, so every object smells of the same spring.",
      fr: "Une seule note dans toute la maison, pour que chaque objet sente le même printemps.",
      ar: "نغمة واحدة تسري في الدار كلّها، فتفوح من كل شيء رائحة ربيعٍ واحد.",
    },
    texture: "/textures/plaster-burgundy.jpg",
    hero: "/products/hair-perfume.webp",
    heroAspect: "tall",
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
      en: "The Order of the Hammam",
      fr: "L'Ordre du Hammam",
      ar: "ترتيب الحمّام",
    },
    standfirst: {
      en: "Heat, black soap, gommage, rinse, oil. The sequence is the whole point, and it has not changed.",
      fr: "La chaleur, le savon noir, le gommage, le rinçage, l'huile. La séquence est tout, et elle n'a pas changé.",
      ar: "حرارة، صابون بلدي، تقشير، شطف، زيت. الترتيب هو كل شيء، ولم يتغيّر.",
    },
    readingTime: 4,
    texture: "/editorial/editorial-hammam.jpg",
    product: "body-scrub-argan-fleur-doranger",
    paragraphs: [
      {
        en: "A hammam is not a shower with ambition. It is a room built to hold heat, and a sequence built to use it. You sit first, and you do nothing, which is the part most people skip.",
        fr: "Un hammam n'est pas une douche ambitieuse. C'est une pièce construite pour retenir la chaleur, et une séquence construite pour s'en servir. On s'assoit d'abord, et on ne fait rien — c'est la partie que l'on saute le plus souvent.",
        ar: "الحمّام ليس دُشّاً طَموحاً. هو غرفة بُنيت لتحفظ الحرارة، وتسلسلٌ بُني ليستعملها. تجلس أولاً ولا تفعل شيئاً، وهذا الجزء هو الذي يُهمله أكثر الناس.",
      },
      {
        en: "Only once the skin has softened does the gommage make sense. Worked in circles, ankles upward, it takes off the week. What follows is oil — never a towel and then nothing.",
        fr: "Ce n'est qu'une fois la peau assouplie que le gommage prend son sens. Travaillé en cercles, des chevilles vers le haut, il emporte la semaine. Ensuite vient l'huile — jamais la serviette puis plus rien.",
        ar: "لا يصير للتقشير معنى إلا بعد أن تلين البشرة. يُدلَّك بحركات دائرية من الكاحلين صعوداً فيأخذ الأسبوع معه. ثم يأتي الزيت — لا منشفة ثم لا شيء بعدها.",
      },
      {
        en: "Everything the house makes for the body is designed to sit somewhere in that order. Nothing in it is new. That is rather the point.",
        fr: "Tout ce que la maison fabrique pour le corps est conçu pour prendre place dans cet ordre. Rien n'y est nouveau. C'est précisément l'idée.",
        ar: "كل ما تصنعه الدار للجسد مصمَّمٌ ليقع في موضعٍ من ذلك الترتيب. لا شيء فيه جديد. وهذا بالضبط هو المقصود.",
      },
    ],
  },
  {
    slug: "the-arganeraie",
    kicker: { en: "The Ingredient", fr: "L'Ingrédient", ar: "المكوّن" },
    title: { en: "The Arganeraie", fr: "L'Arganeraie", ar: "غابة الأركان" },
    standfirst: {
      en: "A forest that exists in one corner of one country, and the oil that comes out of it.",
      fr: "Une forêt qui n'existe que dans un coin d'un seul pays, et l'huile qui en sort.",
      ar: "غابة لا توجد إلا في ركنٍ من بلدٍ واحد، والزيت الذي يخرج منها.",
    },
    readingTime: 5,
    texture: "/editorial/ingredient-argan-oil.jpg",
    product: "hair-mask-argan-fleur-doranger",
    paragraphs: [
      {
        en: "Between Essaouira and Agadir there is a forest of low, thorned trees that grow almost nowhere else. UNESCO made it a biosphere reserve in 1998. Locally it is simply the arganeraie.",
        fr: "Entre Essaouira et Agadir s'étend une forêt d'arbres bas et épineux qui ne poussent presque nulle part ailleurs. L'UNESCO en a fait une réserve de biosphère en 1998. Sur place, on dit simplement l'arganeraie.",
        ar: "بين الصويرة وأݣادير تمتدّ غابةٌ من أشجار واطئة شائكة لا تكاد تنبت في غير هذا المكان. جعلتها اليونسكو محميةَ محيطٍ حيوي سنة 1998. وأهلُها يسمّونها ببساطة: غابة الأركان.",
      },
      {
        en: "The fruit is dried, the shell cracked, the kernel pressed. It is slow work, done mostly by hand and mostly by women organised into cooperatives, and it is the reason the oil has never been cheap.",
        fr: "On sèche le fruit, on casse la coque, on presse l'amandon. C'est un travail lent, fait surtout à la main et surtout par des femmes réunies en coopératives — et c'est pourquoi cette huile n'a jamais été bon marché.",
        ar: "تُجفَّف الثمرة، وتُكسَر القشرة، وتُعصَر اللبّة. عملٌ بطيء يجري باليد غالباً، وعلى أيدي نساءٍ منظّماتٍ في تعاونيات — ولهذا لم يكن هذا الزيت رخيصاً قطّ.",
      },
    ],
  },
  {
    slug: "ma-zhar",
    kicker: { en: "The Ingredient", fr: "L'Ingrédient", ar: "المكوّن" },
    title: { en: "Ma Zhar", fr: "Ma Zhar", ar: "ماء الزهر" },
    standfirst: {
      en: "Orange blossom water is not a fragrance note in Morocco. It is a household object.",
      fr: "Au Maroc, l'eau de fleur d'oranger n'est pas une note de parfum. C'est un objet de la maison.",
      ar: "ماء الزهر في المغرب ليس نغمةً عطرية. إنّه من أثاث البيت.",
    },
    readingTime: 3,
    texture: "/editorial/ingredient-orange-blossom.jpg",
    product: "hair-perfume-fleur-doranger",
    paragraphs: [
      {
        en: "It arrives in glass bottles, sits by the stove, goes into pastry and mint tea, and gets sprinkled over the hands of guests before a meal. Children know the smell before they know the word.",
        fr: "Elle arrive en bouteilles de verre, se tient près du fourneau, entre dans les pâtisseries et le thé à la menthe, et se verse sur les mains des invités avant le repas. Les enfants en connaissent l'odeur avant d'en connaître le mot.",
        ar: "يأتي في قوارير زجاجية، ويقف قرب الموقد، ويدخل في الحلوى وفي أتاي بالنعناع، ويُرشّ على أيدي الضيوف قبل الطعام. يعرف الأطفال رائحته قبل أن يعرفوا اسمه.",
      },
      {
        en: "Building an entire collection on one note is a risk. Building it on this one is closer to an admission of where the house is from.",
        fr: "Bâtir toute une collection sur une seule note est un risque. La bâtir sur celle-ci relève plutôt de l'aveu d'origine.",
        ar: "أن تبني مجموعةً كاملة على نغمة واحدة مخاطرة. أمّا أن تبنيها على هذه النغمة، فهو أقرب إلى اعترافٍ بالأصل.",
      },
    ],
  },
  {
    slug: "why-the-tassel",
    kicker: { en: "The House", fr: "La Maison", ar: "الدار" },
    title: { en: "Why the Tassel", fr: "Pourquoi le Pompon", ar: "لماذا الشرّابة" },
    standfirst: {
      en: "On the shampoo bottle there is a silk tassel that serves no function whatsoever.",
      fr: "Sur le flacon de shampooing, un pompon de soie qui ne sert absolument à rien.",
      ar: "على قارورة الشامبو شرّابةُ حرير لا وظيفة لها البتّة.",
    },
    readingTime: 3,
    texture: "/textures/plaster-espresso.jpg",
    product: "shampoo-argan-fleur-doranger",
    paragraphs: [
      {
        en: "It is tied by hand. It costs money. It makes the bottle harder to pack and harder to ship, and it does nothing at all for the shampoo inside.",
        fr: "Il est noué à la main. Il coûte de l'argent. Il complique l'emballage et l'expédition, et il n'apporte rien au shampooing qu'il accompagne.",
        ar: "تُعقَد باليد. وتكلّف مالاً. وتزيد التعبئة والشحن صعوبة، ولا تضيف إلى الشامبو داخلها شيئاً.",
      },
      {
        en: "It is there because Moroccan objects have always been finished — the corner of a rug, the edge of a caftan, the handle of a teapot. The house kept the habit.",
        fr: "Il est là parce que les objets marocains ont toujours été finis — le coin d'un tapis, le bord d'un caftan, l'anse d'une théière. La maison a gardé l'habitude.",
        ar: "هي هناك لأنّ الأشياء المغربية كانت دائماً تُختَم بحاشية — ركن زربية، وحافّة قفطان، ومقبض بَرّاد. احتفظت الدار بالعادة.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
