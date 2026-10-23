import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { FragranceCollection } from "@/components/commerce/FragranceCollection";
import { QuietLink } from "@/components/ui/Button";
import { getStorefrontHomeCopy as getV2Copy } from "@/lib/storefront-content";
import { CollectionGrid } from "@/components/commerce/CollectionGrid";
import { CampaignHero } from "@/components/layout/CampaignHero";
import { PageFrame } from "@/components/layout/PageFrame";
import { isCollectionId, resolveCollection, collectionIds } from "@/lib/collections";
import { getStorefrontProducts } from "@/lib/storefront-catalog";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getStorefrontDictionary as getDictionary } from "@/lib/storefront-content";
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
  const dict = await getDictionary(locale);
  const catalog = await getStorefrontProducts();
  const collection = await resolveCollection(id, locale, dict, catalog);
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
  const dict = await getDictionary(locale);
  const catalog = await getStorefrontProducts();
  const collection = await resolveCollection(id, locale, dict, catalog);
  const lead = collection.products[0];

  return (
    <PageFrame>
      {id === "home" ? (
        <section className="bg-ivory">
          <div className="shell py-10 sm:py-14">
            <p className="eyebrow text-brass-deep">{collection.eyebrow}</p>
            <h1 className="display-xl mt-4">{collection.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">{collection.body}</p>
          </div>
          <Image src="/collections/campaigns/home.png" alt={collection.title} width={1962} height={802} sizes="100vw" preload className="h-auto w-full" />
        </section>
      ) : <CampaignHero
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
      />}
      {collection.kind === "fragrance" ? (
        <>
          <div className="shell py-6"><QuietLink href="#fragrance-cabinet">{(await getV2Copy(locale)).hero.cta}</QuietLink></div>
          <FragranceCollection products={collection.products} locale={locale} dict={dict} />
        </>
      ) : (
      <section className="surface-grain bg-ivory py-16 sm:py-20 lg:py-24">
        <div className="shell">
          {collection.line.trim() ? (
            <p className="max-w-xl text-[1rem] leading-relaxed text-ink-muted">{collection.line}</p>
          ) : null}
          <div className={collection.line.trim() ? "mt-12" : undefined}>
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
