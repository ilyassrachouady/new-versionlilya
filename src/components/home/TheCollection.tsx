import { ProductCard } from "@/components/commerce/ProductCard";
import { QuietLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { products } from "@/lib/catalog";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Not a grid — a hung composition. Cards sit on different baselines and
 * different fields so the eye travels rather than scans.
 */
const composition = [
  { offset: "lg:mt-0", field: "ivory" as const },
  { offset: "lg:mt-20", field: "sand" as const },
  { offset: "lg:mt-6", field: "espresso" as const },
  { offset: "lg:mt-24", field: "sand" as const },
  { offset: "lg:mt-4", field: "espresso" as const },
  { offset: "lg:mt-28", field: "ivory" as const },
];

export function TheCollection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const shown = products.slice(0, 6);

  return (
    <section className="surface-grain relative bg-ivory pb-24 sm:pb-32 lg:pb-40">
      <div className="shell">
        <SectionHeader
          eyebrow={dict.collection.eyebrow}
          title={dict.collection.title}
          body={dict.collection.body}
          action={
            <QuietLink href={href("/shop", locale)}>{dict.collection.cta}</QuietLink>
          }
        />

        <ul className="hide-scroll -mx-[var(--spacing-gutter,1.25rem)] mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--spacing-gutter,1.25rem)] pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-6">
          {shown.map((product, index) => (
            <Reveal
              as="li"
              key={product.slug}
              delay={(index % 3) * 0.07}
              className={`w-[78vw] shrink-0 snap-start sm:w-auto ${composition[index]?.offset ?? ""}`}
            >
              <ProductCard
                product={product}
                locale={locale}
                dict={dict}
                field={composition[index]?.field}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
