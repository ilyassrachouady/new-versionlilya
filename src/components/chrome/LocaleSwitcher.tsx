"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, localeMeta, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/** Swaps the leading locale segment while keeping the reader in place. */
export function LocaleSwitcher({
  locale,
  tone = "dark",
  className,
}: {
  locale: Locale;
  tone?: "dark" | "light";
  className?: string;
}) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|fr|ar)(?=\/|$)/, "") || "";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={`/${code}${rest}`}
            hrefLang={localeMeta[code].htmlLang}
            aria-current={active ? "true" : undefined}
            className={cn(
              "label-xs transition-opacity duration-500",
              tone === "dark" ? "text-espresso" : "text-ivory",
              active ? "opacity-100" : "opacity-45 hover:opacity-80",
            )}
          >
            {localeMeta[code].label}
          </Link>
        );
      })}
    </div>
  );
}
