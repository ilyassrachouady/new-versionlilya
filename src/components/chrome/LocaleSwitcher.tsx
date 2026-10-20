"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, localeMeta, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/** Swaps the leading locale segment while keeping the reader on the same page. */
export function LocaleSwitcher({
  locale,
  tone = "dark",
  variant = "inline",
  showNative = false,
  compact = false,
  ariaLabel = "Language",
  className,
}: {
  locale: Locale;
  tone?: "dark" | "light";
  variant?: "inline" | "segment" | "panel";
  showNative?: boolean;
  compact?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|fr|ar)(?=\/|$)/, "") || "";

  if (variant === "panel") {
    return (
      <nav aria-label={ariaLabel} className={cn("grid gap-2", className)}>
        {locales.map((code) => {
          const active = code === locale;
          const meta = localeMeta[code];
          return (
            <Link
              key={code}
              href={`/${code}${rest}`}
              hrefLang={meta.htmlLang}
              prefetch
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-12 items-center justify-between rounded-xl border px-4 text-sm transition",
                active
                  ? "border-cream/35 bg-cream/12 text-cream"
                  : "border-cream/15 text-cream/75 hover:border-cream/25 hover:bg-cream/6 hover:text-cream",
              )}
            >
              <span className="font-medium">{meta.native}</span>
              <span className="label-xs opacity-70">{meta.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  if (variant === "segment") {
    const shell =
      tone === "dark"
        ? "border-forest/15 bg-forest/[0.04]"
        : "border-cream/25 bg-cream/8";
    const activeChip = tone === "dark" ? "bg-forest text-cream shadow-sm" : "bg-cream text-forest shadow-sm";
    const idleChip = tone === "dark" ? "text-forest/65 hover:text-forest" : "text-cream/80 hover:text-cream";

    return (
      <nav
        aria-label={ariaLabel}
        className={cn("inline-flex max-w-full rounded-full border p-0.5", shell, className)}
      >
        {locales.map((code) => {
          const active = code === locale;
          const meta = localeMeta[code];
          return (
            <Link
              key={code}
              href={`/${code}${rest}`}
              hrefLang={meta.htmlLang}
              prefetch
              aria-current={active ? "true" : undefined}
              className={cn(
                "inline-flex items-center justify-center rounded-full font-medium tracking-[0.08em] transition",
                compact
                  ? "min-h-7 min-w-[1.85rem] px-1.5 text-[0.5625rem]"
                  : "min-h-9 min-w-[2.75rem] px-2.5 text-[0.625rem] sm:min-h-10 sm:min-w-[4.5rem] sm:px-3 sm:text-[0.6875rem]",
                active ? activeChip : idleChip,
              )}
            >
              {showNative && !compact ? (
                <>
                  <span className="sm:hidden">{meta.label}</span>
                  <span className="hidden sm:inline">{meta.native}</span>
                </>
              ) : (
                meta.label
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label={ariaLabel} className={cn("flex items-center gap-3", className)}>
      {locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={`/${code}${rest}`}
            hrefLang={localeMeta[code].htmlLang}
            prefetch
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
    </nav>
  );
}
