import Image from "next/image";

import { StarOrnament } from "@/components/brand/Ornament";
import { QuietLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function TheHouse({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="surface-grain relative bg-ivory py-20 sm:py-28 lg:py-36">
      <div className="shell grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
        {/* ------------------------------------------------------- material */}
        <Reveal variant="mask" className="order-2 lg:order-1">
          <figure className="relative mx-auto aspect-[4/5] w-full max-w-[26rem]">
            <div className="arch absolute inset-0 overflow-hidden">
              <Image
                src="/editorial/linen.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 85vw, 26rem"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(80% 60% at 30% 10%, rgba(255,250,242,0.55), transparent 60%), linear-gradient(180deg, transparent 55%, rgba(91,50,31,0.30) 100%)",
                }}
              />
            </div>

            <div
              aria-hidden
              className="absolute inset-x-[22%] bottom-[13%] h-7"
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(60,36,26,0.42), transparent 72%)",
              }}
            />
            <Image
              src="/products/signature-jar.webp"
              alt=""
              width={626}
              height={429}
              sizes="(max-width: 1024px) 50vw, 14rem"
              className="absolute bottom-[14%] left-1/2 h-auto w-[52%] -translate-x-1/2 object-contain drop-shadow-[0_14px_20px_rgba(60,36,26,0.35)]"
            />
            <figcaption className="sr-only">
              Amber glass and brass, photographed in the Maison&apos;s own studio.
            </figcaption>
          </figure>
        </Reveal>

        {/* ------------------------------------------------------- statement */}
        <div className="order-1 lg:order-2">
          <Reveal className="flex items-center gap-3">
            <StarOrnament className="size-3.5 text-brass" />
            <span className="eyebrow text-brass-deep">{dict.house.eyebrow}</span>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="display-xl mt-7 text-balance text-espresso">
              {dict.house.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="prose-maison mt-8 max-w-lg">
            {dict.house.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-brass/25 pt-8">
              {dict.house.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="label-xs text-ink-faint">{stat.label}</dt>
                  <dd className="font-display mt-2 text-[1.75rem] leading-none text-burgundy">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2} className="mt-10">
            <QuietLink href={href("/house", locale)}>{dict.house.cta}</QuietLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
