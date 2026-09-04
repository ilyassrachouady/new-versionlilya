/**
 * House-level configuration — aligned to the official lockup.
 */
export const site = {
  name: "Maison Lilya Zahra",
  nameParts: { prefix: "Maison", family: "Lilya Zahra" },
  monogram: "LZ",
  tagline: "For her & him",
  /** Set to your production origin before deploying. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://maisonlilyazahra.com",
  email: "bonjour@maisonlilyazahra.com",
  instagram: "https://instagram.com/",
  foundedIn: "Morocco",
} as const;
