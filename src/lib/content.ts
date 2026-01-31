import { videos } from "@/data/videos";
import {
  COMPANIES,
  COMPANY_TITLES,
  COMPANY_DESCRIPTIONS,
  COMPANY_COLORS,
} from "@/lib/i18n";
import { AI_LEADERS } from "@/config/video-search";
import type { LandingVideo, VideoModule, Company } from "@/lib/types";

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

/**
 * Get all videos sorted by publish date
 */
export const getAllVideos = (): LandingVideo[] =>
  dedupeById(sortByPublishDateDesc(videos));

/**
 * Get hero videos (top 4)
 */
export const getHeroVideos = (): LandingVideo[] => {
  const heroes = videos.filter((video) => video.category === "hero");

  if (heroes.length > 0) {
    return heroes.slice(0, 4);
  }

  // Fallback: pick one from each company
  const fallbackHeroes: LandingVideo[] = [];
  for (const company of COMPANIES) {
    const companyVideo = videos.find((v) => v.company === company);
    if (companyVideo) {
      fallbackHeroes.push(companyVideo);
    }
  }

  return fallbackHeroes.slice(0, 4);
};

/**
 * Get video modules organized by company
 */
export const getVideoModules = (): VideoModule[] => {
  return COMPANIES.map((company) => {
    const companyVideos = videos.filter(
      (video) => video.company === company && video.category !== "hero"
    );

    return {
      company,
      displayName: COMPANY_TITLES[company],
      description: COMPANY_DESCRIPTIONS[company],
      color: COMPANY_COLORS[company],
      videos: sortByPublishDateDesc(companyVideos),
    };
  }).filter((module) => module.videos.length > 0);
};

/**
 * Get videos for a specific company
 */
export const getVideosByCompany = (company: Company): LandingVideo[] => {
  return dedupeById(
    sortByPublishDateDesc(videos.filter((v) => v.company === company))
  );
};

/**
 * Get videos for a specific person (optimized with direct filter)
 */
export const getVideosByPerson = (personName: string): LandingVideo[] => {
  return dedupeById(
    sortByPublishDateDesc(videos.filter((v) => v.person === personName))
  );
};

/**
 * Get total person count
 */
export const getPersonCount = (): number => {
  let count = 0;
  for (const company of COMPANIES) {
    if (AI_LEADERS[company]) {
      count += AI_LEADERS[company].people.length;
    }
  }
  return count;
};

/**
 * Get total video count
 */
export const getVideoCount = (): number => videos.length;
