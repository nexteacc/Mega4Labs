/**
 * Video Search Configuration for Mega 4 Labs
 * Using Exa AI for intelligent video discovery + YouTube API for metadata
 */

import type { Company } from "@/lib/types";

export type SearchQuery = {
  query: string;
  company: Company;
  person?: string;
  maxResults: number;
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
      { name: "Alexander Embiricos", role: "Product Lead, Codex" },
      { name: "Chris Lehane", role: "Chief Global Affairs Officer" },
    ],
  },
  cursor: {
    name: "Cursor",
    displayName: "Cursor AI",
    color: "#000000",
    people: [
      { name: "Michael Truell", role: "Co-founder & CEO, Anysphere" },
      { name: "Aman Sanger", role: "Co-founder, Anysphere" },
      { name: "Ryo Lu", role: "Head of Design" },
    ],
  },
  google: {
    name: "Google",
    displayName: "Google / Gemini",
    color: "#4285F4",
    people: [
      { name: "Demis Hassabis", role: "Co-Founder & CEO, DeepMind" },
      { name: "Josh Woodward", role: "VP, Labs & Gemini" },
      { name: "Sebastian Borgeaud", role: "Research Engineer & Gemini 3 Pre-training Lead, DeepMind" },
      { name: "Shane Legg", role: "Co-founder & Chief AGI Scientist, DeepMind" },
    ],
  },
  anthropic: {
    name: "Anthropic",
    displayName: "Anthropic / Claude",
    color: "#D97757",
    people: [
      { name: "Dario Amodei", role: "CEO" },
      { name: "Daniela Amodei", role: "President & Co-founder" },
      { name: "Amanda Askell", role: "Philosopher" },
      { name: "Boris Cherny", role: "Creator & Head of Claude Code" },
    ],
  },
} as const;

export const SEARCH_QUERIES: SearchQuery[] = [
  // OpenAI
  { query: "sam altman openai interview video", company: "openai", person: "Sam Altman", maxResults: 20 },
  { query: "kevin weil openai interview video", company: "openai", person: "Kevin Weil", maxResults: 20 },
  { query: "chris lehane openai interview video", company: "openai", person: "Chris Lehane", maxResults: 20 },
  { query: "alexander embiricos openai codex interview video", company: "openai", person: "Alexander Embiricos", maxResults: 20 },
  
  // Cursor
  { query: "michael truell cursor interview video", company: "cursor", person: "Michael Truell", maxResults: 20 },
  { query: "aman sanger cursor interview video", company: "cursor", person: "Aman Sanger", maxResults: 20 },
  { query: "ryo lu cursor interview video", company: "cursor", person: "Ryo Lu", maxResults: 20 },
  
  // Google
  { query: "demis hassabis google interview video", company: "google", person: "Demis Hassabis", maxResults: 20 },
  { query: "josh woodward google interview video", company: "google", person: "Josh Woodward", maxResults: 20 },
  { query: "sebastian borgeaud google interview video", company: "google", person: "Sebastian Borgeaud", maxResults: 20 },
  { query: "shane legg google interview video", company: "google", person: "Shane Legg", maxResults: 20 },
  
  // Anthropic
  { query: "dario amodei anthropic interview video", company: "anthropic", person: "Dario Amodei", maxResults: 20 },
  { query: "daniela amodei anthropic interview video", company: "anthropic", person: "Daniela Amodei", maxResults: 20 },
  { query: "amanda askell anthropic interview video", company: "anthropic", person: "Amanda Askell", maxResults: 20 },
  { query: "boris cherny anthropic interview video", company: "anthropic", person: "Boris Cherny", maxResults: 20 },
];

/**
 * Exa AI Search Configuration
 * Simple and clean - let Exa's neural search do the work
 */
export const EXA_CONFIG = {
  // Domain filtering
  includeDomains: ["youtube.com"],
  
  // Date range filtering
  endPublishedDate: new Date().toISOString(),
};

/**
 * Simple configuration
 */
export const CONFIG = {
  heroCount: 4, // Top 4 most recent videos as heroes
};
