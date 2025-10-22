#!/usr/bin/env tsx
/**
 * YouTube 视频自动抓取脚本
 * 
 * 使用方法：
 * 1. 在 .env.local 中设置 YOUTUBE_API_KEY
 * 2. 运行：npm run fetch-videos
 */

import { config } from "dotenv";
import { writeFileSync } from "fs";
import { SEARCH_QUERIES, QUALITY_FILTERS, YOUTUBE_API_CONFIG } from "../config/youtube-search";
import type { LandingVideo } from "../src/lib/types";

// 加载 .env.local 文件
config({ path: ".env.local" });

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  console.error("❌ 错误：未设置 YOUTUBE_API_KEY 环境变量");
  console.error("请运行：export YOUTUBE_API_KEY=your_api_key");
  process.exit(1);
}

type YouTubeSearchResult = {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      high: { url: string; width: number; height: number };
    };
  };
};

type YouTubeVideoDetails = {
  id: string;
  contentDetails: {
    duration: string; // ISO 8601 格式
  };
  statistics: {
    viewCount: string;
    likeCount: string;
  };
  snippet: {
    tags?: string[];
  };
};

/**
 * 搜索 YouTube 视频
 */
async function searchVideos(query: string, maxResults: number) {
  const url = new URL(`${YOUTUBE_API_CONFIG.baseUrl}/search`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", YOUTUBE_API_CONFIG.type);
  url.searchParams.set("order", YOUTUBE_API_CONFIG.order);
  url.searchParams.set("maxResults", maxResults.toString());
  url.searchParams.set("key", YOUTUBE_API_KEY!);

  // 如果需要代理，可以在这里配置
  const fetchOptions: RequestInit = {
    // agent: new HttpsProxyAgent(process.env.HTTP_PROXY || ""),
  };

  const response = await fetch(url.toString(), fetchOptions);
  
  if (!response.ok) {
    throw new Error(`YouTube API 错误: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.items as YouTubeSearchResult[];
}

/**
 * 获取视频详细信息（时长、观看数等）
 */
async function getVideoDetails(videoIds: string[]) {
  const url = new URL(`${YOUTUBE_API_CONFIG.baseUrl}/videos`);
  url.searchParams.set("part", "contentDetails,statistics,snippet");
  url.searchParams.set("id", videoIds.join(","));
  url.searchParams.set("key", YOUTUBE_API_KEY!);

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`YouTube API 错误: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.items as YouTubeVideoDetails[];
}

/**
 * 将 ISO 8601 时长转换为秒
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");
  
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * 质量筛选
 */
function passesQualityFilter(
  video: YouTubeSearchResult,
  details: YouTubeVideoDetails,
  minDuration?: number,
  maxDuration?: number
): boolean {
  const viewCount = parseInt(details.statistics.viewCount || "0");
  const likeCount = parseInt(details.statistics.likeCount || "0");
  const duration = parseDuration(details.contentDetails.duration);
  const publishDate = new Date(video.snippet.publishedAt);
  const ageInDays = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24);

  // 检查观看数
  if (viewCount < QUALITY_FILTERS.minViewCount) {
    return false;
  }

  // 检查点赞率
  const likeRatio = viewCount > 0 ? likeCount / viewCount : 0;
  if (likeRatio < QUALITY_FILTERS.minLikeRatio) {
    return false;
  }

  // 检查发布时间
  if (ageInDays > QUALITY_FILTERS.maxAgeInDays) {
    return false;
  }

  // 检查时长
  if (minDuration && duration < minDuration) {
    return false;
  }
  if (maxDuration && duration > maxDuration) {
    return false;
  }

  // 检查标题中的排除关键词
  const title = video.snippet.title.toLowerCase();
  if (QUALITY_FILTERS.excludeKeywords.some(keyword => title.includes(keyword))) {
    return false;
  }

  return true;
}

/**
 * 转换为 LandingVideo 格式
 */
function convertToLandingVideo(
  video: YouTubeSearchResult,
  details: YouTubeVideoDetails,
  category: string,
  locale: string
): LandingVideo {
  return {
    id: video.id.videoId,
    locale: locale as any,
    category: category as any,
    title: video.snippet.title,
    description: video.snippet.description,
    channelTitle: video.snippet.channelTitle,
    publishDate: video.snippet.publishedAt.split("T")[0],
    duration: details.contentDetails.duration,
    platform: "youtube",
    thumbnail: {
      url: video.snippet.thumbnails.high.url,
      width: video.snippet.thumbnails.high.width,
      height: video.snippet.thumbnails.high.height,
    },
    tags: details.snippet.tags || [],
  };
}

/**
 * 主函数
 */
async function main() {
  console.log("🚀 开始抓取 YouTube 视频...\n");

  const allVideos: LandingVideo[] = [];
  const seenIds = new Set<string>();

  for (const searchQuery of SEARCH_QUERIES) {
    console.log(`🔍 搜索: "${searchQuery.query}" (${searchQuery.category})`);

    try {
      // 1. 搜索视频
      const searchResults = await searchVideos(
        searchQuery.query,
        searchQuery.maxResults
      );

      if (searchResults.length === 0) {
        console.log(`   ⚠️  未找到结果\n`);
        continue;
      }

      // 2. 获取详细信息
      const videoIds = searchResults.map(v => v.id.videoId);
      const details = await getVideoDetails(videoIds);
      const detailsMap = new Map(details.map(d => [d.id, d]));

      // 3. 筛选和转换
      let accepted = 0;
      for (const video of searchResults) {
        const detail = detailsMap.get(video.id.videoId);
        if (!detail) continue;

        // 去重
        if (seenIds.has(video.id.videoId)) continue;

        // 质量筛选
        if (!passesQualityFilter(
          video,
          detail,
          searchQuery.minDuration,
          searchQuery.maxDuration
        )) {
          continue;
        }

        // 转换格式
        const landingVideo = convertToLandingVideo(
          video,
          detail,
          searchQuery.category,
          searchQuery.locale
        );

        allVideos.push(landingVideo);
        seenIds.add(video.id.videoId);
        accepted++;
      }

      console.log(`   ✅ 接受 ${accepted}/${searchResults.length} 个视频\n`);

      // 避免超过 API 配额，添加延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`   ❌ 错误: ${error}`);
      if (error instanceof Error) {
        console.error(`   详情: ${error.message}`);
        if (error.cause) {
          console.error(`   原因: ${error.cause}`);
        }
      }
      console.log();
    }
  }

  // 4. 按发布日期排序
  allVideos.sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  // 5. 生成文件
  const output = `import type { LandingVideo } from "@/lib/types";

import { LandingVideoArraySchema } from "@/lib/videos";

/**
 * 自动生成的视频数据
 * 生成时间: ${new Date().toISOString()}
 * 总数: ${allVideos.length} 个视频
 */
const rawVideos: LandingVideo[] = ${JSON.stringify(allVideos, null, 2)};

export const videos = LandingVideoArraySchema.parse(rawVideos);
`;

  writeFileSync("src/data/videos.ts", output, "utf-8");

  console.log(`\n✨ 完成！共抓取 ${allVideos.length} 个视频`);
  console.log(`📝 已写入: src/data/videos.ts`);
  
  // 统计
  const stats = allVideos.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log("\n📊 分类统计:");
  Object.entries(stats).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} 个`);
  });
}

main().catch(console.error);
