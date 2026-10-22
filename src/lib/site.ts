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
  email: "Localook3@gmail.com",
  contactEmails: [
    { address: "Localook3@gmail.com", label: "Localook3@gmail.com" },
  ],
  instagram: "https://www.instagram.com/maisonlilyazahra.rituel/",
  instagramHandle: "@maisonlilyazahra.rituel",
  foundedIn: "Morocco",
} as const;
