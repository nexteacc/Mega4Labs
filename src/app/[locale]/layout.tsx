import type { ReactNode } from "react";
import { LOCALES, fallbackLocale, type Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

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

  return (
    <div className="min-h-screen bg-base">
      <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-6 pb-6 pt-8 sm:px-8 lg:px-10">
        <div className="rounded-full bg-hero px-4 py-1 text-sm font-medium text-accent">
          Comet × Perplexity Learning Hub
        </div>
        <LanguageSwitcher currentLocale={locale} />
      </header>
      <main>{children}</main>
    </div>
  );
}