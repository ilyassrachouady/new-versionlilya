"use client";

import Image from "next/image";
import Link from "next/link";

import { CurrencySwitcher } from "@/components/chrome/CurrencySwitcher";
import { LocaleSwitcher } from "@/components/chrome/LocaleSwitcher";
import { Price } from "@/components/commerce/Price";
import { useStore } from "@/components/commerce/store";
import { PageFrame } from "@/components/layout/PageFrame";
import { ButtonLink } from "@/components/ui/Button";
import { Emblem } from "@/components/brand/Emblem";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function AccountView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { wished, hydrated, toggleWish } = useStore();

  return (
    <PageFrame>
      <section className="surface-grain bg-ivory py-16 sm:py-24">
        <div className="shell max-w-4xl">
          <p className="eyebrow text-brass-deep">{dict.account.eyebrow}</p>
          <h1 className="display-xl mt-5 text-espresso">{dict.account.title}</h1>
          <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-pretty text-ink-muted">
            {dict.account.body}
          </p>
          <p className="mt-4 text-[0.85rem] text-ink-faint">{dict.account.note}</p>

          <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-brass/25 pt-8">
            <div>
              <p className="label-xs text-ink-faint">{dict.footer.language}</p>
              <LocaleSwitcher locale={locale} className="mt-3" />
            </div>
            <div>
              <p className="label-xs text-ink-faint">{dict.footer.currency}</p>
              <CurrencySwitcher className="mt-3" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eae1d2] py-16 sm:py-24">
        <div className="shell">
          <h2 className="display-lg text-espresso">{dict.wishlist.title}</h2>
          {!hydrated ? (
            <p className="mt-8 text-ink-muted">{dict.common.loading}</p>
          ) : wished.length === 0 ? (
            <div className="mt-12 flex flex-col items-start gap-6">
              <Emblem tone="dark" className="h-10 w-10 opacity-40" />
              <div>
                <p className="display-md text-espresso">{dict.wishlist.empty}</p>
                <p className="mt-3 max-w-md text-ink-muted">{dict.wishlist.emptyBody}</p>
              </div>
              <ButtonLink href={href("/shop", locale)} variant="outline">
                {dict.wishlist.cta}
              </ButtonLink>
            </div>
          ) : (
            <ul className="mt-10 divide-y divide-espresso/10">
              {wished.map((product) => (
                <li key={product.slug} className="flex items-center gap-5 py-5">
                  <Link
                    href={href(`/products/${product.slug}`, locale)}
                    className="relative flex h-24 w-16 shrink-0 items-end justify-center bg-ivory pb-2"
                  >
                    <Image
                      src={product.image}
                      alt=""
                      width={product.imageWidth}
                      height={product.imageHeight}
                      sizes="64px"
                      className="max-h-[85%] w-auto object-contain"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={href(`/products/${product.slug}`, locale)}
                      className="font-display text-[1.2rem] text-espresso hover:text-burgundy"
                    >
                      {product.name[locale]}
                    </Link>
                    <p className="label-xs mt-1 text-ink-faint">
                      {product.scent} · {product.size}
                    </p>
                  </div>
                  <Price
                    amountMAD={product.priceMAD}
                    locale={locale}
                    className="text-[0.875rem] text-espresso"
                  />
                  <button
                    type="button"
                    onClick={() => toggleWish(product.slug)}
                    className="label-xs text-ink-faint hover:text-burgundy"
                  >
                    {dict.cart.remove}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PageFrame>
  );
}
