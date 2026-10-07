import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/commerce/ProductCard";
import { PageFrame } from "@/components/layout/PageFrame";
import { QuietLink } from "@/components/ui/Button";
import { href, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ritualOrder, signatureCopy, signatureIds, signatureProducts, signatureWorlds, type SignatureId } from "@/lib/signature-collections";
import styles from "./SignatureExperience.module.css";

function SignatureHero({ locale, signature }: { locale: Locale; signature?: SignatureId }) {
  const copy = signatureCopy(locale);
  const world = signature ? signatureWorlds[signature] : undefined;
  return (
    <section className={`${styles.hero} ${!signature ? styles.landingHero : ""}`} style={world ? { backgroundColor: world.background } : undefined}>
      {world ? <Image src={world.image} alt={`${world.name} — Maison Lilya Zahra`} fill preload sizes="100vw" className={styles.heroImage} /> : (
        <picture>
          <source media="(min-width: 768px)" srcSet="/signature-collections/landing-supplied.webp" />
          <Image src="/signature-collections/landing-supplied.webp" alt={copy.body} width={1994} height={789} unoptimized loading="eager" fetchPriority="high" className={`absolute inset-0 h-full w-full ${styles.heroImage}`} />
        </picture>
      )}
      <div aria-hidden className={styles.shade} />
      <div className={`v2-shell ${styles.heroCopy}`}>
        <p className="v2-kicker">{signature ? copy.chapter : copy.label}</p>
        <h1 className={`v2-display-hero mt-6 ${signature ? styles.signatureTitle : styles.title}`}>
          {world ? <bdi>{world.name}</bdi> : copy.title.split("\n").map((line) => <span className="block" key={line}>{line}</span>)}
        </h1>
        {!signature && <p className="mt-6 text-sm leading-relaxed">{copy.body}</p>}
        <QuietLink tone="light" href={signature ? "#signature-products" : "#signature-worlds"} className="mt-8 min-h-11 self-start rtl:self-end">
          {signature ? copy.products : copy.explore}<span aria-hidden>↓</span>
        </QuietLink>
      </div>
    </section>
  );
}

export function SignatureLanding({ locale }: { locale: Locale }) {
  const copy = signatureCopy(locale);
  return (
    <PageFrame>
      <SignatureHero locale={locale} />
      <section id="signature-worlds" className="bg-ivory py-12 sm:py-16 scroll-mt-[var(--chrome-h)]" aria-label={copy.label}>
        <div className="v2-shell">
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-espresso/15 pb-5">
            <h2 className="v2-kicker text-espresso">{copy.label}</h2><span className="v2-kicker text-ink-faint" aria-hidden>01 — 04</span>
          </div>
          <div className={styles.gateways}>
            {signatureIds.map((id, index) => {
              const world = signatureWorlds[id];
              return (
                <Link key={id} href={href(`/signature-collections/${id}`, locale)} className={styles.gateway} style={{ backgroundColor: world.background }}>
                  <Image src={`/signature-collections/${id}-card-final.png`} alt="" fill sizes="(max-width: 767px) 100vw, 50vw" className={styles.gatewayImage} />
                  <div aria-hidden className={styles.gatewayShade} />
                  <div className={styles.gatewayCopy}>
                    <span className="v2-kicker opacity-70" aria-hidden>0{index + 1}</span>
                    <h3 className={`font-display mt-3 ${styles.gatewayTitle}`}><bdi>{world.name}</bdi></h3>
                    <span className="v2-kicker mt-5 inline-flex min-h-11 items-center gap-3">{copy.discover}<span aria-hidden className="rtl:rotate-180">→</span></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}

export function SignatureDetail({ locale, signature }: { locale: Locale; signature: SignatureId }) {
  const copy = signatureCopy(locale);
  const dict = getDictionary(locale);
  const products = signatureProducts(signature);
  const groups = ritualOrder.map((ritual) => ({ ritual, products: products.filter((product) => product.ritual === ritual) })).filter((group) => group.products.length);
  return (
    <PageFrame>
      <SignatureHero locale={locale} signature={signature} />
      <div id="signature-products" className="bg-ivory scroll-mt-[var(--chrome-h)]">
        <div className="v2-shell py-10 sm:py-14">
          <p className="max-w-xl text-sm leading-relaxed text-ink-muted">{copy.intro}</p>
          <nav aria-label={dict.shop.filter} className="mt-6 flex flex-wrap gap-x-7 gap-y-2">
            {groups.map(({ ritual }) => <QuietLink key={ritual} href={`#signature-${ritual}`} className="min-h-11">{copy.rituals[ritual]}</QuietLink>)}
          </nav>
        </div>
        {groups.map(({ ritual, products: items }, groupIndex) => (
          <section key={ritual} id={`signature-${ritual}`} aria-labelledby={`title-${ritual}`} className="scroll-mt-[var(--chrome-h)]">
            <div className="v2-shell pb-12 sm:pb-16">
              <div className="flex items-baseline justify-between gap-4 border-t border-espresso/15 pt-7">
                <h2 id={`title-${ritual}`} className="v2-display-section text-espresso">{copy.rituals[ritual]}</h2>
                <span className="v2-kicker text-ink-faint">{items.length} {dict.shop.count}</span>
              </div>
              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-7 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
                {items.map((product, index) => <li key={product.slug}><ProductCard product={product} locale={locale} dict={dict} cleanPhotography field={(["ivory", "sand", "espresso"] as const)[index % 3]} /></li>)}
              </ul>
            </div>
            {groupIndex === 0 && groups.length > 1 && <div aria-hidden className={`${styles.editorial} mb-12 sm:mb-16`}><Image src={signatureWorlds[signature].image} alt="" fill sizes="100vw" /></div>}
          </section>
        ))}
      </div>
      <section className="bg-ivory py-10 sm:py-14">
        <div className="v2-shell border-t border-espresso/15 pt-8">
          <h2 className="v2-kicker text-ink-muted">{copy.another}</h2>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
            {signatureIds.filter((id) => id !== signature).map((id) => <QuietLink key={id} href={href(`/signature-collections/${id}`, locale)} className="min-h-11"><bdi>{signatureWorlds[id].name}</bdi><span aria-hidden className="rtl:rotate-180">→</span></QuietLink>)}
          </div>
          <QuietLink href={href("/signature-collections", locale)} className="mt-7 min-h-11">{copy.all}</QuietLink>
        </div>
      </section>
    </PageFrame>
  );
}
