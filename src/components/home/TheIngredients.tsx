import Image from "next/image";
import Link from "next/link";

import { QuietLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { products } from "@/lib/catalog";
import { ingredients } from "@/lib/content";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const plates: Record<string, string> = {
  argan: "/editorial/ingredient-argan-oil.jpg",
  "orange-blossom": "/editorial/ingredient-orange-blossom.jpg",
};

/** An archive, not a benefits list: name, botanical, origin, story, objects. */
export function TheIngredients({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="surface-linen relative bg-[#eae1d2] py-20 sm:py-28 lg:py-36">
      <div className="shell relative z-10">
        <SectionHeader
          eyebrow={dict.ingredientsSection.eyebrow}
          title={dict.ingredientsSection.title}
          body={dict.ingredientsSection.body}
          action={
            <QuietLink href={href("/ingredients", locale)}>
              {dict.ingredientsSection.cta}
            </QuietLink>
          }
        />

        <ul className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-12">
          {ingredients.map((ingredient, index) => {
            const found = products.filter((product) =>
              product.ingredients.includes(ingredient.id),
            );

            return (
              <Reveal as="li" key={ingredient.id} delay={index * 0.08}>
                <article className="flex h-full flex-col">
                  <div className="arch-keyhole relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={plates[ingredient.id]}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 90vw, 44vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(36,24,21,0.05), rgba(36,24,21,0.45))",
                      }}
                    />
                    <span className="absolute bottom-5 start-6 font-display text-[0.7rem] tracking-[0.35em] text-ivory/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-7 flex flex-1 flex-col">
                    <h3 className="display-lg text-espresso">{ingredient.name[locale]}</h3>
                    <p className="font-display mt-1.5 text-[0.95rem] text-ink-faint italic">
                      {ingredient.latin}
                    </p>

                    <p className="mt-6 text-[0.95rem] leading-relaxed text-pretty text-ink-muted">
                      {ingredient.story[locale]}
                    </p>

                    <dl className="mt-7 border-t border-brass/25 pt-6">
                      <dt className="label-xs text-ink-faint">
                        {dict.ingredientsSection.origin}
                      </dt>
                      <dd className="mt-2 text-[0.9rem] text-espresso">
                        {ingredient.origin[locale]}
                      </dd>
                    </dl>

                    <div className="mt-6">
                      <p className="label-xs text-ink-faint">
                        {dict.ingredientsSection.inThis}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-2">
                        {found.map((product) => (
                          <li key={product.slug}>
                            <Link
                              href={href(`/products/${product.slug}`, locale)}
                              className="inline-block border border-brass/35 px-3 py-1.5 text-[0.6875rem] tracking-[0.14em] text-ink-muted uppercase transition-colors duration-500 hover:border-burgundy hover:text-burgundy"
                            >
                              {product.name[locale]}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
