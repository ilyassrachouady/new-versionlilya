"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type BrassRuleProps = {
  className?: string;
  /** `full` spans its container; `short` is the section-header flourish. */
  width?: "full" | "short";
  tone?: "brass" | "ivory";
};

/**
 * The house's one recurring flourish. A brass hairline with a lozenge at its
 * centre that draws itself open as each section arrives. Used sparingly — it
 * is the thing meant to be remembered, so it must not be everywhere.
 */
export function BrassRule({ className, width = "full", tone = "brass" }: BrassRuleProps) {
  const reduced = useReducedMotion();
  const color = tone === "brass" ? "text-brass" : "text-ivory/50";

  return (
    <motion.div
      aria-hidden
      className={cn(
        "relative flex items-center",
        width === "short" ? "w-24" : "w-full",
        color,
        className,
      )}
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "shown"}
      viewport={{ once: true, margin: "-10%" }}
    >
      <motion.span
        className="h-px flex-1 origin-right bg-current opacity-45"
        variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="mx-1.5 block size-[3px] rotate-45 bg-current"
        variants={{ hidden: { opacity: 0, scale: 0 }, shown: { opacity: 1, scale: 1 } }}
        transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="h-px flex-1 origin-left bg-current opacity-45"
        variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}
