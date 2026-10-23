import { site } from "@/lib/site";
export const contactDefaults = {
  tagline: site.tagline as string,
  email: site.email as string,
  secondaryEmail: site.contactEmails[1].address as string,
  instagram: site.instagram as string,
  instagramHandle: site.instagramHandle as string,
};
