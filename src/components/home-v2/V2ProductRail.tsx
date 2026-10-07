"use client";

import { motion, useReducedMotion } from "motion/react";

import { CabinetProductCard } from "@/components/commerce/CabinetProductCard";
import type { Product } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { V2Copy } from "@/lib/v2-content";

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
<CabinetProductCard cleanPhotography product={product} index={index} locale={locale} dict={dict} discoverLabel={copy.shop} />
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
