"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/Button";
import { Price } from "@/components/commerce/Price";
import { useStore } from "@/components/commerce/store";
import type { Product } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function StickyBag({
  product,
  locale,
  dict,
  sentinelId,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  sentinelId: string;
}) {
  const { add } = useStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(sentinelId);
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show only after the primary purchase control has scrolled above the
        // viewport. A sentinel that is still below the fold should not summon
        // a sticky CTA over the product introduction.
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sentinelId]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-espresso/10 bg-ivory/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_36px_rgba(36,24,21,0.09)] backdrop-blur-md lg:hidden"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto flex max-w-xl items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[1.05rem] text-espresso">
                {product.name[locale]}
              </p>
              <p className="truncate text-[0.65rem] tracking-[0.08em] text-ink-faint uppercase">
                {product.scent} · {product.size}
              </p>
              <Price
                amountEUR={product.priceEUR}
                locale={locale}
                className="text-[0.8125rem] text-ink-muted"
              />
            </div>
            <Button type="button" size="md" className="min-w-[9.25rem]" onClick={() => add(product.slug)} disabled={product.stockQuantity === 0}>
              {product.stockQuantity === 0 ? dict.product.soldOut : dict.product.addToBag}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
