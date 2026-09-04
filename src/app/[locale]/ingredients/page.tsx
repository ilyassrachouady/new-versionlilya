import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageFrame } from "@/components/layout/PageFrame";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { products } from "@/lib/catalog";
import { ingredients } from "@/lib/content";
import { href, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";

const plates: Record<string, string> = {
  argan: "/editorial/ingredient-argan-oil.jpg",
  "orange-blossom": "/editorial/ingredient-orange-blossom.jpg",
};

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
    title: dict.ingredientsSection.title,
    description: dict.ingredientsSection.body,
    alternates: {
      canonical: `/${locale}/ingredients`,
      languages: {
        en: "/en/ingredients",
        fr: "/fr/ingredients",
        ar: "/ar/ingredients",
        "x-default": "/en/ingredients",
      },
    },
  };
}

export default async function IngredientsPage({
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
      <section className="surface-linen bg-[#eae1d2] py-16 sm:py-20">
        <div className="shell">
          <Breadcrumbs
            locale={locale}
            trail={[
              { name: site.name, path: "/" },
              { name: dict.nav.ingredients, path: "/ingredients" },
            ]}
          />
          <div className="mt-12">
            <SectionHeader
              eyebrow={dict.ingredientsSection.eyebrow}
              title={dict.ingredientsSection.title}
              body={dict.ingredientsSection.body}
            />
          </div>

          <ul className="mt-16 grid gap-16 lg:grid-cols-2">
            {ingredients.map((ingredient, index) => {
              const found = products.filter((product) =>
                product.ingredients.includes(ingredient.id),
              );
              return (
                <li key={ingredient.id}>
                  <Link
                    href={href(`/ingredients/${ingredient.id}`, locale)}
                    className="group block"
                  >
                    <div className="arch-keyhole relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={plates[ingredient.id]}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 90vw, 44vw"
                        className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    </div>
                    <p className="label-xs mt-6 text-brass-deep">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="display-lg mt-3 text-espresso transition-colors duration-500 group-hover:text-burgundy">
                      {ingredient.name[locale]}
                    </h2>
                    <p className="font-display mt-1 text-[0.95rem] text-ink-faint italic">
                      {ingredient.latin}
                    </p>
                    <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-muted">
                      {ingredient.origin[locale]}
                    </p>
                    <p className="label-xs mt-5 text-ink-faint">
                      {found.length} {dict.search.results}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </PageFrame>
  );
}
