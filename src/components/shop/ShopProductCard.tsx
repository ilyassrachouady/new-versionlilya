"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductQuickAdd } from "@/components/commerce/ProductQuickAdd";

import { Price } from "@/components/commerce/Price";
import type { Product } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function ShopProductCard({ product, index, locale, dict, discoverLabel }: { product: Product; index: number; locale: Locale; dict: Dictionary; discoverLabel: string }) {
  return (
            <article className="shop-product-card group relative flex h-full min-w-0 flex-col overflow-hidden border border-espresso/10 bg-[#e7d8c7] [content-visibility:auto] [contain-intrinsic-size:auto_32rem]">
              <div className="relative">
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
                <span className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="(max-width: 359px) 90vw, (max-width: 767px) 45vw, (max-width: 1023px) 30vw, 23vw"
                    quality={70}
                    className="object-contain"
                  />
                </span>
                <span className="absolute inset-x-0 bottom-0 h-px origin-[var(--rule-origin)] scale-x-0 bg-[#e8c69f] transition-transform duration-500 group-hover:scale-x-100" />
                </Link>
                <div className="shop-quick-add absolute inset-x-3 bottom-3 z-10">
                  <ProductQuickAdd slug={product.slug} label={dict.product.quickAdd} soldOutLabel={dict.product.soldOut} />
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-5">
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.1em] leading-relaxed text-[#8d3e33] [overflow-wrap:anywhere]">{product.scent} · {product.size}</p>
                <div className="mt-3 flex flex-col items-start gap-2 xl:flex-row xl:justify-between xl:gap-3">
                  <h3 className="font-display text-[1.25rem] leading-[1.15] [overflow-wrap:anywhere] sm:text-[1.65rem]">{product.name[locale]}</h3>
                  <Price amountEUR={product.priceEUR} locale={locale} className="shrink-0 text-[0.78rem]" />
                </div>
                <p className="mt-4 text-[0.78rem] leading-relaxed text-[#725c53]">{product.tagline[locale]}</p>
                <div className="mt-auto flex items-center border-t border-espresso/15 pt-5">
                  <Link
                    href={href(`/products/${product.slug}`, locale)}
                    className="v2-text-link [overflow-wrap:anywhere]"
                  >
                    {discoverLabel}
                  </Link>
                </div>
              </div>
            </article>
  );
}
