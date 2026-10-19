"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SubmitButton({ children, danger = false, className, pendingLabel = "Enregistrement…" }: { children: ReactNode; danger?: boolean; className?: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={cn("admin-label inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-4 transition disabled:cursor-wait disabled:opacity-55", danger ? "border-[#cda79f] bg-[#fffaf2] text-[#8d5048] hover:bg-[#f5e8e5]" : "border-[#173d2c] bg-[#173d2c] text-[#f3e3d0] hover:bg-[#102d20]", className)}>{pending ? pendingLabel : children}</button>;
}
