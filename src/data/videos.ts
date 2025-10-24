import type { LandingVideo } from "@/lib/types";

import { LandingVideoArraySchema } from "@/lib/videos";

/**
 * 自动生成的视频数据
 * 生成时间: 2025-10-24T02:56:57.440Z
 * 总数: 0 个视频
 */
const rawVideos: LandingVideo[] = [];

export const videos = LandingVideoArraySchema.parse(rawVideos);
