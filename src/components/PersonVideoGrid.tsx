"use client";

import { useVideoPlayer } from "@/lib/video-context";
import type { LandingVideo } from "@/lib/types";
import { VideoGrid } from "@/components/VideoGrid";

type PersonVideoGridProps = {
  videos: LandingVideo[];
};

export function PersonVideoGrid({ videos }: PersonVideoGridProps) {
  const { playVideo } = useVideoPlayer();

  return (
    <VideoGrid
      videos={videos}
      cardVariant="default"
      columns={{ base: 1, md: 2, lg: 3 }}
      onSelect={playVideo}
    />
  );
}
