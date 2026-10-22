"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { fragrances, type FragranceId, type Product, type RitualId } from "@/lib/catalog";
import { rituals } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const copy = {
  fr: { search: "Rechercher un produit", scent: "Toutes les senteurs", reset: "Effacer les filtres", result: "résultat", results: "résultats", filter: "Filtrer", sort: "Trier", view: "Voir les produits", recommended: "Notre sélection", ascending: "Prix croissant", descending: "Prix décroissant" },
  en: { search: "Search products", scent: "All scents", reset: "Clear filters", result: "result", results: "results", filter: "Filter", sort: "Sort", view: "View products", recommended: "Our selection", ascending: "Price: low to high", descending: "Price: high to low" },
  ar: { search: "ابحثي عن منتج", scent: "كل الروائح", reset: "مسح الفلاتر", result: "نتيجة", results: "نتائج", filter: "تصفية", sort: "ترتيب", view: "عرض المنتجات", recommended: "اختياراتنا", ascending: "السعر تصاعدياً", descending: "السعر تنازلياً" },
} as const;

export function ShopCatalog({ products, locale, dict }: { products: Product[]; locale: Locale; dict: Dictionary }) {
  const [ritual, setRitual] = useState<RitualId | "all">("all");
  const [fragrance, setFragrance] = useState<FragranceId | "all">("all");
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState("recommended");
  const text = copy[locale];

  const shown = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale);
    const matches = products.filter((product) => {
      const matchesRitual = ritual === "all" || product.ritual === ritual;
      const matchesFragrance = fragrance === "all" || product.fragrance === fragrance;
      const haystack = `${product.name[locale]} ${product.labelFr} ${product.scent} ${product.productType}`.toLocaleLowerCase(locale);
      return matchesRitual && matchesFragrance && (!needle || haystack.includes(needle));
    });
    return sort === "recommended" ? matches : matches.toSorted((a, b) => sort === "ascending" ? a.priceEUR - b.priceEUR : b.priceEUR - a.priceEUR);
  }, [fragrance, locale, products, query, ritual, sort]);

  const filtered = ritual !== "all" || fragrance !== "all" || query.trim().length > 0;
  const reset = () => { setRitual("all"); setFragrance("all"); setQuery(""); };

  const filterControls = (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label={dict.shop.filter}>
        {([{ id: "all", title: dict.shop.all }, ...rituals.map((item) => ({ id: item.id, title: item.title[locale] }))] as { id: RitualId | "all"; title: string }[]).map((item) => (
          <button key={item.id} type="button" aria-pressed={ritual === item.id} onClick={() => setRitual(item.id)} className={cn("min-h-11 px-4 text-xs uppercase tracking-[0.1em]", ritual === item.id ? "bg-burgundy text-ivory" : "border border-espresso/20 text-espresso")}>{item.title}</button>
        ))}
      </div>
      <label className="mt-7 block text-sm text-espresso">{text.scent}
        <select value={fragrance} onChange={(event) => setFragrance(event.target.value as FragranceId | "all")} className="mt-3 h-12 w-full border border-espresso/20 bg-ivory px-3 text-base">
          <option value="all">{text.scent}</option>
          {Object.entries(fragrances).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
      </label>
    </>
  );

  return (
    <section className="relative bg-[#efe4d7] py-10 sm:py-14 lg:py-16">
      <div className="shell">
        <div className="border-t border-espresso/20 pt-6">
          <p className="v2-kicker text-brass-deep">{dict.nav.shop}</p>
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="display-lg text-espresso">{dict.shopPage.catalog}</h2>
            <label className="relative block w-full md:max-w-sm">
              <Search aria-hidden className="absolute start-4 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
              <span className="sr-only">{text.search}</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.search} className="h-12 w-full border border-espresso/15 bg-ivory/65 ps-11 pe-11 text-sm text-espresso outline-none transition focus:border-burgundy focus:bg-ivory" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label={text.reset} className="absolute end-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center text-ink-faint hover:text-espresso"><X className="size-4" /></button>}
            </label>
          </div>
        </div>

        <div className="sticky top-[var(--chrome-h)] z-20 -mx-4 mt-7 border-y border-espresso/10 bg-[#efe4d7] px-4 py-3 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-3 md:hidden">
            <button type="button" onClick={() => setFilterOpen(true)} className="flex min-h-11 flex-1 items-center justify-center border border-espresso/25 text-xs uppercase tracking-[0.12em]">{text.filter}{filtered ? " ·" : ""}</button>
            <label className="relative flex min-h-11 flex-1 items-center justify-center border border-espresso/25 text-xs uppercase tracking-[0.12em]">{text.sort}
              <select aria-label={text.sort} value={sort} onChange={(event) => setSort(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
                <option value="recommended">{text.recommended}</option><option value="ascending">{text.ascending}</option><option value="descending">{text.descending}</option>
              </select>
            </label>
          </div>
          <div className="hidden gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:flex" role="group" aria-label={dict.shop.filter}>
            {([{ id: "all", title: dict.shop.all }, ...rituals.map((item) => ({ id: item.id, title: item.title[locale] }))] as { id: RitualId | "all"; title: string }[]).map((item) => (
              <button key={item.id} type="button" aria-pressed={ritual === item.id} onClick={() => setRitual(item.id)} className={cn("h-10 shrink-0 px-4 text-[0.625rem] uppercase tracking-[0.16em] transition-colors", ritual === item.id ? "bg-burgundy text-ivory" : "bg-ivory/60 text-ink-muted hover:bg-ivory hover:text-espresso")}>{item.title}</button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <select value={fragrance} onChange={(event) => setFragrance(event.target.value as FragranceId | "all")} aria-label={text.scent} className="hidden h-11 min-w-0 flex-1 border border-espresso/10 bg-ivory/60 px-3 text-xs text-espresso outline-none md:block md:max-w-56">
              <option value="all">{text.scent}</option>
              {Object.entries(fragrances).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </select>
            <span role="status" aria-live="polite" className="label-xs ms-auto shrink-0 text-ink-muted">{shown.length} {shown.length === 1 ? text.result : text.results}</span>
            {filtered && <button type="button" onClick={reset} className="label-xs min-h-11 shrink-0 text-burgundy underline-offset-4 hover:underline">{text.reset}</button>}
          </div>
        </div>

        <div id="shop-products" className="scroll-mt-[calc(var(--chrome-h)+8rem)]">
          {shown.length === 0 ? (
            <div className="py-20 text-center"><p className="font-display text-2xl text-espresso">{dict.shop.empty}</p><button type="button" onClick={reset} className="label-xs mt-5 text-burgundy underline underline-offset-4">{text.reset}</button></div>
          ) : (
            <ul className="shop-grid mt-8 grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {shown.map((product, index) => <li key={product.slug} className="group min-w-0"><ShopProductCard product={product} index={index} locale={locale} dict={dict} discoverLabel={dict.shopPage.product} /></li>)}
            </ul>
          )}
        </div>
      </div>
      <Dialog.Root open={filterOpen} onOpenChange={setFilterOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-espresso/50" />
          <Dialog.Content className="fixed inset-x-0 bottom-0 z-[90] max-h-[90dvh] overflow-y-auto overscroll-contain border-t border-espresso/20 bg-ivory px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="mb-6 flex items-center justify-between gap-4"><Dialog.Title className="font-display text-3xl">{text.filter}</Dialog.Title><Dialog.Close aria-label={dict.common.close} className="flex size-11 items-center justify-center"><X aria-hidden className="size-5" /></Dialog.Close></div>
            <Dialog.Description className="sr-only">{text.search} · {text.scent}</Dialog.Description>
            {filterControls}
            <div className="mt-7 flex flex-col gap-3"><Dialog.Close className="min-h-12 bg-forest px-4 text-sm text-cream">{text.view} · {shown.length}</Dialog.Close><button type="button" onClick={reset} className="min-h-11 text-sm text-burgundy underline underline-offset-4">{text.reset}</button></div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
