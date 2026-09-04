import Link from "next/link";

import { Emblem } from "@/components/brand/Emblem";
import { CurrencySwitcher } from "@/components/chrome/CurrencySwitcher";
import { LocaleSwitcher } from "@/components/chrome/LocaleSwitcher";
import { OrnamentBand } from "@/components/brand/Ornament";
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
    <footer className="surface-grain relative overflow-hidden bg-espresso text-ivory">
      <div
        aria-hidden
        className="absolute inset-0 opacity-45"
        style={{ backgroundImage: "url(/textures/plaster-espresso.jpg)", backgroundSize: "cover" }}
      />

      <div className="relative z-10">
        <OrnamentBand className="text-brass" />

        <div className="shell pt-16 pb-10 sm:pt-24">
          <div className="flex flex-col items-center gap-6 text-center">
            <Emblem className="h-12 w-12 text-cream" />
            <Wordmark size="xl" className="text-cream" />
            <p className="eyebrow text-cream/70">{dict.footer.tagline}</p>
          </div>

          <div className="mt-16 grid gap-10 border-t border-ivory/12 pt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="label-xs text-brass-light">{column.title}</h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.path + link.label}>
                      <Link
                        href={href(link.path, locale)}
                        className="text-[0.875rem] text-ivory/70 transition-colors duration-500 hover:text-ivory"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="label-xs text-brass-light">{dict.footer.language}</h2>
              <LocaleSwitcher locale={locale} tone="light" className="mt-5 gap-4" />
              <h2 className="label-xs mt-8 text-brass-light">{dict.footer.currency}</h2>
              <CurrencySwitcher tone="light" className="mt-4" />
              <a
                href={`mailto:${site.email}`}
                className="mt-8 block text-[0.875rem] text-ivory/70 transition-colors duration-500 hover:text-ivory"
              >
                {site.email}
              </a>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-ivory/12 pt-8 sm:flex-row">
            <p className="label-xs text-ivory/40">
              © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
            </p>
            <p className="label-xs text-ivory/40">{dict.footer.madeIn}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
