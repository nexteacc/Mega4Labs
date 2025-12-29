import { z } from "zod";
import type { Company } from "@/lib/types";

const VideoThumbnailSchema = z.object({
  url: z.string().url(),
  width: z.number().positive(),
  height: z.number().positive(),
});

const CompanySchema = z.enum(["openai", "cursor", "deepmind", "anthropic"]);

const LandingVideoSchema = z.object({
  id: z.string().min(1),
  company: CompanySchema,
  category: z.union([z.literal("hero"), CompanySchema]),
  title: z.string().min(1),
  description: z.string(),
  channelTitle: z.string().min(1),
  publishDate: z.string().min(1),
  duration: z.string().min(1),
  platform: z.literal("youtube"),
  thumbnail: VideoThumbnailSchema,
  tags: z.array(z.string()).optional(),
  person: z.string().optional(),
});

export const LandingVideoArraySchema = z.array(LandingVideoSchema);
