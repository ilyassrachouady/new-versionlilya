import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Accordion } from "@/components/ui/Accordion";
import { Emblem } from "@/components/brand/Emblem";
import { Wordmark } from "@/components/brand/Wordmark";
import { PageFrame } from "@/components/layout/PageFrame";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { isLocale, type Locale } from "@/lib/i18n/config";
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
    title: dict.housePage.title,
    description: dict.housePage.standfirst,
    alternates: {
      canonical: `/${locale}/house`,
      languages: { en: "/en/house", fr: "/fr/house", ar: "/ar/house", "x-default": "/en/house" },
    },
  };
}

export default async function HousePage({
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
      <section className="surface-grain relative isolate overflow-hidden bg-espresso text-ivory">
        <Image
          src="/editorial/editorial-oil-dark.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-80"
        />
        <div className="shell relative py-20 sm:py-28 lg:py-36">
          <Breadcrumbs
            locale={locale}
            tone="light"
            trail={[
              { name: site.name, path: "/" },
              { name: dict.nav.house, path: "/house" },
            ]}
          />
          <Reveal className="mt-12 flex flex-col items-start gap-6">
            <Emblem tone="auto" className="h-10 w-10" />
            <p className="eyebrow text-brass-light">{dict.housePage.eyebrow}</p>
            <h1 className="display-hero max-w-4xl text-balance">{dict.housePage.title}</h1>
            <p className="max-w-xl text-[1.1rem] leading-relaxed text-pretty text-ivory/70">
              {dict.housePage.standfirst}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="surface-grain bg-ivory py-20 sm:py-28">
        <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="mask">
            <figure className="relative aspect-[4/5]">
              <div className="arch absolute inset-0 overflow-hidden">
                <Image
                  src="/editorial/linen.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 90vw, 42vw"
                  className="object-cover"
                />
              </div>
              <Image
                src="/products/signature-jar.webp"
                alt=""
                width={626}
                height={429}
                sizes="40vw"
                className="absolute bottom-[12%] left-1/2 h-auto w-[48%] -translate-x-1/2 object-contain drop-shadow-[0_16px_24px_rgba(60,36,26,0.4)]"
              />
            </figure>
          </Reveal>
          <div className="prose-maison max-w-lg">
            {dict.housePage.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#eae1d2] py-20 sm:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-20">
          <h2 className="display-xl text-espresso">{dict.housePage.faqTitle}</h2>
          <Accordion
            items={dict.housePage.faq.map((item, index) => ({
              id: `faq-${index}`,
              title: item.q,
              body: item.a,
            }))}
          />
        </div>
      </section>

      <section id="shipping" className="surface-grain bg-ivory py-20 sm:py-24">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="display-lg text-espresso">{dict.housePage.shippingTitle}</h2>
            <p className="mt-5 max-w-md text-[1rem] leading-relaxed text-ink-muted">
              {dict.housePage.shippingBody}
            </p>
          </div>
          <div id="returns">
            <h2 className="display-lg text-espresso">{dict.housePage.returnsTitle}</h2>
            <p className="mt-5 max-w-md text-[1rem] leading-relaxed text-ink-muted">
              {dict.housePage.returnsBody}
            </p>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="surface-grain relative isolate overflow-hidden bg-burgundy py-20 text-ivory sm:py-28"
      >
        <Image
          src="/textures/plaster-burgundy.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover opacity-90"
        />
        <div className="shell relative flex flex-col items-center text-center">
          <Wordmark size="lg" className="text-ivory" />
          <h2 className="display-xl mt-10">{dict.housePage.contactTitle}</h2>
          <p className="mt-4 text-[1rem] text-ivory/70">{dict.housePage.contactBody}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 font-display text-[1.4rem] text-brass-light underline-offset-8 transition-colors hover:text-ivory hover:underline"
          >
            {site.email}
          </a>
        </div>
      </section>
    </PageFrame>
  );
}
