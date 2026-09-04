import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/commerce/ProductCard";
import { PageFrame } from "@/components/layout/PageFrame";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductFold } from "@/components/product/ProductFold";
import { JsonLd } from "@/components/seo/JsonLd";
import { QuietLink } from "@/components/ui/Button";
import { getProduct, products, productsByRitual, relatedProducts } from "@/lib/catalog";
import { getIngredient } from "@/lib/content";
import { href, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { productSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name[locale]} — ${product.scent}`,
    description: product.description[locale],
    openGraph: {
      title: `${product.name[locale]} — ${product.scent}`,
      description: product.description[locale],
      images: [{ url: product.image }],
    },
    alternates: {
      canonical: `/${locale}/products/${slug}`,
      languages: Object.fromEntries(
        locales.map((code) => [code, `/${code}/products/${slug}`]),
      ),
    },
  };
}

const frame = {
  tall: "inset-x-[24%] inset-y-[8%]",
  column: "inset-x-[20%] inset-y-[6%]",
  jar: "inset-x-[8%] inset-y-[8%]",
} as const;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const product = getProduct(slug);
  if (!product) notFound();
  const dict = getDictionary(locale);
  const sameRitual = productsByRitual(product.ritual).filter((item) => item.slug !== product.slug);
  const also = relatedProducts(product, 4).filter((item) => item.ritual !== product.ritual);
  const ingredient = getIngredient(product.ingredients[0]);

  return (
    <PageFrame>
      <JsonLd data={productSchema(product, locale)} />

      <div className="shell pt-8 sm:pt-10">
        <Breadcrumbs
          locale={locale}
          trail={[
            { name: site.name, path: "/" },
            { name: dict.product.breadcrumb, path: "/shop" },
            { name: product.name[locale], path: `/products/${product.slug}` },
          ]}
        />
      </div>

      <section className="shell py-10 lg:py-16">
        <ProductFold product={product} locale={locale} dict={dict} />
      </section>

      <section className="surface-grain relative overflow-hidden bg-espresso py-20 text-ivory sm:py-28">
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: "url(/textures/plaster-espresso.jpg)",
            backgroundSize: "cover",
          }}
        />
        <div className="shell relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#3b2119]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(80% 55% at 50% 0%, rgba(167,122,69,0.28), transparent 62%)",
              }}
            />
            <div className={cn("absolute", frame[product.aspect])}>
              <Image
                src={product.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 90vw, 42vw"
                className="object-contain drop-shadow-[0_24px_36px_rgba(8,4,4,0.55)]"
              />
            </div>
          </div>
          <div>
            <p className="eyebrow text-brass-light">{product.scent}</p>
            <h2 className="display-xl mt-5 text-ivory">{product.name[locale]}</h2>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-pretty text-ivory/70">
              {product.description[locale]}
            </p>
          </div>
        </div>
      </section>

      <section className="surface-linen bg-[#eae1d2] py-20 sm:py-28">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <p className="eyebrow text-brass-deep">{dict.product.theIngredient}</p>
            <h2 className="display-xl mt-5 text-espresso">{ingredient.name[locale]}</h2>
            <p className="font-display mt-2 text-[1rem] text-ink-faint italic">
              {ingredient.latin}
            </p>
            <p className="mt-6 max-w-lg text-[1rem] leading-relaxed text-pretty text-ink-muted">
              {ingredient.story[locale]}
            </p>
            <p className="mt-6 text-[0.9rem] text-espresso">{ingredient.origin[locale]}</p>
            <div className="mt-8">
              <QuietLink href={href(`/ingredients/${ingredient.id}`, locale)}>
                {dict.ingredientsSection.cta}
              </QuietLink>
            </div>
          </div>
          <div className="arch-keyhole relative aspect-[16/10] overflow-hidden">
            <Image
              src={
                ingredient.id === "argan"
                  ? "/editorial/ingredient-argan-oil.jpg"
                  : "/editorial/ingredient-orange-blossom.jpg"
              }
              alt=""
              fill
              sizes="(max-width: 1024px) 90vw, 44vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {(sameRitual.length > 0 || also.length > 0) && (
        <section className="surface-grain bg-ivory py-20 sm:py-28">
          <div className="shell">
            {sameRitual.length > 0 && (
              <>
                <h2 className="display-lg text-espresso">{dict.product.completeRitual}</h2>
                <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
                  {sameRitual.map((item) => (
                    <li key={item.slug}>
                      <ProductCard product={item} locale={locale} dict={dict} />
                    </li>
                  ))}
                </ul>
              </>
            )}
            {also.length > 0 && (
              <div className={sameRitual.length > 0 ? "mt-20" : ""}>
                <h2 className="display-lg text-espresso">{dict.product.alsoLike}</h2>
                <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
                  {also.map((item) => (
                    <li key={item.slug}>
                      <ProductCard product={item} locale={locale} dict={dict} field="sand" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-14">
              <Link
                href={href("/shop", locale)}
                className="label-xs text-ink-faint transition-colors hover:text-espresso"
              >
                {dict.common.viewAll}
              </Link>
            </div>
          </div>
        </section>
      )}
    </PageFrame>
  );
}
