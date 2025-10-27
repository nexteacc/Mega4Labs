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
async function searchVideos(query: string, maxResults: number, locale?: string) {
  const url = new URL(`${YOUTUBE_API_CONFIG.baseUrl}/search`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", YOUTUBE_API_CONFIG.type);
  url.searchParams.set("order", YOUTUBE_API_CONFIG.order);
  url.searchParams.set("maxResults", maxResults.toString());
  url.searchParams.set("key", YOUTUBE_API_KEY!);

  // 添加语言过滤（优先返回特定语言的视频）
  // 注意：只对非英文语言添加过滤，英文不限制以获得更多结果
  if (locale && locale !== "en") {
    const languageMap: Record<string, string> = {
      ko: "ko",
      ja: "ja",
      zh: "zh", // 中文（包含简体和繁体）
    };
    const relevanceLanguage = languageMap[locale];
    if (relevanceLanguage) {
      url.searchParams.set("relevanceLanguage", relevanceLanguage);
    }
  }

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
 * 检测视频语言是否匹配
 * 通过标题和描述中的字符特征判断
 */
function detectVideoLanguage(video: YouTubeSearchResult): string {
  const text = (video.snippet.title + " " + video.snippet.description).toLowerCase();

  // 韩文字符检测
  if (/[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text)) {
    return "ko";
  }

  // 日文字符检测（平假名、片假名、汉字）
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
    return "ja";
  }

  // 中文字符检测（包含简体和繁体）
  if (/[\u4E00-\u9FFF]/.test(text)) {
    // 进一步区分：如果有日文假名，优先判定为日文
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
      return "ja";
    }
    return "zh"; // 包含简体中文和繁体中文
  }

  // 默认为英文
  return "en";
}

/**
 * 检查视频语言是否匹配目标语言
 */
function isLanguageMatch(video: YouTubeSearchResult, targetLocale: string): boolean {
  const detectedLang = detectVideoLanguage(video);

  // 英文市场：接受英文视频
  if (targetLocale === "en" && detectedLang === "en") {
    return true;
  }

  // 非英文市场：优先匹配目标语言
  if (targetLocale !== "en") {
    // 如果检测到目标语言，直接通过
    if (detectedLang === targetLocale) {
      return true;
    }

    // 如果是英文视频，检查是否包含目标语言的关键词
    if (detectedLang === "en") {
      const text = (video.snippet.title + " " + video.snippet.description).toLowerCase();
      const hasTargetLanguageKeywords =
        (targetLocale === "ko" && /[\uAC00-\uD7AF]/.test(text)) ||
        (targetLocale === "ja" && /[\u3040-\u309F\u30A0-\u30FF]/.test(text)) ||
        (targetLocale === "zh" && /[\u4E00-\u9FFF]/.test(text));

      // 如果英文视频中包含目标语言关键词，也可以接受
      return hasTargetLanguageKeywords;
    }
  }

  return false;
}

/**
 * 质量筛选
 */
