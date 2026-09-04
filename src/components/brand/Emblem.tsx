import Image from "next/image";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type EmblemProps = {
  className?: string;
  /** Kept for API compat — the official mark already carries its cartouche. */
  framed?: boolean;
  title?: string;
  /**
   * `auto` — cream mark (for dark/forest fields).
   * `dark` — forest mark (for ivory/light fields).
   * `plate` — full green square with cream monogram.
   */
  tone?: "auto" | "dark" | "plate";
};

const sources = {
  auto: "/brand/monogram-mark.png",
  dark: "/brand/monogram-dark.png",
  plate: "/brand/monogram.png",
} as const;

/**
 * Official Maison Lilya Zahra monogram — real asset, not a CSS mask.
 */
export function Emblem({ className, title, tone = "auto" }: EmblemProps) {
  const labeled = Boolean(title);

  return (
    <span
      role={labeled ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={labeled ? undefined : true}
      className={cn("relative inline-block aspect-square h-6 w-6 shrink-0", className)}
    >
      <Image
        src={sources[tone]}
        alt={labeled ? title! : ""}
        fill
        sizes="96px"
        className="object-contain"
        priority={false}
      />
    </span>
  );
}

/** Full lockup image for large brand moments. */
export function BrandLockup({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/lockup-on-clear.png"
      alt={site.name}
      width={720}
      height={280}
      className={cn("h-auto w-full max-w-md object-contain", className)}
    />
  );
}
