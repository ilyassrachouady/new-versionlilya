"use client";

import { useStore } from "@/components/commerce/store";

/** Protected collection interaction: preserve this reveal in unrelated visual changes. */
export function ProductQuickAdd({ slug, label }: { slug: string; label: string }) {
  const { add } = useStore();
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-full p-3 opacity-0 transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transition-none">
      <button
        type="button"
        onClick={(event) => { event.preventDefault(); add(slug); }}
        className="h-11 w-full bg-espresso/92 font-sans text-[0.625rem] tracking-[0.24em] text-ivory uppercase backdrop-blur-sm transition-colors duration-500 hover:bg-burgundy"
      >
        {label}
      </button>
    </div>
  );
}
