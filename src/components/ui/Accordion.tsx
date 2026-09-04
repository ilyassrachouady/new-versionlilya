"use client";

import type { ReactNode } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";

export function Accordion({
  items,
  defaultValue,
  tone = "dark",
}: {
  items: { id: string; title: string; body: ReactNode }[];
  defaultValue?: string[];
  tone?: "dark" | "light";
}) {
  return (
    <AccordionPrimitive.Root type="multiple" defaultValue={defaultValue} className="w-full">
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={item.id}
          className={cn(
            "border-b",
            tone === "dark" ? "border-espresso/12" : "border-ivory/15",
          )}
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger
              className={cn(
                "group flex w-full items-center justify-between gap-6 py-5 text-start",
                tone === "dark" ? "text-espresso" : "text-ivory",
              )}
            >
              <span className="label-xs">{item.title}</span>
              <span
                aria-hidden
                className={cn(
                  "relative size-4 shrink-0",
                  tone === "dark" ? "text-brass" : "text-brass-light",
                )}
              >
                <span className="absolute top-1/2 start-0 h-px w-full -translate-y-1/2 bg-current" />
                <span className="absolute top-0 start-1/2 h-full w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:scale-y-0" />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-none">
            <div
              className={cn(
                "pb-6 text-[0.95rem] leading-relaxed text-pretty",
                tone === "dark" ? "text-ink-muted" : "text-ivory/70",
              )}
            >
              {item.body}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
