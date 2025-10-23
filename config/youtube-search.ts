/**
 * YouTube 搜索配置
 * 定义要搜索的关键词和筛选规则
 */

export type SearchQuery = {
    query: string;
    category: "hero" | "tutorial" | "proReview" | "shorts";
    locale: "en" | "ko" | "ja" | "zh";
    maxResults: number;
    minDuration?: number; // 秒
    maxDuration?: number; // 秒
};

export const SEARCH_QUERIES: SearchQuery[] = [
    // ========================================
    // 英文市场 (en)
    // ========================================
    
    // Hero - 精选教程（需要 3-4 个）
    {
        query: "Comet browser complete guide",
        category: "hero",
        locale: "en",
        maxResults: 5,
        minDuration: 180,
    },
    {
        query: "Perplexity Comet browser tutorial",
        category: "hero",
        locale: "en",
        maxResults: 5,
        minDuration: 180,
    },

    // Tutorial - 教程主体（需要 8+ 个）
    {
        query: "Comet browser tutorial",
        category: "tutorial",
        locale: "en",
        maxResults: 10,
        minDuration: 120,
    },
    {
        query: "Comet browser how to use",
        category: "tutorial",
        locale: "en",
        maxResults: 10,
        minDuration: 120,
    },
    {
        query: "Comet AI browser guide",
        category: "tutorial",
        locale: "en",
        maxResults: 10,
        minDuration: 120,
    },

    // ProReview - 深度测评
    {
        query: "Comet browser review",
        category: "proReview",
        locale: "en",
        maxResults: 8,
        minDuration: 300,
    },
    {
        query: "Perplexity Comet browser review",
        category: "proReview",
        locale: "en",
        maxResults: 8,
        minDuration: 300,
    },

    // Shorts - 快速技巧
    {
        query: "Comet browser tips",
        category: "shorts",
        locale: "en",
        maxResults: 10,
        maxDuration: 90,
    },
    {
        query: "Comet browser features",
        category: "shorts",
        locale: "en",
        maxResults: 10,
        maxDuration: 90,
    },

    // ========================================
    // 韩文市场 (ko)
    // ========================================
    
    // Hero - 精选教程
    {
        query: "Comet 브라우저 완벽 가이드",
        category: "hero",
        locale: "ko",
        maxResults: 5,
        minDuration: 180,
    },
    {
        query: "Perplexity Comet 브라우저 튜토리얼",
        category: "hero",
        locale: "ko",
        maxResults: 5,
        minDuration: 180,
    },

    // Tutorial - 教程主体
    {
        query: "Comet 브라우저 사용법",
        category: "tutorial",
        locale: "ko",
        maxResults: 10,
        minDuration: 120,
    },
    {
        query: "Comet AI 브라우저 가이드",
        category: "tutorial",
        locale: "ko",
        maxResults: 10,
        minDuration: 120,
    },

    // ProReview - 深度测评
    {
        query: "Comet 브라우저 리뷰",
        category: "proReview",
        locale: "ko",
        maxResults: 8,
        minDuration: 300,
    },

    // Shorts - 快速技巧
    {
        query: "Comet 브라우저 팁",
        category: "shorts",
        locale: "ko",
        maxResults: 10,
        maxDuration: 90,
    },

    // ========================================
    // 日文市场 (ja)
    // ========================================
    
    // Hero - 精选教程
    {
        query: "Comet ブラウザ 完全ガイド",
        category: "hero",
        locale: "ja",
        maxResults: 5,
        minDuration: 180,
    },
    {
        query: "Perplexity Comet ブラウザ チュートリアル",
        category: "hero",
        locale: "ja",
        maxResults: 5,
        minDuration: 180,
    },

    // Tutorial - 教程主体
    {
        query: "Comet ブラウザ 使い方",
        category: "tutorial",
        locale: "ja",
        maxResults: 10,
        minDuration: 120,
    },
    {
        query: "Comet AI ブラウザ ガイド",
        category: "tutorial",
        locale: "ja",
        maxResults: 10,
        minDuration: 120,
    },

    // ProReview - 深度测评
    {
        query: "Comet ブラウザ レビュー",
        category: "proReview",
        locale: "ja",
        maxResults: 8,
        minDuration: 300,
    },

    // Shorts - 快速技巧
    {
        query: "Comet ブラウザ ヒント",
        category: "shorts",
        locale: "ja",
        maxResults: 10,
        maxDuration: 90,
    },

    // ========================================
    // 中文市场 (zh)
    // ========================================
    
    // Hero - 精选教程
    {
        query: "Comet 浏览器 完整指南",
        category: "hero",
        locale: "zh",
        maxResults: 5,
        minDuration: 180,
    },
    {
        query: "Perplexity Comet 浏览器 教程",
        category: "hero",
        locale: "zh",
        maxResults: 5,
        minDuration: 180,
    },

    // Tutorial - 教程主体
    {
        query: "Comet 浏览器 使用教程",
        category: "tutorial",
        locale: "zh",
        maxResults: 10,
        minDuration: 120,
    },
    {
        query: "Comet AI 浏览器 指南",
        category: "tutorial",
        locale: "zh",
        maxResults: 10,
        minDuration: 120,
    },

    // ProReview - 深度测评
    {
        query: "Comet 浏览器 评测",
        category: "proReview",
        locale: "zh",
        maxResults: 8,
        minDuration: 300,
    },

    // Shorts - 快速技巧
    {
        query: "Comet 浏览器 技巧",
        category: "shorts",
        locale: "zh",
        maxResults: 10,
        maxDuration: 90,
    },
];

/**
 * 质量筛选规则
 * 
 * minViewCount: 最少观看数（1000 = 确保视频有一定热度）
 * minLikeRatio: 最低点赞率（0.05 = 5%，确保高质量内容）
 * maxAgeInDays: 最多发布天数（365 = 1年内，确保内容时效性）
 */
export const QUALITY_FILTERS = {
    minViewCount: 1000,
    minLikeRatio: 0.05,
    maxAgeInDays: 365,
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
