import type { ReactNode } from "react";
import { LOCALES, fallbackLocale, type Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const dynamicParams = false;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const resolveLocale = (input?: string): Locale => {
  if (!input) return fallbackLocale;
  return LOCALES.includes(input as Locale) ? (input as Locale) : fallbackLocale;
};

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}>;

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  const blogLabels: Record<Locale, string> = {
    en: "Blog",
    ko: "블로그",
    ja: "ブログ",
    zh: "博客",
  };

  return (
    <>
      <div className="min-h-screen bg-base">
        <AnnouncementBanner locale={locale} />
        <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-6 pb-6 pt-8 sm:px-8 lg:px-10">
          <Link
            href={`/${locale}`}
            className="rounded-full bg-hero px-4 py-1 text-sm font-medium text-accent hover:opacity-80 transition-opacity"
          >
            Comet × Perplexity Learning Hub
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/blog`}
              className="rounded-full border border-border bg-panel px-4 py-1.5 text-sm font-medium text-primary hover:border-accent hover:text-accent transition-colors"
            >
              {blogLabels[locale]}
            </Link>
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </header>
        <main>{children}</main>
      </div>
      <Footer locale={locale} />
    </>
  );
}