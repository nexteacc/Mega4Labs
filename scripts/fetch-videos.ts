#!/usr/bin/env tsx
import { config } from "dotenv";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { tavily } from "@tavily/core";
import { SEARCH_QUERIES, TAVILY_CONFIG } from "../src/config/video-search";
import type { LandingVideo } from "../src/lib/types";

const VIDEOS_FILE_PATH = "src/data/videos.json";

config({ path: ".env.local" });

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!TAVILY_API_KEY) {
  console.error("❌ Error: TAVILY_API_KEY environment variable not set");
  process.exit(1);
}

if (!YOUTUBE_API_KEY) {
  console.error("❌ Error: YOUTUBE_API_KEY environment variable not set");
  process.exit(1);
}

const tavilyClient = tavily({ apiKey: TAVILY_API_KEY });

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
function extractVideoId(value: string): string | null {
  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, "");
    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] || null;
    } else if (hostname === "youtube.com" || hostname.endsWith(".youtube.com")) {
      videoId = url.searchParams.get("v");
      if (!videoId) {
        const segments = url.pathname.split("/").filter(Boolean);
        if (["embed", "live", "shorts"].includes(segments[0])) {
          videoId = segments[1] || null;
        }
      }
    }

    return videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
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

function getDurationSeconds(isoDuration: string): number | null {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return null;
  return totalSeconds;
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

    let searchResults;
    try {
      const effectiveMaxResults = isFullScan
        ? searchQuery.maxResults
        : Math.min(searchQuery.maxResults, INCREMENTAL_MAX_RESULTS);
      const query = `${searchQuery.query}. Return full-length interviews, podcasts, fireside chats, Q&A sessions, or talks where ${personName} is an actual guest or speaker. Exclude commentary, reactions, clips, highlights, Shorts, and videos that only mention ${personName}.`;
      searchResults = await tavilyClient.search(query, {
        ...TAVILY_CONFIG,
        maxResults: effectiveMaxResults,
        startDate: startPublishedDate.split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      });
    } catch (e) {
      console.error(`   ❌ Tavily Search failed: ${e}`);
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

    const eligibleVideos: string[] = [];
    for (const [id, details] of youtubeDetailsMap.entries()) {
      const seconds = getDurationSeconds(details.contentDetails.duration);
      if (seconds === null || seconds < 20 * 60) continue;
      eligibleVideos.push(id);
    }

    let addedCount = 0;
    for (const id of eligibleVideos) {
      const details = youtubeDetailsMap.get(id);
      if (!details) continue;
      const snippet = details.snippet;
      const thumb = snippet.thumbnails.maxres || snippet.thumbnails.high || snippet.thumbnails.medium || snippet.thumbnails.default;
      if (!thumb) continue;

      const newVideo: LandingVideo = {
        id,
        company: searchQuery.company,
        category: searchQuery.company,
        title: snippet.title,
        description: snippet.description,
        channelTitle: snippet.channelTitle,
        publishDate: snippet.publishedAt,
        duration: details.contentDetails.duration,
        platform: "youtube",
        thumbnail: {
          url: thumb.url,
          width: thumb.width,
          height: thumb.height
        },
        person: searchQuery.person
      };

      newVideos.push(newVideo);
      existingIds.add(id);
      addedCount++;
      console.log(`   ✅ Added: ${snippet.title.slice(0, 50)}...`);
    }
    console.log(`   ✨ Added ${addedCount} eligible videos for ${personName}`);
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
