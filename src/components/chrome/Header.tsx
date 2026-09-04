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
    { label: dict.nav.house, path: "/house" },
  ];

  return (
    <>
      <header
        data-solid={!light}
        className="fixed inset-x-0 top-0 z-50"
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:bg-espresso focus:px-4 focus:py-2 focus:text-[0.6875rem] focus:tracking-[0.2em] focus:text-ivory focus:uppercase"
        >
          {dict.nav.skip}
        </a>

        <p className="flex h-[var(--announce-h)] items-center justify-center bg-forest px-4 text-center text-[0.5625rem] font-medium tracking-[0.22em] text-cream uppercase sm:text-[0.625rem] sm:tracking-[0.28em]">
          {dict.announcement}
        </p>

        <div
          className={cn(
            "relative transition-[background-color,border-color,backdrop-filter] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            light
              ? "border-b border-transparent bg-transparent"
              : "border-b border-espresso/10 bg-ivory/92 backdrop-blur-md",
          )}
        >
          <div
            className={cn(
              "shell flex h-[var(--header-h)] items-center justify-between gap-4 transition-colors duration-[600ms]",
              light ? "text-ivory" : "text-espresso",
            )}
          >
            <nav aria-label="Primary" className="hidden flex-1 items-center gap-9 lg:flex">
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
              className="label-xs -ms-1 flex items-center gap-2.5 py-2 lg:hidden"
              aria-label={dict.nav.openMenu}
              aria-expanded={menuOpen}
            >
              <span aria-hidden className="flex flex-col gap-[5px]">
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-5 bg-current" />
              </span>
              <span className="hidden xs:inline">{dict.nav.menu}</span>
            </button>

            <Link
              href={href("/", locale)}
              className="group/mark flex shrink-0 items-center gap-2.5 lg:absolute lg:left-1/2 lg:-translate-x-1/2 rtl:lg:translate-x-1/2"
              aria-label={site.name}
            >
              <Emblem className="h-8 w-8 text-current opacity-95 transition-opacity duration-500 group-hover/mark:opacity-100 sm:h-9 sm:w-9" />
              <span className="flex flex-col items-start leading-none">
                <span className="font-display text-[0.55rem] tracking-[0.42em] uppercase opacity-75 sm:text-[0.6rem]">
                  {site.nameParts.prefix}
                </span>
                <span className="font-display mt-1 text-[0.72rem] tracking-[0.2em] uppercase sm:text-[0.8rem]">
                  {site.nameParts.family}
                </span>
              </span>
            </Link>

            <div className="flex flex-1 items-center justify-end gap-5 sm:gap-7">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="label-xs hidden py-2 transition-opacity duration-500 hover:opacity-65 sm:block"
              >
                {dict.nav.search}
              </button>
              <Link
                href={href("/account", locale)}
                className="label-xs hidden py-2 transition-opacity duration-500 hover:opacity-65 md:block"
              >
                {dict.nav.account}
              </Link>
              <button
                type="button"
                onClick={openCart}
                className="label-xs flex items-center gap-1.5 py-2 transition-opacity duration-500 hover:opacity-65"
                aria-label={`${dict.nav.bag} (${hydrated ? count : 0})`}
              >
                {dict.nav.bag}
                <span
                  className="tabular inline-flex min-w-[1.05rem] justify-center"
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
                className="absolute inset-x-0 bottom-0 block h-px origin-center bg-brass/30"
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
