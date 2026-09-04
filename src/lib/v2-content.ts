import type { Locale } from "@/lib/i18n/config";

export type V2Copy = {
  hero: {
    eyebrow: string;
    title: string[];
    body: string;
    cta: string;
    secondary: string;
    note: string;
  };
  collection: {
    eyebrow: string;
    title: string;
    body: string;
    shop: string;
    drag: string;
  };
  ritual: {
    eyebrow: string;
    title: string;
    body: string;
    steps: { index: string; title: string; line: string }[];
    cta: string;
  };
  flower: {
    eyebrow: string;
    title: string;
    body: string;
    note: string;
    cta: string;
  };
  hammam: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
  };
  signatures: {
    eyebrow: string;
    title: string;
    body: string;
  };
  origin: {
    eyebrow: string;
    title: string;
    body: string;
    points: { value: string; label: string }[];
    cta: string;
  };
};

const copy: Record<Locale, V2Copy> = {
  en: {
    hero: {
      eyebrow: "The Fleur d'Oranger collection",
      title: ["The ritual", "begins here."],
      body: "Seven objects for hair and body, composed in Morocco with argan oil and the unmistakable note of orange blossom.",
      cta: "Shop the collection",
      secondary: "Compose your ritual",
      note: "Made in Morocco · Delivered worldwide",
    },
    collection: {
      eyebrow: "The cabinet · 01—07",
      title: "Seven objects. One signature.",
      body: "Amber glass, brass details and a single scent carried from the first wash to the final veil of perfume.",
      shop: "Discover the object",
      drag: "Swipe to explore",
    },
    ritual: {
      eyebrow: "The order of care",
      title: "A ritual in four gestures.",
      body: "Begin with water. Give the treatment its time. Nourish while the skin is warm. Leave fleur d'oranger behind.",
      steps: [
        { index: "01", title: "Cleanse", line: "Shampoo and gommage open the ritual." },
        { index: "02", title: "Treat", line: "Condition and mask, slowly." },
        { index: "03", title: "Nourish", line: "Milk by day. Oil after heat." },
        { index: "04", title: "Perfume", line: "A final veil through the hair." },
      ],
      cta: "Enter the ritual",
    },
    flower: {
      eyebrow: "The signature note",
      title: "Fleur d'Oranger",
      body: "For a few weeks each spring, Morocco carries the scent of bitter orange in bloom. Distilled into ma zhar, it becomes the line that connects every object in the Maison.",
      note: "White flower · green leaf · luminous warmth",
      cta: "Discover the ingredient",
    },
    hammam: {
      eyebrow: "Ritual III · Hammam",
      title: "Heat. Gommage. Oil.",
      body: "The oldest sequence in Moroccan care, recast as an intimate weekly ceremony for home.",
      cta: "Shop the hammam ritual",
    },
    signatures: {
      eyebrow: "Selected by the Maison",
      title: "The signatures",
      body: "The objects that hold the whole collection together.",
    },
    origin: {
      eyebrow: "Born in Morocco",
      title: "Of one place, made for everywhere.",
      body: "Argan from the southwest. Orange blossom distilled in spring. A contemporary beauty house shaped by Moroccan material, memory and gesture.",
      points: [
        { value: "07", label: "Objects" },
        { value: "02", label: "Named botanicals" },
        { value: "01", label: "Signature scent" },
      ],
      cta: "The story of the Maison",
    },
  },
  fr: {
    hero: {
      eyebrow: "La collection Fleur d'Oranger",
      title: ["Le rituel", "commence ici."],
      body: "Sept objets pour les cheveux et le corps, composés au Maroc avec l'huile d'argan et la note inimitable de la fleur d'oranger.",
      cta: "Voir la collection",
      secondary: "Composer votre rituel",
      note: "Fabriqué au Maroc · Livraison internationale",
    },
    collection: {
      eyebrow: "Le cabinet · 01—07",
      title: "Sept objets. Une signature.",
      body: "Verre ambré, détails laiton et un seul parfum, du premier lavage au dernier voile parfumé.",
      shop: "Découvrir l'objet",
      drag: "Balayez pour explorer",
    },
    ritual: {
      eyebrow: "L'ordre du soin",
      title: "Un rituel en quatre gestes.",
      body: "Commencez par l'eau. Donnez au soin son temps. Nourrissez la peau encore chaude. Laissez derrière vous la fleur d'oranger.",
      steps: [
        { index: "01", title: "Nettoyer", line: "Shampooing et gommage ouvrent le rituel." },
        { index: "02", title: "Traiter", line: "Après-shampooing et masque, lentement." },
        { index: "03", title: "Nourrir", line: "Le lait le jour. L'huile après la chaleur." },
        { index: "04", title: "Parfumer", line: "Un dernier voile dans les cheveux." },
      ],
      cta: "Entrer dans le rituel",
    },
    flower: {
      eyebrow: "La note signature",
      title: "Fleur d'Oranger",
      body: "Quelques semaines chaque printemps, le Maroc porte le parfum du bigaradier en fleur. Distillée en ma zhar, elle devient le fil qui relie chaque objet de la Maison.",
      note: "Fleur blanche · feuille verte · chaleur lumineuse",
      cta: "Découvrir l'ingrédient",
    },
    hammam: {
      eyebrow: "Rituel III · Hammam",
      title: "Chaleur. Gommage. Huile.",
      body: "La plus ancienne séquence du soin marocain, réinterprétée comme une cérémonie intime chaque semaine.",
      cta: "Voir le rituel hammam",
    },
    signatures: {
      eyebrow: "La sélection de la Maison",
      title: "Les signatures",
      body: "Les objets qui tiennent toute la collection ensemble.",
    },
    origin: {
      eyebrow: "Née au Maroc",
      title: "D'un lieu. Pour partout.",
      body: "L'argan du Sud-Ouest. La fleur d'oranger distillée au printemps. Une maison de beauté contemporaine façonnée par la matière, la mémoire et le geste marocains.",
      points: [
        { value: "07", label: "Objets" },
        { value: "02", label: "Botaniques nommées" },
        { value: "01", label: "Parfum signature" },
      ],
      cta: "L'histoire de la Maison",
    },
  },
  ar: {
    hero: {
      eyebrow: "مجموعة زهر البرتقال",
      title: ["من هنا", "يبدأ الطقس."],
      body: "سبعة مستحضرات للشعر والجسم، صُنعت في المغرب بزيت الأركان والنغمة المميّزة لزهر البرتقال.",
      cta: "تسوّقي المجموعة",
      secondary: "كوّني طقسك",
      note: "صنع في المغرب · توصيل إلى العالم",
    },
    collection: {
      eyebrow: "خزانة الدار · ٠١—٠٧",
      title: "سبعة مستحضرات. توقيع واحد.",
      body: "زجاج عنبري وتفاصيل نحاسية وعطر واحد يمتدّ من الغسلة الأولى إلى اللمسة الأخيرة.",
      shop: "اكتشفي المستحضر",
      drag: "اسحبي للاستكشاف",
    },
    ritual: {
      eyebrow: "ترتيب العناية",
      title: "طقس من أربع لمسات.",
      body: "ابدئي بالماء. امنحي العلاج وقته. غذّي البشرة وهي دافئة. واتركي خلفك أثر زهر البرتقال.",
      steps: [
        { index: "٠١", title: "تنقية", line: "الشامبو والتقشير يفتتحان الطقس." },
        { index: "٠٢", title: "عناية", line: "بلسم وقناع، على مهل." },
        { index: "٠٣", title: "تغذية", line: "الحليب نهاراً، والزيت بعد الدفء." },
        { index: "٠٤", title: "تعطير", line: "وشاح أخير يمرّ عبر الشعر." },
      ],
      cta: "ادخلي الطقس",
    },
    flower: {
      eyebrow: "النغمة المميّزة",
      title: "زهر البرتقال",
      body: "لبضعة أسابيع كل ربيع، يحمل المغرب عبير النارنج المزهر. وحين يُقطّر إلى ماء الزهر، يصبح الخيط الذي يصل كل مستحضرات الدار.",
      note: "زهرة بيضاء · ورقة خضراء · دفء مشرق",
      cta: "اكتشفي المكوّن",
    },
    hammam: {
      eyebrow: "الطقس الثالث · الحمّام",
      title: "حرارة. تقشير. زيت.",
      body: "أقدم تسلسل في العناية المغربية، صيغ من جديد كطقس أسبوعي حميم في البيت.",
      cta: "تسوّقي طقس الحمّام",
    },
    signatures: {
      eyebrow: "اختيار الدار",
      title: "التوقيعات",
      body: "المستحضرات التي تجمع المجموعة كلها.",
    },
    origin: {
      eyebrow: "وُلدت في المغرب",
      title: "من مكان واحد، إلى كل مكان.",
      body: "الأركان من الجنوب الغربي. وزهر البرتقال المقطّر في الربيع. دار جمال معاصرة تشكّلت من مادة المغرب وذاكرته وطقوسه.",
      points: [
        { value: "٠٧", label: "مستحضرات" },
        { value: "٠٢", label: "مكوّنان نباتيان" },
        { value: "٠١", label: "عطر مميّز" },
      ],
      cta: "قصّة الدار",
    },
  },
};

export function getV2Copy(locale: Locale): V2Copy {
  return copy[locale];
}
