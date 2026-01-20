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
import { writeFileSync, readFileSync, existsSync } from "fs";
import Exa from "exa-js";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { SEARCH_QUERIES, CONFIG, EXA_CONFIG } from "../src/config/video-search";
import type { LandingVideo, Company } from "../src/lib/types";

const VIDEOS_FILE_PATH = "src/data/videos.json";

// Load .env.local
config({ path: ".env.local" });

const EXA_API_KEY = process.env.EXA_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

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

if (!GOOGLE_API_KEY) {
  console.error("❌ Error: GOOGLE_GENERATIVE_AI_API_KEY environment variable not set");
  console.error("Please add GOOGLE_GENERATIVE_AI_API_KEY to .env.local");
  process.exit(1);
}

const exa = new Exa(EXA_API_KEY);
const verificationModel = google("gemini-3-flash-preview");

/**
 * Load existing videos from videos.ts file
 * Returns existing videos and a Set of their IDs for deduplication
 */
function loadExistingVideos(): { videos: LandingVideo[]; existingIds: Set<string> } {
  if (!existsSync(VIDEOS_FILE_PATH)) {
    console.log("📂 No existing videos file found, starting fresh\n");
    return { videos: [], existingIds: new Set() };
  }

  try {
    const content = readFileSync(VIDEOS_FILE_PATH, "utf-8");
    const videos = JSON.parse(content) as LandingVideo[];
    const existingIds = new Set(videos.map(v => v.id));

    console.log(`📂 Loaded ${videos.length} existing videos (${existingIds.size} unique IDs)\n`);

    return { videos, existingIds };
  } catch (error) {
    console.error("⚠️  Error loading existing videos:", error);
    return { videos: [], existingIds: new Set() };
  }
}

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
 * Verify a batch of videos for relevance using LLM (Gemini Flash)
 */
