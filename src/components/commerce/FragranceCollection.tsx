import Image from "next/image";
import { CabinetProductCard } from "@/components/commerce/CabinetProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { QuietLink } from "@/components/ui/Button";
import { rituals } from "@/lib/content";
import type { Product } from "@/lib/catalog";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { getV2Copy } from "@/lib/v2-content";

export function FragranceCollection({ products, locale, dict }: { products: Product[]; locale: Locale; dict: Dictionary }) {
  const copy = getV2Copy(locale);
  return (
    <>
      <section id="fragrance-cabinet" className="relative scroll-mt-[var(--chrome-h)] overflow-hidden bg-ivory py-16 sm:py-20 lg:py-24">
        <div className="shell">
          <div className="grid gap-8 border-t border-espresso/20 pt-6 md:grid-cols-[1fr_1.25fr] md:gap-16">
            <Reveal><p className="v2-kicker text-brass-deep">{copy.collection.eyebrow}</p><h2 className="display-xl mt-5">{copy.collection.title}</h2></Reveal>
            <Reveal className="md:pt-8"><p className="max-w-lg text-[0.95rem] leading-[1.8] text-ink-muted">{copy.collection.body}</p></Reveal>
          </div>
          <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {products.map((product, index) => <Reveal as="li" key={product.slug} className="group" delay={(index % 4) * 0.06}><CabinetProductCard product={product} index={index} locale={locale} dict={dict} discoverLabel={copy.collection.shop} /></Reveal>)}
          </ol>
        </div>
      </section>
      <section className="relative overflow-hidden bg-ivory-300 py-16 sm:py-20 lg:py-24">
        <div className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="mask" className="arch relative aspect-[4/5] overflow-hidden"><Image src="/campaign-v2/body-oil-ritual.jpg" alt="" fill sizes="(max-width: 1024px) 90vw, 44vw" className="object-cover" /></Reveal>
          <Reveal><p className="eyebrow text-brass-deep">{copy.flower.eyebrow}</p><h2 className="display-xl mt-5">{copy.flower.title}</h2><p className="mt-6 max-w-lg text-[1rem] leading-relaxed text-ink-muted">{copy.flower.body}</p><p className="label-xs mt-7 border-y border-brass/25 py-4 text-ink-muted">{copy.flower.note}</p><div className="mt-8"><QuietLink href={href("/ingredients/orange-blossom", locale)}>{copy.flower.cta}</QuietLink></div></Reveal>
        </div>
      </section>
      <section className="relative overflow-hidden bg-espresso py-16 text-ivory sm:py-20 lg:py-24">
        <div className="shell"><Reveal><p className="eyebrow text-brass-light">{dict.ritual.eyebrow}</p><h2 className="display-xl mt-5">{dict.collectionsPage.title}</h2><p className="mt-6 max-w-lg text-[1rem] leading-relaxed text-ivory/70">{dict.collectionsPage.body}</p></Reveal>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{rituals.map(ritual => <li key={ritual.id} className="border-t border-brass/30 pt-6"><p className="label-xs text-brass-light">{ritual.index}</p><h3 className="display-md mt-4">{ritual.title[locale]}</h3><p className="mt-4 text-[0.9rem] leading-relaxed text-ivory/70">{ritual.line[locale]}</p><div className="mt-6"><QuietLink tone="light" href={href('/collections/'+ritual.id, locale)}>{dict.collectionsPage.enter}</QuietLink></div></li>)}</ul>
        </div>
      </section>
    </>
  );
}
