import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/commerce/ProductCard";
import { PageFrame } from "@/components/layout/PageFrame";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { QuietLink } from "@/components/ui/Button";
import { getProduct } from "@/lib/catalog";
import { articles, getArticle } from "@/lib/content";
import { href, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { articleSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title[locale],
    description: article.standfirst[locale],
    alternates: {
      canonical: `/${locale}/journal/${slug}`,
      languages: Object.fromEntries(
        locales.map((code) => [code, `/${code}/journal/${slug}`]),
      ),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const article = getArticle(slug);
  if (!article) notFound();
  const dict = getDictionary(locale);
  const related = article.product ? getProduct(article.product) : undefined;
  const more = articles.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <PageFrame>
      <JsonLd data={articleSchema(article, locale)} />
      <article>
        <header className="relative isolate overflow-hidden bg-espresso text-ivory">
          <Image
            src={article.texture}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover opacity-55"
          />
          <div className="shell relative py-20 sm:py-28">
            <Breadcrumbs
              locale={locale}
              tone="light"
              trail={[
                { name: site.name, path: "/" },
                { name: dict.nav.journal, path: "/journal" },
                { name: article.title[locale], path: `/journal/${article.slug}` },
              ]}
            />
            <p className="eyebrow mt-12 text-brass-light">{article.kicker[locale]}</p>
            <h1 className="display-hero mt-5 max-w-4xl text-balance">
              {article.title[locale]}
            </h1>
            <p className="mt-6 max-w-xl text-[1.1rem] leading-relaxed text-ivory/75">
              {article.standfirst[locale]}
            </p>
            <p className="label-xs mt-8 text-ivory/45">
              {article.readingTime} {dict.journal.minutes}
            </p>
          </div>
        </header>

        <div className="surface-grain bg-ivory py-16 sm:py-24">
          <div className="shell max-w-2xl">
            {article.paragraphs.map((paragraph) => (
              <p
                key={paragraph.en}
                className="mt-8 text-[1.125rem] leading-[1.85] text-pretty text-ink-muted first:mt-0"
              >
                {paragraph[locale]}
              </p>
            ))}
          </div>
        </div>
      </article>

      {related && (
        <section className="bg-[#eae1d2] py-20">
          <div className="shell">
            <p className="eyebrow text-brass-deep">{dict.journal.related}</p>
            <div className="mt-10 max-w-sm">
              <ProductCard product={related} locale={locale} dict={dict} field="sand" />
            </div>
          </div>
        </section>
      )}

      <section className="surface-grain bg-ivory py-20">
        <div className="shell">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display-lg text-espresso">{dict.journalPage.more}</h2>
            <QuietLink href={href("/journal", locale)}>{dict.journal.cta}</QuietLink>
          </div>
          <ul className="mt-10 grid gap-10 sm:grid-cols-3">
            {more.map((item) => (
              <li key={item.slug}>
                <Link href={href(`/journal/${item.slug}`, locale)} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.texture}
                      alt=""
                      fill
                      sizes="30vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="display-md mt-4 text-espresso group-hover:text-burgundy">
                    {item.title[locale]}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageFrame>
  );
}