function passesQualityFilter(
  video: YouTubeSearchResult,
  details: YouTubeVideoDetails,
  minDuration?: number,
  maxDuration?: number
): { passed: boolean; reason?: string; stats?: any } {
  const viewCount = parseInt(details.statistics.viewCount || "0");
  const likeCount = parseInt(details.statistics.likeCount || "0");
  const duration = parseDuration(details.contentDetails.duration);
  const publishDate = new Date(video.snippet.publishedAt);
  const ageInDays = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
  const likeRatio = viewCount > 0 ? likeCount / viewCount : 0;

  const stats = {
    title: video.snippet.title.substring(0, 50),
    viewCount,
    likeCount,
    likeRatio: (likeRatio * 100).toFixed(2) + "%",
    ageInDays: Math.floor(ageInDays),
    duration: Math.floor(duration / 60) + "分" + (duration % 60) + "秒",
    publishDate: video.snippet.publishedAt.split("T")[0],
  };

  // 检查观看数
  if (viewCount < QUALITY_FILTERS.minViewCount) {
    return { passed: false, reason: `观看数不足 (${viewCount} < ${QUALITY_FILTERS.minViewCount})`, stats };
  }

  // 检查点赞率
  if (likeRatio < QUALITY_FILTERS.minLikeRatio) {
    return { passed: false, reason: `点赞率不足 (${(likeRatio * 100).toFixed(2)}% < ${QUALITY_FILTERS.minLikeRatio * 100}%)`, stats };
  }

  // 检查发布时间
  if (ageInDays > QUALITY_FILTERS.maxAgeInDays) {
    return { passed: false, reason: `发布时间过久 (${Math.floor(ageInDays)}天 > ${QUALITY_FILTERS.maxAgeInDays}天)`, stats };
  }

  // 检查时长
  if (minDuration && duration < minDuration) {
    return { passed: false, reason: `时长过短 (${Math.floor(duration)}秒 < ${minDuration}秒)`, stats };
  }
  if (maxDuration && duration > maxDuration) {
    return { passed: false, reason: `时长过长 (${Math.floor(duration)}秒 > ${maxDuration}秒)`, stats };
  }

  return { passed: true, stats };
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
    description: video.snippet.description || "No description available",
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
      // 1. 搜索视频（传入 locale 参数进行语言过滤）
      const searchResults = await searchVideos(
        searchQuery.query,
        searchQuery.maxResults,
        searchQuery.locale
      );

      if (searchResults.length === 0) {
        console.log(`   ⚠️  未找到结果\n`);
        continue;
      }

      console.log(`   📊 找到 ${searchResults.length} 个原始结果`);

      // 2. 获取详细信息
      const videoIds = searchResults.map(v => v.id.videoId);
      const details = await getVideoDetails(videoIds);
      const detailsMap = new Map(details.map(d => [d.id, d]));

      // 3. 筛选和转换
      let accepted = 0;
      let duplicates = 0;
      const filterReasons: Record<string, number> = {};

      for (const video of searchResults) {
        const detail = detailsMap.get(video.id.videoId);
        if (!detail) {
          console.log(`   ⚠️  无法获取视频详情: ${video.snippet.title.substring(0, 40)}`);
          continue;
        }

        // 去重
        if (seenIds.has(video.id.videoId)) {
          duplicates++;
          continue;
        }

        // 语言匹配检测
        if (!isLanguageMatch(video, searchQuery.locale)) {
          const detectedLang = detectVideoLanguage(video);
          console.log(`   🌐 语言不匹配: ${video.snippet.title.substring(0, 40)}`);
          console.log(`      期望: ${searchQuery.locale} | 检测到: ${detectedLang}`);
          filterReasons["语言不匹配"] = (filterReasons["语言不匹配"] || 0) + 1;
          continue;
        }

        // 质量筛选
        const filterResult = passesQualityFilter(
          video,
          detail,
          searchQuery.minDuration,
          searchQuery.maxDuration
        );

        if (!filterResult.passed) {
          console.log(`   ❌ 过滤: ${filterResult.stats?.title}`);
          console.log(`      原因: ${filterResult.reason}`);
          console.log(`      数据: 观看${filterResult.stats?.viewCount} | 点赞率${filterResult.stats?.likeRatio} | ${filterResult.stats?.ageInDays}天前 | ${filterResult.stats?.duration}`);

          filterReasons[filterResult.reason!] = (filterReasons[filterResult.reason!] || 0) + 1;
          continue;
        }

        // 转换格式
        const landingVideo = convertToLandingVideo(
          video,
          detail,
          searchQuery.category,
          searchQuery.locale
        );

        console.log(`   ✅ 通过: ${filterResult.stats?.title}`);
        console.log(`      数据: 观看${filterResult.stats?.viewCount} | 点赞率${filterResult.stats?.likeRatio} | ${filterResult.stats?.ageInDays}天前 | ${filterResult.stats?.duration}`);

        allVideos.push(landingVideo);
        seenIds.add(video.id.videoId);
        accepted++;
      }

      console.log(`\n   📈 结果: ${accepted}/${searchResults.length} 个通过筛选`);
      if (duplicates > 0) {
        console.log(`   🔄 去重: ${duplicates} 个重复`);
      }
      if (Object.keys(filterReasons).length > 0) {
        console.log(`   📋 过滤原因统计:`);
        Object.entries(filterReasons).forEach(([reason, count]) => {
          console.log(`      - ${reason}: ${count} 个`);
        });
      }
      console.log();

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

  // 生成 JSON 报告
  const report = {
    timestamp: new Date().toISOString(),
    totalVideos: allVideos.length,
    byCategory: stats,
    byLocale: allVideos.reduce((acc, v) => {
      acc[v.locale] = (acc[v.locale] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    latestVideos: allVideos.slice(0, 5).map(v => ({
      id: v.id,
      title: v.title,
      category: v.category,
      publishDate: v.publishDate,
    })),
  };

  writeFileSync("reports/latest-fetch.json", JSON.stringify(report, null, 2), "utf-8");
  console.log(`📄 报告已保存: reports/latest-fetch.json`);
}

main().catch(console.error);
