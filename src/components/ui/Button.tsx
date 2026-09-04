import type { ComponentProps } from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const button = cva(
  "group/btn relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-sans uppercase transition-[color,background-color,border-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        solid: "bg-burgundy text-ivory hover:bg-espresso",
        ivory: "bg-ivory text-espresso hover:bg-white",
        outline: "border border-espresso/30 text-espresso hover:border-espresso hover:bg-espresso hover:text-ivory",
        outlineLight:
          "border border-ivory/35 text-ivory hover:border-ivory hover:bg-ivory hover:text-espresso",
        ghost: "text-espresso hover:text-burgundy",
        ghostLight: "text-ivory/80 hover:text-ivory",
      },
      size: {
        sm: "h-9 px-4 text-[0.625rem] tracking-[0.2em]",
        md: "h-12 px-7 text-[0.6875rem] tracking-[0.22em]",
        lg: "h-14 px-9 text-[0.75rem] tracking-[0.24em]",
        link: "h-auto p-0 text-[0.6875rem] tracking-[0.22em]",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof button> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(button({ variant, size }), className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof button>;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(button({ variant, size }), className)} {...props} />;
}

/**
 * The house's text link: a brass hairline that grows in from the leading edge
 * on hover. Reads as an underline, behaves like a drawn rule.
 */
export function QuietLink({
  className,
  tone = "dark",
  children,
  ...props
}: ComponentProps<typeof Link> & { tone?: "dark" | "light" }) {
  return (
    <Link
      className={cn(
        "group/quiet relative inline-flex items-center gap-2 pb-1 font-sans text-[0.6875rem] tracking-[0.22em] uppercase transition-colors duration-500",
        tone === "dark" ? "text-espresso hover:text-burgundy" : "text-ivory/85 hover:text-ivory",
        className,
      )}
      {...props}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-0 -bottom-1 h-px origin-[var(--rule-origin,left)] scale-x-0 transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/quiet:scale-x-100 group-focus-visible/quiet:scale-x-100",
            tone === "dark" ? "bg-brass" : "bg-ivory/70",
          )}
        />
      </span>
    </Link>
  );
}
