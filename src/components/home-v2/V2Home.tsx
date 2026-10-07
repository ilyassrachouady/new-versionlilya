import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/commerce/ProductCard";
import { Newsletter } from "@/components/home/Newsletter";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink, QuietLink } from "@/components/ui/Button";
import { products, signatureSlugs } from "@/lib/catalog";
import { shopProductImages } from "@/lib/shop-product-images";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { getV2Copy } from "@/lib/v2-content";

import { V2SignatureShowcase } from "@/components/home-v2/V2SignatureShowcase";
import { V2Hero } from "@/components/home-v2/V2Hero";
import { V2ProductRail } from "@/components/home-v2/V2ProductRail";

export function V2Home({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const copy = getV2Copy(locale);
  const homepageProducts = products.map(product => ({ ...product, image: shopProductImages[product.slug] ?? product.image }));
  const signatures = signatureSlugs
    .map((slug) => homepageProducts.find((product) => product.slug === slug))
    .filter((product): product is (typeof products)[number] => Boolean(product));

  return (
    <div className="v2-home">
      <V2Hero locale={locale} copy={copy.hero} />

      <V2ProductRail products={homepageProducts} locale={locale} dict={dict} copy={copy.collection} />

      <section id="ritual" className="relative overflow-hidden bg-[#1b3024] py-20 text-[#f0dfce] sm:py-28 lg:py-36">
        <div aria-hidden className="v2-noise absolute inset-0 opacity-20" />
        <div className="v2-shell relative">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
            <div>
              <Reveal>
                <p className="v2-kicker text-[#d0a46f]">{copy.ritual.eyebrow}</p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="v2-display-section mt-5 max-w-[10ch]">{copy.ritual.title}</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-md text-[0.92rem] leading-[1.85] text-[#ead8c5]/66">
                  {copy.ritual.body}
                </p>
              </Reveal>
              <Reveal delay={0.14} className="mt-8">
                <ButtonLink href={href("/collections", locale)} variant="outlineLight" size="md">
                  {copy.ritual.cta}
                </ButtonLink>
              </Reveal>
            </div>

            <ol className="border-t border-[#ead8c5]/18">
              {copy.ritual.steps.map((step, index) => (
                <Reveal
                  as="li"
                  key={step.index}
                  delay={index * 0.045}
                  className="group grid grid-cols-[3rem_1fr] gap-4 border-b border-[#ead8c5]/18 py-6 sm:grid-cols-[4rem_0.7fr_1fr] sm:items-center sm:gap-6 sm:py-8"
                >
                  <span className="v2-index text-[#d0a46f]">{step.index}</span>
                  <h3 className="font-display text-[1.75rem] leading-none sm:text-[2.2rem]">{step.title}</h3>
                  <p className="col-start-2 text-[0.8rem] leading-relaxed text-[#ead8c5]/56 sm:col-start-auto sm:text-[0.86rem]">
                    {step.line}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <V2SignatureShowcase locale={locale} />

      <section className="relative isolate min-h-[88svh] overflow-hidden bg-[#3b110e] text-[#f5e6d6]">
        <Image
          src="/campaign-v2/hammam-ritual.jpg"
          alt="Body scrub and hair mask in a luminous Moroccan hammam."
          fill
          quality={90}
          sizes="100vw"
          className="-z-20 object-cover object-center md:object-[center_60%]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(18,5,4,.25)_0%,rgba(18,5,4,.08)_42%,rgba(18,5,4,.82)_100%)] md:bg-[linear-gradient(90deg,rgba(18,5,4,.76)_0%,rgba(18,5,4,.3)_46%,rgba(18,5,4,.04)_75%)]" />
        <div className="v2-shell flex min-h-[88svh] items-end pb-10 pt-28 sm:pb-16 md:items-center md:pb-20">
          <div className="max-w-[35rem]">
            <Reveal>
              <p className="v2-kicker text-[#e0b27b]">{copy.hammam.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="v2-display-section mt-5 max-w-[9ch]">{copy.hammam.title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-[0.92rem] leading-[1.8] text-[#f2dfcb]/74">{copy.hammam.body}</p>
            </Reveal>
            <Reveal delay={0.14} className="mt-8">
              <ButtonLink href={href("/collections/hammam", locale)} variant="ivory" size="md">
                {copy.hammam.cta}
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-[#efe4d7] py-20 text-[#25100e] sm:py-28 lg:py-36">
        <div className="v2-shell">
          <div className="grid gap-6 border-t border-[#351411]/20 pt-6 sm:pt-8 md:grid-cols-2 md:items-end">
            <div>
              <p className="v2-kicker text-[#85281f]">{copy.signatures.eyebrow}</p>
              <h2 className="v2-display-section mt-5">{copy.signatures.title}</h2>
            </div>
            <p className="max-w-md text-[0.9rem] leading-relaxed text-[#6d574e] md:justify-self-end">
              {copy.signatures.body}
            </p>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 sm:mt-16 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
            {signatures.map((product, index) => (
              <Reveal as="li" key={product.slug} delay={index * 0.06} className={index === 2 ? "col-span-2 mx-auto w-[62%] lg:col-span-1 lg:w-auto" : ""}>
                <ProductCard
                  cleanPhotography
                  product={product}
                  locale={locale}
                  dict={dict}
                  field={index === 1 ? "espresso" : index === 2 ? "sand" : "ivory"}
                />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#6c1d18] py-20 text-[#f3e3d2] sm:py-28 lg:py-36">
        <div aria-hidden className="v2-noise absolute inset-0 opacity-20" />
        <div className="v2-shell relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-end lg:gap-24">
            <div>
              <Reveal>
                <p className="v2-kicker text-[#e3b77e]">{copy.origin.eyebrow}</p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="v2-display-section mt-5 max-w-[12ch]">{copy.origin.title}</h2>
              </Reveal>
            </div>
            <div>
              <Reveal>
                <p className="max-w-xl text-[0.96rem] leading-[1.9] text-[#f3e3d2]/72">{copy.origin.body}</p>
              </Reveal>
              <Reveal className="mt-8">
                <QuietLink tone="light" href={href("/house", locale)}>{copy.origin.cta}</QuietLink>
              </Reveal>
            </div>
          </div>

          <dl className="mt-14 grid grid-cols-3 border-y border-[#f3e3d2]/18 sm:mt-20">
            {copy.origin.points.map((point) => (
              <div key={point.label} className="border-e border-[#f3e3d2]/18 px-3 py-7 last:border-e-0 sm:px-6 sm:py-10">
                <dt className="v2-kicker text-[#f3e3d2]/52">{point.label}</dt>
                <dd className="font-display mt-3 text-[2rem] leading-none text-[#f3e3d2] sm:text-[3.4rem]">{point.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 flex justify-center sm:mt-20">
            <Link href={href("/shop", locale)} className="group relative flex aspect-square w-[min(78vw,20rem)] items-center justify-center rounded-full border border-[#f3e3d2]/28 text-center">
              <span className="absolute inset-3 rounded-full border border-[#f3e3d2]/12 transition-transform duration-700 group-hover:scale-95" />
              <span className="font-display max-w-[8ch] text-[2.1rem] leading-[1.02] sm:text-[2.7rem]">{copy.hero.cta}</span>
            </Link>
          </div>
        </div>
      </section>

      <Newsletter dict={dict} />
    </div>
  );
}
