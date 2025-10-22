"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, resolveLocale, type Locale } from "@/lib/i18n";
import { useAnalytics } from "@/hooks/useAnalytics";
import clsx from "clsx";

type LanguageSwitcherProps = Readonly<{
  currentLocale?: Locale;
  className?: string;
}>;

const buildPathForLocale = ({
  pathname,
  targetLocale,
}: {
  pathname?: string | null;
  targetLocale: Locale;
}) => {
  if (!pathname) return `/${targetLocale}`;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return `/${targetLocale}`;
  }

  const firstSegment = segments[0];
  if (LOCALES.includes(firstSegment as Locale)) {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }

  return `/${segments.join("/") || targetLocale}`;
};

export function LanguageSwitcher({
  currentLocale = "en",
  className,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { track } = useAnalytics();

  const options = useMemo(
    () => LOCALES.map((locale) => ({ value: locale, label: LOCALE_LABELS[locale] })),
    [],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const nextLocale = resolveLocale(event.target.value);
      if (nextLocale === currentLocale) return;

      const nextPath = buildPathForLocale({
        pathname,
        targetLocale: nextLocale,
      });

      track("language_switch", {
        from_locale: currentLocale,
        to_locale: nextLocale,
        next_path: nextPath,
      });

      router.push(nextPath);
    },
    [currentLocale, pathname, router, track],
  );

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border border-border bg-panel px-3 py-1.5 shadow-sm",
        className,
      )}
    >
      <span className="text-xs font-medium text-secondary">Language</span>
      <select
        className="appearance-none bg-transparent text-sm font-semibold text-primary focus:outline-none"
        value={currentLocale}
        onChange={handleChange}
        aria-label="Switch language"
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <span aria-hidden className="text-secondary">⌄</span>
    </div>
  );
}