"use client";

import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";

import { Emblem } from "@/components/brand/Emblem";
import { Price } from "@/components/commerce/Price";
import { useStore } from "@/components/commerce/store";
import { Button, ButtonLink } from "@/components/ui/Button";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function CartDrawer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { isOpen, closeCart, items, count, subtotalMAD, setQuantity, remove } = useStore();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[80] bg-espresso/45 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.aside
                className="surface-grain fixed inset-y-0 end-0 z-[90] flex w-full max-w-[27rem] flex-col bg-ivory"
                initial={{ x: locale === "ar" ? "-100%" : "100%" }}
                animate={{ x: 0 }}
                exit={{ x: locale === "ar" ? "-100%" : "100%" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <header className="relative z-10 flex items-center justify-between border-b border-espresso/10 px-6 py-5">
                  <div className="flex items-baseline gap-3">
                    <Dialog.Title className="display-md text-espresso">
                      {dict.cart.title}
                    </Dialog.Title>
                    <Dialog.Description className="sr-only">
                      {dict.cart.subtotal}
                    </Dialog.Description>
                    <span className="label-xs tabular text-ink-faint">
                      {count} {count === 1 ? dict.cart.itemCount : dict.cart.itemCountPlural}
                    </span>
                  </div>
                  <Dialog.Close className="label-xs py-2 text-ink-muted transition-colors hover:text-espresso">
                    {dict.common.close}
                  </Dialog.Close>
                </header>

                {items.length === 0 ? (
                  <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
                    <Emblem className="h-12 w-auto text-brass/45" />
                    <div>
                      <p className="display-md text-espresso">{dict.cart.empty}</p>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                        {dict.cart.emptyBody}
                      </p>
                    </div>
                    <Dialog.Close asChild>
                      <ButtonLink href={href("/shop", locale)} variant="outline" size="md">
                        {dict.cart.emptyCta}
                      </ButtonLink>
                    </Dialog.Close>
                  </div>
                ) : (
                  <>
                    <ul className="relative z-10 flex-1 divide-y divide-espresso/10 overflow-y-auto px-6">
                      {items.map(({ product, quantity }) => (
                        <li key={product.slug} className="flex gap-4 py-5">
                          <Dialog.Close asChild>
                            <Link
                              href={href(`/products/${product.slug}`, locale)}
                              className="relative flex h-28 w-20 shrink-0 items-end justify-center overflow-hidden bg-ivory-300 pb-3"
                            >
                              <Image
                                src={product.image}
                                alt=""
                                width={product.imageWidth}
                                height={product.imageHeight}
                                sizes="80px"
                                className="max-h-[80%] w-auto object-contain"
                                style={{ width: "auto", height: "auto" }}
                              />
                            </Link>
                          </Dialog.Close>

                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-display text-[1.05rem] leading-tight text-espresso">
                                  {product.name[locale]}
                                </p>
                                <p className="label-xs mt-1.5 text-ink-faint">
                                  {product.scent} · {product.size}
                                </p>
                              </div>
                              <Price
                                amountMAD={product.priceMAD * quantity}
                                locale={locale}
                                className="shrink-0 text-[0.8125rem] text-espresso"
                              />
                            </div>

                            <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                              <div className="flex items-center border border-espresso/15">
                                <button
                                  type="button"
                                  onClick={() => setQuantity(product.slug, quantity - 1)}
                                  aria-label={dict.cart.decrease}
                                  className="flex size-8 items-center justify-center text-ink-muted transition-colors hover:text-espresso"
                                >
                                  −
                                </button>
                                <span className="tabular w-7 text-center text-[0.8125rem] text-espresso">
                                  {quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setQuantity(product.slug, quantity + 1)}
                                  aria-label={dict.cart.increase}
                                  className="flex size-8 items-center justify-center text-ink-muted transition-colors hover:text-espresso"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => remove(product.slug)}
                                className="label-xs text-ink-faint transition-colors hover:text-burgundy"
                              >
                                {dict.cart.remove}
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <footer className="relative z-10 border-t border-espresso/10 px-6 py-6">
                      <div className="flex items-baseline justify-between">
                        <span className="label-xs text-ink-muted">{dict.cart.subtotal}</span>
                        <Price
                          amountMAD={subtotalMAD}
                          locale={locale}
                          className="font-display text-[1.4rem] text-espresso"
                        />
                      </div>
                      <p className="mt-2 text-[0.75rem] leading-relaxed text-ink-faint">
                        {dict.cart.shippingNote}
                      </p>
                      <Button className="mt-5 w-full" size="lg">
                        {dict.cart.checkout}
                      </Button>
                      <Dialog.Close asChild>
                        <Button variant="ghost" size="sm" className="mt-3 w-full">
                          {dict.cart.continue}
                        </Button>
                      </Dialog.Close>
                    </footer>
                  </>
                )}
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
