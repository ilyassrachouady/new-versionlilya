import Image from "next/image";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";
import styles from "./ShopBanner.module.css";

const campaign = "/signature-collections/landing-supplied.webp";

export function ShopBanner({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const titleLines = locale === "en" ? ["The Maison", "Cabinet."] : locale === "fr" ? ["Le cabinet", "de la Maison."] : [dict.shopPage.title];
  return (
    <section className={styles.hero}>
      <div aria-hidden className={styles.environment}>
        <Image src={campaign} alt="" fill sizes="250vw" quality={92} className={styles.backdrop} />
      </div>
      <div aria-hidden className={styles.photograph}>
        <Image src={campaign} alt="" fill preload sizes="100vw" quality={92} className={styles.image} />
      </div>
      <div aria-hidden className={styles.shade} />
      <div className={styles.breadcrumbs}>
        <Breadcrumbs locale={locale} tone="light" trail={[{ name: site.name, path: "/" }, { name: dict.nav.shop, path: "/shop" }]} />
      </div>
      <div className={styles.content}>
        <p className="v2-kicker">{dict.nav.shop}</p>
        <h1 className={"v2-display-hero " + styles.title}>{titleLines.map((line, index) => <span key={line}>{line}{index < titleLines.length - 1 ? " " : ""}</span>)}</h1>
        <p className={styles.body}>{dict.shopPage.body}</p>
      </div>
    </section>
  );
}
