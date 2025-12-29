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
  google: {
    name: "Google",
    displayName: "Google / Gemini",
    color: "#4285F4",
    people: [
      { name: "Demis Hassabis", role: "CEO & Chief AGI Scientist" },
      { name: "Josh Woodward", role: "VP of Gemini" },
      { name: "Sebastian Borgeaud", role: "Research Lead" },
      { name: "Shane Legg", role: "Co-founder & Chief AGI Scientist" },
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
  // OpenAI
  { query: "sam altman openai interview video", company: "openai", person: "Sam Altman", maxResults: 30 },
  { query: "kevin weil openai interview video", company: "openai", person: "Kevin Weil", maxResults: 20 },
  
  // Cursor
  { query: "michael truell cursor interview video", company: "cursor", person: "Michael Truell", maxResults: 30 },
  { query: "aman sanger cursor interview video", company: "cursor", person: "Aman Sanger", maxResults: 20 },
  { query: "ryo lu cursor interview video", company: "cursor", person: "Ryo Lu", maxResults: 20 },
  
  // Google
  { query: "demis hassabis google interview video", company: "google", person: "Demis Hassabis", maxResults: 30 },
  { query: "josh woodward google interview video", company: "google", person: "Josh Woodward", maxResults: 20 },
  { query: "sebastian borgeaud google interview video", company: "google", person: "Sebastian Borgeaud", maxResults: 20 },
  { query: "shane legg google interview video", company: "google", person: "Shane Legg", maxResults: 20 },
  
  // Anthropic
  { query: "dario amodei anthropic interview video", company: "anthropic", person: "Dario Amodei", maxResults: 30 },
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
  
  // Date range filtering (last 2 years)
  startPublishedDate: "2023-01-01T00:00:00.000Z",
  endPublishedDate: new Date().toISOString(),
  
  // Search type - auto lets Exa decide between neural and keyword
  type: "auto" as const,
  
  // Content options
  text: true,
  summary: {
    query: "summary youtube within 50 words",
  },
};

/**
 * Simple configuration
 */
export const CONFIG = {
  heroCount: 4, // Top 4 most recent videos as heroes
};
