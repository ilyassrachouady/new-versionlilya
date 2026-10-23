import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageFrame } from "@/components/layout/PageFrame";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getStorefrontDictionary as getDictionary } from "@/lib/storefront-content";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
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
  const dict = await getDictionary(locale);

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

          <section className="mt-16 border-t border-espresso/15 pt-12 sm:mt-20 sm:pt-16">
            <p className="label-xs text-brass-deep">01</p>
            <h2 className="display-xl mt-4 text-espresso">Son histoire</h2>
            <div className="mt-8 grid max-w-5xl gap-6 text-[1.05rem] leading-relaxed text-ink-muted md:grid-cols-2 md:gap-12">
              <p>
                C’est dans le Sud-Ouest du Maroc, entre Essaouira et Agadir, que tout commence pour nous. Là pousse l’arganier, un arbre unique dont nous récoltons précieusement les fruits et les feuilles pour donner vie à nos soins.
              </p>
              <p>
                Pour nous, la beauté n’a pas besoin d’artifices. C’est pourquoi nos produits sont 100 % naturels et formulés autour de notre huile d’argan pure. Pas de superflu, aucun compromis&nbsp;: juste la nature à l’état brut pour prendre soin de votre peau.
              </p>
            </div>
          </section>
        </div>
      </section>
    </PageFrame>
  );
}
