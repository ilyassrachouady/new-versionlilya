/**
 * Open Inyad payment request sent by the house.
 * The customer types the amount; this link does not receive the bag.
 */
export const inyadPayment = {
  url: process.env.NEXT_PUBLIC_EUR_PAYMENT_URL ?? "",
  /** Payments remain unavailable until an EUR destination is configured. */
  maxEUR: Infinity,
} as const;

/** Euro amount, in Western digits, with exact cents. */
export function formatPayableEUR(amountEUR: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    numberingSystem: "latn",
  }).format(amountEUR);
}
