import type { Locale } from "@/lib/i18n/config";
type CertificationCard = {
  index: string;
  title: string;
  body: string;
  note: string;
  logo: string;
  logoAlt: string;
  logoClassName: string;
};

type TrustCopy = {
  eyebrow: string;
  heading: string;
  intro: string;
  certifications: CertificationCard[];
};

export const trustCopy: Record<Locale, TrustCopy> = {
  en: {
    eyebrow: "Quality & compliance",
    heading: "Care developed with rigor, from formulation to manufacturing.",
    intro:
      "A demanding approach to quality, supported by controlled manufacturing standards and regulatory oversight.",
    certifications: [
      {
        index: "01",
        title: "Manufacturing",
        body: "Made by an ISO 22716-certified laboratory.",
        note: "Cosmetics — Good manufacturing practices",
        logo: "/trust/iso-22716.png",
        logoAlt: "ISO 22716",
        logoClassName: "h-[4.4rem] w-auto max-w-[15rem] sm:h-[4.9rem]",
      },
      {
        index: "02",
        title: "Regulatory compliance",
        body: "Agence Marocaine du Médicament et des Produits de Santé.",
        note: "AMMPS",
        logo: "/trust/ammps.png",
        logoAlt: "AMMPS — Agence Marocaine du Médicament et des Produits de Santé",
        logoClassName: "h-[3.7rem] w-auto max-w-[11rem] sm:h-[4.15rem]",
      },
    ],
  },
  fr: {
    eyebrow: "Qualité & conformité",
    heading: "Des soins développés avec exigence, de la formulation à la fabrication.",
    intro:
      "Une approche exigeante de la qualité, soutenue par des standards de fabrication encadrés et une conformité réglementaire rigoureuse.",
    certifications: [
      {
        index: "01",
        title: "Fabrication",
        body: "Fabriqué par un laboratoire certifié ISO 22716.",
        note: "Cosmétiques — Bonnes pratiques de fabrication",
        logo: "/trust/iso-22716.png",
        logoAlt: "ISO 22716",
        logoClassName: "h-[4.4rem] w-auto max-w-[15rem] sm:h-[4.9rem]",
      },
      {
        index: "02",
        title: "Conformité réglementaire",
        body: "Agence Marocaine du Médicament et des Produits de Santé.",
        note: "AMMPS",
        logo: "/trust/ammps.png",
        logoAlt: "AMMPS — Agence Marocaine du Médicament et des Produits de Santé",
        logoClassName: "h-[3.7rem] w-auto max-w-[11rem] sm:h-[4.15rem]",
      },
    ],
  },
  ar: {
    eyebrow: "الجودة والامتثال",
    heading: "عناية تُطوَّر بدقة، من الصياغة إلى التصنيع.",
    intro:
      "نهج صارم للجودة، تدعمه معايير تصنيع مؤطرة ورقابة تنظيمية دقيقة.",
    certifications: [
      {
        index: "01",
        title: "التصنيع",
        body: "مصنّع من طرف مختبر معتمد وفق معيار ISO 22716.",
        note: "مستحضرات التجميل — ممارسات التصنيع الجيدة",
        logo: "/trust/iso-22716.png",
        logoAlt: "ISO 22716",
        logoClassName: "h-[4.4rem] w-auto max-w-[15rem] sm:h-[4.9rem]",
      },
      {
        index: "02",
        title: "الامتثال التنظيمي",
        body: "Agence Marocaine du Médicament et des Produits de Santé.",
        note: "AMMPS",
        logo: "/trust/ammps.png",
        logoAlt: "AMMPS — Agence Marocaine du Médicament et des Produits de Santé",
        logoClassName: "h-[3.7rem] w-auto max-w-[11rem] sm:h-[4.15rem]",
      },
    ],
  },
};

