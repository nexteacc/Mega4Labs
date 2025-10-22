/**
 * YouTube 搜索配置
 * 定义要搜索的关键词和筛选规则
 */

export type SearchQuery = {
    query: string;
    category: "hero" | "tutorial" | "demo" | "proReview" | "shorts";
    locale: "en" | "ko" | "ja" | "zh";
    maxResults: number;
    minDuration?: number; // 秒
    maxDuration?: number; // 秒
};

export const SEARCH_QUERIES: SearchQuery[] = [
    // Hero 视频 - 精选高质量教程
    {
        query: "Comet browser Perplexity tutorial",
        category: "hero",
        locale: "en",
        maxResults: 5,
        minDuration: 180, // 至少3分钟
    },

    // Tutorial 视频 - 入门教程
    {
        query: "Comet browser getting started",
        category: "tutorial",
        locale: "en",
        maxResults: 10,
        minDuration: 300, // 至少5分钟
    },
    {
        query: "Perplexity AI how to use",
        category: "tutorial",
        locale: "en",
        maxResults: 10,
        minDuration: 300,
    },

    // Demo 视频 - 实战演示
    {
        query: "Comet browser workflow demo",
        category: "demo",
        locale: "en",
        maxResults: 8,
        minDuration: 480, // 至少8分钟
    },
    {
        query: "Perplexity AI productivity",
        category: "demo",
        locale: "en",
        maxResults: 8,
        minDuration: 480,
    },

    // Review 视频 - 深度评测
    {
        query: "Comet browser review",
        category: "proReview",
        locale: "en",
        maxResults: 5,
        minDuration: 600, // 至少10分钟
    },

    // Shorts 视频 - 快速技巧
    {
        query: "Comet browser tips",
        category: "shorts",
        locale: "en",
        maxResults: 10,
        maxDuration: 60, // 最多60秒
    },

    // 其他语言
    {
        query: "Comet 브라우저 사용법",
        category: "tutorial",
        locale: "ko",
        maxResults: 5,
        minDuration: 180,
    },
    {
        query: "Comet ブラウザ 使い方",
        category: "tutorial",
        locale: "ja",
        maxResults: 5,
        minDuration: 180,
    },
    {
        query: "Comet 浏览器 教程",
        category: "tutorial",
        locale: "zh",
        maxResults: 5,
        minDuration: 180,
    },
];

/**
 * 质量筛选规则
 */
export const QUALITY_FILTERS = {
    minViewCount: 500, // 最少观看数
    minLikeRatio: 0.7, // 最低点赞率（点赞数/观看数）
    maxAgeInDays: 365, // 最多1年内的视频
    excludeKeywords: [
        "clickbait",
        "scam",
        "fake",
        "spam",
    ],
};

/**
 * YouTube API 配置
 */
export const YOUTUBE_API_CONFIG = {
    baseUrl: "https://www.googleapis.com/youtube/v3",
    order: "relevance" as const, // relevance | date | viewCount | rating
    type: "video" as const,
    videoDuration: "any" as const, // any | short | medium | long
};
