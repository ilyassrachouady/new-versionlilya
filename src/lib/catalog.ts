import type { Locale } from "@/lib/i18n/config";

export type Localized = Record<Locale, string>;

export type RitualId = "hair" | "body" | "hammam" | "scent";

export type Product = {
  slug: string;
  sku: string;
  /** Cut out from the maison's own studio frames — transparent, on any field. */
  image: string;
  imageWidth: number;
  imageHeight: number;
  /** English / Arabic name of the object. */
  name: Localized;
  /** The French line printed on the label. Kept verbatim in every locale. */
  labelFr: string;
  /** Printed on every label of the line. */
  scent: string;
  size: string;
  volumeMl: number;
  withArgan: boolean;
  priceMAD: number;
  ritual: RitualId;
  needs: NeedId[];
  tagline: Localized;
  description: Localized;
  ritualNote: Localized;
  howToUse: Localized;
  /** Which ingredient stories this product is attached to. */
  ingredients: IngredientId[];
  /** Vessel description, drawn from the photography. */
  vessel: Localized;
  featured: boolean;
  /** Silhouette weighting so tall bottles and squat jars sit correctly. */
  aspect: "tall" | "column" | "jar";
};

export type NeedId = "cleanse" | "nourish" | "hydrate" | "glow" | "restore" | "scent";

export type IngredientId = "argan" | "orange-blossom";

/* --------------------------------------------------------------------------
 * PRICING
 * Placeholder dirham prices so the storefront is complete end to end.
 * Replace with the maison's real price list before opening the store.
 * ----------------------------------------------------------------------- */

