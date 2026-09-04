/**
 * House-level configuration.
 *
 * NOTE ON THE NAME: the packaging photographed for this build reads
 * "MAISON LILYA ZAHRA". The brief specifies "MAISON LIYA ZAHRA". The brief
 * wins here, but the wordmark is defined once, in this file — change the two
 * strings below and the entire site, metadata and emblem follow.
 */
export const site = {
  name: "Maison Liya Zahra",
  nameParts: { prefix: "Maison", family: "Liya Zahra" },
  monogram: "LZ",
  /** Set to your production origin before deploying. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://maisonliyazahra.com",
  email: "bonjour@maisonliyazahra.com",
  instagram: "https://instagram.com/",
  foundedIn: "Morocco",
} as const;
