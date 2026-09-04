"use client";

import { AddToBag } from "@/components/commerce/AddToBag";
import { Price } from "@/components/commerce/Price";
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { StickyBag } from "@/components/commerce/StickyBag";
import { WishlistButton } from "@/components/commerce/WishlistButton";
import { Accordion } from "@/components/ui/Accordion";
import { site } from "@/lib/site";
import type { Product } from "@/lib/catalog";
import { getIngredient } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function ProductFold({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const named = product.ingredients.map((id) => getIngredient(id));

  return (
    <>
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
        <ProductGallery product={product} />

        <div>
          <p className="eyebrow text-brass-deep">{site.name}</p>
          <h1 className="display-xl mt-5 text-espresso">{product.name[locale]}</h1>
          <p className="font-display mt-2 text-[1.2rem] text-ink-faint italic">
            {product.labelFr}
          </p>
          <p className="label-xs mt-4 text-burgundy">{product.scent}</p>

          <p className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-pretty text-ink-muted">
            {product.tagline[locale]}
          </p>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-pretty text-ink-muted">
            {product.description[locale]}
          </p>

          <div className="mt-10 flex items-end justify-between gap-6 border-t border-brass/25 pt-7">
            <div>
              <p className="label-xs text-ink-faint">{dict.product.size}</p>
              <p className="mt-1.5 text-[0.95rem] text-espresso">{product.size}</p>
            </div>
            <Price
              amountMAD={product.priceMAD}
              locale={locale}
              className="font-display text-[1.85rem] leading-none text-burgundy"
            />
          </div>

          {product.withArgan && (
            <p className="label-xs mt-5 text-brass-deep">{dict.product.withArgan}</p>
          )}

          <div id="add-to-bag" className="mt-8">
            <AddToBag slug={product.slug} dict={dict} />
          </div>
          <WishlistButton slug={product.slug} dict={dict} className="mt-4" />
          <p className="mt-6 text-[0.8rem] leading-relaxed text-ink-faint">
            {dict.product.shipping}
          </p>

          <div className="mt-12">
            <Accordion
              defaultValue={["ritual"]}
              items={[
                {
                  id: "ritual",
                  title: dict.product.ritualHeading,
                  body: product.ritualNote[locale],
                },
                {
                  id: "use",
                  title: dict.product.howToUse,
                  body: product.howToUse[locale],
                },
                {
                  id: "ingredients",
                  title: dict.product.ingredientsHeading,
                  body: (
                    <div>
                      <ul className="space-y-2">
                        {named.map((ingredient) => (
                          <li key={ingredient.id}>
                            <span className="text-espresso">{ingredient.name[locale]}</span>
                            <span className="text-ink-faint"> — {ingredient.latin}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4">{dict.product.fullList}</p>
                    </div>
                  ),
                },
                {
                  id: "details",
                  title: dict.product.details,
                  body: (
                    <dl className="space-y-3">
                      <div>
                        <dt className="label-xs text-ink-faint">{dict.product.vessel}</dt>
                        <dd className="mt-1">{product.vessel[locale]}</dd>
                      </div>
                      <div>
                        <dt className="label-xs text-ink-faint">{dict.product.reference}</dt>
                        <dd className="mt-1 tabular">{product.sku}</dd>
                      </div>
                    </dl>
                  ),
                },
                {
                  id: "origin",
                  title: dict.product.origin,
                  body: named
                    .map((ingredient) => ingredient.origin[locale])
                    .join(" "),
                },
              ]}
            />
          </div>
        </div>
      </div>
      <StickyBag product={product} locale={locale} dict={dict} sentinelId="add-to-bag" />
    </>
  );
}
