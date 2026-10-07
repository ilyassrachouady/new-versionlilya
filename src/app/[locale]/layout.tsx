import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Amiri, Bodoni_Moda, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";

import "@/app/globals.css";

import { ArchDefs } from "@/components/brand/ArchDefs";
import { Footer } from "@/components/chrome/Footer";
import { Header } from "@/components/chrome/Header";
import { ChromeProvider } from "@/components/chrome/chrome-context";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { StoreProvider } from "@/components/commerce/store";
import { Curtain } from "@/components/chrome/Curtain";
import { SearchDialog } from "@/components/chrome/SearchDialog";
import { Toast } from "@/components/chrome/Toast";
import { isLocale, localeMeta, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-bodoni",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-plex-arabic",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3EDE3" },
    { media: "(prefers-color-scheme: dark)", color: "#241815" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const titles: Record<Locale, string> = {
    en: "Maison Lilya Zahra — Beauty, rooted in Morocco",
    fr: "Maison Lilya Zahra — La beauté, enracinée au Maroc",
    ar: "دار ليا زهرة — جمالٌ متجذّرٌ في المغرب",
  };

  return {
    metadataBase: new URL(site.url),
    title: { default: titles[locale], template: `%s — ${site.name}` },
    description: dict.hero.sub,
    applicationName: site.name,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        fr: "/fr",
        ar: "/ar",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: titles[locale],
      description: dict.hero.sub,
      url: `/${locale}`,
      locale: localeMeta[locale].ogLocale,
    },
    twitter: { card: "summary_large_image", title: titles[locale], description: dict.hero.sub },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const { dir } = localeMeta[locale];

  const fontVariables =
    locale === "ar"
      ? `${bodoni.variable} ${inter.variable} ${amiri.variable} ${plexArabic.variable}`
      : `${bodoni.variable} ${inter.variable}`;

  return (
    <html lang={locale} dir={dir} data-scroll-behavior="smooth" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <ArchDefs />
        <StoreProvider>
          <ChromeProvider>
            <Curtain />
            <Header locale={locale} dict={dict} />
            <main id="main">{children}</main>
            <Footer locale={locale} dict={dict} />
            <CartDrawer locale={locale} dict={dict} />
            <SearchDialog locale={locale} dict={dict} />
            <Toast dict={dict} />
          </ChromeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
