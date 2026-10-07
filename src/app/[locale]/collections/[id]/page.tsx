import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FragranceCollection } from "@/components/commerce/FragranceCollection";
import { QuietLink } from "@/components/ui/Button";
import { getV2Copy } from "@/lib/v2-content";
import { CollectionGrid } from "@/components/commerce/CollectionGrid";
import { CampaignHero } from "@/components/layout/CampaignHero";
import { PageFrame } from "@/components/layout/PageFrame";
import { isCollectionId, resolveCollection, collectionIds } from "@/lib/collections";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { shopProductImages } from "@/lib/shop-product-images";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return collectionIds.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: raw, id } = await params;
  if (!isLocale(raw) || !isCollectionId(id)) return {};
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const collection = resolveCollection(id, locale, dict);
  return {
    title: collection.title,
    description: collection.body,
    alternates: {
      canonical: `/${locale}/collections/${id}`,
      languages: Object.fromEntries(
        locales.map((code) => [code, `/${code}/collections/${id}`]),
      ),
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  if (!isLocale(raw) || !isCollectionId(id)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const collection = resolveCollection(id, locale, dict);
  const lead = collection.products[0];

  return (
    <PageFrame>
      <CampaignHero
        locale={locale}
        eyebrow={collection.eyebrow}
        title={collection.title}
        body={collection.body}
        texture={collection.texture}
        productSrc={lead?.image ?? collection.hero}
        productAspect={lead?.aspect ?? collection.heroAspect}
        productWidth={lead?.imageWidth}
        productHeight={lead?.imageHeight}
        crumbs={[
          { name: site.name, path: "/" },
          { name: dict.nav.collections, path: "/collections" },
          { name: collection.title, path: `/collections/${id}` },
        ]}
        tone={collection.kind === "edit" && collection.id === "her" ? "burgundy" : "dark"}
      />
      {collection.kind === "fragrance" ? (
        <>
          <div className="shell py-6"><QuietLink href="#fragrance-cabinet">{getV2Copy(locale).hero.cta}</QuietLink></div>
          <FragranceCollection products={collection.products} locale={locale} dict={dict} />
        </>
      ) : (
      <section className="surface-grain bg-ivory py-16 sm:py-20 lg:py-24">
        <div className="shell">
          <p className="max-w-xl text-[1rem] leading-relaxed text-ink-muted">{collection.line}</p>
          <div className="mt-12">
            <CollectionGrid
              locale={locale}
              dict={dict}
              items={collection.kind === "ritual" ? collection.products.map((product) => ({
                ...product,
                image: shopProductImages[product.slug] ?? product.image,
              })) : collection.products}
              cleanPhotography={collection.kind === "ritual"}
              filterable={false}
            />
          </div>
        </div>
      </section>
      )}
    </PageFrame>
  );
}
