import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import {
  LOCALES,
  HERO_HEADLINE,
  HERO_SUBHEAD,
  SEO_KEYWORDS,
  SEO_SITE_NAME,
  fallbackLocale,
  buildHeroSupporting,
} from "@/lib/i18n";
import type { LandingVideo } from "@/lib/types";
import { formatVideoUrl } from "@/lib/format";
import { getVideoCount } from "@/lib/video-stats";

export const BASE_URL = "https://perplexitypro.info";
export const SITE_AUTHOR = "perplexitypro.info";
export const THEME_COLOR = "#21808d";

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

export const buildPageTitle = (locale: Locale) => {
  const headline = HERO_HEADLINE[locale].replace(/\n/g, " ");
  return `${headline} | ${SEO_SITE_NAME[locale]}`;
};

export const buildPageDescription = (locale: Locale) => {
  const videoCount = getVideoCount();
  const heroSupporting = buildHeroSupporting(locale, videoCount);
  return `${HERO_SUBHEAD[locale]} ${heroSupporting}`;
};

export const buildKeywords = (locale: Locale) => SEO_KEYWORDS[locale];

export const buildOpenGraph = (locale: Locale): NonNullable<Metadata["openGraph"]> => ({
  title: HERO_HEADLINE[locale].replace(/\n/g, " "),
  description: HERO_SUBHEAD[locale],
  url: buildLocaleUrl(locale),
  siteName: SEO_SITE_NAME[locale],
  locale,
  type: "website",
  alternateLocale: LOCALES.filter((code) => code !== locale),
});

export const buildTwitterCard = (locale: Locale): NonNullable<Metadata["twitter"]> => ({
  card: "summary_large_image",
  title: SEO_SITE_NAME[locale],
  description: HERO_SUBHEAD[locale],
  images: [`${BASE_URL}/twitter-image.jpg`],
});



export const buildWebsiteJsonLd = (locale: Locale): string => {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SEO_SITE_NAME[locale],
      url: buildLocaleUrl(locale),
      description: buildPageDescription(locale),
      inLanguage: locale,
      author: {
        "@type": "Organization",
        name: SITE_AUTHOR,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    null,
    2
  );
};

export const buildOrganizationJsonLd = (): string => {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_AUTHOR,
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      sameAs: ["https://www.youtube.com/@perplexity_ai"],
    },
    null,
    2
  );
};

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