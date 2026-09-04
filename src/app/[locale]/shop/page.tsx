import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionGrid } from "@/components/commerce/CollectionGrid";
import { CampaignHero } from "@/components/layout/CampaignHero";
import { PageFrame } from "@/components/layout/PageFrame";
import { products } from "@/lib/catalog";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const titles: Record<Locale, string> = {
    en: "The Collection",
    fr: "La Collection",
    ar: "المجموعة",
  };
  return {
    title: titles[locale],
    description: dict.shop.body,
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
  const lead = products[0];

  return (
    <PageFrame>
      <CampaignHero
        locale={locale}
        eyebrow={dict.shop.eyebrow}
        title={dict.shop.title}
        body={dict.shop.body}
        texture="/editorial/editorial-oil-dark.jpg"
        productSrc={lead.image}
        productAspect={lead.aspect}
        productWidth={lead.imageWidth}
        productHeight={lead.imageHeight}
        crumbs={[
          { name: site.name, path: "/" },
          { name: dict.shop.title, path: "/shop" },
        ]}
      />
      <section className="surface-grain bg-ivory py-16 sm:py-20 lg:py-24">
        <div className="shell">
          <CollectionGrid locale={locale} dict={dict} />
        </div>
      </section>
    </PageFrame>
  );
}
