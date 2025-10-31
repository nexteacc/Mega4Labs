"use client";

import type { Locale } from "@/lib/i18n";
import { ANNOUNCEMENT_BANNER, ANNOUNCEMENT_BANNER_MOBILE } from "@/lib/i18n";

type AnnouncementBannerProps = {
  locale: Locale;
};

export function AnnouncementBanner({ locale }: AnnouncementBannerProps) {
  return (
    <div
      className="block w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-4 py-3 text-center text-white shadow-[0_4px_12px_rgba(217,119,6,0.25)] sm:px-6"
    >
      {/* 桌面端文案 */}
      <span className="hidden text-sm font-medium sm:inline sm:text-base">
        {ANNOUNCEMENT_BANNER[locale]}
      </span>
      
      {/* 移动端文案 */}
      <span className="inline text-sm font-medium sm:hidden">
        {ANNOUNCEMENT_BANNER_MOBILE[locale]}
      </span>
    </div>
  );
}
