#!/usr/bin/env tsx
/**
 * YouTube Video Fetching Script for Mega 4 Labs
 *
 * Usage:
 * 1. Set YOUTUBE_API_KEY in .env.local
 * 2. Run: npm run fetch-videos
 */

import { config } from "dotenv";
import { writeFileSync } from "fs";
import { SEARCH_QUERIES, QUALITY_FILTERS, YOUTUBE_API_CONFIG } from "../config/youtube-search";
import type { LandingVideo, Company } from "../src/lib/types";

// Load .env.local
config({ path: ".env.local" });

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  console.error("❌ Error: YOUTUBE_API_KEY environment variable not set");
  console.error("Please run: export YOUTUBE_API_KEY=your_api_key");
  process.exit(1);
}

type YouTubeSearchResult = {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      high: { url: string; width: number; height: number };
    };
  };
};

type YouTubeVideoDetails = {
  id: string;
  contentDetails: {
    duration: string; // ISO 8601 format
  };
  statistics: {
    viewCount: string;
    likeCount: string;
  };
  snippet: {
    tags?: string[];
  };
};

/**
 * Search YouTube videos
 */
async function searchVideos(query: string, maxResults: number) {
  const url = new URL(`${YOUTUBE_API_CONFIG.baseUrl}/search`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", YOUTUBE_API_CONFIG.type);
  url.searchParams.set("order", YOUTUBE_API_CONFIG.order);
  url.searchParams.set("maxResults", maxResults.toString());
  url.searchParams.set("key", YOUTUBE_API_KEY!);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.items as YouTubeSearchResult[];
}

/**
 * Get video details (duration, view count, etc.)
 */
async function getVideoDetails(videoIds: string[]) {
  const url = new URL(`${YOUTUBE_API_CONFIG.baseUrl}/videos`);
  url.searchParams.set("part", "contentDetails,statistics,snippet");
  url.searchParams.set("id", videoIds.join(","));
  url.searchParams.set("key", YOUTUBE_API_KEY!);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.items as YouTubeVideoDetails[];
}

/**
 * Parse ISO 8601 duration to seconds
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Quality filtering
 */
function passesQualityFilter(
  video: YouTubeSearchResult,
  details: YouTubeVideoDetails,
  minDuration?: number,
  maxDuration?: number
): { passed: boolean; reason?: string; stats?: Record<string, unknown> } {
  const viewCount = parseInt(details.statistics.viewCount || "0");
  const likeCount = parseInt(details.statistics.likeCount || "0");
  const duration = parseDuration(details.contentDetails.duration);
  const publishDate = new Date(video.snippet.publishedAt);
  const ageInDays = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
  const likeRatio = viewCount > 0 ? likeCount / viewCount : 0;

  const stats = {
    title: video.snippet.title.substring(0, 50),
    viewCount,
    likeCount,
    likeRatio: (likeRatio * 100).toFixed(2) + "%",
    ageInDays: Math.floor(ageInDays),
    duration: Math.floor(duration / 60) + "m" + (duration % 60) + "s",
    publishDate: video.snippet.publishedAt.split("T")[0],
  };

  const filters = QUALITY_FILTERS.default;

  // Check view count
  if (viewCount < filters.minViewCount) {
    return { passed: false, reason: `View count too low (${viewCount} < ${filters.minViewCount})`, stats };
  }

  // Check like ratio
  if (likeRatio < filters.minLikeRatio) {
    return { passed: false, reason: `Like ratio too low (${(likeRatio * 100).toFixed(2)}% < ${filters.minLikeRatio * 100}%)`, stats };
  }

  // Check age
  if (ageInDays > filters.maxAgeInDays) {
    return { passed: false, reason: `Too old (${Math.floor(ageInDays)} days > ${filters.maxAgeInDays} days)`, stats };
  }

  // Check duration
  if (minDuration && duration < minDuration) {
    return { passed: false, reason: `Too short (${Math.floor(duration)}s < ${minDuration}s)`, stats };
  }
  if (maxDuration && duration > maxDuration) {
    return { passed: false, reason: `Too long (${Math.floor(duration)}s > ${maxDuration}s)`, stats };
  }

  return { passed: true, stats };
}

/**
 * Extended video type with stats for Hero selection
 */
type LandingVideoWithStats = LandingVideo & {
  viewCount: number;
  likeRatio: number;
};

/**
 * Convert to LandingVideo format
 */
function convertToLandingVideo(
  video: YouTubeSearchResult,
  details: YouTubeVideoDetails,
  company: Company,
  person?: string
): LandingVideoWithStats {
  const viewCount = parseInt(details.statistics.viewCount || "0");
  const likeCount = parseInt(details.statistics.likeCount || "0");
  const likeRatio = viewCount > 0 ? likeCount / viewCount : 0;

  return {
    id: video.id.videoId,
    company,
    category: company,
    title: video.snippet.title,
    description: video.snippet.description || "No description available",
    channelTitle: video.snippet.channelTitle,
    publishDate: video.snippet.publishedAt.split("T")[0],
    duration: details.contentDetails.duration,
    platform: "youtube",
    thumbnail: {
      url: video.snippet.thumbnails.high.url,
      width: video.snippet.thumbnails.high.width,
      height: video.snippet.thumbnails.high.height,
    },
    tags: details.snippet.tags || [],
    person,
    viewCount,
    likeRatio,
  };
}

/**
 * Main function
 */
async function main() {
  console.log("🚀 Starting YouTube video fetch for Mega 4 Labs...\n");
  console.log("📋 Strategy:");
  console.log("   - Fetching videos for 4 companies: OpenAI, Cursor, Google, Anthropic");
  console.log("   - Hero videos selected from top performers\n");

  // Store videos by company
  const videosByCompany: Record<Company, LandingVideoWithStats[]> = {
    openai: [],
    cursor: [],
    google: [],
    anthropic: [],
  };

  // Global deduplication
  const seenIds = new Set<string>();

  for (const searchQuery of SEARCH_QUERIES) {
    console.log(`🔍 Searching: "${searchQuery.query}" (${searchQuery.company}${searchQuery.person ? ` - ${searchQuery.person}` : ""})`);

    try {
      // 1. Search videos
      const searchResults = await searchVideos(
        searchQuery.query,
        searchQuery.maxResults
      );

      if (searchResults.length === 0) {
        console.log(`   ⚠️  No results found\n`);
        continue;
      }

      console.log(`   📊 Found ${searchResults.length} raw results`);

      // 2. Get video details
      const videoIds = searchResults.map(v => v.id.videoId);
      const details = await getVideoDetails(videoIds);
      const detailsMap = new Map(details.map(d => [d.id, d]));

      // 3. Filter and convert
      let accepted = 0;
      let duplicates = 0;
      const filterReasons: Record<string, number> = {};

      for (const video of searchResults) {
        const detail = detailsMap.get(video.id.videoId);
        if (!detail) {
          console.log(`   ⚠️  Could not get video details: ${video.snippet.title.substring(0, 40)}`);
          continue;
        }

        // Deduplication
        if (seenIds.has(video.id.videoId)) {
          duplicates++;
          continue;
        }

        // Quality filter
        const filterResult = passesQualityFilter(
          video,
          detail,
          searchQuery.minDuration,
          searchQuery.maxDuration
        );

        if (!filterResult.passed) {
          console.log(`   ❌ Filtered: ${filterResult.stats?.title}`);
          console.log(`      Reason: ${filterResult.reason}`);

          filterReasons[filterResult.reason!] = (filterReasons[filterResult.reason!] || 0) + 1;
          continue;
        }

        // Convert format
        const landingVideo = convertToLandingVideo(
          video,
          detail,
          searchQuery.company,
          searchQuery.person
        );

        console.log(`   ✅ Passed: ${filterResult.stats?.title}`);
        console.log(`      Stats: ${filterResult.stats?.viewCount} views | ${filterResult.stats?.likeRatio} likes | ${filterResult.stats?.ageInDays} days ago | ${filterResult.stats?.duration}`);

        videosByCompany[searchQuery.company].push(landingVideo);
        seenIds.add(video.id.videoId);
        accepted++;
      }

      console.log(`\n   📈 Result: ${accepted}/${searchResults.length} passed filters`);
      if (duplicates > 0) {
        console.log(`   🔄 Deduplicated: ${duplicates} duplicates`);
      }
      if (Object.keys(filterReasons).length > 0) {
        console.log(`   📋 Filter reasons:`);
        Object.entries(filterReasons).forEach(([reason, count]) => {
          console.log(`      - ${reason}: ${count}`);
        });
      }
      console.log();

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`   ❌ Error: ${error}`);
      if (error instanceof Error) {
        console.error(`   Details: ${error.message}`);
      }
      console.log();
    }
  }

  // 4. Select Hero videos from all companies
  console.log("🌟 Selecting Hero videos...");
  const allCompanyVideos = [
    ...videosByCompany.openai,
    ...videosByCompany.cursor,
    ...videosByCompany.google,
    ...videosByCompany.anthropic,
  ];

  const heroFilters = QUALITY_FILTERS.hero;
  const heroVideos = allCompanyVideos
    .filter(v => {
      const meetsStandard =
        v.viewCount >= heroFilters.minViewCount &&
        v.likeRatio >= heroFilters.minLikeRatio;

      if (meetsStandard) {
        console.log(`   ✅ Hero candidate: ${v.title.substring(0, 40)} (${v.viewCount} views, ${(v.likeRatio * 100).toFixed(2)}% likes)`);
      }

      return meetsStandard;
    })
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 4) // Top 4
    .map(v => {
      const { viewCount, likeRatio, ...videoData } = v;
      return { ...videoData, category: "hero" as const };
    });

  console.log(`   ✨ Selected ${heroVideos.length} Hero videos (criteria: ${heroFilters.minViewCount}+ views, ${heroFilters.minLikeRatio * 100}%+ likes)\n`);

  // 5. Merge all videos (remove stats)
  const allVideos: LandingVideo[] = [
    ...heroVideos,
    ...videosByCompany.openai.map(({ viewCount, likeRatio, ...v }) => v),
    ...videosByCompany.cursor.map(({ viewCount, likeRatio, ...v }) => v),
    ...videosByCompany.google.map(({ viewCount, likeRatio, ...v }) => v),
    ...videosByCompany.anthropic.map(({ viewCount, likeRatio, ...v }) => v),
  ];

  // 6. Sort by publish date
  allVideos.sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  // 7. Generate output file
  const output = `import type { LandingVideo } from "@/lib/types";

import { LandingVideoArraySchema } from "@/lib/videos";

/**
 * Auto-generated video data for Mega 4 Labs
 * Generated: ${new Date().toISOString()}
 * Total: ${allVideos.length} videos
 *
 * Companies: OpenAI, Cursor, Google, Anthropic
 * Hero videos selected from top performers
 */
const rawVideos: LandingVideo[] = ${JSON.stringify(allVideos, null, 2)};

export const videos = LandingVideoArraySchema.parse(rawVideos);
`;

  writeFileSync("src/data/videos.ts", output, "utf-8");

  console.log(`\n✨ Done! Fetched ${allVideos.length} videos`);
  console.log(`📝 Written to: src/data/videos.ts`);

  // Stats by company
  const companyStats = allVideos.reduce((acc, v) => {
    acc[v.company] = (acc[v.company] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("\n📊 By Company:");
  Object.entries(companyStats).forEach(([company, count]) => {
    console.log(`   ${company}: ${count} videos`);
  });

  // Stats by category
  const categoryStats = allVideos.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("\n📊 By Category:");
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} videos`);
  });

  // Generate JSON report
  const report = {
    timestamp: new Date().toISOString(),
    totalVideos: allVideos.length,
    totalSearches: SEARCH_QUERIES.length,
    byCompany: companyStats,
    byCategory: categoryStats,
    strategy: {
      companies: ["openai", "cursor", "google", "anthropic"],
      heroSelectionStrategy: "Top 4 by view count from all companies",
    },
    latestVideos: allVideos.slice(0, 5).map(v => ({
      id: v.id,
      title: v.title,
      company: v.company,
      person: v.person,
      publishDate: v.publishDate,
    })),
  };

  writeFileSync("reports/latest-fetch.json", JSON.stringify(report, null, 2), "utf-8");
  console.log(`📄 Report saved: reports/latest-fetch.json`);
}

main().catch(console.error);
