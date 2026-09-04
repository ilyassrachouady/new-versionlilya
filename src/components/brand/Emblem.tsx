import { cn } from "@/lib/utils";

type EmblemProps = {
  className?: string;
  /** Kept for API compat — the official mark already carries its cartouche. */
  framed?: boolean;
  title?: string;
};

/**
 * Official house monogram from the Maison Lilya Zahra lockup.
 * Coloured via `currentColor` through a CSS mask.
 */
export function Emblem({ className, title }: EmblemProps) {
  return (
    <span
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn(
        "inline-block aspect-square h-6 w-6 shrink-0 bg-current",
        "[mask-image:url(/brand/monogram-alpha.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]",
        "[-webkit-mask-image:url(/brand/monogram-alpha.png)] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]",
        className,
      )}
    />
  );
}
