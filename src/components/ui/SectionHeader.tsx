import type { ReactNode } from "react";

import { BrassRule } from "@/components/brand/BrassRule";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "start" | "center";
  tone?: "dark" | "light";
  className?: string;
  action?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  body,
  align = "start",
  tone = "dark",
  className,
  action,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        centered && "items-center text-center",
        className,
      )}
    >
      <Reveal className={cn("flex items-center gap-4", centered && "flex-col gap-3")}>
        <span
          className={cn(
            "eyebrow",
            tone === "dark" ? "text-brass-deep" : "text-brass-light",
          )}
        >
          {eyebrow}
        </span>
        <BrassRule
          width="short"
          tone={tone === "dark" ? "brass" : "ivory"}
          className={centered ? "w-16" : "w-16"}
        />
      </Reveal>

      <div
        className={cn(
          "flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12",
          centered && "md:flex-col md:items-center",
        )}
      >
        <Reveal delay={0.05} className={cn("max-w-3xl", centered && "mx-auto")}>
          <h2
            className={cn(
              "display-xl text-balance",
              tone === "dark" ? "text-espresso" : "text-ivory",
            )}
          >
            {title}
          </h2>
          {body && (
            <p
              className={cn(
                "mt-5 max-w-xl text-[0.95rem] leading-relaxed text-pretty",
                centered && "mx-auto",
                tone === "dark" ? "text-ink-muted" : "text-ink-invert-muted",
              )}
            >
              {body}
            </p>
          )}
        </Reveal>
        {action && (
          <Reveal delay={0.1} className="shrink-0">
            {action}
          </Reveal>
        )}
      </div>
    </div>
  );
}
