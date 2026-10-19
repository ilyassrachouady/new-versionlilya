/**
 * Open Inyad payment request sent by the house.
 * The customer types the amount; this link does not receive the bag.
 */
export const inyadPayment = {
  url: "https://pay.inyad.com/pl/PFLu6T",
  /** Ceiling on the payment page, in dirhams (500000 cents). */
  maxMAD: 5000,
} as const;

/** Dirham figure the customer must type, in Western digits. */
export function formatPayableMAD(amountMAD: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    numberingSystem: "latn",
  }).format(amountMAD);
}
