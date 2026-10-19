"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, ViewTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Boxes, Command, FolderKanban, LayoutDashboard, Menu, PackageCheck, Search, Settings, ShoppingBag, Users } from "lucide-react";

import { signOutAdmin } from "@/app/admin/login/actions";
import { PrefetchRoutes } from "@/components/chrome/PrefetchRoutes";
import { RouteProgress } from "@/components/chrome/RouteProgress";
import { Emblem } from "@/components/brand/Emblem";
import { AdminCommandPalette } from "@/components/dashboard/AdminCommandPalette";
import type { AdminProfile } from "@/lib/admin-types";
import { cn } from "@/lib/utils";

const nav = [
  ["Vue d’ensemble", "/admin", LayoutDashboard],
  ["Commandes", "/admin/orders", ShoppingBag],
  ["Produits", "/admin/products", Boxes],
  ["Collections", "/admin/collections", FolderKanban],
  ["Clients", "/admin/customers", Users],
  ["Stock", "/admin/inventory", PackageCheck],
] as const;

const warm = [
  "/admin",
  "/admin/orders",
  "/admin/products",
  "/admin/products/new",
  "/admin/collections",
  "/admin/customers",
  "/admin/inventory",
  "/admin/settings",
] as const;

const roleLabel = { owner: "Propriétaire", admin: "Administrateur" } as const;

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "L") + (parts[1]?.[0] ?? "Z")).toUpperCase();
}

export function DashboardShell({ children, admin }: { children: React.ReactNode; admin: AdminProfile }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen((open) => !open); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sidebar = <>
    <div className="flex h-[5.25rem] items-center gap-3 border-b border-white/10 px-6">
      <span className="flex size-10 items-center justify-center rounded-xl border border-[#dcc8ae]/50 bg-[#ead9c5] shadow-[0_10px_30px_rgba(0,0,0,.18)]"><Emblem tone="dark" className="size-7" /></span><div><p className="admin-serif text-[0.95rem] leading-none tracking-[0.08em] text-[#f4e2cf]">MAISON</p><p className="admin-serif mt-1 text-[0.78rem] leading-none tracking-[0.14em] text-[#d9b992]">LILYA ZAHRA</p></div>
    </div>
    <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Navigation de l’administration">
      <p className="admin-label px-3 pb-3 text-[#927f70]">Gestion essentielle</p>
      {nav.map(([label, href, Icon]) => { const active = href === "/admin" ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} prefetch onClick={() => setMobileOpen(false)} className={cn("group mb-1.5 flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-[0.82rem] text-[#c9c4b9] transition-all hover:bg-white/[0.07] hover:text-white", active && "bg-[#ead9c5] font-semibold text-[#173326] shadow-[0_8px_24px_rgba(0,0,0,.16)] hover:bg-[#ead9c5] hover:text-[#173326]")}><Icon className="size-[1.05rem]" strokeWidth={1.8} /><span>{label}</span></Link>; })}
    </nav>
    <div className="border-t border-white/10 p-3">
      <Link href="/admin/settings" prefetch className="flex min-h-10 items-center gap-3 px-3 text-[0.8rem] text-[#bcb0a5] hover:text-white"><Settings className="size-[1.05rem]" strokeWidth={1.45} />Paramètres</Link>
      <form action={signOutAdmin} className="mt-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-[#b58b56] text-xs font-semibold text-[#251712]">{initials(admin.fullName)}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium text-white">{admin.fullName}</span>
            <span className="block truncate text-[0.65rem] text-[#9f9185]">{roleLabel[admin.role]}</span>
          </span>
        </div>
        <button type="submit" className="admin-label mt-3 w-full py-2 text-start text-[#bcb0a5] hover:text-white">Quitter le bureau</button>
      </form>
    </div>
  </>;

  return <div className="admin-root min-h-dvh bg-[#f4efe7] text-[#25372e]">
    <PrefetchRoutes hrefs={warm} />
    <RouteProgress />
    <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 border-e border-[#315442] bg-[#112d21] lg:flex lg:flex-col" style={{ viewTransitionName: "admin-sidebar" }}>{sidebar}</aside>
    <AnimatePresence>{mobileOpen && <><motion.button aria-label="Fermer la navigation" className="fixed inset-0 z-40 bg-[#0d261b]/45 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} /><motion.aside className="fixed inset-y-0 start-0 z-50 flex w-[18rem] flex-col bg-[#112d21] lg:hidden" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: .35, ease: [0.22,1,.36,1] }}>{sidebar}</motion.aside></>}</AnimatePresence>
    <div className="lg:ps-64">
      <header className="sticky top-0 z-30 flex h-[5.25rem] items-center gap-2 border-b border-[#d9cdbf] bg-[#fbf7f0] px-4 sm:gap-4 sm:px-7 lg:px-8" style={{ viewTransitionName: "admin-header" }}>
        <button onClick={() => setMobileOpen(true)} className="flex size-10 items-center justify-center lg:hidden" aria-label="Ouvrir la navigation"><Menu className="size-5" /></button>
        <button onClick={() => setCommandOpen(true)} className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#e5e0db] bg-[#f8f8f6] text-xs text-[#8e8175] transition hover:border-[#cfc7c0] sm:h-11 sm:w-auto sm:max-w-xl sm:flex-1 sm:justify-start sm:gap-3 sm:px-4 sm:text-start"><Search className="size-4" /><span className="hidden truncate sm:inline">Aller à une page du bureau…</span><span className="ms-auto hidden items-center gap-1 rounded-md border border-[#ddd7d1] bg-white px-1.5 py-1 text-[0.6rem] sm:flex"><Command className="size-2.5" />K</span></button>
        <div className="ms-auto hidden items-center gap-3 sm:flex"><span className="size-2 rounded-full bg-[#74866f]" /><span className="admin-label text-[#75695f]">Boutique en ligne</span></div>
        <Link href="/fr" className="admin-label ms-auto border-s border-[#d8cfc1] ps-3 text-[#62564c] sm:ms-0 sm:ps-4">Voir la boutique</Link>
      </header>
      <main className="mx-auto max-w-[94rem] px-4 py-7 sm:px-7 sm:py-9 lg:px-9 xl:px-12">
        <ViewTransition>{children}</ViewTransition>
      </main>
    </div>
    <AdminCommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
  </div>;
}
