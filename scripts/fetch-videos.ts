#!/usr/bin/env tsx
/**
 * Video Fetching Script for Mega 4 Labs
 * Strategy: Exa AI for search + YouTube API for metadata
 *
 * Usage:
 * 1. Set EXA_API_KEY and YOUTUBE_API_KEY in .env.local
 * 2. Run: pnpm run fetch-videos
 */

import { config } from "dotenv";
import { writeFileSync } from "fs";
import Exa from "exa-js";
import { SEARCH_QUERIES, CONFIG, EXA_CONFIG } from "../src/config/video-search";
import type { LandingVideo, Company } from "../src/lib/types";

// Load .env.local
config({ path: ".env.local" });

const EXA_API_KEY = process.env.EXA_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!EXA_API_KEY) {
  console.error("❌ Error: EXA_API_KEY environment variable not set");
  console.error("Please add EXA_API_KEY to .env.local");
  process.exit(1);
}

if (!YOUTUBE_API_KEY) {
  console.error("❌ Error: YOUTUBE_API_KEY environment variable not set");
  console.error("Please add YOUTUBE_API_KEY to .env.local");
  process.exit(1);
}

const exa = new Exa(EXA_API_KEY);

type ExaResult = {
  id: string;
  title: string | null;
  url: string;
  publishedDate?: string;
  author?: string;
  text?: string;
  summary?: string;
  image?: string;
};

type YouTubeVideoDetails = {
  id: string;
  contentDetails: {
    duration: string; // ISO 8601 format
  };
};

/**
 * Extract YouTube video ID from URL
 */
function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

/**
 * Get YouTube video details (duration only)
 */
async function getYouTubeDetails(videoIds: string[]): Promise<Map<string, YouTubeVideoDetails>> {
  if (videoIds.length === 0) return new Map();
  
  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "contentDetails");  // Only get duration
  url.searchParams.set("id", videoIds.join(","));
  url.searchParams.set("key", YOUTUBE_API_KEY!);
  
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    const details = data.items as YouTubeVideoDetails[];
    return new Map(details.map(d => [d.id, d]));
  } catch (error) {
    console.error("   ⚠️  YouTube API error:", error);
    return new Map();
  }
}

/**
 * Format video stats for logging
 */
function formatVideoStats(
  result: ExaResult,
  youtubeDetails?: YouTubeVideoDetails
): Record<string, unknown> {
  const publishDate = result.publishedDate ? new Date(result.publishedDate) : new Date();
  const ageInDays = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
  
  let duration = "unknown";
  
  if (youtubeDetails) {
    const match = youtubeDetails.contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (match) {
      const hours = parseInt(match[1] || "0");
      const minutes = parseInt(match[2] || "0");
      const seconds = parseInt(match[3] || "0");
      const totalMinutes = hours * 60 + minutes + Math.round(seconds / 60);
      duration = totalMinutes + "m";
    }
  }
  
  return {
    title: (result.title || "Untitled").substring(0, 50),
    author: result.author || "Unknown",
    ageInDays: Math.floor(ageInDays),
    duration,
    publishDate: result.publishedDate?.split("T")[0] || "Unknown",
  };
}

/**
 * Convert Exa result to LandingVideo format with YouTube metadata
 */
function convertToLandingVideo(
  result: ExaResult,
  company: Company,
  youtubeDetails?: YouTubeVideoDetails,
  person?: string
): LandingVideo {
  const videoId = extractVideoId(result.url);
  const duration = youtubeDetails?.contentDetails.duration || "PT30M";
  
  return {
    id: videoId || result.id,
    company,
    category: company,
    title: result.title || "Untitled",
    description: result.summary || result.text?.substring(0, 200) || "No description available",
    channelTitle: result.author || "Unknown",
    publishDate: result.publishedDate?.split("T")[0] || new Date().toISOString().split("T")[0],
    duration,
    platform: "youtube",
    thumbnail: {
      url: result.image || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      width: 480,
      height: 360,
    },
    tags: [],
    person,
  };
}

/**
 * Main function
 */
