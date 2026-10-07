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
import { cn } from "@/lib/utils";

const fields = ["v2-product-cream", "v2-product-red", "v2-product-green"] as const;

const frame: Record<Product["aspect"], string> = {
  tall: "inset-x-[22%] inset-y-[8%]",
  column: "inset-x-[18%] inset-y-[6%]",
  jar: "inset-x-[7%] inset-y-[15%]",
};

export function CabinetProductCard({ product, index, locale, dict, discoverLabel, cleanPhotography = false }: { product: Product; index: number; locale: Locale; dict: Dictionary; discoverLabel: string; cleanPhotography?: boolean }) {
  const { add } = useStore();
  const reduced = useReducedMotion();
  return (
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
                {!cleanPhotography && <span aria-hidden className="absolute inset-x-[16%] bottom-[8%] h-8 rounded-[50%] bg-black/25 blur-md" />}
                <motion.span
                  className={cn("absolute", cleanPhotography ? "inset-0" : frame[product.aspect])}
                  whileHover={reduced ? undefined : { y: -12, scale: 1.015 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 82vw, 25vw"
                    className={cleanPhotography ? "object-cover object-center" : "object-contain drop-shadow-[0_24px_34px_rgba(25,7,6,.38)]"}
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
                    {discoverLabel}
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
  );
}
