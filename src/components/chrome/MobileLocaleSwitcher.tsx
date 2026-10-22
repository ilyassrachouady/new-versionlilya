"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";

import { localeMeta, type Locale } from "@/lib/i18n/config";

export function MobileLocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={`Langue / Language / اللغة — ${localeMeta[locale].native}`}
        className="group flex size-11 shrink-0 items-center justify-center gap-0.5 min-[68rem]:hidden"
      >
        <span className="text-[0.6875rem] font-medium tracking-[0.04em]" dir="ltr">{localeMeta[locale].label}</span>
        <ChevronDown aria-hidden className="size-3 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" strokeWidth={1.5} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          aria-label="Langue / Language / اللغة"
          align="end"
          side="bottom"
          sideOffset={8}
          collisionPadding={16}
          className="z-[75] w-44 border border-forest/15 bg-ivory p-2 text-forest shadow-[0_8px_24px_rgba(20,36,27,0.12)] min-[68rem]:hidden"
        >
          {(["fr", "en", "ar"] as const).map((code) => (
            <button
              key={code}
              type="button"
              lang={code}
              aria-current={code === locale ? "true" : undefined}
              onClick={() => {
                setOpen(false);
                if (code === locale) return;
                const rest = pathname.replace(/^\/(en|fr|ar)(?=\/|$)/, "");
                router.push(`/${code}${rest}${window.location.search}${window.location.hash}`, { scroll: false });
              }}
              className="flex min-h-11 w-full items-center justify-between gap-4 px-3 text-sm transition-colors hover:bg-forest/5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-forest aria-current:bg-forest/5"
            >
              <bdi>{localeMeta[code].native}</bdi>
              {code === locale && <Check aria-hidden className="size-4" strokeWidth={1.5} />}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
