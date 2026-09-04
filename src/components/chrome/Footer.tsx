import Link from "next/link";

import { Emblem } from "@/components/brand/Emblem";
import { CurrencySwitcher } from "@/components/chrome/CurrencySwitcher";
import { LocaleSwitcher } from "@/components/chrome/LocaleSwitcher";
import { Wordmark } from "@/components/brand/Wordmark";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const columns = [
    {
      title: dict.footer.shop,
      links: [
        { label: dict.footer.links.allProducts, path: "/shop" },
        { label: dict.footer.links.hair, path: "/collections/hair" },
        { label: dict.footer.links.body, path: "/collections/body" },
        { label: dict.footer.links.hammam, path: "/collections/hammam" },
        { label: dict.footer.links.scent, path: "/collections/scent" },
      ],
    },
    {
      title: dict.footer.house,
      links: [
        { label: dict.footer.links.about, path: "/house" },
        { label: dict.footer.links.collection, path: "/collections" },
        { label: dict.footer.links.ingredients, path: "/ingredients" },
        { label: dict.footer.links.journal, path: "/journal" },
      ],
    },
    {
      title: dict.footer.care,
      links: [
        { label: dict.footer.links.contact, path: "/house#contact" },
        { label: dict.footer.links.faq, path: "/house#faq" },
        { label: dict.footer.links.shipping, path: "/house#shipping" },
        { label: dict.footer.links.returns, path: "/house#returns" },
      ],
    },
  ];

  return (
    <footer className="surface-grain relative overflow-hidden bg-forest text-cream">
      <div className="relative z-10">
        <div className="shell pt-14 pb-10 sm:pt-20 sm:pb-12">
          <div className="flex flex-col items-center gap-5 text-center sm:gap-6">
            <Emblem tone="auto" className="h-14 w-14 sm:h-16 sm:w-16" />
            <Wordmark size="lg" className="text-cream sm:hidden" />
            <Wordmark size="xl" className="hidden text-cream sm:flex" />
            <p className="eyebrow text-cream/65">{dict.footer.tagline}</p>
            <p className="label-xs text-cream/45">{site.tagline}</p>
          </div>

          <div className="mt-12 grid gap-8 border-t border-cream/15 pt-10 sm:mt-16 sm:grid-cols-2 sm:gap-10 sm:pt-12 lg:grid-cols-4 lg:gap-8">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="label-xs text-cream/55">{column.title}</h2>
                <ul className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
                  {column.links.map((link) => (
                    <li key={link.path + link.label}>
                      <Link
                        href={href(link.path, locale)}
                        className="text-[0.875rem] text-cream/70 transition-colors duration-500 hover:text-cream"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="label-xs text-cream/55">{dict.footer.language}</h2>
              <LocaleSwitcher locale={locale} tone="light" className="mt-4 gap-4 sm:mt-5" />
              <h2 className="label-xs mt-7 text-cream/55 sm:mt-8">{dict.footer.currency}</h2>
              <CurrencySwitcher tone="light" className="mt-4" />
              <a
                href={`mailto:${site.email}`}
                className="mt-7 block text-[0.875rem] text-cream/70 transition-colors duration-500 hover:text-cream sm:mt-8"
              >
                {site.email}
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/15 pt-7 sm:mt-14 sm:flex-row sm:gap-4 sm:pt-8">
            <p className="label-xs text-center text-cream/40 sm:text-start">
              © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
            </p>
            <p className="label-xs text-cream/40">{dict.footer.madeIn}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
