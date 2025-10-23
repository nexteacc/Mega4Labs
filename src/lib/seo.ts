import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import {
  LOCALES,
  HERO_HEADLINE,
  HERO_SUBHEAD,
  HERO_SUPPORTING,
  SEO_KEYWORDS,
  SEO_SITE_NAME,
  fallbackLocale,
} from "@/lib/i18n";
import type { LandingVideo } from "@/lib/types";
import { formatVideoUrl } from "@/lib/format";

export const BASE_URL = "https://www.perplexitypro.info";
export const SITE_AUTHOR = "www.perplexitypro.info";
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

export const buildPageDescription = (locale: Locale) =>
  `${HERO_SUBHEAD[locale]} ${HERO_SUPPORTING[locale]}`;

export const buildKeywords = (locale: Locale) => SEO_KEYWORDS[locale];

export const buildOpenGraph = (locale: Locale): NonNullable<Metadata["openGraph"]> => ({
  title: buildPageTitle(locale),
  description: buildPageDescription(locale),
  url: buildLocaleUrl(locale),
  siteName: SEO_SITE_NAME[locale],
  locale,
  type: "website",
  alternateLocale: LOCALES.filter((code) => code !== locale),
  images: [
    {
      url: `${BASE_URL}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: SEO_SITE_NAME[locale],
    },
  ],
});

export const buildTwitterCard = (locale: Locale): NonNullable<Metadata["twitter"]> => ({
  card: "summary_large_image",
  title: HERO_HEADLINE[locale].replace(/\n/g, " "),
  description: HERO_SUBHEAD[locale],
  images: [`${BASE_URL}/og-image.jpg`],
  creator: "@perplexity_ai",
  site: "@perplexity_ai",
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