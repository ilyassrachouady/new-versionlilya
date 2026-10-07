import { catalogProducts, type FragranceId, type RitualId } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n/config";
import { shopProductImages } from "@/lib/shop-product-images";

export const signatureIds = ["fleur-doranger", "the-vert", "ambre-musc", "safran"] as const;
export type SignatureId = (typeof signatureIds)[number];
export const ritualOrder: RitualId[] = ["hair", "body", "hammam", "scent"];

export const signatureWorlds: Record<SignatureId, { name: string; image: string; background: string }> = {
  "fleur-doranger": { name: "Fleur d’Oranger", image: "/signature-collections/fleur-doranger.webp", background: "#9a603c" },
  "the-vert": { name: "Thé Vert", image: "/signature-collections/the-vert.webp", background: "#354538" },
  "ambre-musc": { name: "Ambre Musc", image: "/signature-collections/ambre-musc.webp", background: "#292d24" },
  safran: { name: "Safran", image: "/signature-collections/safran.webp", background: "#b19a75" },
};

export function isSignatureId(value: string): value is SignatureId {
  return signatureIds.includes(value as SignatureId);
}

// Another discovery view of the same catalog; never maintain signature-specific SKU lists.
export function signatureProducts(signature: FragranceId) {
  return catalogProducts.filter((product) => product.fragrance === signature).map((product) => ({
    ...product,
    image: shopProductImages[product.slug] ?? product.image,
  }));
}

const copy = {
  en: {
    nav: "Signatures", label: "Signature Collections", title: "The signatures\nof the Maison.",
    body: "Four worlds. One Maison.", explore: "Explore the signatures", discover: "Discover the signature",
    products: "Explore the objects", intro: "The objects of this signature, gathered by ritual.",
    another: "Discover another signature", all: "All signatures", chapter: "The signature",
    rituals: { hair: "Hair", body: "Body", hammam: "Hammam", scent: "Scent" },
  },
  fr: {
    nav: "Signatures", label: "Collections signatures", title: "Les signatures\nde la Maison.",
    body: "Quatre univers. Une Maison.", explore: "Explorer les signatures", discover: "Découvrir la signature",
    products: "Découvrir les objets", intro: "Les objets de cette signature, réunis par rituel.",
    another: "Découvrir une autre signature", all: "Toutes les signatures", chapter: "La signature",
    rituals: { hair: "Cheveux", body: "Corps", hammam: "Hammam", scent: "Parfum" },
  },
  ar: {
    nav: "التوقيعات", label: "مجموعات التوقيعات", title: "توقيعات\nالدار.",
    body: "أربعة عوالم. دار واحدة.", explore: "اكتشف التوقيعات", discover: "اكتشف التوقيع",
    products: "اكتشف المنتجات", intro: "منتجات هذا التوقيع، مرتّبة بحسب الطقوس.",
    another: "اكتشف توقيعاً آخر", all: "كل التوقيعات", chapter: "التوقيع",
    rituals: { hair: "الشعر", body: "الجسم", hammam: "الحمّام", scent: "العطر" },
  },
};

export function signatureCopy(locale: Locale) { return copy[locale]; }
