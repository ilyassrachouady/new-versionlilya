"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { BrassRule } from "@/components/brand/BrassRule";
import { Price } from "@/components/commerce/Price";
import { Reveal } from "@/components/ui/Reveal";
import { productsByNeed, type NeedId } from "@/lib/catalog";
import { needs } from "@/lib/content";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const frame = {
  tall: "inset-x-[24%] inset-y-[10%]",
  column: "inset-x-[20%] inset-y-[8%]",
  jar: "inset-x-[10%] inset-y-[10%]",
} as const;

export function RitualFinder({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [selected, setSelected] = useState<NeedId | null>(null);
  const reduced = useReducedMotion();

  const active = needs.find((need) => need.id === selected);
  const matches = selected ? productsByNeed(selected) : [];

  return (
    <section className="surface-grain relative bg-ivory py-20 sm:py-28 lg:py-36">
      <div className="shell">
        <div className="flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center gap-3">
            <span className="eyebrow text-brass-deep">{dict.finder.eyebrow}</span>
            <BrassRule width="short" className="w-16" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-xl mt-6 max-w-3xl text-balance text-espresso">
              {dict.finder.title}
            </h2>
            <p className="mt-5 text-[0.95rem] text-ink-muted">{dict.finder.body}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            role="group"
            aria-label={dict.finder.title}
            className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-2.5"
          >
            {needs.map((need) => {
              const isActive = need.id === selected;
              return (
                <button
                  key={need.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelected(isActive ? null : need.id)}
                  className={cn(
                    "border px-6 py-3 text-[0.6875rem] tracking-[0.22em] uppercase transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isActive
                      ? "border-burgundy bg-burgundy text-ivory"
                      : "border-espresso/20 text-ink-muted hover:border-espresso/60 hover:text-espresso",
                  )}
                >
                  {need.label[locale]}
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={reduced ? undefined : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-14"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="label-xs text-ink-faint">{dict.finder.result}</p>
                <p className="display-md max-w-xl text-balance text-burgundy">
                  {active.answer[locale]}
                </p>
              </div>

              <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
                {matches.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={href(`/products/${product.slug}`, locale)}
                      className="group block focus-visible:outline-offset-4"
                    >
                      <div className="surface-grain relative aspect-[3/4] overflow-hidden bg-ivory-300 transition-colors duration-700 group-hover:bg-[#e2d6c2]">
                        <div
                          aria-hidden
                          className="absolute inset-x-[27%] bottom-[16%] h-5"
                          style={{
                            background:
                              "radial-gradient(50% 50% at 50% 50%, rgba(36,24,21,0.26), transparent 72%)",
                          }}
                        />
                        <div
                          className={cn(
                            "absolute transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2",
                            frame[product.aspect],
                          )}
                        >
                          <Image
                            src={product.image}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 45vw, 22vw"
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex items-baseline justify-between gap-3">
                        <p className="font-display text-[1.05rem] text-espresso">
                          {product.name[locale]}
                        </p>
                        <Price
                          amountMAD={product.priceMAD}
                          locale={locale}
                          className="text-[0.8125rem] text-ink-muted"
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="label-xs text-ink-faint underline-offset-4 transition-colors hover:text-espresso hover:underline"
                >
                  {dict.finder.reset}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
