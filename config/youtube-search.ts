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

    // Tutorial - 教学类（how to 是核心区分词）
    {
        query: "Comet browser how to use",
        category: "tutorial",
        locale: "en",
        maxResults: 30,
        minDuration: 120,      // 2分钟+
        maxDuration: 600,      // 10分钟内
    },

    // ProReview - 评测类（review 是核心区分词）
    {
        query: "Comet browser review",
        category: "proReview",
        locale: "en",
        maxResults: 30,
        minDuration: 300,      // 5分钟+（深度内容）
    },

    // Shorts - 快速内容（tips 是核心区分词，时长是物理边界）
    {
        query: "Comet browser tips",
        category: "shorts",
        locale: "en",
        maxResults: 30,
        maxDuration: 90,       // 90秒内
    },

    // ========================================
    // 韩文市场 (ko)
    // ========================================

    // Tutorial - 教学类
    {
        query: "Comet 브라우저 사용법",  // 使用方法（地道表达）
        category: "tutorial",
        locale: "ko",
        maxResults: 30,
        minDuration: 120,
        maxDuration: 600,
    },

    // ProReview - 评测类
    {
        query: "Comet 브라우저 리뷰",  // 评测（韩国人常用 리뷰）
        category: "proReview",
        locale: "ko",
        maxResults: 30,
        minDuration: 300,
    },

    // Shorts - 快速内容
    {
        query: "Comet 브라우저 팁",  // 技巧（韩国人常用 팁，也可用 사용 팁）
        category: "shorts",
        locale: "ko",
        maxResults: 30,
        maxDuration: 90,
    },

    // ========================================
    // 日文市场 (ja)
    // ========================================

    // Tutorial - 教学类
    {
        query: "Comet ブラウザ 使い方",  // 使用方法（日本人最常用）
        category: "tutorial",
        locale: "ja",
        maxResults: 30,
        minDuration: 120,
        maxDuration: 600,
    },

    // ProReview - 评测类
    {
        query: "Comet ブラウザ レビュー",  // 评测（日本人常用 レビュー）
        category: "proReview",
        locale: "ja",
        maxResults: 30,
        minDuration: 300,
    },

    // Shorts - 快速内容
    {
        query: "Comet ブラウザ 使い方 コツ",  // 使用技巧（コツ 比 ヒント 更地道）
        category: "shorts",
        locale: "ja",
        maxResults: 30,
        maxDuration: 90,
    },

    // ========================================
    // 中文市场 (zh)
    // ========================================

    // Tutorial - 教学类
    {
        query: "Comet 浏览器 使用教程",
        category: "tutorial",
        locale: "zh",
        maxResults: 30,
        minDuration: 120,
        maxDuration: 600,
    },

    // ProReview - 评测类
    {
        query: "Comet 浏览器 评测",
        category: "proReview",
        locale: "zh",
        maxResults: 30,
        minDuration: 300,
    },

    // Shorts - 快速内容
    {
        query: "Comet 浏览器 技巧",
        category: "shorts",
        locale: "zh",
        maxResults: 30,
        maxDuration: 90,
    },
];

/**
 * 质量筛选规则
 * 
 * 不同类别有不同的质量要求：
 * - Tutorial: 标准要求（观看数500+，点赞率1.5%+）
 * - ProReview: 更高可信度要求（观看数1000+，点赞率2%+）
 * - Shorts: 标准要求（观看数500+，点赞率1.5%+）
 * - Hero: 从所有类别中精选（观看数2000+，点赞率2%+）
 */
export const QUALITY_FILTERS = {
    tutorial: {
        minViewCount: 500,
        minLikeRatio: 0.015,
        maxAgeInDays: 365,
    },
    proReview: {
        minViewCount: 1000,
        minLikeRatio: 0.02,
        maxAgeInDays: 365,
    },
    shorts: {
        minViewCount: 500,
        minLikeRatio: 0.015,
        maxAgeInDays: 365,
    },
    hero: {
        minViewCount: 2000,
        minLikeRatio: 0.02,
        maxAgeInDays: 365,
    },
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
