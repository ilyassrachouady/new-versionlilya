import type { Product } from "@/lib/catalog";
import type { Article } from "@/lib/content";
import { baseCurrency } from "@/lib/currency";
import { href, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";

const absolute = (path: string) => new URL(path, site.url).toString();

export function organisationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: absolute(href("/", locale)),
    email: site.email,
    address: { "@type": "PostalAddress", addressCountry: "MA" },
    brand: { "@type": "Brand", name: site.name },
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: absolute(href("/", locale)),
    inLanguage: locale,
  };
}

export function productSchema(product: Product, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name[locale]} — ${product.scent}`,
    description: product.description[locale],
    sku: product.sku,
    image: [absolute(product.image)],
    brand: { "@type": "Brand", name: site.name },
    countryOfOrigin: { "@type": "Country", name: "Morocco" },
    offers: {
      "@type": "Offer",
      price: product.priceMAD,
      priceCurrency: baseCurrency,
      availability: "https://schema.org/InStock",
      url: absolute(href(`/products/${product.slug}`, locale)),
      seller: { "@type": "Organization", name: site.name },
    },
  };
}

export function articleSchema(article: Article, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title[locale],
    description: article.standfirst[locale],
    inLanguage: locale,
    image: [absolute(article.texture)],
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: absolute(href(`/journal/${article.slug}`, locale)),
  };
}

export function breadcrumbSchema(
  trail: { name: string; path: string }[],
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(href(crumb.path, locale)),
    })),
  };
}
