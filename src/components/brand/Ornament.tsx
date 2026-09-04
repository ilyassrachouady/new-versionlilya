import { cn } from "@/lib/utils";

/**
 * Zellige geometry reduced to a hairline: an eight-point star built from two
 * squares, the way the tile itself is set out. Used at small sizes only —
 * the pattern belongs on the packaging, the geometry belongs here.
 */
export function StarOrnament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-4", className)}>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.85"
      />
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.85"
        transform="rotate(45 12 12)"
      />
    </svg>
  );
}

/** A tileable hairline band derived from the same star, for section seams. */
export function OrnamentBand({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("h-3 w-full opacity-30", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='12' viewBox='0 0 24 12'%3E%3Cg fill='none' stroke='%23A77A45' stroke-width='0.7'%3E%3Cpath d='M0 6h4M20 6h4'/%3E%3Crect x='8' y='2' width='8' height='8'/%3E%3Crect x='8' y='2' width='8' height='8' transform='rotate(45 12 6)'/%3E%3C/g%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat-x",
        backgroundSize: "24px 12px",
      }}
    />
  );
}
