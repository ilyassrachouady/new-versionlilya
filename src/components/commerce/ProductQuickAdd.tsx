"use client";

import { useStore } from "@/components/commerce/store";

/** Protected collection interaction: preserve this reveal in unrelated visual changes. */
export function ProductQuickAdd({ slug, label, soldOutLabel }: { slug: string; label: string; soldOutLabel?: string }) {
  const { add, catalog } = useStore();
  const soldOut = catalog.find((item) => item.slug === slug)?.stockQuantity === 0;
  return (
    <div className="relative">
      <button
        type="button"
        disabled={soldOut}
        onClick={(event) => { event.preventDefault(); if (!soldOut) add(slug); }}
        className="h-11 w-full bg-espresso/92 font-sans text-[0.625rem] tracking-[0.24em] text-ivory uppercase transition-colors duration-300 hover:bg-burgundy disabled:opacity-50"
      >
        {soldOut ? soldOutLabel ?? label : label}
      </button>
    </div>
  );
}
