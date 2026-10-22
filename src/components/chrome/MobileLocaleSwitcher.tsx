"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { isLocale, localeMeta, type Locale } from "@/lib/i18n/config";

/** Native phone picker keeps language selection familiar and keyboard accessible. */
export function MobileLocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className="relative flex size-11 shrink-0 items-center justify-center gap-0.5 min-[68rem]:hidden">
      <span aria-hidden className="text-[0.6875rem] font-medium tracking-[0.04em]" dir="ltr">{localeMeta[locale].label}</span>
      <ChevronDown aria-hidden className="size-3" strokeWidth={1.5} />
      <select
        aria-label="Langue / Language / اللغة"
        value={locale}
        onChange={(event) => {
          const next = event.target.value;
          if (!isLocale(next) || next === locale) return;
          const rest = pathname.replace(/^\/(en|fr|ar)(?=\/|$)/, "");
          router.push(`/${next}${rest}${window.location.search}${window.location.hash}`, { scroll: false });
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {(["fr", "en", "ar"] as const).map((code) => (
          <option key={code} value={code} lang={code}>{localeMeta[code].native}</option>
        ))}
      </select>
    </label>
  );
}
