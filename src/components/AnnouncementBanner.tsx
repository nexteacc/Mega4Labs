"use client";

import type { Locale } from "@/lib/i18n";
import { ANNOUNCEMENT_BANNER, ANNOUNCEMENT_BANNER_MOBILE, DEFAULT_CTA_URL } from "@/lib/i18n";
import { useAnalytics } from "@/hooks/useAnalytics";

type AnnouncementBannerProps = {
  locale: Locale;
};

export function AnnouncementBanner({ locale }: AnnouncementBannerProps) {
  const { track } = useAnalytics();

  const handleClick = () => {
    track("cta_click", {
      locale,
      location: "top_banner",
    });
  };

  return (
    <a
      href={DEFAULT_CTA_URL}
      onClick={handleClick}
      className="block w-full bg-gradient-to-r from-accent via-accent-strong to-[#144b53] px-4 py-3 text-center text-white shadow-[0_4px_12px_rgba(3,94,106,0.25)] transition-all hover:shadow-[0_6px_16px_rgba(3,94,106,0.35)] sm:px-6"
    >
      {/* 桌面端文案 */}
      <span className="hidden text-sm font-medium sm:inline sm:text-base">
        {ANNOUNCEMENT_BANNER[locale]}
      </span>
      
      {/* 移动端文案 */}
      <span className="inline text-sm font-medium sm:hidden">
        {ANNOUNCEMENT_BANNER_MOBILE[locale]}
      </span>
    </a>
  );
}
