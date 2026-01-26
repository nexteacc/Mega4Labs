"use client";

import { useState } from "react";
import type { LandingVideo } from "@/lib/types";
import { VideoGrid } from "@/components/VideoGrid";
import { VideoPlayerDialog } from "@/components/VideoPlayerDialog";

type PersonVideoGridProps = {
  videos: LandingVideo[];
};

export function PersonVideoGrid({ videos }: PersonVideoGridProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<LandingVideo | null>(null);

  const handleSelect = (video: LandingVideo) => {
    setSelected(video);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <>
      <VideoGrid
        videos={videos}
        cardVariant="default"
        columns={{ base: 1, md: 2, lg: 3 }}
        onSelect={handleSelect}
      />
      <VideoPlayerDialog open={open} video={selected} onClose={handleClose} />
    </>
  );
}
