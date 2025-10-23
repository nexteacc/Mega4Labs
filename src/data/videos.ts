import type { LandingVideo } from "@/lib/types";

import { LandingVideoArraySchema } from "@/lib/videos";

/**
 * 视频数据
 * 
 * 运行 `npm run fetch-videos` 来抓取 YouTube 视频数据
 */
const rawVideos: LandingVideo[] = [];

export const videos = LandingVideoArraySchema.parse(rawVideos);
