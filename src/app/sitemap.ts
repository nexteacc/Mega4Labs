import type { MetadataRoute } from "next";
import { LOCALES, fallbackLocale } from "@/lib/i18n";
import { BASE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // 使用固定日期，只在内容真正更新时才改变
  // Google 不喜欢 lastModified 频繁变化但内容不变的情况
  const lastModified = "2025-10-30"; // 手动更新此日期当内容变化时
  
  const localePages = LOCALES.map((locale) => {
    const path = locale === fallbackLocale ? "" : `/${locale}`;
    
    return {
      url: `${BASE_URL}${path}`,
      lastModified: lastModified,
      changeFrequency: "weekly" as const,
      priority: locale === fallbackLocale ? 1.0 : 0.9,
    };
  });

  return localePages;
}
