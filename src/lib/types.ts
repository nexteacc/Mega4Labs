/**
 * Company types for Mega 4 Labs
 */
export type Company = "openai" | "cursor" | "deepmind" | "anthropic";

export type VideoCategory = "hero" | Company;

export type VideoPlatform = "youtube";

export interface VideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface LandingVideo {
  id: string;
  company: Company;
  category: VideoCategory;
  title: string;
  description: string;
  channelTitle: string;
  publishDate: string;
  duration: string;
  platform: VideoPlatform;
  thumbnail: VideoThumbnail;
  tags?: string[];
  person?: string; // Featured person name (e.g., "Sam Altman")
}

export interface VideoModule {
  company: Company;
  displayName: string;
  description: string;
  color: string;
  videos: LandingVideo[];
}
