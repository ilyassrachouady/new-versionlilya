"use client";

import { useStore } from "@/components/commerce/store";
import { baseCurrency, formatPrice } from "@/lib/currency";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Renders the dirham price in the reader's chosen currency. Server-rendered
 * as MAD so the first paint is never blank, then swapped once the stored
 * preference is read.
 */
export function Price({
  amountMAD,
  locale,
  className,
}: {
  amountMAD: number;
  locale: Locale;
  className?: string;
}) {
  const { currency, hydrated } = useStore();
  const active = hydrated ? currency : baseCurrency;
  return (
    <span className={cn("tabular", className)} suppressHydrationWarning>
      {formatPrice(amountMAD, active, locale)}
    </span>
  );
}
