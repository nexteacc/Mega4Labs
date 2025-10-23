import type { Locale } from "@/lib/i18n";

export type VideoCategory = "hero" | "tutorial" | "proReview" | "shorts";

export type VideoPlatform = "youtube";

export interface VideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface LandingVideo {
  id: string;
  locale: Locale;
  category: VideoCategory;
  title: string;
  description: string;
  channelTitle: string;
  publishDate: string;
  duration: string;
  platform: VideoPlatform;
  thumbnail: VideoThumbnail;
  tags?: string[];
}

export interface VideoModule {
  category: Extract<VideoCategory, "tutorial" | "proReview" | "shorts">;
  title: string;
  description: string;
  videos: LandingVideo[];
}
