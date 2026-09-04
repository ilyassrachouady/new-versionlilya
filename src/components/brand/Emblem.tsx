import { cn } from "@/lib/utils";

type EmblemProps = {
  className?: string;
  /** Draws the double-hairline cartouche that frames the mark on the labels. */
  framed?: boolean;
  title?: string;
};

/**
 * The house mark: a single engraved glyph inside a brass cartouche, taken
 * from the emblem printed at the head of every Maison label.
 */
export function Emblem({ className, framed = true, title }: EmblemProps) {
  return (
    <svg
      viewBox="0 0 48 56"
      fill="none"
      className={cn("h-6 w-auto", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {framed && (
        <>
          <rect
            x="0.75"
            y="0.75"
            width="46.5"
            height="54.5"
            rx="7"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.95"
          />
          <rect
            x="4"
            y="4"
            width="40"
            height="48"
            rx="4.5"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.55"
          />
        </>
      )}
      <path
        d="M13.4 16.6h21.9v4.2L20.6 34.9h14.7v4.5H12.3v-4.2l14.7-14.1H13.4z"
        fill="currentColor"
      />
      <path d="M15.5 43.4h17" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
      <path d="M20.4 12.2h7.2" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
    </svg>
  );
}
