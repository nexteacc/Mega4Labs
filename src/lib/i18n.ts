/**
 * Content and copy for MEGA 4 LAB (English only)
 */

import type { Company } from "@/lib/types";

// Site branding
export const SITE_NAME = "MEGA 4 LAB";
export const SITE_TAGLINE = "Watch the Minds Behind AI Innovation";

// Hero section
export const HERO_PILL = "AI Industry Leaders";
export const HERO_HEADLINE = "Watch the\nMinds Behind\nAI Innovation";
export const HERO_SUBHEAD = "Curated interviews, talks, and insights from the leaders shaping artificial intelligence.";

// Video counts
export const VIDEO_COUNT_LABEL = "videos";

export const buildHeroSupporting = (videoCount: number): string => {
  const roundedCount = Math.floor(videoCount / 10) * 10;
  return `${roundedCount}+ ${VIDEO_COUNT_LABEL} • Updated weekly • Expert-curated`;
};

// Load more
export const LOAD_MORE_LABEL = "Load More";

// Company configuration
export const COMPANIES: Company[] = ["openai", "cursor", "deepmind", "anthropic"];

export const COMPANY_TITLES: Record<Company, string> = {
  openai: "OpenAI / ChatGPT",
  cursor: "Cursor AI",
  deepmind: "Google DeepMind",
  anthropic: "Anthropic / Claude",
};

export const COMPANY_DESCRIPTIONS: Record<Company, string> = {
  openai: "Insights from Sam Altman and the OpenAI team on GPT, AGI, and the future of AI.",
  cursor: "The team revolutionizing AI-powered code editors and developer productivity.",
  deepmind: "Demis Hassabis and colleagues on breakthrough AI research and scientific discovery.",
  anthropic: "Dario Amodei and the Anthropic team on AI safety and Claude's development.",
};

export const COMPANY_COLORS: Record<Company, string> = {
  openai: "#10A37F",
  cursor: "#000000",
  deepmind: "#4285F4",
  anthropic: "#D97757",
};

// Footer
export const FOOTER_MADE_WITH_LOVE = "Made with care for AI enthusiasts";
export const FOOTER_SUBMIT_VIDEO = "Submit a Video";
export const FOOTER_COPYRIGHT = `© ${new Date().getFullYear()} MEGA 4 LAB. Videos belong to their respective creators.`;

// SEO
export const SEO_KEYWORDS = "AI leaders, Sam Altman, Dario Amodei, Demis Hassabis, Cursor AI, OpenAI interview, Anthropic CEO, DeepMind, AI industry, artificial intelligence, AGI, GPT, Claude";
export const SEO_SITE_NAME = "MEGA 4 LAB";
export const SEO_DESCRIPTION = "Curated interviews, talks, and insights from AI industry leaders including Sam Altman (OpenAI), Dario Amodei (Anthropic), Demis Hassabis (DeepMind), and Cursor's founding team.";
