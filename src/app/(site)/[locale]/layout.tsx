import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import { notFound } from "next/navigation";
import "../../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingSocialButton from "@/components/FloatingSocialButton";
import CookieConsent from "@/components/CookieConsent";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/dictionaries";
import { getSiteSettings } from "@/lib/cms/siteSettings";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: dict.meta.title, description: dict.meta.description };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const settings = await getSiteSettings();

  return (
    <html lang={dict.meta.htmlLang} className={prompt.variable}>
      <body>
        <Header locale={locale} dict={dict} />
        <main>{children}</main>
        <Footer dict={dict} socialLinks={settings?.socialLinks} />
        <FloatingSocialButton socialLinks={settings?.socialLinks?.length ? settings.socialLinks : dict.data.socialLinks} />
        <CookieConsent locale={locale} />
      </body>
    </html>
  );
}
