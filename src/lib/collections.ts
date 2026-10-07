import { getProduct, products, productsByRitual, type Product, type RitualId, type FragranceId } from "@/lib/catalog";
import { edits, getRitual, rituals, type Edit, type Ritual } from "@/lib/content";
import { getV2Copy } from "@/lib/v2-content";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export const ritualIds = ["hair", "body", "hammam", "scent"] as const;
export const editIds = ["her", "him"] as const;
export const fragranceIds = ["fleur-doranger"] as const satisfies readonly FragranceId[];
export const collectionIds = [...ritualIds, ...editIds, ...fragranceIds] as const;

export type CollectionId = (typeof collectionIds)[number];

export function isCollectionId(value: string): value is CollectionId {
  return (collectionIds as readonly string[]).includes(value);
}

export type ResolvedCollection =
  | {
      id: FragranceId;
      kind: "fragrance";
      eyebrow: string;
      title: string;
      line: string;
      body: string;
      texture: string;
      hero: string;
      heroAspect: Product["aspect"];
      products: Product[];
    }
  | {
      id: RitualId;
      kind: "ritual";
      eyebrow: string;
      title: string;
      line: string;
      body: string;
      texture: string;
      hero: string;
      heroAspect: Product["aspect"];
      products: Product[];
    }
  | {
      id: Edit["id"];
      kind: "edit";
      eyebrow: string;
      title: string;
      line: string;
      body: string;
      texture: string;
      hero: string;
      heroAspect: Product["aspect"];
      products: Product[];
    };

export function resolveCollection(
  id: CollectionId,
  locale: Locale,
  dict: Dictionary,
): ResolvedCollection {
  if (id === "fleur-doranger") {
    const copy = getV2Copy(locale);
    return {
      id, kind: "fragrance", eyebrow: copy.hero.eyebrow, title: copy.flower.title,
      line: copy.flower.note, body: copy.hero.body,
      texture: "/textures/plaster-terracotta.jpg", hero: "/products/body-oil.webp", heroAspect: "tall",
      products: products.filter((product) => product.fragrance === id),
    };
  }

  if (id === "her" || id === "him") {
    const edit = edits.find((item) => item.id === id)!;
    const items = edit.slugs
      .map((slug) => getProduct(slug))
      .filter((product): product is Product => product !== undefined);
    return {
      id,
      kind: "edit",
      eyebrow: dict.edits.eyebrow,
      title: edit.title[locale],
      line: edit.line[locale],
      body: edit.body[locale],
      texture: edit.texture,
      hero: items[0]?.image ?? "/products/body-oil.webp",
      heroAspect: items[0]?.aspect ?? "tall",
      products: items,
    };
  }

  const ritual: Ritual = getRitual(id);
  return {
    id,
    kind: "ritual",
    eyebrow: dict.ritual.eyebrow,
    title: ritual.title[locale],
    line: ritual.line[locale],
    body: ritual.body[locale],
    texture: ritual.texture,
    hero: ritual.hero,
    heroAspect: ritual.heroAspect,
    products: productsByRitual(id),
  };
}

export function allCollections(locale: Locale, dict: Dictionary): ResolvedCollection[] {
  return collectionIds.map((id) => resolveCollection(id, locale, dict));
}

export { products, rituals, edits };
