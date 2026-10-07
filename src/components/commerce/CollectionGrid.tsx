"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/commerce/ProductCard";
import { products, type Product, type RitualId } from "@/lib/catalog";
import { rituals } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const fields = ["ivory", "sand", "espresso"] as const;

export function CollectionGrid({
  locale,
  dict,
  items = products,
  filterable = true,
  cleanPhotography = false,
}: {
  locale: Locale;
  dict: Dictionary;
  items?: Product[];
  filterable?: boolean;
  cleanPhotography?: boolean;
}) {
  const [ritual, setRitual] = useState<RitualId | "all">("all");

  const shown = useMemo(() => {
    if (ritual === "all") return items;
    return items.filter((product) => product.ritual === ritual);
  }, [items, ritual]);

  return (
    <div>
      {filterable && (
        <div
          role="group"
          aria-label={dict.shop.filter}
          className="flex flex-wrap items-center gap-2 border-b border-espresso/10 pb-6"
        >
          <span className="label-xs me-3 text-ink-faint">{dict.shop.filter}</span>
          <FilterChip
            active={ritual === "all"}
            onClick={() => setRitual("all")}
          >
            {dict.shop.all}
          </FilterChip>
          {rituals.map((item) => (
            <FilterChip
              key={item.id}
              active={ritual === item.id}
              onClick={() => setRitual(item.id)}
            >
              {item.title[locale]}
            </FilterChip>
          ))}
          <span className="label-xs ms-auto tabular text-ink-faint">
            {shown.length} {dict.shop.count}
          </span>
        </div>
      )}

      {shown.length === 0 ? (
        <p className="py-24 text-center font-display text-[1.5rem] text-ink-muted">
          {dict.shop.empty}
        </p>
      ) : (
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-7 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
          {shown.map((product, index) => (
            <li key={product.slug}>
              <ProductCard
                product={product}
                cleanPhotography={cleanPhotography}
                locale={locale}
                dict={dict}
                field={fields[index % fields.length]}
                priority={index < 4}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "border px-4 py-2 text-[0.625rem] tracking-[0.2em] uppercase transition-colors duration-500",
        active
          ? "border-burgundy bg-burgundy text-ivory"
          : "border-espresso/15 text-ink-muted hover:border-espresso/50 hover:text-espresso",
      )}
    >
      {children}
    </button>
  );
}
