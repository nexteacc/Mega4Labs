import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import {
  LOCALES,
  HERO_HEADLINE,
  HERO_SUBHEAD,
  HERO_SUPPORTING,
  fallbackLocale,
} from "@/lib/i18n";
import type { LandingVideo } from "@/lib/types";
import { formatVideoUrl } from "@/lib/format";

export const BASE_URL = "https://www.perplexitypro.info";

export const buildLocalePath = (locale: Locale) =>
  locale === fallbackLocale ? "/" : `/${locale}`;

export const buildLocaleUrl = (locale: Locale) =>
  `${BASE_URL}${buildLocalePath(locale)}`;

export const buildAlternates = (locale: Locale): NonNullable<Metadata["alternates"]> => {
  const languages: Record<string, string> = {};
  LOCALES.forEach((code) => {
    languages[code] = buildLocaleUrl(code);
  });

  return {
    canonical: buildLocaleUrl(locale),
    languages,
  };
};

export const buildPageTitle = (locale: Locale) =>
  `${HERO_HEADLINE[locale]} · Comet × Perplexity Learning Hub`;

export const buildPageDescription = (locale: Locale) =>
  `${HERO_SUBHEAD[locale]} ${HERO_SUPPORTING[locale]}`;

export const buildOpenGraph = (locale: Locale): NonNullable<Metadata["openGraph"]> => ({
  title: buildPageTitle(locale),
  description: buildPageDescription(locale),
  url: buildLocaleUrl(locale),
  siteName: "Comet × Perplexity Learning Hub",
  locale,
  type: "website",
  alternateLocale: LOCALES.filter((code) => code !== locale),
});

export const buildTwitterCard = (locale: Locale): NonNullable<Metadata["twitter"]> => ({
  card: "summary_large_image",
  title: buildPageTitle(locale),
  description: buildPageDescription(locale),
});

export const buildVideoItemListJsonLd = (
  locale: Locale,
  videos: LandingVideo[],
): string => {
  const itemListElement = videos.map((video, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: formatVideoUrl(video.id),
    item: {
      "@type": "VideoObject",
      name: video.title,
      description: video.description,
      thumbnailUrl: [video.thumbnail.url],
      uploadDate: video.publishDate,
      duration: video.duration,
      inLanguage: locale,
      author: {
        "@type": "Person",
        name: video.channelTitle,
      },
      embedUrl: formatVideoUrl(video.id),
    },
  }));

  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Comet × Perplexity Learning Videos",
      numberOfItems: videos.length,
      itemListElement,
    },
    null,
    2,
  );
};