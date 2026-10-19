"use client";

import { getImageProps } from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { ButtonLink } from "@/components/ui/Button";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/config";
import type { V2Copy } from "@/lib/v2-content";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function V2Hero({ locale, copy }: { locale: Locale; copy: V2Copy["hero"] }) {
  const reduced = useReducedMotion();
  const commonImageProps = {
    alt: "Maison Lilya Zahra body oil, body scrub and body milk arranged on stone.",
    sizes: "100vw",
    quality: 92,
    loading: "eager" as const,
  };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...commonImageProps,
    src: "/campaign-v2/hero-desktop.jpg",
    width: 1536,
    height: 1024,
  });
  const {
    props: { srcSet: mobileSrcSet, ...mobileImageProps },
  } = getImageProps({
    ...commonImageProps,
    src: "/campaign-v2/hero-mobile.jpg",
    width: 1024,
    height: 1536,
  });

  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease },
        };

  return (
    <section
      data-hero-dark
      className="v2-hero relative isolate min-h-[100svh] overflow-hidden bg-[#220a09] text-[#f2e6d8]"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        initial={reduced ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease }}
      >
        <picture>
          <source media="(min-width: 48rem)" srcSet={desktopSrcSet} />
          <source media="(max-width: 47.999rem)" srcSet={mobileSrcSet} />
          {/* Art direction: the browser fetches one crop, never both. */}
          <img
            {...mobileImageProps}
            alt={commonImageProps.alt}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-[52%_center] md:object-center"
          />
        </picture>
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,2,2,.82)_0%,rgba(8,2,2,.62)_40%,rgba(8,2,2,.3)_68%,rgba(8,2,2,.78)_100%)] md:bg-[linear-gradient(90deg,rgba(8,2,2,.78)_0%,rgba(8,2,2,.46)_38%,rgba(8,2,2,.03)_72%)]"
      />
      <div aria-hidden className="v2-noise absolute inset-0 -z-10 opacity-25" />

      <div className="v2-shell flex min-h-[100svh] flex-col justify-between pb-6 pt-[calc(var(--chrome-h)+2rem)] sm:pb-8 md:justify-center md:pb-20 md:pt-[calc(var(--chrome-h)+4rem)]">
        <div
          className={cn(
            "max-w-[40rem] pt-[3svh] md:pt-0",
            locale === "ar" && "max-w-[35rem]",
          )}
        >
          {copy.eyebrow && <motion.p className="v2-kicker text-[#ead7c3]/80" {...reveal(0.05)}>
            {copy.eyebrow}
          </motion.p>}

          <h1
            className={cn(
              "v2-display-hero max-w-[8ch] text-balance text-[#f6eadc] [text-shadow:0_2px_22px_rgba(8,2,2,.38)] md:[text-shadow:none]",
              copy.eyebrow && "mt-4 md:mt-6",
              locale === "ar" && "max-w-[7.5ch] leading-[1.04]",
            )}
          >
            {copy.title.map((line, index) => (
              <motion.span key={line} className="block" {...reveal(0.1 + index * 0.06)}>
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className={cn(
              "mt-5 max-w-[31rem] text-[0.84rem] leading-[1.72] text-[#f4e7d9]/90 [text-shadow:0_1px_14px_rgba(8,2,2,.7)] sm:text-[0.9rem] md:mt-7 md:text-[0.98rem] md:text-[#ead7c3]/76 md:[text-shadow:none]",
              locale === "ar" && "max-w-[28rem] text-[0.92rem] leading-[1.9] sm:text-base",
            )}
            {...reveal(0.22)}
          >
            {copy.body}
          </motion.p>

          <motion.div
            className="mt-7 flex flex-col items-stretch gap-2.5 min-[30rem]:flex-row min-[30rem]:items-center md:mt-10"
            {...reveal(0.28)}
          >
            <ButtonLink
              href={href("/shop", locale)}
              size="lg"
              className="min-h-14 bg-[#f1e3d3] px-7 text-[#2a0c0a] hover:bg-white"
            >
              {copy.cta}
            </ButtonLink>
            <ButtonLink
              href="#ritual"
              variant="outlineLight"
              size="lg"
              className="min-h-14 border-[#f1e3d3]/45 px-7"
            >
              {copy.secondary}
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          className="flex items-end justify-between gap-6 border-t border-[#f1e3d3]/20 pt-4 md:absolute md:inset-x-0 md:bottom-0 md:px-[max(1.25rem,calc((100vw-96rem)/2+4rem))] md:pb-7"
          {...reveal(0.36)}
        >
          <p className="v2-kicker max-w-[15rem] text-[#ead7c3]/58">{copy.note}</p>
          <a
            href="#cabinet"
            aria-label={copy.secondary}
            className="group flex size-11 shrink-0 items-center justify-center rounded-full border border-[#f1e3d3]/35"
          >
            <span className="block h-4 w-px bg-[#f1e3d3]/80 transition-transform duration-500 group-hover:translate-y-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
