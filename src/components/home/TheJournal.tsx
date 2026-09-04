import Image from "next/image";
import Link from "next/link";

import { QuietLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { articles } from "@/lib/content";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function TheJournal({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [lead, ...rest] = articles;

  return (
    <section className="surface-linen relative bg-[#eae1d2] py-20 sm:py-28 lg:py-36">
      <div className="shell relative z-10">
        <SectionHeader
          eyebrow={dict.journal.eyebrow}
          title={dict.journal.title}
          body={dict.journal.body}
          action={<QuietLink href={href("/journal", locale)}>{dict.journal.cta}</QuietLink>}
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <Reveal variant="mask">
            <article>
              <Link
                href={href(`/journal/${lead.slug}`, locale)}
                className="group block focus-visible:outline-offset-4"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={lead.texture}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 92vw, 55vw"
                    className="object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(36,24,21,0.06), rgba(36,24,21,0.5))",
                    }}
                  />
                  <span className="absolute top-6 start-6 border border-ivory/40 px-3 py-1.5 text-[0.625rem] tracking-[0.22em] text-ivory uppercase">
                    {lead.kicker[locale]}
                  </span>
                </div>
                <h3 className="display-lg mt-7 text-balance text-espresso transition-colors duration-500 group-hover:text-burgundy">
                  {lead.title[locale]}
                </h3>
                <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-pretty text-ink-muted">
                  {lead.standfirst[locale]}
                </p>
                <p className="label-xs mt-5 text-ink-faint">
                  {lead.readingTime} {dict.journal.minutes}
                </p>
              </Link>
            </article>
          </Reveal>

          <ul className="flex flex-col divide-y divide-brass/25">
            {rest.map((article, index) => (
              <Reveal as="li" key={article.slug} delay={index * 0.06}>
                <Link
                  href={href(`/journal/${article.slug}`, locale)}
                  className="group flex items-start gap-6 py-7 first:pt-0 focus-visible:outline-offset-4"
                >
                  <div className="relative aspect-square w-24 shrink-0 overflow-hidden sm:w-28">
                    <Image
                      src={article.texture}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="label-xs text-brass-deep">{article.kicker[locale]}</p>
                    <h3 className="display-md mt-2.5 text-balance text-espresso transition-colors duration-500 group-hover:text-burgundy">
                      {article.title[locale]}
                    </h3>
                    <p className="label-xs mt-3 text-ink-faint">
                      {article.readingTime} {dict.journal.minutes}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
