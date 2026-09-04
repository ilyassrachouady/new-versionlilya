"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { Price } from "@/components/commerce/Price";
import { useStore } from "@/components/commerce/store";
import type { Product } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { V2Copy } from "@/lib/v2-content";
import { cn } from "@/lib/utils";

const fields = ["v2-product-cream", "v2-product-red", "v2-product-green"] as const;

const frame: Record<Product["aspect"], string> = {
  tall: "inset-x-[22%] inset-y-[8%]",
  column: "inset-x-[18%] inset-y-[6%]",
  jar: "inset-x-[7%] inset-y-[15%]",
};

export function V2ProductRail({
  products,
  locale,
  dict,
  copy,
}: {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
  copy: V2Copy["collection"];
}) {
  const { add } = useStore();
  const reduced = useReducedMotion();

  return (
    <section id="cabinet" className="overflow-hidden bg-[#efe4d7] py-20 text-[#25100e] sm:py-28 lg:py-36">
      <div className="v2-shell">
        <div className="grid gap-8 border-t border-[#351411]/20 pt-6 md:grid-cols-[1fr_1.25fr] md:gap-16 md:pt-8">
          <div>
            <p className="v2-kicker text-[#7a251f]">{copy.eyebrow}</p>
            <h2 className="v2-display-section mt-5 max-w-[11ch]">{copy.title}</h2>
          </div>
          <div className="md:pt-8">
            <p className="max-w-lg text-[0.95rem] leading-[1.8] text-[#5f4942]">{copy.body}</p>
            <p className="v2-kicker mt-6 flex items-center gap-3 text-[#7b665d] lg:hidden">
              {copy.drag}
              <span aria-hidden className="h-px w-8 bg-current" />
            </p>
          </div>
        </div>
      </div>

      <ol className="v2-product-rail mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-5 sm:mt-16 sm:gap-5 sm:px-6 lg:grid lg:grid-cols-4 lg:gap-px lg:overflow-visible lg:px-0 lg:pb-0">
        {products.map((product, index) => (
          <motion.li
            key={product.slug}
            className="group w-[82vw] max-w-[23rem] shrink-0 snap-start lg:w-auto lg:max-w-none"
            initial={reduced ? undefined : { opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.85, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <article className="relative flex h-full flex-col bg-[#e7d8c7]">
              <Link
                href={href(`/products/${product.slug}`, locale)}
                className={cn(
                  "relative block aspect-[3/4] overflow-hidden",
                  fields[index % fields.length],
                )}
                aria-label={`${product.name[locale]} — ${product.scent}`}
              >
                <span className="v2-index absolute start-4 top-4 z-10 text-[#f4e7d8]/72 mix-blend-difference">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="absolute inset-x-[16%] bottom-[8%] h-8 rounded-[50%] bg-black/25 blur-md" />
                <motion.span
                  className={cn("absolute", frame[product.aspect])}
                  whileHover={reduced ? undefined : { y: -12, scale: 1.015 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 82vw, 25vw"
                    className="object-contain drop-shadow-[0_24px_34px_rgba(25,7,6,.38)]"
                  />
                </motion.span>
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#e8c69f] transition-transform duration-700 group-hover:scale-x-100" />
              </Link>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="v2-kicker text-[#8d3e33]">{product.scent} · {product.size}</p>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <h3 className="font-display text-[1.65rem] leading-[1.05]">{product.name[locale]}</h3>
                  <Price amountMAD={product.priceMAD} locale={locale} className="shrink-0 text-[0.78rem]" />
                </div>
                <p className="mt-4 text-[0.78rem] leading-relaxed text-[#725c53]">{product.tagline[locale]}</p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                  <Link
                    href={href(`/products/${product.slug}`, locale)}
                    className="v2-text-link"
                  >
                    {copy.shop}
                  </Link>
                  <button
                    type="button"
                    onClick={() => add(product.slug)}
                    className="flex size-11 items-center justify-center rounded-full border border-[#421713]/25 text-xl transition-colors duration-500 hover:border-[#6d1d18] hover:bg-[#6d1d18] hover:text-[#f7eadb]"
                    aria-label={`${dict.product.quickAdd}: ${product.name[locale]}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
