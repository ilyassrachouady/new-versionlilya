import type { MetadataRoute } from "next";

import { products } from "@/lib/catalog";
import { collectionIds } from "@/lib/collections";
import { articles, ingredients } from "@/lib/content";
import { locales } from "@/lib/i18n/config";
import { site } from "@/lib/site";

const paths = [
  "",
  "/shop",
  "/collections",
  "/house",
  "/ingredients",
  "/journal",
  ...collectionIds.map((id) => `/collections/${id}`),
  ...products.map((product) => `/products/${product.slug}`),
  ...articles.map((article) => `/journal/${article.slug}`),
  ...ingredients.map((ingredient) => `/ingredients/${ingredient.id}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(
          locales.map((code) => [code, `${site.url}/${code}${path}`]),
        ),
      },
    })),
  );
}
