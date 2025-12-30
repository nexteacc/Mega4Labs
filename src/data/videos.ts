import type { LandingVideo } from "@/lib/types";

import { LandingVideoArraySchema } from "@/lib/videos";

/**
 * Auto-generated video data for Mega 4 Labs
 * Generated: 2025-12-30T12:09:06.556Z
 * Total: 0 videos
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
const rawVideos: LandingVideo[] = [];

export const videos = LandingVideoArraySchema.parse(rawVideos);
