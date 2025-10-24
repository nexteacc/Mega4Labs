import type { MetadataRoute } from "next";
import { LOCALES, fallbackLocale } from "@/lib/i18n";
import { BASE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  
  // Generate entries for all language versions
  const localePages = LOCALES.map((locale) => {
    const path = locale === fallbackLocale ? "" : `/${locale}`;
    
    return {
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: locale === fallbackLocale ? 1.0 : 0.9,
    };
  });

  return localePages;
}
