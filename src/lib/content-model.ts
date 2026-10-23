import { shopCopy } from "@/lib/shop-content";
import { contactDefaults } from "@/lib/contact-content";
export { fields } from "./content-fields";
import { trustCopy } from "@/lib/trust-content";
import { showcaseCopy } from "@/lib/showcase-content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getV2Copy } from "@/lib/v2-content";
import { signatureCopy, signatureWorlds } from "@/lib/signature-collections";
import { rituals, articles, ingredients, edits, needs } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";

export const contentSources = { shopUi: (locale: Locale) => shopCopy[locale], contact: () => contactDefaults, worlds: (locale: Locale) => Object.fromEntries((["fleur-doranger", "the-vert", "safran", "ambre-musc"] as const).map((id, index) => [id, { ...signatureWorlds[id], name: showcaseCopy[locale].names[index] }])), trust: (locale: Locale) => trustCopy[locale], showcase: (locale: Locale) => showcaseCopy[locale], dictionary: getDictionary, home: getV2Copy, signatures: signatureCopy,
  editorial: () => ({ rituals, articles, ingredients, edits, needs }) };
export type ContentKey = keyof typeof contentSources;
export const contentTitles: Record<ContentKey, string> = { shopUi: "Boutique : filtres et tri", contact: "Coordonnées et réseaux sociaux", worlds: "Noms des fragrances", trust: "Qualité et conformité", showcase: "Accueil : fragrances", dictionary: "Interface, FAQ, Maison et navigation", home: "Page d’accueil", signatures: "Collections signatures", editorial: "Collections, journal et ingrédients" };
export function localize(value: unknown, locale: Locale): unknown {
  if (Array.isArray(value)) return value.map(item => localize(item, locale));
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (["fr", "en", "ar"].every(key => typeof obj[key] === "string")) return obj[locale];
    return Object.fromEntries(Object.entries(obj).map(([key, item]) => [key, localize(item, locale)]));
  }
  return value;
}
export function merge<T>(base: T, patch: unknown): T {
  if (typeof base === "string") return (typeof patch === "string" ? patch : base) as T;
  if (Array.isArray(base)) return base.map((v, i) => merge(v, Array.isArray(patch) ? patch[i] : undefined)) as T;
  if (base && typeof base === "object") return Object.fromEntries(Object.entries(base).map(([key, v]) => [key, merge(v, patch && typeof patch === "object" ? (patch as Record<string, unknown>)[key] : undefined)])) as T;
  return base;
}
export function contentDefault(key: ContentKey, locale: Locale) { return localize(contentSources[key](locale), locale); }
export function hydrate<T>(base: T, translated: unknown, locale: Locale): T {
  if (Array.isArray(base)) return base.map((v, i) => hydrate(v, Array.isArray(translated) ? translated[i] : undefined, locale)) as T;
  if (base && typeof base === "object") {
    const obj = base as Record<string, unknown>;
    if (["fr", "en", "ar"].every(key => typeof obj[key] === "string")) return { ...obj, [locale]: typeof translated === "string" ? translated : obj[locale] } as T;
    return Object.fromEntries(Object.entries(obj).map(([key, v]) => [key, hydrate(v, translated && typeof translated === "object" ? (translated as Record<string, unknown>)[key] : undefined, locale)])) as T;
  }
  return merge(base, translated);
}
