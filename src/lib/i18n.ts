/**
 * Content and copy for Mega 4 Labs (English only)
 */

import type { Company } from "@/lib/types";

// Site branding
export const SITE_NAME = "Mega 4 Labs";

// Hero section
export const HERO_PILL = "AI Industry Sailors";
export const HERO_HEADLINE = "Watch the\nMinds Behind\nAI Innovation";
export const HERO_SUBHEAD = "Curated interviews, talks, and insights from the sailors shaping artificial intelligence";

// Video counts
export const VIDEO_COUNT_LABEL = "videos";

export const buildHeroSupporting = (videoCount: number): string => {
  const roundedCount = Math.floor(videoCount / 10) * 10;
  return `${roundedCount}+ ${VIDEO_COUNT_LABEL} • Updated weekly`;
};

// Load more
export const LOAD_MORE_LABEL = "Show More";

// Company configuration
export const COMPANIES: Company[] = ["openai", "cursor", "google", "anthropic", "a16z"];

export const COMPANY_TITLES: Record<Company, string> = {
  openai: "OpenAI",
  cursor: "Cursor",
  google: "Google DeepMind",
  anthropic: "Anthropic",
  a16z: "a16z",
};

export const COMPANY_DESCRIPTIONS: Record<Company, string> = {
  openai: "Interviews and talks from people at OpenAI.",
  cursor: "Interviews and talks from people at Cursor.",
  google: "Interviews and talks from people at Google DeepMind.",
  anthropic: "Interviews and talks from people at Anthropic.",
  a16z: "Interviews and talks from people at a16z.",
};

export const COMPANY_COLORS: Record<Company, string> = {
  openai: "#10A37F",
  cursor: "#000000",
  google: "#4285F4",
  anthropic: "#D97757",
  a16z: "#FF4F00",
};

// Footer
export const FOOTER_MADE_WITH_LOVE = "Made for AI builders";
export const FOOTER_SUBMIT_VIDEO = "Suggest a video";
export const FOOTER_COPYRIGHT = `© ${new Date().getFullYear()} Mega 4 Labs. Videos belong to their respective creators.`;

// SEO
export const SEO_KEYWORDS = "AI interviews, AI leaders, OpenAI, Anthropic, Google DeepMind, Cursor, a16z, artificial intelligence, AGI, GPT, Claude, Gemini";
export const SEO_DESCRIPTION = "Watch long-form interviews and talks featuring people from OpenAI, Anthropic, Google DeepMind, Cursor, and a16z.";
