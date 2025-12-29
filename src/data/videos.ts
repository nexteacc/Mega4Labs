import type { LandingVideo } from "@/lib/types";

import { LandingVideoArraySchema } from "@/lib/videos";

/**
 * Placeholder video data for MEGA 4 LAB
 * Run `npm run fetch-videos` to populate with real data
 *
 * Companies: OpenAI, Cursor, DeepMind, Anthropic
 */
const rawVideos: LandingVideo[] = [];

export const videos = LandingVideoArraySchema.parse(rawVideos);
