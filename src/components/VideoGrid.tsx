"use client";

import clsx from "clsx";
import type { LandingVideo } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { VideoCard } from "@/components/VideoCard";

type GridColumns = 1 | 2 | 3 | 4;

type VideoGridProps = {
  videos: LandingVideo[];
  locale: Locale;
  onSelect?: (video: LandingVideo, index: number) => void;
  cardVariant?: "default" | "hero" | "short";
  columns?: {
    base?: GridColumns;
    md?: GridColumns;
    lg?: GridColumns;
  };
};

const columnClassMap: Record<GridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

export function VideoGrid({
  videos,
  locale,
  onSelect,
  cardVariant = "default",
  columns = { base: 1, md: 2, lg: 3 },
}: VideoGridProps) {
  const gridClass = clsx(
    "grid gap-4 sm:gap-6",
    columns.base && columnClassMap[columns.base],
    columns.md && `sm:${columnClassMap[columns.md]}`,
    columns.lg && `lg:${columnClassMap[columns.lg]}`,
  );

  return (
    <div className={gridClass}>
      {videos.map((video, index) => (
        <VideoCard
          key={`${video.id}-${index}`}
          video={video}
          locale={locale}
          variant={cardVariant}
          index={index}
          onSelect={() => onSelect?.(video, index)}
        />
      ))}
    </div>
  );
}