export const products: Product[] = [
  {
    slug: "body-oil-fleur-doranger",
    sku: "MLZ-BO-100",
    image: "/products/body-oil.webp",
    imageWidth: 364,
    imageHeight: 1217,
    name: {
      en: "Body Oil",
      fr: "Huile Corporelle",
      ar: "زيت الجسم",
    },
    labelFr: "Huile Corporelle",
    scent: "Fleur d'Oranger",
    size: "100 ML",
    volumeMl: 100,
    withArgan: false,
    priceMAD: 320,
    ritual: "body",
    needs: ["nourish", "glow", "scent"],
    tagline: {
      en: "Orange blossom, carried in oil.",
      fr: "La fleur d'oranger, portée par l'huile.",
      ar: "زهر البرتقال، محمولاً في الزيت.",
    },
    description: {
      en: "Orange blossom is the scent of a Moroccan spring — courtyards, cool tiled floors, water offered at the door. This body oil carries it in amber glass, to be worked into the skin slowly, at the end of a day.",
      fr: "La fleur d'oranger, c'est le printemps marocain — les patios, le carrelage frais, l'eau que l'on vous tend à l'entrée. Cette huile la garde dans son flacon d'ambre, pour être travaillée lentement sur la peau, en fin de journée.",
      ar: "زهر البرتقال هو رائحة الربيع المغربي: الأفنية، البلاط البارد، والماء الذي يُقدَّم عند الباب. يحفظ هذا الزيت تلك الرائحة في زجاج عنبري، ليُدلَّك على البشرة بتمهّل في آخر النهار.",
    },
    ritualNote: {
      en: "After the hammam, or a long shower, while the skin is still warm.",
      fr: "Après le hammam, ou une longue douche, tant que la peau est encore chaude.",
      ar: "بعد الحمّام أو استحمام طويل، والبشرة ما تزال دافئة.",
    },
    howToUse: {
      en: "Warm a little between the palms. Work upward from the ankles, unhurried. Finish at the shoulders.",
      fr: "Réchauffez quelques gouttes entre les paumes. Remontez des chevilles, sans hâte. Terminez aux épaules.",
      ar: "دفّئي قليلاً منه بين الكفّين. اصعدي من الكاحلين بلا عجلة، وانتهي عند الكتفين.",
    },
    ingredients: ["orange-blossom"],
    vessel: {
      en: "Frosted amber glass, brass-toned collar, ornamental label.",
      fr: "Verre ambré dépoli, col ton laiton, étiquette ornementale.",
      ar: "زجاج عنبري مصنفر، طوق بلون النحاس، وملصق مزخرف.",
    },
    featured: true,
    aspect: "tall",
  },
  {
    slug: "hair-perfume-fleur-doranger",
    sku: "MLZ-HP-100",
    image: "/products/hair-perfume.webp",
    imageWidth: 363,
    imageHeight: 1115,
    name: {
      en: "Hair Perfume",
      fr: "Parfum Pour Cheveux",
      ar: "عطر الشعر",
    },
    labelFr: "Parfum Pour Cheveux",
    scent: "Fleur d'Oranger",
    size: "100 ML",
    volumeMl: 100,
    withArgan: false,
    priceMAD: 340,
    ritual: "scent",
    needs: ["scent"],
    tagline: {
      en: "Scent, worn in the hair.",
      fr: "Le parfum, porté dans les cheveux.",
      ar: "عطرٌ يُلبَس في الشعر.",
    },
    description: {
      en: "A hair perfume built on fleur d'oranger. Lighter than fragrance on skin: it moves when you move, and stays a few steps behind you.",
      fr: "Un parfum pour cheveux bâti sur la fleur d'oranger. Plus léger qu'un parfum de peau : il bouge quand vous bougez, et reste quelques pas derrière vous.",
      ar: "عطر للشعر قوامه زهر البرتقال. أخفّ من عطر البشرة: يتحرّك حين تتحرّكين، ويبقى على بعد خطوات خلفك.",
    },
    ritualNote: {
      en: "Last, once the hair is dry.",
      fr: "En dernier, une fois les cheveux secs.",
      ar: "في الأخير، بعد أن يجفّ الشعر.",
    },
    howToUse: {
      en: "Hold at arm's length. Two passes over the lengths — never the roots.",
      fr: "Vaporisez à bout de bras. Deux passages sur les longueurs — jamais sur les racines.",
      ar: "امسكي القارورة على مسافة الذراع. رشّتان على الأطراف — لا على الجذور.",
    },
    ingredients: ["orange-blossom"],
    vessel: {
      en: "Frosted amber glass, brass-toned collar, ornamental label.",
      fr: "Verre ambré dépoli, col ton laiton, étiquette ornementale.",
      ar: "زجاج عنبري مصنفر، طوق بلون النحاس، وملصق مزخرف.",
    },
    featured: true,
    aspect: "tall",
  },
  {
    slug: "body-scrub-argan-fleur-doranger",
    sku: "MLZ-BS-250",
    image: "/products/body-scrub.webp",
    imageWidth: 723,
    imageHeight: 848,
    name: {
      en: "Body Scrub",
      fr: "Gommage Corporel",
      ar: "مقشّر الجسم",
    },
    labelFr: "Gommage Corporel",
    scent: "Fleur d'Oranger",
    size: "250 ML",
    volumeMl: 250,
    withArgan: true,
    priceMAD: 280,
    ritual: "hammam",
    needs: ["cleanse", "glow"],
    tagline: {
      en: "The hammam, at home.",
      fr: "Le hammam, à la maison.",
      ar: "الحمّام، في بيتك.",
    },
    description: {
      en: "Gommage is the centre of the Moroccan hammam — the moment the week is taken off. Made with argan oil and scented with fleur d'oranger, in the largest jar the house fills.",
      fr: "Le gommage est le cœur du hammam marocain — le moment où la semaine s'en va. Formulé à l'huile d'argan et parfumé à la fleur d'oranger, dans le plus grand pot de la maison.",
      ar: "الگمّاج قلب الحمّام المغربي — اللحظة التي يُنزَع فيها أسبوع كامل. مصنوع بزيت الأركان ومعطّر بزهر البرتقال، في أكبر مرطبان تملؤه الدار.",
    },
    ritualNote: {
      en: "Once a week, in a warm room, before anything else.",
      fr: "Une fois par semaine, dans une pièce chaude, avant tout le reste.",
      ar: "مرّة في الأسبوع، في غرفة دافئة، قبل كل شيء آخر.",
    },
    howToUse: {
      en: "On damp skin. Work in circles from the ankles upward. Rinse, then oil.",
      fr: "Sur peau humide. Massez en cercles, des chevilles vers le haut. Rincez, puis huilez.",
      ar: "على بشرة رطبة. دلّكي بحركات دائرية من الكاحلين صعوداً. اشطفي، ثم رطّبي بالزيت.",
    },
    ingredients: ["argan", "orange-blossom"],
    vessel: {
      en: "Amber glass jar, screw-threaded brass-toned lid.",
      fr: "Pot en verre ambré, couvercle vissé ton laiton.",
      ar: "مرطبان من الزجاج العنبري بغطاء لولبي بلون النحاس.",
    },
    featured: true,
    aspect: "jar",
  },
  {
    slug: "hair-mask-argan-fleur-doranger",
    sku: "MLZ-HM-200",
    image: "/products/hair-mask.webp",
    imageWidth: 798,
    imageHeight: 938,
    name: {
      en: "Hair Mask",
      fr: "Masque Capillaire",
      ar: "قناع الشعر",
    },
    labelFr: "Masque Capillaire",
    scent: "Fleur d'Oranger",
    size: "200 ML",
    volumeMl: 200,
    withArgan: true,
    priceMAD: 270,
    ritual: "hair",
    needs: ["nourish", "restore"],
    tagline: {
      en: "A longer treatment, for the ends.",
      fr: "Un soin plus long, pour les pointes.",
      ar: "عناية أطول، للأطراف.",
    },
    description: {
      en: "A weekly mask with argan oil, in amber glass under a brass-toned lid. The kind of jar that stays out on the shelf rather than in the cupboard.",
      fr: "Un masque hebdomadaire à l'huile d'argan, en verre ambré sous un couvercle ton laiton. Le genre de pot qui reste sur l'étagère, pas dans le placard.",
      ar: "قناع أسبوعي بزيت الأركان، في زجاج عنبري تحت غطاء بلون النحاس. من المرطبانات التي تبقى على الرفّ لا في الخزانة.",
    },
    ritualNote: {
      en: "Once a week. Give it the ten minutes.",
      fr: "Une fois par semaine. Accordez-lui ses dix minutes.",
      ar: "مرّة في الأسبوع. امنحيه عشر دقائق كاملة.",
    },
    howToUse: {
      en: "On damp hair. Section, apply to lengths and ends, leave ten minutes, rinse.",
      fr: "Sur cheveux humides. Séparez, appliquez sur les longueurs et les pointes, laissez dix minutes, rincez.",
      ar: "على شعر رطب. قسّمي الشعر، ووزّعيه على الأطوال والأطراف، واتركيه عشر دقائق ثم اشطفي.",
    },
    ingredients: ["argan", "orange-blossom"],
    vessel: {
      en: "Amber glass jar, screw-threaded brass-toned lid.",
      fr: "Pot en verre ambré, couvercle vissé ton laiton.",
      ar: "مرطبان من الزجاج العنبري بغطاء لولبي بلون النحاس.",
    },
    featured: true,
    aspect: "jar",
  },
  {
    slug: "shampoo-argan-fleur-doranger",
    sku: "MLZ-SH-200",
    image: "/products/shampoo.webp",
    imageWidth: 408,
    imageHeight: 1212,
    name: {
      en: "Shampoo",
      fr: "Shampooing",
      ar: "شامبو",
    },
    labelFr: "Shampooing",
    scent: "Fleur d'Oranger",
    size: "200 ML",
    volumeMl: 200,
    withArgan: true,
    priceMAD: 220,
    ritual: "hair",
    needs: ["cleanse"],
    tagline: {
      en: "The first step, dressed properly.",
      fr: "Le premier geste, correctement habillé.",
      ar: "الخطوة الأولى، في لباسها اللائق.",
    },
    description: {
      en: "A shampoo with argan oil and fleur d'oranger, finished with a hand-tied silk tassel — the house's small insistence that the everyday should also be dressed.",
      fr: "Un shampooing à l'huile d'argan et à la fleur d'oranger, achevé d'un pompon de soie noué à la main — la petite exigence de la maison : que le quotidien soit habillé, lui aussi.",
      ar: "شامبو بزيت الأركان وزهر البرتقال، مذيَّل بشرّابة حرير معقودة يدوياً — إصرار الدار الصغير على أن اليومي يستحقّ لباسه أيضاً.",
    },
    ritualNote: {
      en: "The opening of the hair ritual.",
      fr: "L'ouverture du rituel capillaire.",
      ar: "افتتاح طقس الشعر.",
    },
    howToUse: {
      en: "Work into wet hair at the scalp. Rinse. Repeat only if you need to.",
      fr: "Massez le cuir chevelu sur cheveux mouillés. Rincez. Ne recommencez que si nécessaire.",
      ar: "دلّكي فروة الرأس على شعر مبلل. اشطفي. وكرّري عند الحاجة فقط.",
    },
    ingredients: ["argan", "orange-blossom"],
    vessel: {
      en: "Ornamented bottle, domed cap, hand-tied silk tassel.",
      fr: "Flacon ornementé, capuchon en dôme, pompon de soie noué à la main.",
      ar: "قارورة مزخرفة، غطاء مقبّب، وشرّابة حرير معقودة يدوياً.",
    },
    featured: false,
    aspect: "column",
  },
  {
    slug: "conditioner-argan-fleur-doranger",
    sku: "MLZ-CD-200",
    image: "/products/conditioner.webp",
    imageWidth: 410,
    imageHeight: 1260,
    name: {
      en: "Conditioner",
      fr: "Après-Shampooing",
      ar: "بلسم الشعر",
    },
    labelFr: "Après-Shampooing",
    scent: "Fleur d'Oranger",
    size: "200 ML",
    volumeMl: 200,
    withArgan: true,
    priceMAD: 220,
    ritual: "hair",
    needs: ["nourish", "restore"],
    tagline: {
      en: "What follows the wash.",
      fr: "Ce qui suit le lavage.",
      ar: "ما يلي الغسل.",
    },
    description: {
      en: "The companion to the shampoo, with argan oil and the same orange blossom. Left in for the length of a long breath, then rinsed.",
      fr: "Le compagnon du shampooing, à l'huile d'argan et à la même fleur d'oranger. On le laisse le temps d'une longue respiration, puis on rince.",
      ar: "رفيق الشامبو، بزيت الأركان وبزهر البرتقال نفسه. يُترك بمقدار نَفَسٍ طويل، ثم يُشطف.",
    },
    ritualNote: {
      en: "Straight after the shampoo, every wash.",
      fr: "Juste après le shampooing, à chaque lavage.",
      ar: "مباشرة بعد الشامبو، في كلّ غسلة.",
    },
    howToUse: {
      en: "Apply from mid-length to ends. Leave two to three minutes. Rinse cool.",
      fr: "Appliquez des mi-longueurs aux pointes. Laissez deux à trois minutes. Rincez à l'eau fraîche.",
      ar: "وزّعيه من منتصف الطول إلى الأطراف. اتركيه دقيقتين إلى ثلاث. اشطفي بماء بارد.",
    },
    ingredients: ["argan", "orange-blossom"],
    vessel: {
      en: "Ornamented bottle, domed cap, hand-tied silk tassel.",
      fr: "Flacon ornementé, capuchon en dôme, pompon de soie noué à la main.",
      ar: "قارورة مزخرفة، غطاء مقبّب، وشرّابة حرير معقودة يدوياً.",
    },
    featured: false,
    aspect: "column",
  },
  {
    slug: "body-milk-argan-fleur-doranger",
    sku: "MLZ-BM-200",
    image: "/products/body-milk.webp",
    imageWidth: 475,
    imageHeight: 1336,
    name: {
      en: "Body Milk",
      fr: "Lait Corporel",
      ar: "حليب الجسم",
    },
    labelFr: "Lait Corporel",
    scent: "Fleur d'Oranger",
    size: "200 ML",
    volumeMl: 200,
    withArgan: true,
    priceMAD: 260,
    ritual: "body",
    needs: ["hydrate", "scent"],
    tagline: {
      en: "Lighter than the oil. For every day.",
      fr: "Plus léger que l'huile. Pour tous les jours.",
      ar: "أخفّ من الزيت. لكلّ يوم.",
    },
    description: {
      en: "A body milk with argan oil for the mornings when oil is too much. Pump, gold tassel, orange blossom — the same house, in a lighter register.",
      fr: "Un lait corporel à l'huile d'argan pour les matins où l'huile est de trop. Pompe, pompon doré, fleur d'oranger — la même maison, dans un registre plus léger.",
      ar: "حليب للجسم بزيت الأركان، لصباحاتٍ يكون فيها الزيت أثقل من اللازم. مضخّة، وشرّابة ذهبية، وزهر برتقال — الدار نفسها بنبرة أخفّ.",
    },
    ritualNote: {
      en: "Mornings, on skin still damp from the shower.",
      fr: "Le matin, sur une peau encore humide de la douche.",
      ar: "في الصباح، على بشرة ما تزال رطبة من الاستحمام.",
    },
    howToUse: {
      en: "Two pumps. Smooth over arms, legs and shoulders. Dress once it has settled.",
      fr: "Deux pressions. Lissez sur les bras, les jambes et les épaules. Habillez-vous une fois absorbé.",
      ar: "ضغطتان. وزّعيه على الذراعين والساقين والكتفين، والبسي بعد أن يستقرّ.",
    },
    ingredients: ["argan", "orange-blossom"],
    vessel: {
      en: "Ornamented bottle, brass-toned pump, gold silk tassel.",
      fr: "Flacon ornementé, pompe ton laiton, pompon de soie doré.",
      ar: "قارورة مزخرفة، مضخّة بلون النحاس، وشرّابة حرير ذهبية.",
    },
    featured: true,
    aspect: "column",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function productsByRitual(ritual: RitualId): Product[] {
  return products.filter((product) => product.ritual === ritual);
}

export function productsByNeed(need: NeedId): Product[] {
  return products.filter((product) => product.needs.includes(need));
}

export function relatedProducts(product: Product, count = 4): Product[] {
  const sameRitual = products.filter(
    (item) => item.slug !== product.slug && item.ritual === product.ritual,
  );
  const rest = products.filter(
    (item) => item.slug !== product.slug && item.ritual !== product.ritual,
  );
  return [...sameRitual, ...rest].slice(0, count);
}

/** The scrub, the oil and the mask — the three the house is known for. */
export const signatureSlugs = [
  "body-oil-fleur-doranger",
  "hair-mask-argan-fleur-doranger",
  "body-scrub-argan-fleur-doranger",
] as const;
