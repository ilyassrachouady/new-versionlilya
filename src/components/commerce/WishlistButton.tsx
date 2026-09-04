"use client";

import { useStore } from "@/components/commerce/store";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function WishlistButton({
  slug,
  dict,
  className,
}: {
  slug: string;
  dict: Dictionary;
  className?: string;
}) {
  const { isWished, toggleWish, hydrated } = useStore();
  const on = hydrated && isWished(slug);

  return (
    <button
      type="button"
      onClick={() => toggleWish(slug)}
      aria-pressed={on}
      className={cn(
        "label-xs py-2 text-ink-muted transition-colors duration-500 hover:text-burgundy",
        on && "text-burgundy",
        className,
      )}
    >
      {on ? dict.wishlist.remove : dict.wishlist.add}
    </button>
  );
}
