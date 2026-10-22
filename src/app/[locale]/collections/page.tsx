import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { QuietLink } from "@/components/ui/Button";
import { PageFrame } from "@/components/layout/PageFrame";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { rituals } from "@/lib/content";
import { href, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import styles from "./Collections.module.css";

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
    title: dict.collectionsPage.title,
    description: dict.collectionsPage.body,
    alternates: {
      canonical: `/${locale}/collections`,
      languages: {
        en: "/en/collections",
        fr: "/fr/collections",
        ar: "/ar/collections",
        "x-default": "/en/collections",
      },
    },
  };
}

const campaignImages: Record<string, string> = {
  home: "/collections/campaigns/home-category-hq.png",
  hair: "/collections/campaigns/hair.png",
  body: "/collections/campaigns/body.png",
  hammam: "/collections/campaigns/hammam.png",
  scent: "/collections/campaigns/scent.png",
};

export default async function CollectionsPage({
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
      <section className="surface-grain bg-ivory py-10 sm:py-14">
        <div className="shell">
          <Breadcrumbs
            locale={locale}
            trail={[
              { name: site.name, path: "/" },
              { name: dict.nav.collections, path: "/collections" },
            ]}
          />
          <div className="mt-7">
            <SectionHeader
              eyebrow={dict.collectionsPage.eyebrow}
              title={dict.collectionsPage.title}
              body={dict.collectionsPage.body}
            />
          </div>
        </div>
      </section>

      <div>
        {rituals.map((ritual, index) => {
          const dark = index % 2 === 1;
          return (
            <section
              key={ritual.id}
              className={cn(
                "surface-grain relative overflow-hidden",
                dark ? "bg-espresso text-ivory" : "bg-ivory text-espresso",
              )}
            >
              <div className={cn(styles.row, index % 2 === 1 && styles.reverse)}>
                <Reveal variant="fade" className={styles.media}>
                  <div className={styles.photograph}>
                    <Image src={campaignImages[ritual.id]} alt="" fill sizes="(max-width: 1023px) 100vw, 58vw" quality={92} preload={index === 0} className={styles.image} />
                  </div>
                </Reveal>
                <div className={styles.copy}>
                  <p className={cn("eyebrow", dark ? "text-brass-light" : "text-brass-deep")}>
                    {ritual.index}
                  </p>
                  <h2 className={"display-xl mt-4 " + styles.title}>{ritual.title[locale]}</h2>
                  <p
                    className={cn(
                      "mt-5 max-w-md text-[1.05rem] leading-relaxed",
                      dark ? "text-ivory/70" : "text-ink-muted",
                    )}
                  >
                    {ritual.body[locale]}
                  </p>
                  <div className="mt-8">
                    <QuietLink
                      href={href(`/collections/${ritual.id}`, locale)}
                      tone={dark ? "light" : "dark"}
                    >
                      {dict.collectionsPage.enter}
                    </QuietLink>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

    </PageFrame>
  );
}
