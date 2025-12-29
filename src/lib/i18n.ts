/**
 * Content and copy for Mega 4 Labs (English only)
 */

import type { Company } from "@/lib/types";

// Site branding
export const SITE_NAME = "Mega 4 Labs";
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
  deepmind: "Google DeepMind / Gemini",
  anthropic: "Anthropic / Claude",
};

export const COMPANY_DESCRIPTIONS: Record<Company, string> = {
  openai: "Insights from Sam Altman and the OpenAI team on GPT, AGI, and the future of AI.",
  cursor: "The team revolutionizing AI-powered code editors and developer productivity.",
  deepmind: "Demis Hassabis and colleagues on Gemini, breakthrough AI research, and multimodal AI.",
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
export const FOOTER_COPYRIGHT = `© ${new Date().getFullYear()} Mega 4 Labs. Videos belong to their respective creators.`;

// SEO
export const SEO_KEYWORDS = "AI leaders, Sam Altman, Dario Amodei, Demis Hassabis, Cursor AI, OpenAI interview, Anthropic CEO, DeepMind, Gemini, AI industry, artificial intelligence, AGI, GPT, Claude";
export const SEO_SITE_NAME = "Mega 4 Labs";
export const SEO_DESCRIPTION = "Curated interviews, talks, and insights from AI industry leaders including Sam Altman (OpenAI), Dario Amodei (Anthropic), Demis Hassabis (DeepMind/Gemini), and Cursor's founding team.";
