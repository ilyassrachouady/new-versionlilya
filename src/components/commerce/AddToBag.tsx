"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { useStore } from "@/components/commerce/store";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function AddToBag({
  slug,
  dict,
  size = "lg",
  className,
}: {
  slug: string;
  dict: Dictionary;
  size?: "md" | "lg";
  className?: string;
}) {
  const { add } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [state, setState] = useState<"idle" | "added">("idle");

  function onAdd() {
    add(slug, quantity);
    setState("added");
    window.setTimeout(() => setState("idle"), 1600);
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-4">
        <p className="label-xs text-ink-faint">{dict.product.quantity}</p>
        <div className="flex items-center border border-espresso/20">
          <button
            type="button"
            onClick={() => setQuantity((n) => Math.max(1, n - 1))}
            aria-label={dict.cart.decrease}
            className="flex size-11 items-center justify-center text-ink-muted transition-colors hover:text-espresso"
          >
            −
          </button>
          <span className="tabular w-8 text-center text-[0.875rem] text-espresso">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((n) => n + 1)}
            aria-label={dict.cart.increase}
            className="flex size-11 items-center justify-center text-ink-muted transition-colors hover:text-espresso"
          >
            +
          </button>
        </div>
      </div>
      <Button
        type="button"
        size={size}
        className="w-full"
        onClick={onAdd}
        aria-live="polite"
      >
        {state === "added" ? dict.product.added : dict.product.addToBag}
      </Button>
    </div>
  );
}
