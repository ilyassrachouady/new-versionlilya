import { Price } from "@/components/commerce/Price";
import { ProductStage } from "@/components/commerce/ProductStage";
import { QuietLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProduct, signatureSlugs } from "@/lib/catalog";
import { getIngredient } from "@/lib/content";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const tones = ["sand", "espresso", "ivory"] as const;

/** The three the house is known for, given a full editorial spread each. */
export function TheSignatures({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const signatures = signatureSlugs
    .map((slug) => getProduct(slug))
    .filter((product) => product !== undefined);

  return (
    <section className="surface-grain relative bg-ivory py-20 sm:py-28 lg:py-36">
      <div className="shell">
        <SectionHeader eyebrow={dict.signatures.eyebrow} title={dict.signatures.title} />
      </div>

      <div className="mt-16 flex flex-col gap-20 sm:gap-24 lg:gap-32">
        {signatures.map((product, index) => {
          const flipped = index % 2 === 1;
          const ingredient = getIngredient(product.ingredients[0]);

          return (
            <div key={product.slug} className="shell">
              <div
                className={cn(
                  "grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20",
                  flipped && "lg:[&>*:first-child]:order-2",
                )}
              >
                <Reveal variant="mask">
                  <ProductStage
                    product={product}
                    tone={tones[index % tones.length]}
                    index={index}
                    priority={index === 0}
                  />
                </Reveal>

                <div className={cn(flipped && "lg:order-1")}>
                  <Reveal>
                    <p className="eyebrow text-brass-deep">{product.scent}</p>
                    <h3 className="display-xl mt-5 text-espresso">{product.name[locale]}</h3>
                    <p className="font-display mt-2 text-[1.15rem] text-ink-faint italic">
                      {product.labelFr}
                    </p>
                  </Reveal>

                  <Reveal delay={0.06}>
                    <p className="mt-7 max-w-md text-[1.0625rem] leading-relaxed text-pretty text-ink-muted">
                      {product.description[locale]}
                    </p>
                  </Reveal>

                  <Reveal delay={0.1}>
                    <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-5 border-t border-brass/25 pt-7">
                      <div>
                        <dt className="label-xs text-ink-faint">{dict.product.size}</dt>
                        <dd className="tabular mt-1.5 text-[0.9rem] text-espresso">
                          {product.size}
                        </dd>
                      </div>
                      <div>
                        <dt className="label-xs text-ink-faint">
                          {dict.ingredientsSection.eyebrow}
                        </dt>
                        <dd className="mt-1.5 text-[0.9rem] text-espresso">
                          {ingredient.name[locale]}
                        </dd>
                      </div>
                      <div>
                        <dt className="label-xs text-ink-faint">
                          {dict.ingredientsSection.origin}
                        </dt>
                        <dd className="mt-1.5 text-[0.9rem] text-espresso">
                          {ingredient.originShort[locale]}
                        </dd>
                      </div>
                    </dl>
                  </Reveal>

                  <Reveal delay={0.14} className="mt-9 flex items-center gap-8">
                    <QuietLink href={href(`/products/${product.slug}`, locale)}>
                      {dict.common.discover}
                    </QuietLink>
                    <Price
                      amountMAD={product.priceMAD}
                      locale={locale}
                      className="font-display text-[1.25rem] text-burgundy"
                    />
                  </Reveal>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
