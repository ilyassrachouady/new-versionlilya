"use client";

import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";

import { Emblem } from "@/components/brand/Emblem";
import { LocaleSwitcher } from "@/components/chrome/LocaleSwitcher";
import { CurrencySwitcher } from "@/components/chrome/CurrencySwitcher";
import { useChrome } from "@/components/chrome/chrome-context";
import { rituals } from "@/lib/content";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";

export function MobileMenu({
  open,
  onOpenChange,
  locale,
  dict,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: Locale;
  dict: Dictionary;
}) {
  const { setSearchOpen } = useChrome();
  const links = [
    { label: dict.nav.shop, path: "/shop" },
    { label: dict.nav.collections, path: "/collections" },
    { label: dict.nav.house, path: "/house" },
    { label: dict.nav.ingredients, path: "/ingredients" },
    { label: dict.nav.journal, path: "/journal" },
    { label: dict.nav.account, path: "/account" },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[60] bg-espresso/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="surface-grain fixed inset-y-0 start-0 z-[70] flex w-full max-w-[26rem] flex-col bg-forest text-cream"
                initial={{ x: locale === "ar" ? "100%" : "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: locale === "ar" ? "100%" : "-100%" }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  backgroundColor: "#1c3225",
                }}
              >
                <Dialog.Title className="sr-only">{dict.nav.menu}</Dialog.Title>
                <Dialog.Description className="sr-only">{dict.nav.openMenu}</Dialog.Description>
                <div className="relative z-10 flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5">
                  <div className="flex items-center gap-2.5">
                    <Emblem tone="auto" className="h-8 w-8" />
                    <span className="flex flex-col items-start leading-none">
                      <span className="font-display text-[0.45rem] tracking-[0.32em] text-cream/70 uppercase">
                        {site.nameParts.prefix}
                      </span>
                      <span className="font-display mt-0.5 text-[0.65rem] tracking-[0.14em] text-cream uppercase">
                        {site.nameParts.family}
                      </span>
                    </span>
                  </div>
                  <Dialog.Close className="label-xs py-2 text-cream/80 transition-opacity hover:opacity-100">
                    {dict.nav.close}
                  </Dialog.Close>
                </div>

                <nav className="relative z-10 flex flex-1 flex-col justify-center gap-0.5 px-5 sm:gap-1 sm:px-6">
                  {links.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.14 + index * 0.055,
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={href(link.path, locale)}
                        onClick={() => onOpenChange(false)}
                        className="block py-2.5 font-display text-[1.65rem] leading-none tracking-[-0.02em] text-cream transition-colors duration-500 hover:text-ivory sm:py-2 sm:text-[1.875rem]"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-cream/15 pt-5 sm:mt-8 sm:gap-x-6 sm:pt-6">
                    {rituals.map((ritual) => (
                      <Link
                        key={ritual.id}
                        href={href(`/collections/${ritual.id}`, locale)}
                        onClick={() => onOpenChange(false)}
                        className="label-xs text-cream/65 transition-colors hover:text-cream"
                      >
                        {ritual.title[locale]}
                      </Link>
                    ))}
                  </div>
                </nav>

                <div className="relative z-10 flex items-center justify-between gap-3 border-t border-cream/15 px-5 py-4 sm:gap-4 sm:px-6 sm:py-5">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      setSearchOpen(true);
                    }}
                    className="label-xs text-cream/80"
                  >
                    {dict.nav.search}
                  </button>
                  <LocaleSwitcher locale={locale} tone="light" />
                  <CurrencySwitcher tone="light" />
                </div>
                <p className="relative z-10 px-5 pb-5 text-[0.5625rem] tracking-[0.2em] text-cream/45 uppercase sm:px-6 sm:pb-6">
                  {site.tagline}
                </p>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
