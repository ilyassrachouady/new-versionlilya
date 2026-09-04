"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { Price } from "@/components/commerce/Price";
import { useStore } from "@/components/commerce/store";
import type { Product } from "@/lib/catalog";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

/**
 * Product owns the plate. Tall bottles run nearly full height;
 * jars sit large and centred — never a small sticker in empty field.
 */
const frame: Record<Product["aspect"], string> = {
  /* Scale past the inset so skinny bottles claim the plate, not the void. */
  tall: "inset-x-[6%] top-[1%] bottom-[5%] scale-[1.22]",
  column: "inset-x-[8%] top-[2%] bottom-[5%] scale-[1.12]",
  jar: "inset-x-[4%] top-[5%] bottom-[7%]",
};

export function ProductCard({
  product,
  locale,
  dict,
  priority = false,
  field = "ivory",
  className,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  priority?: boolean;
  field?: "ivory" | "sand" | "espresso";
  className?: string;
}) {
  const { add } = useStore();
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();

  const dark = field === "espresso";
  const jar = product.aspect === "jar";

  return (
    <article
      className={cn("group relative flex flex-col", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={href(`/products/${product.slug}`, locale)}
        className="relative block overflow-hidden focus-visible:outline-offset-4"
        aria-label={`${product.name[locale]} — ${product.scent}`}
      >
        <div
          className={cn(
            "surface-grain relative w-full overflow-hidden transition-colors duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            jar ? "aspect-[4/5]" : "aspect-[2/3]",
            field === "ivory" && "bg-[#e4d7c4] group-hover:bg-[#dccdb8]",
            field === "sand" && "bg-[#d9c7ad] group-hover:bg-[#d0bb9e]",
            dark && "bg-espresso group-hover:bg-espresso-deep",
          )}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-80"
            style={{
              background: dark
                ? "radial-gradient(120% 80% at 50% 0%, rgba(167,122,69,0.2), transparent 62%)"
                : "radial-gradient(120% 85% at 50% 0%, rgba(255,252,246,0.7), transparent 58%)",
            }}
          />

          {/* Soft pedestal so cutouts don’t float on empty field. */}
          <div
            aria-hidden
            className="absolute inset-x-[8%] top-[12%] bottom-[10%] rounded-[46%]"
            style={{
              background: dark
                ? "radial-gradient(ellipse at 50% 55%, rgba(243,237,227,0.14) 0%, transparent 68%)"
                : "radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0.4) 0%, transparent 68%)",
            }}
          />

          <motion.div
            aria-hidden
            className={cn(
              "absolute left-1/2 h-7 -translate-x-1/2 rounded-[50%]",
              jar ? "bottom-[12%] w-[58%]" : "bottom-[8%] w-[42%]",
            )}
            style={{
              background: dark
                ? "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.55), transparent 70%)"
                : "radial-gradient(50% 50% at 50% 50%, rgba(36,24,21,0.3), transparent 70%)",
            }}
            animate={
              reduced ? undefined : { scaleX: hovered ? 0.86 : 1, opacity: hovered ? 0.7 : 1 }
            }
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className={cn("absolute", frame[product.aspect])}
            animate={reduced ? undefined : { y: hovered ? -10 : 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={product.image}
              alt={`${product.name[locale]} — ${product.scent}`}
              fill
              priority={priority}
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 24vw"
              className="object-contain drop-shadow-[0_18px_32px_rgba(20,10,8,0.38)]"
            />
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-full p-3 opacity-0 transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                add(product.slug);
              }}
              className="h-11 w-full bg-espresso/92 font-sans text-[0.625rem] tracking-[0.24em] text-ivory uppercase backdrop-blur-sm transition-colors duration-500 hover:bg-burgundy"
            >
              {dict.product.quickAdd}
            </button>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="display-md text-espresso">
            <Link
              href={href(`/products/${product.slug}`, locale)}
              className="transition-colors duration-500 hover:text-burgundy"
            >
              {product.name[locale]}
            </Link>
          </h3>
          <Price
            amountMAD={product.priceMAD}
            locale={locale}
            className="shrink-0 font-sans text-[0.8125rem] text-espresso"
          />
        </div>

        <span
          aria-hidden
          className="mt-3 block h-px w-full origin-[var(--rule-origin)] scale-x-0 bg-brass/60 transition-transform duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
        />

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="label-xs text-ink-faint">{product.scent}</p>
          <p className="label-xs tabular text-ink-faint">{product.size}</p>
        </div>
      </div>
    </article>
  );
}
