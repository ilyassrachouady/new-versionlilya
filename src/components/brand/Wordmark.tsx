import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type WordmarkProps = {
  className?: string;
  /** `stacked` = MAISON over LILYA ZAHRA; `inline` = one line; `lockup` = full brand with monogram. */
  layout?: "stacked" | "inline" | "lockup";
  size?: "sm" | "md" | "lg" | "xl";
  /** Show the vertical FOR HER & HIM line (lockup only). */
  tagline?: boolean;
};

const sizes = {
  sm: {
    prefix: "text-[0.5rem] tracking-[0.42em]",
    family: "text-[0.72rem] tracking-[0.22em]",
    tag: "text-[0.4rem] tracking-[0.28em]",
    mark: "h-7",
  },
  md: {
    prefix: "text-[0.55rem] tracking-[0.48em]",
    family: "text-[0.95rem] tracking-[0.2em]",
    tag: "text-[0.45rem] tracking-[0.3em]",
    mark: "h-9",
  },
  lg: {
    prefix: "text-[0.7rem] tracking-[0.5em]",
    family: "text-[1.55rem] tracking-[0.16em]",
    tag: "text-[0.55rem] tracking-[0.32em]",
    mark: "h-14",
  },
  xl: {
    prefix: "text-[0.8rem] tracking-[0.55em]",
    family: "text-[clamp(1.75rem,5.5vw,4rem)] tracking-[0.12em]",
    tag: "text-[0.65rem] tracking-[0.34em]",
    mark: "h-20",
  },
} as const;

export function Wordmark({
  className,
  layout = "stacked",
  size = "md",
  tagline = true,
}: WordmarkProps) {
  const scale = sizes[size];

  if (layout === "inline") {
    return (
      <span className={cn("font-display uppercase leading-none", scale.family, className)}>
        {site.nameParts.prefix} {site.nameParts.family}
      </span>
    );
  }

  if (layout === "lockup") {
    return (
      <span className={cn("inline-flex items-center gap-3 sm:gap-4", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/monogram-mark.png"
          alt=""
          aria-hidden
          className={cn("aspect-square w-auto object-contain", scale.mark)}
          width={80}
          height={80}
          decoding="async"
        />
        {tagline && (
          <span
            aria-hidden
            className={cn(
              "flex h-[4.5em] items-center border-x border-current/35 px-2 font-sans uppercase opacity-80",
              scale.tag,
            )}
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {site.tagline}
          </span>
        )}
        <span className="flex flex-col items-start leading-none">
          <span className={cn("font-display uppercase", scale.prefix)}>{site.nameParts.prefix}</span>
          <span className={cn("font-display mt-[0.28em] uppercase", scale.family)}>
            {site.nameParts.family}
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className={cn("flex flex-col items-center leading-none", className)}>
      <span className={cn("font-display uppercase opacity-80", scale.prefix)}>
        {site.nameParts.prefix}
      </span>
      <span className={cn("font-display mt-[0.35em] uppercase", scale.family)}>
        {site.nameParts.family}
      </span>
    </span>
  );
}
