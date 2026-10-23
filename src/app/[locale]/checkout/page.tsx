import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CheckoutView } from "@/components/commerce/CheckoutView";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getStorefrontDictionary as getDictionary } from "@/lib/storefront-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  return {
    title: dict.checkout.title,
    description: dict.checkout.body,
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  return <CheckoutView locale={locale} dict={dict} />;
}
