import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type WordmarkProps = {
  className?: string;
  /** `stacked` is the house lockup; `inline` is for the header rail. */
  layout?: "stacked" | "inline";
  size?: "sm" | "md" | "lg" | "xl";
};

const sizes = {
  sm: { prefix: "text-[0.5rem] tracking-[0.42em]", family: "text-[0.72rem] tracking-[0.3em]" },
  md: { prefix: "text-[0.55rem] tracking-[0.45em]", family: "text-[0.95rem] tracking-[0.28em]" },
  lg: { prefix: "text-[0.7rem] tracking-[0.5em]", family: "text-[1.6rem] tracking-[0.22em]" },
  xl: {
    prefix: "text-[0.8rem] tracking-[0.55em]",
    family: "text-[clamp(2rem,6vw,4.5rem)] tracking-[0.14em]",
  },
} as const;

export function Wordmark({ className, layout = "stacked", size = "md" }: WordmarkProps) {
  const scale = sizes[size];

  if (layout === "inline") {
    return (
      <span className={cn("font-display uppercase leading-none", scale.family, className)}>
        {site.nameParts.prefix} {site.nameParts.family}
      </span>
    );
  }

  return (
    <span className={cn("flex flex-col items-center leading-none", className)}>
      <span className={cn("font-sans uppercase opacity-70", scale.prefix)}>
        {site.nameParts.prefix}
      </span>
      <span className={cn("font-display mt-[0.45em] uppercase", scale.family)}>
        {site.nameParts.family}
      </span>
    </span>
  );
}
