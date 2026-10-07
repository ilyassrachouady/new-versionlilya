"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Emblem } from "@/components/brand/Emblem";
import { MobileMenu } from "@/components/chrome/MobileMenu";
import { useChrome } from "@/components/chrome/chrome-context";
import { useStore } from "@/components/commerce/store";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { overlay, setSearchOpen } = useChrome();
  const { count, openCart, hydrated } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const light = overlay && !scrolled;

  const primary = [
    { label: dict.nav.shop, path: "/shop" },
    { label: dict.nav.collections, path: "/collections" },
    { label: locale === "ar" ? "التوقيعات" : "Signatures", path: "/signature-collections" },
    { label: dict.nav.house, path: "/house" },
  ];

  return (
    <>
      <header data-solid={!light} className="fixed inset-x-0 top-0 z-50">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:bg-forest focus:px-4 focus:py-2 focus:text-[0.6875rem] focus:tracking-[0.2em] focus:text-cream focus:uppercase"
        >
          {dict.nav.skip}
        </a>

        <p className="flex min-h-[var(--announce-h)] items-center justify-center bg-forest px-3 py-1.5 text-center text-[0.5rem] font-medium tracking-[0.18em] text-cream uppercase sm:px-4 sm:text-[0.625rem] sm:tracking-[0.28em]">
          {dict.announcement}
        </p>

        <div
          className={cn(
            "relative transition-[background-color,border-color,backdrop-filter] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            light
              ? "border-b border-transparent bg-transparent"
              : "border-b border-forest/10 bg-ivory/94 backdrop-blur-md",
          )}
        >
          <div
            className={cn(
              "shell relative flex h-[var(--header-h)] items-center justify-between gap-2 transition-colors duration-[600ms] sm:gap-4",
              light ? "text-cream" : "text-forest",
            )}
          >
            {/* Leading: menu (mobile) / nav (desktop) */}
            <div className="flex min-w-[3.25rem] flex-1 items-center justify-start lg:min-w-0">
              <nav aria-label="Primary" className="hidden items-center gap-2 lg:flex xl:gap-6">
                {primary.map((item) => (
                  <NavLink
                    key={item.path}
                    href={href(item.path, locale)}
                    active={pathname.startsWith(href(item.path, locale))}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="label-xs -ms-1 flex items-center gap-2 py-2 lg:hidden"
                aria-label={dict.nav.openMenu}
                aria-expanded={menuOpen}
              >
                <span aria-hidden className="flex flex-col gap-[5px]">
                  <span className="block h-px w-5 bg-current" />
                  <span className="block h-px w-5 bg-current" />
                </span>
              </button>
            </div>

            {/* Brand — always centered */}
            <Link
              href={href("/", locale)}
              className="group/mark absolute left-1/2 flex -translate-x-1/2 items-center gap-2 rtl:translate-x-1/2 sm:gap-2.5"
              aria-label={site.name}
            >
              <Emblem
                tone={light ? "auto" : "dark"}
                className="h-7 w-7 sm:h-8 sm:w-8"
              />
              <span className="flex flex-col items-start leading-none">
                <span className="font-display text-[0.45rem] tracking-[0.32em] uppercase opacity-70 sm:text-[0.55rem] sm:tracking-[0.42em]">
                  {site.nameParts.prefix}
                </span>
                <span className="font-display mt-0.5 text-[0.625rem] tracking-[0.12em] uppercase sm:mt-1 sm:text-[0.78rem] sm:tracking-[0.18em]">
                  {site.nameParts.family}
                </span>
              </span>
            </Link>

            {/* Trailing actions */}
            <div className="flex min-w-[3.25rem] flex-1 items-center justify-end gap-3 sm:gap-6 lg:min-w-0 lg:gap-7">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="label-xs hidden py-2 transition-opacity duration-500 hover:opacity-65 md:block"
              >
                {dict.nav.search}
              </button>
              <Link
                href={href("/account", locale)}
                className="label-xs hidden py-2 transition-opacity duration-500 hover:opacity-65 lg:block"
              >
                {dict.nav.account}
              </Link>
              <button
                type="button"
                onClick={openCart}
                className="label-xs flex items-center gap-1 py-2 transition-opacity duration-500 hover:opacity-65"
                aria-label={`${dict.nav.bag} (${hydrated ? count : 0})`}
              >
                <span className="max-w-[4.5rem] truncate sm:max-w-none">{dict.nav.bag}</span>
                <span
                  className="tabular inline-flex min-w-[1rem] justify-center"
                  suppressHydrationWarning
                >
                  ({hydrated ? count : 0})
                </span>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {!light && (
              <motion.span
                aria-hidden
                className="absolute inset-x-0 bottom-0 block h-px origin-center bg-forest/20"
                initial={reduced ? undefined : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={reduced ? undefined : { scaleX: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </AnimatePresence>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        locale={locale}
        dict={dict}
      />
    </>
  );
}

function NavLink({
  href: to,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={to} className="group/nav relative py-2">
      <span className="label-xs">{children}</span>
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 h-px origin-[var(--rule-origin)] bg-current transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          active ? "scale-x-100 opacity-60" : "scale-x-0 opacity-60 group-hover/nav:scale-x-100",
        )}
      />
    </Link>
  );
}
