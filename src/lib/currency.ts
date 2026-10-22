import type { Locale } from "@/lib/i18n/config";

export const currencies = ["EUR"] as const;
export type Currency = (typeof currencies)[number];

/**
 * EUR is the only catalogue and storefront currency.
 */
export const baseCurrency: Currency = "EUR";

export const enabledCurrencies: Currency[] = ["EUR"];

/** One-time migration reference; selling prices do not fluctuate with FX. */
export const eurMigration = { date: "2026-10-22", madPerEur: 10.9953, source: "https://mparsio.com/outils/taux-de-change" } as const;

export function legacyMadToEur(amount: number) {
  return Math.round((amount / eurMigration.madPerEur + Number.EPSILON) * 100) / 100;
}

const referenceRates: Record<Currency, number> = {
  EUR: 1,
};

export function getRates(): Record<Currency, number> {
  return referenceRates;
}

const localeForCurrency: Record<Currency, string> = {
  EUR: "fr-FR",
};

/** Keep cents; never round a unit price to whole euros. */
function tidy(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function convert(amountInBase: number, currency: Currency): number {
  return tidy(amountInBase * getRates()[currency]);
}

/** Historical order amounts retain their original currency. */
export function formatMoney(amount: number, currency = "EUR", locale: Locale = "fr") {
  return new Intl.NumberFormat(locale === "ar" ? "ar-MA" : locale === "en" ? "en-IE" : "fr-FR", {
    style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPrice(
  amountInBase: number,
  currency: Currency,
  locale: Locale = "en",
): string {
  const value = convert(amountInBase, currency);
  const intlLocale = locale === "ar" ? "ar-MA" : localeForCurrency[currency];
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}
