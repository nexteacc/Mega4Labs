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
        <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-2 px-4 pb-6 pt-8 sm:gap-4 sm:px-8 lg:px-10">
          <Link
            href={`/${locale}`}
            className="rounded-full bg-hero px-3 py-1 text-xs font-medium text-accent hover:opacity-80 transition-opacity sm:px-4 sm:text-sm truncate max-w-[140px] sm:max-w-none"
            title="Comet × Perplexity Learning Hub"
          >
            <span className="hidden sm:inline">Comet × Perplexity Learning Hub</span>
            <span className="inline sm:hidden">C × P Hub</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Link
              href={`/${locale}/blog`}
              className="rounded-full border border-border bg-panel px-3 py-1.5 text-xs font-medium text-primary hover:border-accent hover:text-accent transition-colors sm:px-4 sm:text-sm"
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