/**
 * YouTube Search Configuration for MEGA 4 LAB
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
    query: "Sam Altman interview",
    company: "openai",
    person: "Sam Altman",
    maxResults: 20,
    minDuration: 300,
  },
  {
    query: "Sam Altman podcast AI",
    company: "openai",
    person: "Sam Altman",
    maxResults: 20,
    minDuration: 300,
  },
  {
    query: "Sam Altman GPT future AGI",
    company: "openai",
    person: "Sam Altman",
    maxResults: 15,
  },
  {
    query: "Kevin Weil OpenAI product",
    company: "openai",
    person: "Kevin Weil",
    maxResults: 10,
  },

  // ========================================
  // Cursor
  // ========================================
  {
    query: "Cursor AI CEO interview",
    company: "cursor",
    maxResults: 15,
    minDuration: 180,
  },
  {
    query: "Michael Truell Cursor",
    company: "cursor",
    person: "Michael Truell",
    maxResults: 15,
  },
  {
    query: "Aman Sanger Cursor AI",
    company: "cursor",
    person: "Aman Sanger",
    maxResults: 10,
  },
  {
    query: "Ryo Lu Cursor design",
    company: "cursor",
    person: "Ryo Lu",
    maxResults: 10,
  },
  {
    query: "Cursor AI founder interview",
    company: "cursor",
    maxResults: 15,
    minDuration: 120,
  },

  // ========================================
  // DeepMind
  // ========================================
  {
    query: "Demis Hassabis interview",
    company: "deepmind",
    person: "Demis Hassabis",
    maxResults: 20,
    minDuration: 300,
  },
  {
    query: "Demis Hassabis AI future AGI",
    company: "deepmind",
    person: "Demis Hassabis",
    maxResults: 15,
  },
  {
    query: "DeepMind CEO podcast",
    company: "deepmind",
    maxResults: 15,
    minDuration: 300,
  },
  {
    query: "Shane Legg AGI DeepMind",
    company: "deepmind",
    person: "Shane Legg",
    maxResults: 10,
  },

  // ========================================
  // Anthropic
  // ========================================
  {
    query: "Dario Amodei interview",
    company: "anthropic",
    person: "Dario Amodei",
    maxResults: 20,
    minDuration: 300,
  },
  {
    query: "Dario Amodei AI safety podcast",
    company: "anthropic",
    person: "Dario Amodei",
    maxResults: 15,
  },
  {
    query: "Daniela Amodei Anthropic interview",
    company: "anthropic",
    person: "Daniela Amodei",
    maxResults: 10,
  },
  {
    query: "Amanda Askell Claude AI",
    company: "anthropic",
    person: "Amanda Askell",
    maxResults: 10,
  },
  {
    query: "Boris Cherny Claude Code",
    company: "anthropic",
    person: "Boris Cherny",
    maxResults: 10,
  },
  {
    query: "Anthropic CEO podcast",
    company: "anthropic",
    maxResults: 15,
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
