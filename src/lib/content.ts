import { videos } from "@/data/videos";
import {
  LOCALES,
  MODULE_COPY,
  MODULE_TITLES,
  fallbackLocale,
  resolveLocale,
  type Locale,
} from "@/lib/i18n";
import type { LandingVideo, VideoModule } from "@/lib/types";

const MODULE_ORDER: VideoModule["category"][] = [
  "tutorial",
  "proReview",
  "shorts",
];

const sortByPublishDateDesc = (items: LandingVideo[]): LandingVideo[] =>
  [...items].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );

const dedupeById = (items: LandingVideo[]): LandingVideo[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
};

const collectVideosForLocale = (locale: Locale): LandingVideo[] => {
  const normalized = resolveLocale(locale);
  const localized = videos.filter((video) => video.locale === normalized);

  if (localized.length > 0) {
    return dedupeById(sortByPublishDateDesc(localized));
  }

  const fallbackVideos = videos.filter((video) => video.locale === fallbackLocale);
  return dedupeById(sortByPublishDateDesc(fallbackVideos));
};

export const getAllVideosForLocale = (locale: Locale): LandingVideo[] =>
  collectVideosForLocale(locale);

export const getHeroVideos = (locale: Locale): LandingVideo[] => {
  const pool = collectVideosForLocale(locale);
  const heroes = pool.filter((video) => video.category === "hero");

  if (heroes.length > 0) {
    return heroes.slice(0, 4);
  }

  const fallbackHeroes = videos.filter(
    (video) => video.locale === fallbackLocale && video.category === "hero",
  );

  return sortByPublishDateDesc(fallbackHeroes).slice(0, 4);
};

export const getVideoModules = (locale: Locale): VideoModule[] => {
  const pool = collectVideosForLocale(locale);

  return MODULE_ORDER.reduce<VideoModule[]>((accumulator, category) => {
    const categoryVideos = pool.filter((video) => video.category === category);
    if (categoryVideos.length === 0) {
      return accumulator;
    }

    const localizedTitle = MODULE_TITLES[locale]?.[category];
    const fallbackTitle = MODULE_TITLES[fallbackLocale][category];
    const localizedCopy = MODULE_COPY[locale]?.[category];
    const fallbackCopy = MODULE_COPY[fallbackLocale][category];

    accumulator.push({
      category,
      title: localizedTitle ?? fallbackTitle,
      description: localizedCopy ?? fallbackCopy,
      videos: categoryVideos,
    });

    return accumulator;
  }, []);
};

export const isSupportedLocale = (locale: string): locale is Locale =>
  LOCALES.includes(locale as Locale);
