"use client";

import { cn } from "@/lib/utils";

export function CurrencySwitcher({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span className={cn("label-xs inline-flex min-h-11 items-center", tone === "dark" ? "text-espresso" : "text-ivory", className)}>EUR · €</span>
  );
}
