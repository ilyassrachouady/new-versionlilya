import { notFound } from "next/navigation";

import { OverlayHeader } from "@/components/chrome/chrome-context";
import { FromMorocco } from "@/components/home/FromMorocco";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { RitualFinder } from "@/components/home/RitualFinder";
import { TheCollection } from "@/components/home/TheCollection";
import { TheEdits } from "@/components/home/TheEdits";
import { TheHouse } from "@/components/home/TheHouse";
import { TheIngredients } from "@/components/home/TheIngredients";
import { TheJournal } from "@/components/home/TheJournal";
import { TheRitual } from "@/components/home/TheRitual";
import { TheSignatures } from "@/components/home/TheSignatures";
import { JsonLd } from "@/components/seo/JsonLd";
import { organisationSchema, websiteSchema } from "@/lib/schema";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <OverlayHeader />
      <JsonLd data={[organisationSchema(locale), websiteSchema(locale)]} />

      <Hero locale={locale} dict={dict} />
      <TheHouse locale={locale} dict={dict} />
      <TheCollection locale={locale} dict={dict} />
      <TheRitual locale={locale} dict={dict} />
      <TheSignatures locale={locale} dict={dict} />
      <FromMorocco dict={dict} />
      <TheIngredients locale={locale} dict={dict} />
      <TheEdits locale={locale} dict={dict} />
      <RitualFinder locale={locale} dict={dict} />
      <TheJournal locale={locale} dict={dict} />
      <Newsletter dict={dict} />
    </>
  );
}
