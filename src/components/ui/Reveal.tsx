"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** `rise` for text blocks, `mask` for imagery, `fade` for everything else. */
  variant?: "rise" | "fade" | "mask";
  as?: "div" | "section" | "li" | "article" | "header" | "figure";
};

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    return <Component className={className}>{children}</Component>;
  }

  if (variant === "mask") {
    return (
      <Component
        className={className}
        initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0.4 }}
        whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: variant === "rise" ? 18 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
