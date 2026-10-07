import { shopProductImages } from "@/lib/shop-product-images";
import { ShopBanner } from "@/components/shop/ShopBanner";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageFrame } from "@/components/layout/PageFrame";
import { catalogProducts as products, fragrances } from "@/lib/catalog";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return {
    title: dict.nav.shop,
    description: dict.shopPage.body,
    alternates: {
      canonical: `/${locale}/shop`,
      languages: { en: "/en/shop", fr: "/fr/shop", ar: "/ar/shop", "x-default": "/en/shop" },
    },
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
return (
    <PageFrame>
      <ShopBanner locale={locale} dict={dict} />
      <ShopCatalog products={products.map(product => ({ ...product, image: shopProductImages[product.slug] ?? product.image })).sort((a, b) => {
          const types = ["shampoo", "conditioner", "hair-mask", "body-oil", "body-milk", "body-scrub", "shower-gel", "hair-perfume"];
          return types.indexOf(a.productType) - types.indexOf(b.productType) || Object.keys(fragrances).indexOf(a.fragrance) - Object.keys(fragrances).indexOf(b.fragrance);
        })} locale={locale} dict={dict} />
    </PageFrame>
  );
}
