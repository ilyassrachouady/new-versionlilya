import Image from "next/image";

import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Tone = "sand" | "espresso" | "ivory";

const tones: Record<Tone, { panel: string; glow: string; ink: string }> = {
  sand: {
    panel: "bg-[#e5d9c6]",
    glow: "rgba(255,252,246,0.72)",
    ink: "text-espresso/35",
  },
  espresso: {
    panel: "bg-[#3b2119]",
    glow: "rgba(167,122,69,0.32)",
    ink: "text-ivory/40",
  },
  ivory: {
    panel: "bg-[#e0cdb4]",
    glow: "rgba(255,250,240,0.68)",
    ink: "text-espresso/35",
  },
};

/**
 * Editorial product stage — the object must own the panel.
 * Uses fill + inset so jars/bottles scale with the frame, not intrinsic px.
 */
export function ProductStage({
  product,
  tone = "sand",
  index,
  className,
  priority = false,
}: {
  product: Product;
  tone?: Tone;
  index?: number;
  className?: string;
  priority?: boolean;
}) {
  const field = tones[tone];
  const jar = product.aspect === "jar";

  return (
    <div
      className={cn(
        "surface-grain relative aspect-[5/6] overflow-hidden",
        field.panel,
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(80% 55% at 50% 8%, ${field.glow}, transparent 64%)`,
        }}
      />

      {/* Soft pedestal — grounds cutouts on dark fields. */}
      <div
        aria-hidden
        className="absolute inset-x-[6%] top-[8%] bottom-[10%] rounded-[46%]"
        style={{
          background:
            tone === "espresso"
              ? "radial-gradient(ellipse at 50% 55%, rgba(243,237,227,0.18) 0%, rgba(243,237,227,0.06) 45%, transparent 70%)"
              : "radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0.35) 0%, transparent 68%)",
        }}
      />
      <div
        aria-hidden
        className={cn(
          "absolute left-1/2 h-11 w-[58%] -translate-x-1/2 rounded-[50%]",
          jar ? "bottom-[14%]" : "bottom-[9%]",
        )}
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(20,10,8,0.45), transparent 72%)",
        }}
      />

      {/* Product frame — jar fills most of the panel; bottles keep vertical room. */}
      <div
        className={cn(
          "absolute",
          jar
            ? "inset-x-[7%] inset-y-[9%]"
            : product.aspect === "tall"
              ? "inset-x-[26%] inset-y-[8%]"
              : "inset-x-[22%] inset-y-[6%]",
        )}
      >
        <Image
          src={product.image}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 1024px) 92vw, 44vw"
          className="object-contain drop-shadow-[0_24px_40px_rgba(20,10,8,0.42)]"
        />
      </div>

      {typeof index === "number" && (
        <span
          aria-hidden
          className={cn(
            "absolute top-6 start-6 font-display text-[0.7rem] tracking-[0.35em]",
            field.ink,
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}
