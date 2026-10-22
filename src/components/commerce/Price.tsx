"use client";

import { useStore } from "@/components/commerce/store";
import { baseCurrency, formatPrice } from "@/lib/currency";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Renders canonical EUR catalogue prices, including cents.
 */
export function Price({
  amountEUR,
  locale,
  className,
}: {
  amountEUR: number;
  locale: Locale;
  className?: string;
}) {
  const { currency, hydrated } = useStore();
  const active = hydrated ? currency : baseCurrency;
  return (
    <span className={cn("tabular", className)} suppressHydrationWarning>
      {formatPrice(amountEUR, active, locale)}
    </span>
  );
}
