"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { Emblem } from "@/components/brand/Emblem";
import { StarOrnament } from "@/components/brand/Ornament";
import { ButtonLink } from "@/components/ui/Button";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const reduced = useReducedMotion();

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease },
        };

  return (
    <section
      data-hero-dark
      className="surface-grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-forest text-cream"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-80"
        style={{
          backgroundImage: "url(/textures/plaster-espresso.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "multiply",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-forest/70"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(75% 60% at 78% 8%, rgba(230,211,191,0.12), transparent 62%), radial-gradient(90% 90% at 20% 100%, rgba(20,36,27,0.85), transparent 70%)",
        }}
      />

      <div className="shell flex flex-1 flex-col justify-center pt-[calc(var(--chrome-h)+1.25rem)] pb-8 sm:pt-[calc(var(--chrome-h)+2rem)] sm:pb-12 lg:pb-16">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-16">
          {/* Statement first on mobile — brand before image */}
          <div className="order-1">
            <motion.div className="flex items-center gap-3" {...rise(0.1)}>
              <Emblem tone="auto" className="h-8 w-8 sm:h-9 sm:w-9" />
              <span className="eyebrow text-cream/75">{dict.hero.maison}</span>
            </motion.div>

            <h1 className="display-hero mt-5 text-balance text-cream sm:mt-7">
              {dict.hero.line.map((line, index) => (
                <motion.span key={line} className="block" {...rise(0.18 + index * 0.09)}>
                  {index === 2 ? (
                    <span className="relative inline-block">
                      {line}
                      <motion.span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-1 block h-px origin-[var(--rule-origin)] bg-cream/60"
                        initial={reduced ? undefined : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.3, delay: 0.85, ease }}
                      />
                    </span>
                  ) : (
                    line
                  )}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="mt-5 max-w-md text-[0.9rem] leading-relaxed text-pretty text-cream/70 sm:mt-8 sm:text-[0.95rem]"
              {...rise(0.5)}
            >
              {dict.hero.sub}
            </motion.p>

            <motion.div
              className="mt-7 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4"
              {...rise(0.58)}
            >
              <ButtonLink href={href("/shop", locale)} variant="ivory" size="lg">
                {dict.hero.cta}
              </ButtonLink>
              <ButtonLink
                href={href("/collections", locale)}
                variant="outlineLight"
                size="lg"
              >
                {dict.hero.ctaSecondary}
              </ButtonLink>
            </motion.div>
          </div>

          <motion.div
            className="order-2"
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease }}
          >
            <div className="relative mx-auto aspect-[4/5] w-full max-h-[42svh] max-w-[28rem] lg:max-h-none lg:max-w-[32rem]">
              <motion.div
                className="arch absolute inset-x-[4%] top-0 bottom-[6%] overflow-hidden"
                initial={reduced ? undefined : { clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{ duration: 1.4, delay: 0.15, ease }}
              >
                <Image
                  src="/editorial/editorial-hero-still.jpg"
                  alt={`${site.name} body oil, body scrub and hair perfume on limestone, with orange blossom.`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 32rem"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(28,50,37,0.06) 0%, rgba(28,50,37,0.12) 55%, rgba(28,50,37,0.45) 100%)",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="shell relative z-10 flex items-center justify-between gap-4 border-t border-cream/15 py-4 sm:gap-6 sm:py-5"
        {...rise(0.9)}
      >
        <div className="flex items-center gap-3 text-cream/70">
          <StarOrnament className="size-3.5" />
          <span className="label-xs text-cream/55">{dict.collection.title}</span>
        </div>
        <span className="label-xs hidden text-cream/40 sm:block">{dict.footer.tagline}</span>
        <span className="label-xs flex items-center gap-2 text-cream/40">
          {dict.hero.scroll}
          <span aria-hidden className="inline-block h-px w-6 bg-current sm:w-8" />
        </span>
      </motion.div>
    </section>
  );
}
