import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageFrame } from "@/components/layout/PageFrame";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { articles } from "@/lib/content";
import { href, isLocale, type Locale } from "@/lib/i18n/config";
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
  return {
    title: dict.journal.title,
    description: dict.journal.body,
    alternates: {
      canonical: `/${locale}/journal`,
      languages: {
        en: "/en/journal",
        fr: "/fr/journal",
        ar: "/ar/journal",
        "x-default": "/en/journal",
      },
    },
  };
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const [lead, ...rest] = articles;

  return (
    <PageFrame>
      <section className="surface-linen bg-[#eae1d2] py-16 sm:py-20">
        <div className="shell">
          <Breadcrumbs
            locale={locale}
            trail={[
              { name: site.name, path: "/" },
              { name: dict.nav.journal, path: "/journal" },
            ]}
          />
          <div className="mt-12">
            <SectionHeader
              eyebrow={dict.journal.eyebrow}
              title={dict.journal.title}
              body={dict.journal.body}
            />
          </div>

          <article className="mt-16">
            <Link href={href(`/journal/${lead.slug}`, locale)} className="group block">
              <div className="relative aspect-[16/8] overflow-hidden sm:aspect-[16/7]">
                <Image
                  src={lead.texture}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(36,24,21,0.05), rgba(36,24,21,0.55))",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                  <span className="border border-ivory/40 px-3 py-1.5 text-[0.625rem] tracking-[0.22em] text-ivory uppercase">
                    {lead.kicker[locale]}
                  </span>
                  <h2 className="display-xl mt-5 max-w-3xl text-ivory">
                    {lead.title[locale]}
                  </h2>
                </div>
              </div>
            </Link>
          </article>

          <ul className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <li key={article.slug}>
                <Link
                  href={href(`/journal/${article.slug}`, locale)}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={article.texture}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 90vw, 30vw"
                      className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  </div>
                  <p className="label-xs mt-5 text-brass-deep">{article.kicker[locale]}</p>
                  <h2 className="display-md mt-3 text-balance text-espresso transition-colors duration-500 group-hover:text-burgundy">
                    {article.title[locale]}
                  </h2>
                  <p className="label-xs mt-3 text-ink-faint">
                    {article.readingTime} {dict.journal.minutes}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageFrame>
  );
}
