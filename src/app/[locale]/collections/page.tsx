import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { QuietLink } from "@/components/ui/Button";
import { PageFrame } from "@/components/layout/PageFrame";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { edits, rituals } from "@/lib/content";
import { href, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

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

const frame = {
  tall: "inset-x-[28%] inset-y-[10%]",
  column: "inset-x-[24%] inset-y-[8%]",
  jar: "inset-x-[12%] inset-y-[10%]",
} as const;

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
      <section className="surface-grain bg-ivory py-16 sm:py-20">
        <div className="shell">
          <Breadcrumbs
            locale={locale}
            trail={[
              { name: site.name, path: "/" },
              { name: dict.nav.collections, path: "/collections" },
            ]}
          />
          <div className="mt-12">
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
              <div className="shell grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
                <Reveal
                  variant="mask"
                  className={cn(index % 2 === 1 && "lg:order-2")}
                >
                  <div className="arch relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={ritual.texture}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 90vw, 42vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(23,14,12,0.1), rgba(23,14,12,0.55))",
                      }}
                    />
                    <div className={cn("absolute", frame[ritual.heroAspect])}>
                      <Image
                        src={ritual.hero}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 50vw, 18vw"
                        className="object-contain drop-shadow-[0_18px_26px_rgba(8,4,4,0.5)]"
                      />
                    </div>
                  </div>
                </Reveal>
                <Reveal className={cn(index % 2 === 1 && "lg:order-1")}>
                  <p className={cn("eyebrow", dark ? "text-brass-light" : "text-brass-deep")}>
                    {ritual.index}
                  </p>
                  <h2 className="display-xl mt-5">{ritual.title[locale]}</h2>
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
                </Reveal>
              </div>
            </section>
          );
        })}
      </div>

      <section className="grid lg:grid-cols-2">
        {edits.map((edit) => {
          const dark = edit.id === "him";
          return (
            <div
              key={edit.id}
              className={cn(
                "surface-grain relative isolate overflow-hidden px-6 py-16 sm:px-10 lg:px-14 lg:py-24",
                dark ? "bg-espresso text-ivory" : "bg-burgundy text-ivory",
              )}
            >
              <Image
                src={edit.texture}
                alt=""
                fill
                sizes="50vw"
                className="-z-10 object-cover opacity-90"
              />
              <p className="eyebrow relative text-brass-light">{edit.line[locale]}</p>
              <h2 className="display-xl relative mt-5">{edit.title[locale]}</h2>
              <p className="relative mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ivory/70">
                {edit.body[locale]}
              </p>
              <div className="relative mt-10">
                <QuietLink href={href(`/collections/${edit.id}`, locale)} tone="light">
                  {dict.edits.cta}
                </QuietLink>
              </div>
            </div>
          );
        })}
      </section>
    </PageFrame>
  );
}
