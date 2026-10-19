import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Search } from "lucide-react";

import { cn } from "@/lib/utils";

export function AdminMedia({ src, alt = "", className }: { src?: string | null; alt?: string; className?: string }) {
  if (!src) return null;
  const local = src.startsWith("/") && !src.startsWith("//");
  if (local) {
    return <Image src={src} alt={alt} fill sizes="(max-width:768px) 90vw, 320px" className={className} />;
  }
  return (
    // Remote, blob, and storage URLs skip the image optimizer so any pasted link still previews.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={cn("absolute inset-0 h-full w-full", className)} />
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
    <div>{eyebrow && <p className="admin-label text-[#9a7a50]">{eyebrow}</p>}<h1 className="admin-serif mt-2 text-[2.25rem] font-medium leading-tight tracking-[-0.025em] text-[#173326] sm:text-[2.8rem]">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#706b61]">{description}</p>}</div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </header>;
}

export function AdminButton({ children, variant = "primary", className }: { children: ReactNode; variant?: "primary" | "secondary" | "quiet"; className?: string }) {
  return <button className={cn("admin-label inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-4 transition-colors", variant === "primary" && "border-[#173d2c] bg-[#173d2c] text-[#f3e3d0] hover:bg-[#102d20]", variant === "secondary" && "border-[#d8c8b5] bg-[#fffaf2] text-[#254435] hover:border-[#aa8a61]", variant === "quiet" && "border-transparent text-[#53665b] hover:bg-[#f3eadf]", className)}>{children}</button>;
}

export function MetricCard({ label, value, change, note, accent = "wine" }: { label: string; value: string; change?: string; note?: string; accent?: "wine" | "forest" | "gold" | "ink" }) {
  const positive = (change ?? "").startsWith("+");
  const negative = (change ?? "").startsWith("-");
  const tones = { wine: "from-[#214936] to-[#143426] text-[#f7ead9]", forest: "from-[#2e5842] to-[#1b3f2e] text-[#f7ead9]", gold: "from-[#d9c09b] to-[#b99768] text-[#173326]", ink: "from-[#18382a] to-[#0c2419] text-[#f7ead9]" };
  return <article className={cn("relative isolate overflow-hidden rounded-[1.35rem] border border-black/5 bg-gradient-to-br p-5 shadow-[0_14px_36px_rgba(49,35,25,0.13)]", tones[accent])}>
    <span className="absolute -end-8 -top-10 -z-10 size-32 rounded-full border border-white/10 bg-white/[0.04]" />
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] opacity-70">{label}</p>
    <p className="admin-serif mt-5 whitespace-nowrap text-[clamp(1.85rem,2.7vw,2.7rem)] font-medium leading-none tracking-[-0.025em]">{value}</p>
    <p className={cn("mt-5 flex items-center gap-1.5 text-xs font-medium", accent === "gold" ? "text-[#3f2d22]/70" : "text-white/65")}>
      {change ? <>{positive ? <ArrowUpRight className="size-3.5" /> : negative ? <ArrowDownRight className="size-3.5" /> : null}{change}</> : null}
      <span className={change ? "hidden sm:inline" : ""}>{note ?? (change ? "depuis la période précédente" : "Catalogue actuel")}</span>
    </p>
  </article>;
}

export function StatusBadge({ children }: { children: ReactNode }) {
  const value = String(children).toLowerCase();
  const tone = value.includes("livr") || value.includes("actif") || value.includes("sain") || value.includes("ligne") || value.includes("payée") ? "bg-[#e2ebe4] text-[#365c45]" : value.includes("rembours") || value.includes("rupture") ? "bg-[#eee1d7] text-[#7b493d]" : value.includes("faible") || value.includes("préparation") ? "bg-[#efe5d2] text-[#80643b]" : "bg-[#ece7de] text-[#625f56]";
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[0.62rem] font-medium tracking-[0.06em] uppercase", tone)}>{children}</span>;
}

export function SearchInput({ placeholder = "Rechercher" }: { placeholder?: string }) {
  return <label className="relative block min-w-[15rem]"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#9a8e84]" /><input className="h-11 w-full rounded-xl border border-[#dfdad4] bg-white ps-10 pe-3 text-sm outline-none transition focus:border-[#9a786b]" placeholder={placeholder} /></label>;
}

export function SectionTitle({ title, note, action }: { title: string; note?: string; action?: ReactNode }) {
  return <div className="flex items-end justify-between gap-4"><div><h2 className="admin-serif text-[1.3rem] font-medium tracking-[-0.01em] text-[#173326]">{title}</h2>{note && <p className="mt-1 text-xs text-[#7e756a]">{note}</p>}</div>{action}</div>;
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="admin-label border-b border-[#88735d]/40 pb-1 text-[#5d5045] transition-colors hover:text-[#241d19]">{children}</Link>;
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="border border-dashed border-[#cfc4b4] px-8 py-16 text-center"><p className="admin-serif text-2xl">{title}</p><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#80746b]">{body}</p></div>;
}
