import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/commerce/ProductCard";
import { PageFrame } from "@/components/layout/PageFrame";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { products, type IngredientId } from "@/lib/catalog";
import { getIngredient, ingredients } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";

const plates: Record<IngredientId, string> = {
  argan: "/editorial/ingredient-argan-oil.jpg",
  "orange-blossom": "/editorial/ingredient-orange-blossom.jpg",
};

const ids = ingredients.map((item) => item.id);

export function generateStaticParams() {
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: raw, id } = await params;
  if (!isLocale(raw) || !ids.includes(id as IngredientId)) return {};
  const locale = raw as Locale;
  const ingredient = getIngredient(id as IngredientId);
  return {
    title: ingredient.name[locale],
    description: ingredient.story[locale],
    alternates: {
      canonical: `/${locale}/ingredients/${id}`,
      languages: Object.fromEntries(
        locales.map((code) => [code, `/${code}/ingredients/${id}`]),
      ),
    },
  };
}

export default async function IngredientPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  if (!isLocale(raw) || !ids.includes(id as IngredientId)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const ingredient = getIngredient(id as IngredientId);
  const found = products.filter((product) => product.ingredients.includes(ingredient.id));

  return (
    <PageFrame>
      <section className="relative isolate overflow-hidden bg-espresso py-20 text-ivory sm:py-28">
        <Image
          src={plates[ingredient.id]}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-50"
        />
        <div className="shell relative">
          <Breadcrumbs
            locale={locale}
            tone="light"
            trail={[
              { name: site.name, path: "/" },
              { name: dict.nav.ingredients, path: "/ingredients" },
              { name: ingredient.name[locale], path: `/ingredients/${ingredient.id}` },
            ]}
          />
          <p className="eyebrow mt-12 text-brass-light">{ingredient.latin}</p>
          <h1 className="display-hero mt-5 max-w-4xl text-balance">
            {ingredient.name[locale]}
          </h1>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ivory/70">
            {ingredient.origin[locale]}
          </p>
        </div>
      </section>

      <section className="surface-grain bg-ivory py-20 sm:py-28">
        <div className="shell max-w-3xl">
          <p className="text-[1.125rem] leading-relaxed text-pretty text-ink-muted">
            {ingredient.story[locale]}
          </p>
          <p className="mt-8 text-[0.95rem] text-espresso">{ingredient.note[locale]}</p>
        </div>
        <div className="shell mt-16">
          <h2 className="display-lg text-espresso">{dict.ingredientsSection.inThis}</h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            {found.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} locale={locale} dict={dict} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageFrame>
  );
}
