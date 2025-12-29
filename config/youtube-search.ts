/**
 * YouTube Search Configuration for Mega 4 Labs
 * Defines search queries for AI industry leaders
 */

import type { Company } from "@/lib/types";

export type SearchQuery = {
  query: string;
  company: Company;
  person?: string;
  maxResults: number;
  minDuration?: number; // seconds
  maxDuration?: number; // seconds
};

/**
 * AI Leaders Configuration
 */
export const AI_LEADERS = {
  openai: {
    name: "OpenAI",
    displayName: "OpenAI / ChatGPT",
    color: "#10A37F",
    people: [
      { name: "Sam Altman", role: "CEO" },
      { name: "Kevin Weil", role: "CPO" },
    ],
  },
  cursor: {
    name: "Cursor",
    displayName: "Cursor AI",
    color: "#000000",
    people: [
      { name: "Michael Truell", role: "CEO" },
      { name: "Aman Sanger", role: "Co-founder" },
      { name: "Ryo Lu", role: "Head of Design" },
    ],
  },
  deepmind: {
    name: "DeepMind",
    displayName: "Google DeepMind",
    color: "#4285F4",
    people: [
      { name: "Demis Hassabis", role: "CEO" },
      { name: "Shane Legg", role: "Co-founder" },
    ],
  },
  anthropic: {
    name: "Anthropic",
    displayName: "Anthropic / Claude",
    color: "#D97757",
    people: [
      { name: "Dario Amodei", role: "CEO" },
      { name: "Daniela Amodei", role: "President" },
      { name: "Amanda Askell", role: "Character Lead" },
      { name: "Boris Cherny", role: "Claude Code Creator" },
    ],
  },
} as const;

export const SEARCH_QUERIES: SearchQuery[] = [
  // ========================================
  // OpenAI
  // ========================================
  {
    query: "Sam Altman OpenAI interview",
    company: "openai",
    person: "Sam Altman",
    maxResults: 30,
    minDuration: 300,
  },
  {
    query: "Kevin Weil OpenAI interview",
    company: "openai",
    person: "Kevin Weil",
    maxResults: 20,
    minDuration: 300,
  },

  // ========================================
  // Cursor
  // ========================================
  {
    query: "Michael Truell Cursor interview",
    company: "cursor",
    person: "Michael Truell",
    maxResults: 30,
    minDuration: 180,
  },
  {
    query: "Aman Sanger Cursor interview",
    company: "cursor",
    person: "Aman Sanger",
    maxResults: 20,
    minDuration: 180,
  },
  {
    query: "Ryo Lu Cursor interview",
    company: "cursor",
    person: "Ryo Lu",
    maxResults: 20,
    minDuration: 180,
  },

  // ========================================
  // DeepMind
  // ========================================
  {
    query: "Demis Hassabis DeepMind interview",
    company: "deepmind",
    person: "Demis Hassabis",
    maxResults: 30,
    minDuration: 300,
  },
  {
    query: "Shane Legg DeepMind interview",
    company: "deepmind",
    person: "Shane Legg",
    maxResults: 20,
    minDuration: 300,
  },

  // ========================================
  // Anthropic
  // ========================================
  {
    query: "Dario Amodei Anthropic interview",
    company: "anthropic",
    person: "Dario Amodei",
    maxResults: 30,
    minDuration: 300,
  },
  {
    query: "Daniela Amodei Anthropic interview",
    company: "anthropic",
    person: "Daniela Amodei",
    maxResults: 20,
    minDuration: 300,
  },
  {
    query: "Amanda Askell Anthropic interview",
    company: "anthropic",
    person: "Amanda Askell",
    maxResults: 20,
    minDuration: 300,
  },
  {
    query: "Boris Cherny Anthropic interview",
    company: "anthropic",
    person: "Boris Cherny",
    maxResults: 20,
    minDuration: 300,
  },
];

/**
 * Quality filters for video selection
 */
export const QUALITY_FILTERS = {
  default: {
    minViewCount: 10000,      // 1万播放量起
    minLikeRatio: 0.03,       // 3% 点赞率
    maxAgeInDays: 730,        // 2年内
  },
  hero: {
    minViewCount: 100000,     // 10万播放量
    minLikeRatio: 0.035,      // 3.5% 点赞率
    maxAgeInDays: 365,        // 1年内
  },
};

/**
 * YouTube API configuration
 */
export const YOUTUBE_API_CONFIG = {
  baseUrl: "https://www.googleapis.com/youtube/v3",
  order: "relevance" as const,
  type: "video" as const,
  videoDuration: "any" as const,
};
