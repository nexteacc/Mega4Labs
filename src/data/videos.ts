import type { LandingVideo } from "@/lib/types";

import { LandingVideoArraySchema } from "@/lib/videos";

/**
 * 自动生成的视频数据
 * 生成时间: 2025-10-25T10:30:49.580Z
 * 总数: 1 个视频
 */
const rawVideos: LandingVideo[] = [
  {
    "id": "qSNRGeZuHeI",
    "locale": "ja",
    "category": "hero",
    "title": "COMET EXPLICADO FÁCIL. Automatiza con navegador agéntico#ia #ai #inteligenciaartificial #perplexity",
    "description": "No description available",
    "channelTitle": "maxmaxdata",
    "publishDate": "2025-10-10",
    "duration": "PT3M",
    "platform": "youtube",
    "thumbnail": {
      "url": "https://i.ytimg.com/vi/qSNRGeZuHeI/hqdefault.jpg",
      "width": 480,
      "height": 360
    },
    "tags": []
  }
];

export const videos = LandingVideoArraySchema.parse(rawVideos);