async function verifyVideoRelevanceBatch(
  videos: { id: string; title: string; description: string; channelTitle: string }[],
  personName: string
): Promise<Map<string, { isRelevant: boolean; reason: string }>> {
  if (videos.length === 0) return new Map();

  try {
    const { object } = await generateObject({
      model: verificationModel,
      schema: z.object({
        results: z.array(z.object({
          id: z.string(),
          isRelevant: z.boolean().describe("Whether the video is primarily featuring the person."),
          reason: z.string().describe("Brief reason for the decision."),
        })),
      }),
      prompt: `
        Analyze the following list of videos and determine if each one is relevant to "${personName}".
        
        Input Data (JSON):
        ${JSON.stringify(videos, null, 2)}
        
        Task:
        For EACH video, determine if ${personName} is the MAIN subject, guest, or speaker (e.g. interview, speech, podcast guest).
        
        Rules:
        - Return false if the person is only mentioned in credits (e.g. "Music by ${personName}", "Edited by ${personName}").
        - Return false if the person is only briefly mentioned or is a topic of discussion without being present (unless it's a deep dive documentary).
        - Return false if it's a different person with the same name.
        - Return true if it is an interview, speech, fireside chat, or presentation by ${personName}.
        
        Return a JSON object with a "results" array containing the decision for each video.
      `,
    });

    const resultMap = new Map<string, { isRelevant: boolean; reason: string }>();
    object.results.forEach(r => resultMap.set(r.id, { isRelevant: r.isRelevant, reason: r.reason }));
    
    // Fill in missing ones as false (fail-closed)
    videos.forEach(v => {
      if (!resultMap.has(v.id)) {
        resultMap.set(v.id, { isRelevant: false, reason: "LLM missed this video" });
      }
    });

    return resultMap;
  } catch (error) {
    console.error("   ⚠️  Batch LLM Verification failed:", error);
    return new Map(); // Fail all
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
  console.log("   - Exa AI: Auto search (neural/keyword)");
  console.log("   - YouTube API: Precise duration metadata");
  console.log("   - Organization: By person (interview subjects)");
  console.log("   - Mode: INCREMENTAL (preserve existing + add new)\n");

  // Load existing videos for incremental update
  const { videos: existingVideos } = loadExistingVideos();
  // Filter out hero videos from existing (we'll re-select heroes later)
  const existingNonHeroVideos = existingVideos.filter(v => v.category !== "hero");

  // Store NEW videos by company (only newly fetched)
  const newVideosByCompany: Record<Company, LandingVideo[]> = {
    openai: [],
    cursor: [],
    google: [],
    anthropic: [],
  };

  // Global deduplication: start with existing IDs
  const seenIds = new Set<string>(existingVideos.map(v => v.id));

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

      // Step 2: Extract video IDs
      const videoIds: string[] = [];
      const exaResultsMap = new Map<string, ExaResult>();

      for (const exaResult of result.results) {
        const videoId = extractVideoId(exaResult.url);
        // Filter: must have videoId, title, publishedDate
        if (videoId && !seenIds.has(videoId) && exaResult.title && exaResult.publishedDate) {
          videoIds.push(videoId);
          exaResultsMap.set(videoId, exaResult as ExaResult);
        }
      }

      // Step 3: Filter duplicates and prepare candidates
      const candidates: { id: string; exaResult: ExaResult }[] = [];
      let accepted = 0;
      let duplicates = 0;

      for (const [videoId, exaResult] of exaResultsMap) {
        if (seenIds.has(videoId)) {
          duplicates++;
          continue;
        }
        candidates.push({ id: videoId, exaResult });
      }

      // Step 4: Batch Verification (AI First)
      const verificationResults = new Map<string, { isRelevant: boolean; reason: string }>();
      
      if (searchQuery.person && candidates.length > 0) {
        console.log(`      🤖 Batch verifying ${candidates.length} videos for "${searchQuery.person}"... `);
        
        const batchInput = candidates.map(c => ({
          id: c.id,
          title: c.exaResult.title || "",
          description: c.exaResult.summary || c.exaResult.text || "",
          channelTitle: c.exaResult.author || ""
        }));
        
        const results = await verifyVideoRelevanceBatch(batchInput, searchQuery.person);
        results.forEach((v, k) => verificationResults.set(k, v));
      } else {
        // If no person specified, assume relevant
        candidates.forEach(c => verificationResults.set(c.id, { isRelevant: true, reason: "No person specified" }));
      }

      // Collect IDs that passed AI verification
      const passedVideoIds: string[] = [];
      for (const candidate of candidates) {
        const verification = verificationResults.get(candidate.id);
        
        // Fail-Closed Logic
        if (searchQuery.person) {
          if (!verification || !verification.isRelevant) {
             continue; // Skip failed videos
          }
        }
        passedVideoIds.push(candidate.id);
      }

      // Step 5: Fetch YouTube metadata ONLY for verified videos
      console.log(`   🎬 Fetching YouTube metadata for ${passedVideoIds.length} verified videos...`);
      const youtubeDetailsMap = await getYouTubeDetails(passedVideoIds);

      // Step 6: Process results
      for (const candidate of candidates) {
        const videoId = candidate.id;
        const exaResult = candidate.exaResult;
        const verification = verificationResults.get(videoId);

        // Fail-Closed Logic (Logging)
        if (searchQuery.person) {
          if (!verification) {
             console.log(`❌ Rejected: ${exaResult.title?.substring(0, 30)}... (Verification missing/failed)`);
             continue;
          }
          if (!verification.isRelevant) {
            console.log(`❌ Rejected: ${exaResult.title?.substring(0, 30)}... (${verification.reason})`);
            continue;
          }
          console.log(`✅ Accepted: ${exaResult.title?.substring(0, 30)}...`);
        }

        // Get details (might be undefined if YouTube fetch failed, but we handle that)
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

        newVideosByCompany[searchQuery.company].push(landingVideo);
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

  // Combine all non-hero videos (existing + newly fetched)
  const newVideosFlat = Object.values(newVideosByCompany).flat();
  const allCandidates = [...existingNonHeroVideos, ...newVideosFlat];

  // Sort by date (newest first) to prepare for Hero selection
  allCandidates.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  // Select Hero videos (top 4 most recent)
  // Note: We create distinct "hero" entries while preserving the original company entries
  const heroVideos = allCandidates
    .slice(0, CONFIG.heroCount)
    .map(v => ({ ...v, category: "hero" as const }));

  console.log(`   ✨ Selected ${heroVideos.length} Hero videos (most recent)\n`);
  heroVideos.forEach(v => {
    console.log(`   - ${v.title.substring(0, 50)} (${v.company} - ${v.person}, ${v.publishDate})`);
  });

  // Merge all videos: Heroes + All Candidates (Company versions)
  // This preserves the pattern where a video exists as both a "hero" and a regular company video
  const allVideos: LandingVideo[] = [
    ...heroVideos,
    ...allCandidates,
  ];

  // Final sort by publish date (newest first)
  allVideos.sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  // Final validation before writing:
  // Ensure we are not accidentally wiping the database with an empty or suspiciously small dataset.
  // Safety threshold: The new dataset should have at least 50% of the count of the existing dataset (unless it was empty).
  if (existingNonHeroVideos.length > 10 && allVideos.length < existingNonHeroVideos.length * 0.5) {
    console.error(`\n❌ CRITICAL ERROR: New dataset size (${allVideos.length}) is significantly smaller than existing dataset (${existingNonHeroVideos.length}).`);
    console.error("   Aborting write operation to prevent data loss.");
    console.error("   Please check the logs for AI verification failures or API errors.");
    process.exit(1);
  }

  // Generate output file
  writeFileSync("src/data/videos.json", JSON.stringify(allVideos, null, 2), "utf-8");

  console.log(`\n✨ Done! Fetched ${allVideos.length} videos`);
  console.log(`📝 Written to: src/data/videos.json`);

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
      filtering: "Date range + domain + LLM Semantic Verification",
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
