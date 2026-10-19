"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Boxes, FolderKanban, LayoutDashboard, PackageCheck, Plus, Search, Settings, ShoppingBag, Store, Users, X } from "lucide-react";

const commands = [
  ["Vue d’ensemble", "/admin", LayoutDashboard],
  ["Commandes", "/admin/orders", ShoppingBag],
  ["Produits", "/admin/products", Boxes],
  ["Nouveau produit", "/admin/products/new", Plus],
  ["Collections", "/admin/collections", FolderKanban],
  ["Clients", "/admin/customers", Users],
  ["Stock", "/admin/inventory", PackageCheck],
  ["Paramètres", "/admin/settings", Settings],
  ["Voir la boutique", "/fr", Store],
] as const;

export function AdminCommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const matches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("fr");
    if (!needle) return commands;
    return commands.filter(([label]) => label.toLocaleLowerCase("fr").includes(needle));
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-[#201916]/35 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Palette de commandes"
            className="w-full max-w-xl border border-[#cfc4b4] bg-[#faf7f1] shadow-2xl"
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[#ddd4c8] px-4">
              <Search className="size-4 text-[#8c7e72]" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Aller à une page du bureau…"
                className="h-14 flex-1 bg-transparent text-sm outline-none"
              />
              <button type="button" onClick={() => onOpenChange(false)} aria-label="Fermer">
                <X className="size-4" />
              </button>
            </div>
            <div className="p-2">
              <p className="admin-label px-3 py-2 text-[#9b8d80]">Raccourcis</p>
              {matches.length === 0 ? (
                <p className="px-3 py-4 text-sm text-[#7d7368]">Aucun raccourci pour « {query} ».</p>
              ) : (
                matches.map(([label, href, Icon]) => {
                  const Item = Icon as ComponentType<{ className?: string; strokeWidth?: number }>;
                  return (
                    <Link
                      key={href}
                      href={href}
                      prefetch
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-[#eee7dc]"
                    >
                      <Item className="size-4" strokeWidth={1.4} />
                      {label}
                    </Link>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
