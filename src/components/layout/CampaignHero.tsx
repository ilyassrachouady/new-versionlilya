import Image from "next/image";

import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { BrassRule } from "@/components/brand/BrassRule";
import { StarOrnament } from "@/components/brand/Ornament";
import type { Product } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const frame: Record<Product["aspect"], string> = {
  tall: "inset-x-[26%] inset-y-[10%]",
  column: "inset-x-[22%] inset-y-[8%]",
  jar: "inset-x-[10%] inset-y-[10%]",
};

export function CampaignHero({
  locale,
  eyebrow,
  title,
  body,
  texture,
  productSrc,
  productAspect = "tall",
  crumbs,
  tone = "dark",
  compact = false,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  body?: string;
  texture: string;
  productSrc?: string;
  productAspect?: Product["aspect"];
  productWidth?: number;
  productHeight?: number;
  crumbs: Crumb[];
  tone?: "dark" | "burgundy";
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "surface-grain relative isolate overflow-hidden text-ivory",
        tone === "burgundy" ? "bg-burgundy" : "bg-espresso",
      )}
    >
      <Image
        src={texture}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-85"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            tone === "burgundy"
              ? "radial-gradient(70% 55% at 80% 0%, rgba(214,138,92,0.28), transparent 62%), linear-gradient(180deg, rgba(38,12,11,0.2), rgba(38,12,11,0.72))"
              : "radial-gradient(70% 55% at 78% 8%, rgba(167,122,69,0.28), transparent 62%), linear-gradient(180deg, rgba(15,9,8,0.15), rgba(15,9,8,0.72))",
        }}
      />

      <div className={cn("shell relative grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16", compact ? "py-10 sm:py-12 lg:py-14" : "py-16 sm:py-20 lg:py-28")}>
        <div>
          <Breadcrumbs trail={crumbs} locale={locale} tone="light" />
          <div className="mt-10 flex items-center gap-3">
            <StarOrnament className="size-3.5 text-brass-light" />
            <span className="eyebrow text-brass-light">{eyebrow}</span>
          </div>
          <h1 className={cn(compact ? "display-xl" : "display-hero", "mt-6 text-balance text-ivory")}>{title}</h1>
          {body && (
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-pretty text-ivory/70">
              {body}
            </p>
          )}
          <BrassRule width="short" tone="ivory" className="mt-8 w-16" />
        </div>

        {productSrc && (
          <div className={cn("relative mx-auto aspect-[4/5] w-full", compact ? "max-w-[14rem] sm:max-w-[18rem]" : "max-w-[22rem] lg:max-w-none")}>
            <div className="arch absolute inset-0 overflow-hidden">
              <Image
                src={texture}
                alt=""
                fill
                sizes="(max-width: 1024px) 60vw, 22rem"
                className="object-cover opacity-80"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(36,24,21,0.05) 0%, rgba(36,24,21,0.45) 100%)",
                }}
              />
            </div>
            <div
              aria-hidden
              className="absolute inset-x-[20%] bottom-[12%] h-8"
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(8,4,4,0.55), transparent 72%)",
              }}
            />
            <div className={cn("absolute", frame[productAspect])}>
              <Image
                src={productSrc}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 60vw, 22rem"
                className="object-contain drop-shadow-[0_18px_28px_rgba(8,4,4,0.5)]"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
