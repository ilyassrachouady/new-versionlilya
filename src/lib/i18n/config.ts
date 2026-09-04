export const locales = ["en", "fr", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeMeta: Record<
  Locale,
  { label: string; native: string; dir: "ltr" | "rtl"; htmlLang: string; ogLocale: string }
> = {
  en: { label: "EN", native: "English", dir: "ltr", htmlLang: "en", ogLocale: "en_US" },
  fr: { label: "FR", native: "Français", dir: "ltr", htmlLang: "fr", ogLocale: "fr_FR" },
  ar: { label: "AR", native: "العربية", dir: "rtl", htmlLang: "ar", ogLocale: "ar_MA" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Localised path helper: `href("/shop", "fr") -> "/fr/shop"`. */
export function href(path: string, locale: Locale): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}
