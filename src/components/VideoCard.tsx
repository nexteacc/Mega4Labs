"use client";

import Image from "next/image";
import clsx from "clsx";
import { formatDuration, formatPublishDate } from "@/lib/format";
import type { LandingVideo } from "@/lib/types";
import { useAnalytics } from "@/hooks/useAnalytics";

type VideoCardVariant = "default" | "hero" | "short";

type VideoCardProps = {
  video: LandingVideo;
  onSelect: (video: LandingVideo) => void;
  variant?: VideoCardVariant;
  index?: number;
};

const variantClasses: Record<VideoCardVariant, string> = {
  default:
    "rounded-[26px] border-border bg-panel shadow-[0_14px_35px_rgba(17,24,39,0.08)] hover:shadow-[0_18px_45px_rgba(33,128,141,0.18)] hover:border-accent/30",
  hero:
    "rounded-[32px] border-transparent bg-gradient-to-br from-panel via-panel to-hero shadow-[0_18px_50px_rgba(33,128,141,0.25)] hover:shadow-[0_22px_60px_rgba(33,128,141,0.32)] hover:border-accent/40",
  short:
    "rounded-2xl border-border bg-panel shadow-[0_10px_28px_rgba(17,24,39,0.08)] hover:shadow-[0_16px_40px_rgba(33,128,141,0.2)] hover:border-accent/30",
};

export function VideoCard({
  video,
  onSelect,
  variant = "default",
  index,
}: VideoCardProps) {
  const { track } = useAnalytics();

  const handleClick = () => {
    track("video_play", {
      videoId: video.id,
      company: video.company,
      category: video.category,
      position: index ?? -1,
      context: variant,
    });
    onSelect(video);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        "group relative flex h-full w-full flex-col overflow-hidden border transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        variantClasses[variant],
      )}
      aria-label={`Play video ${video.title}`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={video.thumbnail.url}
          alt={video.title}
          fill
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 90vw"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Hover overlay with play button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-semibold text-primary shadow-[0_16px_40px_rgba(33,128,141,0.4)] transition-transform duration-200 group-hover:scale-110 sm:h-16 sm:w-16 sm:text-2xl">
            ▶
          </span>
        </div>

        <div className="absolute inset-x-2 bottom-2 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-white sm:inset-x-4 sm:bottom-4 sm:gap-2 sm:text-xs">
          <span className="inline-flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 sm:gap-1 sm:px-2 sm:py-1">
            ⏱ {formatDuration(video.duration)}
          </span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-white/15 px-1.5 py-0.5 sm:gap-1 sm:px-2 sm:py-1">
            📅 {formatPublishDate(video.publishDate)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-3 pb-3 pt-3 text-left sm:gap-2 sm:px-4 sm:pb-4 sm:pt-4">
        <h3 className="text-sm font-semibold leading-snug text-primary break-words sm:text-base">
          {video.title}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-secondary break-words sm:text-sm">
          {video.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-secondary/70 truncate sm:text-xs">
            {video.channelTitle}
          </span>
          {video.person && (
            <span className="text-[10px] font-medium text-accent truncate sm:text-xs">
              • {video.person}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
