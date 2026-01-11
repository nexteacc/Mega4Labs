import type { LandingVideo } from "@/lib/types";
import { LandingVideoArraySchema } from "@/lib/videos";
import rawVideosData from "./videos.json";

/**
 * Auto-generated video data for Mega 4 Labs
 * NOW MANAGED IN: src/data/videos.json
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
const rawVideos = rawVideosData as LandingVideo[];

export const videos = LandingVideoArraySchema.parse(rawVideos);
