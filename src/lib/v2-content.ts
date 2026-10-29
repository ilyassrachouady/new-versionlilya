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
      eyebrow: "",
      title: ["The ritual", "begins here."],
      body: "Where premium Moroccan cosmetics meet absolute purity. Treat your skin to 100% organic, natural rituals infused with argan oil.",
      cta: "Shop the collection",
      secondary: "Compose your ritual",
      note: "Made in Morocco · Delivered worldwide",
    },
    collection: {
      eyebrow: "The cabinet · 01—07",
      title: "Our Orange Blossom ritual",
      body: "A 100% organic and natural range, born from the perfect pairing of argan oil and orange blossom. Discover a unique sensory routine with soft, enveloping notes.",
      shop: "Discover the product",
      drag: "Swipe to explore",
    },
    ritual: {
      eyebrow: "The order of care",
      title: "The four stages of care",
      body: "Let water begin the ritual. Take time to nourish your skin, and let your favourite fragrance surround you.",
      steps: [
        { index: "01", title: "Cleanse", line: "Shampoo and gommage open the ritual." },
        { index: "02", title: "Care", line: "A gentle moment with the mask." },
        { index: "03", title: "Nourishment", line: "Body milk to hydrate, oil to enhance." },
        { index: "04", title: "Fragrance", line: "A delicate finishing touch in the hair." },
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
      eyebrow: "",
      title: ["Le rituel", "commence ici."],
      body: "Quand la haute cosmétique marocaine rencontre la pureté absolue. Offrez à votre peau des rituels 100% bio, naturels et infusés d'argan.",
      cta: "Voir la collection",
      secondary: "Composer votre rituel",
      note: "Fabriqué au Maroc · Livraison internationale",
    },
    collection: {
      eyebrow: "Le cabinet · 01—07",
      title: "Notre rituel à la Fleur d'Oranger",
      body: "Une gamme 100 % bio et naturelle, née du mariage parfait entre l'huile d'argan et la fleur d'oranger. Laissez-vous envoûter par une routine sensorielle unique aux notes douces et enveloppantes.",
      shop: "Découvrir l'article",
      drag: "Balayez pour explorer",
    },
    ritual: {
      eyebrow: "L'ordre du soin",
      title: "Les quatre temps du soin",
      body: "Laissez l'eau initier le soin. Prenez le temps de nourrir votre peau, et laissez votre sillage favori vous envelopper.",
      steps: [
        { index: "01", title: "Le Nettoyage", line: "L'ouverture du rituel par le shampoing et le gommage." },
        { index: "02", title: "Le Soin", line: "Le temps du masque, tout en douceur." },
        { index: "03", title: "La Nutrition", line: "Le lait pour hydrater, l'huile pour sublimer." },
        { index: "04", title: "Le Parfum", line: "Une touche finale délicate dans les cheveux." },
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
      title: "L'Art du Voyage Olfactif",
      body: "De la douceur de la fleur d'oranger à l'or rouge du safran, en passant par la fraîcheur du thé vert et les notes envoûtantes d'ambre et du musc, Maison Lilya Zahra assemble les plus beaux trésors de la nature. Une collection de soins précieux faits maison, façonnés pour éveiller vos sens et sublimer votre peau.",
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
      eyebrow: "",
      title: ["من هنا", "يبدأ الطقس."],
      body: "حين تلتقي مستحضرات التجميل المغربية الراقية بالنقاء المطلق. امنحوا بشرتكم طقوس عناية عضوية وطبيعية مئة بالمئة، غنية بزيت الأركان.",
      cta: "تسوّقي المجموعة",
      secondary: "كوّني طقسك",
      note: "صنع في المغرب · توصيل إلى العالم",
    },
    collection: {
      eyebrow: "خزانة الدار · ٠١—٠٧",
      title: "طقسنا بزهر البرتقال",
      body: "مجموعة عضوية وطبيعية مئة بالمئة، ولدت من التناغم بين زيت الأركان وزهر البرتقال. روتين حسي فريد بنفحات ناعمة تحتضن الحواس.",
      shop: "اكتشف المنتج",
      drag: "اسحبي للاستكشاف",
    },
    ritual: {
      eyebrow: "ترتيب العناية",
      title: "المراحل الأربع للعناية",
      body: "دعوا الماء يبدأ طقس العناية. خذوا وقتكم لتغذية بشرتكم، واتركوا عطركم المفضل يحيط بكم.",
      steps: [
        { index: "٠١", title: "تنقية", line: "الشامبو والتقشير يفتتحان الطقس." },
        { index: "٠٢", title: "العناية", line: "وقت القناع، بكل لطف." },
        { index: "٠٣", title: "التغذية", line: "الحليب للترطيب، والزيت لإبراز الجمال." },
        { index: "٠٤", title: "العطر", line: "لمسة ختامية رقيقة على الشعر." },
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
