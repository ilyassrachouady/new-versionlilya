import type { Locale } from "@/lib/i18n/config";

export const currencies = ["MAD", "EUR", "GBP", "USD", "CAD", "AED"] as const;
export type Currency = (typeof currencies)[number];

/**
 * The store prices in dirham. Everything else is a display conversion.
 *
 * NOTE FOR THE MAISON: these are static reference rates. Point
 * `getRates()` at your payment provider's FX feed before taking real orders,
 * and trim `enabledCurrencies` to the ones your gateway actually settles.
 */
export const baseCurrency: Currency = "MAD";

export const enabledCurrencies: Currency[] = ["MAD", "EUR", "GBP", "USD", "CAD", "AED"];

const referenceRates: Record<Currency, number> = {
  MAD: 1,
  EUR: 0.092,
  GBP: 0.078,
  USD: 0.1,
  CAD: 0.137,
  AED: 0.367,
};

export function getRates(): Record<Currency, number> {
  return referenceRates;
}

const localeForCurrency: Record<Currency, string> = {
  MAD: "fr-MA",
  EUR: "fr-FR",
  GBP: "en-GB",
  USD: "en-US",
  CAD: "en-CA",
  AED: "en-AE",
};

/** Round to a price that looks considered rather than converted. */
function tidy(amount: number, currency: Currency): number {
  if (currency === "MAD" || currency === "AED") return Math.round(amount / 5) * 5;
  return Math.round(amount);
}

export function convert(amountInBase: number, currency: Currency): number {
  return tidy(amountInBase * getRates()[currency], currency);
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
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}