async function main() {
  console.log("🚀 Starting video fetch for Mega 4 Labs...\n");
  console.log("📋 Strategy:");
  console.log("   - Exa AI: Auto search (neural/keyword) with minimal filtering");
  console.log("   - YouTube API: Precise duration metadata");
  console.log("   - Organization: By person (interview subjects)");
  console.log("   - Trust Exa's AI: No manual quality filtering\n");
  
  // Store videos by company
  const videosByCompany: Record<Company, LandingVideo[]> = {
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
      // Step 1: Search with Exa AI (with native filtering)
      const result = await exa.searchAndContents(
        searchQuery.query,
        {
          ...EXA_CONFIG,
          numResults: searchQuery.maxResults,
        }
      );
      
      if (!result.results || result.results.length === 0) {
        console.log(`   ⚠️  No results found\n`);
        continue;
      }
      
      console.log(`   📊 Found ${result.results.length} results from Exa AI`);
      
      // Step 2: Extract video IDs and get YouTube metadata
      const videoIds: string[] = [];
      const exaResultsMap = new Map<string, ExaResult>();
      
      for (const exaResult of result.results) {
        const videoId = extractVideoId(exaResult.url);
        // Filter: must have videoId, title, and publishedDate
        if (videoId && !seenIds.has(videoId) && exaResult.title && exaResult.publishedDate) {
          videoIds.push(videoId);
          exaResultsMap.set(videoId, exaResult as ExaResult);
        }
      }
      
      console.log(`   🎬 Fetching YouTube metadata for ${videoIds.length} videos...`);
      const youtubeDetailsMap = await getYouTubeDetails(videoIds);
      
      // Step 3: Convert and deduplicate
      let accepted = 0;
      let duplicates = 0;
      
      for (const [videoId, exaResult] of exaResultsMap) {
        // Deduplication
        if (seenIds.has(videoId)) {
          duplicates++;
          continue;
        }
        
        const youtubeDetails = youtubeDetailsMap.get(videoId);
        const stats = formatVideoStats(exaResult, youtubeDetails);
        
        // Convert format
        const landingVideo = convertToLandingVideo(
          exaResult,
          searchQuery.company,
          youtubeDetails,
          searchQuery.person
        );
        
        console.log(`   ✅ Added: ${stats.title}`);
        console.log(`      Stats: ${stats.duration} | ${stats.ageInDays} days ago`);
        if (exaResult.summary) {
          console.log(`      Summary: ${exaResult.summary.substring(0, 80)}...`);
        }
        
        videosByCompany[searchQuery.company].push(landingVideo);
        seenIds.add(videoId);
        accepted++;
      }
      
      console.log(`\n   📈 Result: ${accepted}/${result.results.length} videos added`);
      if (duplicates > 0) {
        console.log(`   🔄 Deduplicated: ${duplicates} duplicates`);
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
  
  // Select Hero videos (most recent from each company)
  console.log("🌟 Selecting Hero videos...");
  const allCompanyVideos = [
    ...videosByCompany.openai,
    ...videosByCompany.cursor,
    ...videosByCompany.google,
    ...videosByCompany.anthropic,
  ];
  
  // Sort all videos by publish date (newest first) and take top 4 as heroes
  const heroVideos = allCompanyVideos
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, CONFIG.heroCount)
    .map(v => ({ ...v, category: "hero" as const }));
  
  console.log(`   ✨ Selected ${heroVideos.length} Hero videos (most recent)\n`);
  heroVideos.forEach(v => {
    console.log(`   - ${v.title.substring(0, 50)} (${v.company} - ${v.person}, ${v.publishDate})`);
  });
  
  // Sort each company's videos by publish date (newest first)
  Object.keys(videosByCompany).forEach(company => {
    videosByCompany[company as Company].sort((a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  });
  
  // Merge all videos
  const allVideos: LandingVideo[] = [
    ...heroVideos,
    ...videosByCompany.openai,
    ...videosByCompany.cursor,
    ...videosByCompany.google,
    ...videosByCompany.anthropic,
  ];
  
  // Final sort by publish date (newest first)
  allVideos.sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
  
  // Generate output file
  const output = `import type { LandingVideo } from "@/lib/types";

import { LandingVideoArraySchema } from "@/lib/videos";

/**
 * Auto-generated video data for Mega 4 Labs
 * Generated: ${new Date().toISOString()}
 * Total: ${allVideos.length} videos
 * 
 * Strategy:
 * - Exa AI: Auto search with minimal filtering + auto-generated summaries
 * - YouTube API: Precise duration metadata
 * - Organization: By person (interview subjects)
 * - Trust Exa's AI: No manual quality filtering
 *
 * Companies: OpenAI, Cursor, Google, Anthropic
 * Hero videos: Most recent 4 from all companies
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
  
  // Stats by person
  const personStats = allVideos.reduce((acc, v) => {
    if (v.person) {
      acc[v.person] = (acc[v.person] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  console.log("\n📊 By Person:");
  Object.entries(personStats).forEach(([person, count]) => {
    console.log(`   ${person}: ${count} videos`);
  });
  
  // Generate JSON report
  const report = {
    timestamp: new Date().toISOString(),
    source: "Exa AI + YouTube API",
    totalVideos: allVideos.length,
    totalSearches: SEARCH_QUERIES.length,
    byCompany: companyStats,
    byPerson: personStats,
    strategy: {
      searchEngine: "Exa AI auto search (neural/keyword)",
      metadataSource: "YouTube API (duration only)",
      filtering: "Minimal - date range (2 years) + domain (youtube.com)",
      organization: "By person (interview subjects)",
      heroSelection: "Most recent 4 videos from all companies",
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
