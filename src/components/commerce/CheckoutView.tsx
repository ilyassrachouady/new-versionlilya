"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { placeOrder, type PlaceOrderError } from "@/app/[locale]/checkout/actions";
import { Emblem } from "@/components/brand/Emblem";
import { Price } from "@/components/commerce/Price";
import { useStore } from "@/components/commerce/store";
import { PageFrame } from "@/components/layout/PageFrame";
import { Button, ButtonLink } from "@/components/ui/Button";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { formatPayableEUR, inyadPayment } from "@/lib/payment";
import { site } from "@/lib/site";

export function CheckoutView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { items, subtotalEUR, hydrated, currency, clear } = useStore();
  const overLimit = subtotalEUR > inyadPayment.maxEUR;
  const showConverted = hydrated && currency !== "EUR";
  const [error, setError] = useState<PlaceOrderError | null>(null);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<{ orderNumber: string; totalEUR: number; paymentUrl: string } | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    setPlacing(true);
    formData.set("lines", JSON.stringify(items.map(({ product, quantity }) => ({ slug: product.slug, quantity }))));
    const result = await placeOrder(formData);
    setPlacing(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    clear();
    setPlaced(result);
  }

  return (
    <PageFrame>
      <section className="surface-grain bg-ivory py-16 sm:py-24">
        <div className="shell max-w-3xl">
          <p className="eyebrow text-brass-deep">{dict.checkout.eyebrow}</p>
          <h1 className="display-xl mt-5 text-espresso">{dict.checkout.title}</h1>
          <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-pretty text-ink-muted">
            {dict.checkout.body}
          </p>

          {!hydrated ? (
            <p className="mt-12 text-ink-muted">{dict.common.loading}</p>
          ) : placed ? (
            <div className="mt-12 border-t border-brass/25 pt-8">
              <p className="label-xs text-ink-faint">{dict.checkout.orderNumber}</p>
              <p className="mt-2 font-display text-[2rem] text-espresso">{placed.orderNumber}</p>
              <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">{dict.checkout.placed}</p>
              <div className="mt-8 border border-brass/30 bg-ivory-300/40 px-6 py-7">
                <p className="label-xs text-ink-faint">{dict.checkout.amountLabel}</p>
                <p className="mt-3 font-display text-[2.4rem] leading-none text-espresso tabular">
                  {formatPayableEUR(placed.totalEUR)}
                </p>
                <p className="mt-4 text-[0.9rem] leading-relaxed text-ink-muted">{dict.checkout.amountHint}</p>
              </div>
              <div className="mt-8">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href={placed.paymentUrl}>{dict.checkout.pay}</a>
                </Button>
                <p className="mt-4 text-[0.75rem] leading-relaxed text-ink-faint">{dict.checkout.secure}</p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-14 flex flex-col items-start gap-6">
              <Emblem tone="dark" className="h-10 w-10 opacity-40" />
              <div>
                <p className="display-md text-espresso">{dict.checkout.emptyTitle}</p>
                <p className="mt-3 max-w-md text-ink-muted">{dict.checkout.emptyBody}</p>
              </div>
              <ButtonLink href={href("/shop", locale)} variant="outline">
                {dict.checkout.emptyCta}
              </ButtonLink>
            </div>
          ) : (
            <div className="mt-12 border-t border-brass/25 pt-8">
              <h2 className="label-xs text-ink-faint">{dict.checkout.summary}</h2>
              <ul className="mt-4 divide-y divide-espresso/10">
                {items.map(({ product, quantity }) => (
                  <li key={product.slug} className="flex items-center gap-5 py-5">
                    <Link
                      href={href(`/products/${product.slug}`, locale)}
                      className="relative flex h-24 w-16 shrink-0 items-end justify-center bg-ivory-300 pb-2"
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
                        className="font-display text-[1.2rem] leading-tight text-espresso hover:text-burgundy"
                      >
                        {product.name[locale]}
                      </Link>
                      <p className="label-xs mt-1.5 text-ink-faint">
                        {product.scent} · {product.size} · ×{quantity}
                      </p>
                    </div>
                    <Price
                      amountEUR={product.priceEUR * quantity}
                      locale={locale}
                      className="shrink-0 text-[0.8125rem] text-espresso"
                    />
                  </li>
                ))}
              </ul>

              <div className="mt-8 border border-brass/30 bg-ivory-300/40 px-6 py-7 sm:px-8">
                <p className="label-xs text-ink-faint">{dict.checkout.amountLabel}</p>
                <p className="mt-3 font-display text-[2.4rem] leading-none text-espresso tabular">
                  {formatPayableEUR(subtotalEUR)}
                </p>
                <p className="mt-4 max-w-md text-[0.9rem] leading-relaxed text-ink-muted">
                  {dict.checkout.amountHint}
                </p>
                {showConverted && (
                  <p className="mt-3 text-[0.85rem] text-ink-faint">
                    {dict.checkout.displayedAs}{" "}
                    <Price amountEUR={subtotalEUR} locale={locale} className="text-espresso" />
                  </p>
                )}
              </div>

              {!inyadPayment.url ? (
                <div className="mt-8 border-t border-brass/20 pt-6">
                  <p className="max-w-lg text-[0.95rem] leading-relaxed text-ink-muted">{dict.checkout.paymentUnavailable}</p>
                  <a href={`mailto:${site.email}`} className="label-xs mt-4 inline-flex min-h-11 items-center text-espresso underline underline-offset-4">{dict.checkout.write}</a>
                </div>
              ) : overLimit ? (
                <div className="mt-8">
                  <p className="max-w-lg text-[0.95rem] leading-relaxed text-burgundy">
                    {dict.checkout.overLimit}
                  </p>
                  <a
                    href={`mailto:${site.email}`}
                    className="label-xs mt-4 inline-block text-espresso underline decoration-brass underline-offset-4"
                  >
                    {dict.checkout.write}
                  </a>
                </div>
              ) : (
                <form action={onSubmit} className="mt-10 space-y-5">
                  <h2 className="label-xs text-ink-faint">{dict.checkout.contactTitle}</h2>
                  <label className="block">
                    <span className="label-xs text-ink-faint">{dict.checkout.fullName}</span>
                    <input name="fullName" required autoComplete="name" className="mt-2 h-12 w-full border border-espresso/15 bg-transparent px-4 text-sm text-espresso outline-none focus:border-brass" />
                  </label>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="label-xs text-ink-faint">{dict.checkout.email}</span>
                      <input name="email" type="email" required autoComplete="email" className="mt-2 h-12 w-full border border-espresso/15 bg-transparent px-4 text-sm text-espresso outline-none focus:border-brass" />
                    </label>
                    <label className="block">
                      <span className="label-xs text-ink-faint">{dict.checkout.phone}</span>
                      <input name="phone" required autoComplete="tel" className="mt-2 h-12 w-full border border-espresso/15 bg-transparent px-4 text-sm text-espresso outline-none focus:border-brass" />
                    </label>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="label-xs text-ink-faint">{dict.checkout.country}</span>
                      <input name="country" defaultValue="Maroc" autoComplete="country-name" className="mt-2 h-12 w-full border border-espresso/15 bg-transparent px-4 text-sm text-espresso outline-none focus:border-brass" />
                    </label>
                    <label className="block">
                      <span className="label-xs text-ink-faint">{dict.checkout.city}</span>
                      <input name="city" required autoComplete="address-level2" className="mt-2 h-12 w-full border border-espresso/15 bg-transparent px-4 text-sm text-espresso outline-none focus:border-brass" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="label-xs text-ink-faint">{dict.checkout.address}</span>
                    <input name="address" required autoComplete="street-address" className="mt-2 h-12 w-full border border-espresso/15 bg-transparent px-4 text-sm text-espresso outline-none focus:border-brass" />
                  </label>
                  {error && (
                    <p className="text-[0.9rem] text-burgundy">{dict.checkout.errors[error]}</p>
                  )}
                  <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={placing}>
                    {placing ? dict.checkout.placing : dict.checkout.placeOrder}
                  </Button>
                  <p className="text-[0.75rem] leading-relaxed text-ink-faint">{dict.checkout.secure}</p>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </PageFrame>
  );
}
