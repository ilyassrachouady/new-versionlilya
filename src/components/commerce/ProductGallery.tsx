"use client";

import { useState } from "react";
import Image from "next/image";

import type { Product } from "@/lib/catalog";
import { shopProductImages } from "@/lib/shop-product-images";
import { cn } from "@/lib/utils";

const fields = [
  { id: "ivory", bg: "bg-[#e6d9c6]", glow: "rgba(255,252,246,0.72)" },
  { id: "espresso", bg: "bg-espresso", glow: "rgba(167,122,69,0.28)" },
  { id: "sand", bg: "bg-[#dcc9ad]", glow: "rgba(255,250,240,0.6)" },
] as const;

const frame: Record<Product["aspect"], string> = {
  tall: "inset-x-[26%] inset-y-[8%]",
  column: "inset-x-[22%] inset-y-[6%]",
  jar: "inset-x-[8%] inset-y-[8%]",
};

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const field = fields[active] ?? fields[0];
  const images = product.gallery;
  const imageFit = shopProductImages[product.slug] === product.image ? "object-cover object-center" : "object-contain";
  const jar = product.aspect === "jar";


  if (images?.length) {
    return <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
        <Image src={images[active] ?? images[0]} alt={product.labelFr + " — " + product.scent} fill priority sizes="(max-width: 1024px) 92vw, 46vw" className={imageFit} />
      </div>
      {images.length > 1 && <div className="mt-3 grid grid-cols-3 gap-3" role="tablist" aria-label="Views">
        {images.map((image, index) => <button key={image} type="button" role="tab" aria-selected={active === index} aria-label={String(index + 1)} onClick={() => setActive(index)} className={cn("relative aspect-square overflow-hidden bg-ivory", active === index ? "ring-1 ring-brass ring-offset-2 ring-offset-ivory" : "opacity-80")}><Image src={image} alt="" fill sizes="120px" className="object-contain" /></button>)}
      </div>}
    </div>;
  }

  return (
    <div>
      <div
        className={cn(
          "surface-grain relative aspect-[4/5] overflow-hidden transition-colors duration-700",
          field.bg,
        )}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(80% 55% at 50% 0%, ${field.glow}, transparent 62%)`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-[8%] top-[10%] bottom-[12%] rounded-[46%]"
          style={{
            background:
              active === 1
                ? "radial-gradient(ellipse at 50% 55%, rgba(243,237,227,0.16) 0%, transparent 68%)"
                : "radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0.28) 0%, transparent 68%)",
          }}
        />
        <div
          aria-hidden
          className={cn(
            "absolute left-1/2 h-10 w-[55%] -translate-x-1/2 rounded-[50%]",
            jar ? "bottom-[14%]" : "bottom-[10%]",
          )}
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(30,16,12,0.42), transparent 72%)",
          }}
        />
        <div className={cn("absolute", frame[product.aspect])}>
          <Image
            src={product.image}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 92vw, 46vw"
            className="object-contain drop-shadow-[0_22px_36px_rgba(30,16,12,0.38)]"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3" role="tablist" aria-label="Views">
        {fields.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active === index}
            onClick={() => setActive(index)}
            className={cn(
              "relative aspect-square overflow-hidden",
              item.bg,
              active === index ? "ring-1 ring-brass ring-offset-2 ring-offset-ivory" : "opacity-80",
            )}
          >
            <span className="absolute inset-[12%]">
              <Image
                src={product.image}
                alt=""
                fill
                sizes="120px"
                className="object-contain"
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
