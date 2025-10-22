"use client";

import Image from "next/image";
import clsx from "clsx";
import { formatDuration, formatPublishDate } from "@/lib/format";
import type { LandingVideo } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { useAnalytics } from "@/hooks/useAnalytics";

type VideoCardVariant = "default" | "hero" | "short";

type VideoCardProps = {
  video: LandingVideo;
  locale: Locale;
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
  locale,
  onSelect,
  variant = "default",
  index,
}: VideoCardProps) {
  const { track } = useAnalytics();

  const handleClick = () => {
    track("video_play", {
      videoId: video.id,
      category: video.category,
      locale,
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
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-semibold text-primary shadow-[0_16px_40px_rgba(33,128,141,0.4)] transition-transform duration-200 group-hover:scale-110">
            ▶
          </span>
        </div>

        <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-white">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1">
            ⏱ {formatDuration(video.duration)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">
            📅 {formatPublishDate(video.publishDate, locale)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-4 text-left">
        <h3 className="text-base font-semibold leading-snug text-primary">
          {video.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-secondary">
          {video.description}
        </p>
        <span className="text-xs font-semibold uppercase tracking-wide text-secondary/70">
          {video.channelTitle}
        </span>
      </div>
    </button>
  );
}