#!/usr/bin/env tsx
/**
 * Video Fetching Script for Mega 4 Labs (Optimized)
 * Strategy: Exa AI (Search Only) + YouTube API (Metadata) + Incremental Updates
 * 
 * Usage:
 * 1. Set EXA_API_KEY and YOUTUBE_API_KEY in .env.local
 * 2. Run: pnpm run fetch-videos [--full]
 */

import { config } from "dotenv";
import { writeFileSync, readFileSync, existsSync } from "fs";
import Exa from "exa-js";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { SEARCH_QUERIES, EXA_CONFIG } from "../src/config/video-search";
import type { LandingVideo } from "../src/lib/types";

const VIDEOS_FILE_PATH = "src/data/videos.json";

// Load .env.local
config({ path: ".env.local" });

const EXA_API_KEY = process.env.EXA_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!EXA_API_KEY) {
  console.error("❌ Error: EXA_API_KEY environment variable not set");
  process.exit(1);
}

if (!YOUTUBE_API_KEY) {
  console.error("❌ Error: YOUTUBE_API_KEY environment variable not set");
  process.exit(1);
}

if (!GOOGLE_API_KEY) {
  console.error("❌ Error: GOOGLE_GENERATIVE_AI_API_KEY environment variable not set");
  process.exit(1);
}

const exa = new Exa(EXA_API_KEY);
const verificationModel = google("gemini-3-flash-preview");

// Command line args
const isFullScan = process.argv.includes("--full");
const INCREMENTAL_MAX_RESULTS = 10;

type YouTubeThumbnail = {
  url: string;
  width: number;
  height: number;
};

type YouTubeThumbnails = {
  default?: YouTubeThumbnail;
  medium?: YouTubeThumbnail;
  high?: YouTubeThumbnail;
  standard?: YouTubeThumbnail;
  maxres?: YouTubeThumbnail;
};

type YouTubeSnippet = {
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnails: YouTubeThumbnails;
};

type YouTubeContentDetails = {
  duration: string;
};

type YouTubeVideoItem = {
  id: string;
  snippet: YouTubeSnippet;
  contentDetails: YouTubeContentDetails;
};

/**
 * Load existing videos
 */
function loadExistingVideos(): { videos: LandingVideo[]; existingIds: Set<string>; personLatestDates: Map<string, Date> } {
  if (!existsSync(VIDEOS_FILE_PATH)) {
    console.log("📂 No existing videos file found, starting fresh\n");
    return { videos: [], existingIds: new Set(), personLatestDates: new Map() };
  }

  try {
    const content = readFileSync(VIDEOS_FILE_PATH, "utf-8");
    const videos = JSON.parse(content) as LandingVideo[];
    const existingIds = new Set(videos.map(v => v.id));
    
    // Find latest video date per person
    const personLatestDates = new Map<string, Date>();
    videos.forEach(v => {
      if (v.person && v.publishDate) {
        const date = new Date(v.publishDate);
        const current = personLatestDates.get(v.person);
        if (!current || date > current) {
          personLatestDates.set(v.person, date);
        }
      }
    });

    console.log(`📂 Loaded ${videos.length} existing videos (${existingIds.size} unique IDs)`);
    console.log("📅 Latest dates per person:", Object.fromEntries(personLatestDates));
    console.log("");

    return { videos, existingIds, personLatestDates };
  } catch (error) {
    console.error("⚠️  Error loading existing videos:", error);
    return { videos: [], existingIds: new Set(), personLatestDates: new Map() };
  }
}

/**
 * Extract YouTube ID from URL
 */
function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

/**
 * Get YouTube video full details
 */
