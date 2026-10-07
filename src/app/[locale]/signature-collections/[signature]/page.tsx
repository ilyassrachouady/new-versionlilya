import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SignatureDetail } from "@/components/signatures/SignatureExperience";
import { isLocale, locales } from "@/lib/i18n/config";
import { isSignatureId, signatureIds, signatureWorlds } from "@/lib/signature-collections";

export function generateStaticParams() { return signatureIds.map((signature) => ({ signature })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; signature: string }> }): Promise<Metadata> {
  const { locale, signature } = await params;
  if (!isLocale(locale) || !isSignatureId(signature)) return {};
  return { title: signatureWorlds[signature].name, alternates: {
    canonical: `/${locale}/signature-collections/${signature}`,
    languages: Object.fromEntries(locales.map((code) => [code, `/${code}/signature-collections/${signature}`])),
  } };
}

export default async function SignaturePage({ params }: { params: Promise<{ locale: string; signature: string }> }) {
  const { locale, signature } = await params;
  if (!isLocale(locale) || !isSignatureId(signature)) notFound();
  return <SignatureDetail locale={locale} signature={signature} />;
}
