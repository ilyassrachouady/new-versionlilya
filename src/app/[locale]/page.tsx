import { notFound } from "next/navigation";

import { OverlayHeader } from "@/components/chrome/chrome-context";
import { V2Home } from "@/components/home-v2/V2Home";
import { JsonLd } from "@/components/seo/JsonLd";
import { organisationSchema, websiteSchema } from "@/lib/schema";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getStorefrontProducts } from "@/lib/storefront-catalog";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const catalog = await getStorefrontProducts();

  return (
    <>
      <OverlayHeader />
      <JsonLd data={[organisationSchema(locale), websiteSchema(locale)]} />
      <V2Home locale={locale} dict={dict} products={catalog} />
    </>
  );
}
