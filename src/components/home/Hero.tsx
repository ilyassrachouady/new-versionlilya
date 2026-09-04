"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { Emblem } from "@/components/brand/Emblem";
import { StarOrnament } from "@/components/brand/Ornament";
import { ButtonLink } from "@/components/ui/Button";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

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
      className="surface-grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-espresso text-ivory"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-90"
        style={{
          backgroundImage: "url(/textures/plaster-espresso.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Warm directional light, raking in from the upper right. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(75% 60% at 78% 8%, rgba(167,122,69,0.30), transparent 62%), radial-gradient(90% 90% at 20% 100%, rgba(23,14,12,0.75), transparent 70%)",
        }}
      />

      <div className="shell flex flex-1 flex-col justify-end pt-[calc(var(--chrome-h)+2.25rem)] pb-10 lg:justify-center lg:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-16">
          {/* ------------------------------------------------ statement */}
          <div className="order-2 lg:order-1">
            <motion.div className="flex items-center gap-3.5" {...rise(0.1)}>
              <Emblem className="h-7 w-auto text-brass-light" />
              <span className="eyebrow text-brass-light">{dict.hero.maison}</span>
            </motion.div>

            <h1 className="display-hero mt-7 text-balance text-ivory">
              {dict.hero.line.map((line, index) => (
                <motion.span key={line} className="block" {...rise(0.18 + index * 0.09)}>
                  {index === 2 ? (
                    <span className="relative inline-block">
                      {line}
                      <motion.span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-1 block h-px origin-[var(--rule-origin)] bg-brass/70"
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
              className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-pretty text-ivory/70"
              {...rise(0.5)}
            >
              {dict.hero.sub}
            </motion.p>

            <motion.div className="mt-10 flex flex-wrap items-center gap-4" {...rise(0.58)}>
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

          {/* ------------------------------------------------ still life */}
          <motion.div
            className="order-1 lg:order-2"
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease }}
          >
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[32rem]">
              <motion.div
                className="arch absolute inset-x-[4%] top-0 bottom-[6%] overflow-hidden"
                initial={reduced ? undefined : { clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{ duration: 1.4, delay: 0.15, ease }}
              >
                <Image
                  src="/editorial/editorial-hero-still.jpg"
                  alt="Maison Liya Zahra body oil, body scrub and hair perfume on limestone, with orange blossom."
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
                      "linear-gradient(180deg, rgba(36,24,21,0.04) 0%, rgba(36,24,21,0.08) 55%, rgba(36,24,21,0.38) 100%)",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --------------------------------------------------------- footer rail */}
      <motion.div
        className="shell relative z-10 flex items-center justify-between gap-6 border-t border-ivory/12 py-5"
        {...rise(0.9)}
      >
        <div className="flex items-center gap-3 text-brass-light">
          <StarOrnament className="size-3.5" />
          <span className="label-xs text-ivory/55">{dict.collection.title}</span>
        </div>
        <span className="label-xs hidden text-ivory/40 sm:block">{dict.footer.tagline}</span>
        <span className="label-xs flex items-center gap-2 text-ivory/40">
          {dict.hero.scroll}
          <span aria-hidden className="inline-block h-px w-8 bg-current" />
        </span>
      </motion.div>
    </section>
  );
}
