import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SignatureLanding } from "@/components/signatures/SignatureExperience";
import { isLocale, locales } from "@/lib/i18n/config";
import { signatureCopy } from "@/lib/signature-collections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = signatureCopy(locale);
  return { title: copy.label, description: copy.body, alternates: {
    canonical: `/${locale}/signature-collections`,
    languages: Object.fromEntries(locales.map((code) => [code, `/${code}/signature-collections`])),
  } };
}

export default async function SignatureCollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SignatureLanding locale={locale} />;
}
