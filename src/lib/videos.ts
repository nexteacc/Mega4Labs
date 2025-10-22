import { z } from "zod";
import type { Locale } from "@/lib/i18n";

const VideoThumbnailSchema = z.object({
  url: z.string().url(),
  width: z.number().positive(),
  height: z.number().positive(),
});

const LandingVideoSchema = z.object({
  id: z.string().min(1),
  locale: z.custom<Locale>((value) =>
    typeof value === "string" && ["en", "ko", "ja", "zh"].includes(value),
  ),
  category: z.enum(["hero", "tutorial", "demo", "proReview", "shorts"]),
  title: z.string().min(1),
  description: z.string().min(1),
  channelTitle: z.string().min(1),
  publishDate: z.string().min(1),
  duration: z.string().min(1),
  platform: z.literal("youtube"),
  thumbnail: VideoThumbnailSchema,
  tags: z.array(z.string()).optional(),
});

export const LandingVideoArraySchema = z.array(LandingVideoSchema);
