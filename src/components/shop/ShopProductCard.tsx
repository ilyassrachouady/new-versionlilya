"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProductQuickAdd } from "@/components/commerce/ProductQuickAdd";
import { motion, useReducedMotion } from "motion/react";

import { Price } from "@/components/commerce/Price";
import { useStore } from "@/components/commerce/store";
import type { Product } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";




export function ShopProductCard({ product, index, locale, dict, discoverLabel }: { product: Product; index: number; locale: Locale; dict: Dictionary; discoverLabel: string }) {
  const { add } = useStore();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  return (
            <article className="group relative flex h-full flex-col bg-[#e7d8c7]" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
              <Link
                href={href(`/products/${product.slug}`, locale)}
                className={cn(
                  "relative block aspect-[3/4] overflow-hidden",
                  "bg-ivory",
                )}
                aria-label={`${product.name[locale]} — ${product.scent}`}
              >
                <span className="v2-index absolute start-4 top-4 z-10 text-[#f4e7d8]/72 mix-blend-difference">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <motion.span
                  className="absolute inset-0"
                  animate={reduced ? undefined : { y: hovered ? -10 : 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="(max-width: 359px) 90vw, (max-width: 767px) 45vw, (max-width: 1023px) 30vw, 23vw"
                    className="object-contain"
                  />
                </motion.span>
                <span className="absolute inset-x-0 bottom-0 h-px origin-[var(--rule-origin)] scale-x-0 bg-[#e8c69f] transition-transform duration-700 group-hover:scale-x-100" />
              </Link>

              <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[3/4] overflow-hidden">
                <ProductQuickAdd slug={product.slug} label={dict.product.quickAdd} />
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-5">
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.1em] leading-relaxed text-[#8d3e33] [overflow-wrap:anywhere]">{product.scent} · {product.size}</p>
                <div className="mt-3 flex flex-col items-start gap-2 xl:flex-row xl:justify-between xl:gap-3">
                  <h3 className="font-display text-[1.25rem] leading-[1.15] [overflow-wrap:anywhere] sm:text-[1.65rem]">{product.name[locale]}</h3>
                  <Price amountMAD={product.priceMAD} locale={locale} className="shrink-0 text-[0.78rem]" />
                </div>
                <p className="mt-4 text-[0.78rem] leading-relaxed text-[#725c53]">{product.tagline[locale]}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5">
                  <Link
                    href={href(`/products/${product.slug}`, locale)}
                    className="v2-text-link max-w-[calc(100%-3rem)] [overflow-wrap:anywhere]"
                  >
                    {discoverLabel}
                  </Link>
                  <button
                    type="button"
                    onClick={() => add(product.slug)}
                    className="flex [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:invisible size-11 shrink-0 items-center justify-center rounded-full border border-[#421713]/25 text-xl transition-colors duration-500 hover:border-[#6d1d18] hover:bg-[#6d1d18] hover:text-[#f7eadb]"
                    aria-label={`${dict.product.quickAdd}: ${product.name[locale]}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
  );
}
