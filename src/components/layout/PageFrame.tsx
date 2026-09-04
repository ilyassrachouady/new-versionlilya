import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Clears the fixed announcement + header on every inner page of the house. */
export function PageFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("pt-[var(--chrome-h)]", className)}>{children}</div>;
}
