"use client";

import { useStore } from "@/components/commerce/store";
import { enabledCurrencies } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function CurrencySwitcher({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const { currency, setCurrency } = useStore();

  return (
    <label className={cn("relative inline-flex items-center", className)}>
      <span className="sr-only">Currency</span>
      <select
        value={currency}
        onChange={(event) =>
          setCurrency(event.target.value as (typeof enabledCurrencies)[number])
        }
        className={cn(
          "label-xs cursor-pointer appearance-none bg-transparent pe-4 outline-none transition-opacity duration-500 hover:opacity-70",
          tone === "dark" ? "text-espresso" : "text-ivory",
        )}
      >
        {enabledCurrencies.map((code) => (
          <option key={code} value={code} className="bg-ivory text-espresso">
            {code}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute end-0 text-[0.5rem]",
          tone === "dark" ? "text-espresso/60" : "text-ivory/60",
        )}
      >
        ▾
      </span>
    </label>
  );
}