async function getYouTubeDetails(videoIds: string[]): Promise<Map<string, YouTubeVideoItem>> {
  if (videoIds.length === 0) return new Map();

  // YouTube API allows max 50 ids per request
  const chunks = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    chunks.push(videoIds.slice(i, i + 50));
  }

  const results = new Map<string, YouTubeVideoItem>();

  for (const chunk of chunks) {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("key", YOUTUBE_API_KEY!);

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        console.error(`YouTube API error: ${response.status} ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      if (Array.isArray(data.items)) {
        (data.items as YouTubeVideoItem[]).forEach((item) => results.set(item.id, item));
      }
    } catch (error) {
      console.error("   ⚠️  YouTube API request failed:", error);
    }
  }

  return results;
}

function getDurationMinutes(isoDuration: string): number | null {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  const totalMinutes = hours * 60 + minutes + Math.round(seconds / 60);
  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) return null;
  return totalMinutes;
}

/**
 * Convert ISO 8601 duration to human readable format (e.g. "15m")
 */
function parseDuration(isoDuration: string): string {
  const minutes = getDurationMinutes(isoDuration);
  if (minutes === null) return "unknown";
  return minutes + "m";
}

/**
 * Verify videos using Gemini
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
          isRelevant: z.boolean(),
          reason: z.string(),
        })),
      }),
      prompt: `
        Analyze the following list of videos and determine if each one is relevant to "${personName}".
        
        Input Data (JSON):
        ${JSON.stringify(videos, null, 2)}
        
        Task:
        For EACH video, determine if ${personName} is the MAIN subject, guest, or speaker (e.g. interview, speech, podcast guest).
        
        Rules:
        - Return false if the person is only mentioned in credits or briefly mentioned.
        - Return false if it's a different person with the same name.
        - Return true if it is an interview, speech, fireside chat, or presentation by ${personName}.
        
        Return a JSON object with a "results" array.
      `,
    });

    const resultMap = new Map();
    object.results.forEach(r => resultMap.set(r.id, r));
    return resultMap;
  } catch (error) {
    console.error("   ⚠️  Batch LLM Verification failed:", error);
    return new Map();
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 Starting Optimized Video Fetch...");
  console.log(`ℹ️  Mode: ${isFullScan ? "FULL SCAN (ignoring history)" : "INCREMENTAL"}`);
  
  const { videos: existingVideos, existingIds, personLatestDates } = loadExistingVideos();
  const newVideos: LandingVideo[] = [];
  
  // Default start date: 1 year ago if no history
  const defaultStartDate = new Date();
  defaultStartDate.setFullYear(defaultStartDate.getFullYear() - 1);

  for (const searchQuery of SEARCH_QUERIES) {
    const personName = searchQuery.person || searchQuery.query;
    console.log(`\n🔍 Processing: ${personName} (${searchQuery.company})`);
    
    // 1. Determine Start Date
    let startPublishedDate = defaultStartDate.toISOString();
    
    if (!isFullScan && searchQuery.person && personLatestDates.has(searchQuery.person)) {
      const latestDate = personLatestDates.get(searchQuery.person)!;
      // Go back 30 days for safety buffer (since we run weekly now)
      const bufferDate = new Date(latestDate);
      bufferDate.setDate(bufferDate.getDate() - 30);
      startPublishedDate = bufferDate.toISOString();
      console.log(`   📅 Incremental: Searching from ${startPublishedDate} (Latest: ${latestDate.toISOString().split('T')[0]})`);
    } else {
      console.log(`   📅 Full/Initial: Searching from ${startPublishedDate}`);
    }

    // 2. Exa Search (Search Only - Low Cost)
    let searchResults;
    try {
      const effectiveMaxResults = isFullScan
        ? searchQuery.maxResults
        : Math.min(searchQuery.maxResults, INCREMENTAL_MAX_RESULTS);
      searchResults = await exa.search(
        searchQuery.query,
        {
          ...EXA_CONFIG,
          numResults: effectiveMaxResults,
          startPublishedDate: startPublishedDate,
          // We don't need contents, just URLs to get IDs
        }
      );
    } catch (e) {
      console.error(`   ❌ Exa Search failed: ${e}`);
      continue;
    }

    // 3. Filter IDs & Deduplicate
    const potentialIds = new Set<string>();
    searchResults.results.forEach(r => {
      const id = extractVideoId(r.url);
      if (id && !existingIds.has(id)) {
        potentialIds.add(id);
      }
    });
    
    const idsToFetch = Array.from(potentialIds);
    console.log(`   Found ${searchResults.results.length} results -> ${idsToFetch.length} new unique IDs`);
    
    if (idsToFetch.length === 0) continue;

    // 4. Fetch YouTube Metadata (Batch)
    const youtubeDetailsMap = await getYouTubeDetails(idsToFetch);
    console.log(`   Fetched details for ${youtubeDetailsMap.size} videos from YouTube`);

    // 5. Prepare for Verification
    const videosToVerify = [];
    for (const [id, details] of youtubeDetailsMap.entries()) {
      // Basic duration filter (> 20 mins)
      const minutes = getDurationMinutes(details.contentDetails.duration);
      if (minutes === null) continue;
      if (minutes < 20) continue; // Skip shorts/clips/short interviews

      videosToVerify.push({
        id: id,
        title: details.snippet.title,
        description: details.snippet.description.slice(0, 500), // Truncate for token saving
        channelTitle: details.snippet.channelTitle
      });
    }

    // 6. Gemini Verification
    const verificationResults = await verifyVideoRelevanceBatch(videosToVerify, personName);
    
    // 7. Add Valid Videos
    let addedCount = 0;
    for (const v of videosToVerify) {
      const decision = verificationResults.get(v.id);
      if (decision?.isRelevant) {
        const details = youtubeDetailsMap.get(v.id);
        if (!details) continue;
        const snippet = details.snippet;
        
        // Find best thumbnail
        const thumb = snippet.thumbnails.maxres || snippet.thumbnails.high || snippet.thumbnails.medium || snippet.thumbnails.default;
        if (!thumb) continue;

        const newVideo: LandingVideo = {
          id: v.id,
          company: searchQuery.company,
          category: searchQuery.company,
          title: snippet.title,
          description: snippet.description, // Store full description? or truncate? keeping full for now
          channelTitle: snippet.channelTitle,
          publishDate: snippet.publishedAt,
          duration: parseDuration(details.contentDetails.duration),
          platform: "youtube",
          thumbnail: {
            url: thumb.url,
            width: thumb.width,
            height: thumb.height
          },
          person: searchQuery.person
        };
        
        newVideos.push(newVideo);
        existingIds.add(v.id); // Prevent dupes in same run
        addedCount++;
        console.log(`   ✅ Added: ${snippet.title.slice(0, 50)}...`);
      } else {
        // console.log(`   ❌ Skipped: ${v.title.slice(0, 30)}... (${decision?.reason})`);
      }
    }
    console.log(`   ✨ Added ${addedCount} relevant videos for ${personName}`);
  }

  // 8. Save
  if (newVideos.length > 0) {
    const finalVideos = [...existingVideos, ...newVideos];
    // Sort by date desc
    finalVideos.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    
    writeFileSync(VIDEOS_FILE_PATH, JSON.stringify(finalVideos, null, 2));
    console.log(`\n💾 Saved ${newVideos.length} new videos. Total: ${finalVideos.length}`);
  } else {
    console.log("\n🤷 No new relevant videos found.");
  }
}

main().catch(console.error);
