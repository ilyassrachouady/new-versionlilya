"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Emblem } from "@/components/brand/Emblem";
import { useChrome } from "@/components/chrome/chrome-context";
import { Price } from "@/components/commerce/Price";
import { catalogProducts as products } from "@/lib/catalog";
import { shopProductImages } from "@/lib/shop-product-images";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function SearchDialog({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { searchOpen, setSearchOpen } = useChrome();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!searchOpen) return;
    const id = window.setTimeout(() => {
      setQuery("");
      inputRef.current?.focus();
    }, 40);
    return () => window.clearTimeout(id);
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((product) => {
      const hay = [
        product.name.en,
        product.name.fr,
        product.name.ar,
        product.labelFr,
        product.scent,
        product.ritual,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
      <AnimatePresence>
        {searchOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[80] bg-espresso/50 backdrop-blur-[3px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="surface-grain fixed inset-x-0 top-0 z-[90] max-h-dvh overflow-y-auto bg-ivory pt-[var(--chrome-h)]"
                initial={reduced ? undefined : { y: "-12%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduced ? undefined : { y: "-8%", opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="shell py-10 pb-16 sm:py-14">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <Dialog.Title className="display-lg text-espresso">
                        {dict.search.title}
                      </Dialog.Title>
                      <Dialog.Description className="sr-only">
                        {dict.search.placeholder}
                      </Dialog.Description>
                    </div>
                    <Dialog.Close className="label-xs py-2 text-ink-muted transition-colors hover:text-espresso">
                      {dict.common.close}
                    </Dialog.Close>
                  </div>

                  <label className="mt-10 block border-b border-espresso/15 pb-3">
                    <span className="sr-only">{dict.search.placeholder}</span>
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={dict.search.placeholder}
                      className="w-full bg-transparent font-display text-[1.75rem] leading-tight text-espresso outline-none placeholder:text-ink-faint sm:text-[2.25rem]"
                    />
                  </label>

                  <p className="label-xs mt-6 text-ink-faint">
                    {results.length} {dict.search.results}
                  </p>

                  {results.length === 0 ? (
                    <div className="flex flex-col items-center py-20 text-center">
                      <Emblem tone="dark" className="h-10 w-10 opacity-40" />
                      <p className="display-md mt-6 text-espresso">{dict.search.empty}</p>
                    </div>
                  ) : (
                    <ul className="mt-8 divide-y divide-espresso/10">
                      {results.map((product) => (
                        <li key={product.slug}>
                          <Dialog.Close asChild>
                            <Link
                              href={href(`/products/${product.slug}`, locale)}
                              className="group flex items-center gap-5 py-4"
                            >
                              <span className="relative h-20 w-14 shrink-0 overflow-hidden bg-ivory-300">
                                <Image
                                  src={shopProductImages[product.slug] ?? product.image}
                                  alt=""
                                  fill
                                  sizes="56px"
                                  className="object-cover object-center"
                                />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="font-display text-[1.2rem] text-espresso transition-colors duration-500 group-hover:text-burgundy">
                                  {product.name[locale]}
                                </span>
                                <span className="label-xs mt-1.5 block text-ink-faint">
                                  {product.scent} · {product.size}
                                </span>
                              </span>
                              <Price
                                amountMAD={product.priceMAD}
                                locale={locale}
                                className="text-[0.8125rem] text-espresso"
                              />
                            </Link>
                          </Dialog.Close>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
