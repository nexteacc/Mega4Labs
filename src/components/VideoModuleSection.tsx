"use client";

import { useState } from "react";
import type { LandingVideo } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { LOAD_MORE_LABEL } from "@/lib/i18n";
import { CTAButton } from "@/components/CTAButton";
import { VideoGrid } from "@/components/VideoGrid";
import { VideoPlayerDialog } from "@/components/VideoPlayerDialog";

type VideoModuleSectionProps = {
  title: string;
  description: string;
  videos: LandingVideo[];
  locale: Locale;
  ctaLabel: string;
  cardVariant?: "default" | "short";
  columns?: {
    base?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4;
    lg?: 1 | 2 | 3 | 4;
  };
  showCTA?: boolean;
};

const INITIAL_LOAD = 6;
const LOAD_MORE_COUNT = 6;

export function VideoModuleSection({
  title,
  description,
  videos,
  locale,
  ctaLabel,
  cardVariant = "default",
  columns,
  showCTA = true,
}: VideoModuleSectionProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<LandingVideo | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);

  const visibleVideos = videos.slice(0, visibleCount);
  const hasMore = visibleCount < videos.length;

  const handleSelect = (video: LandingVideo) => {
    setSelected(video);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelected(null), 200);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, videos.length));
  };

  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-[var(--spacing-section)] sm:px-8 lg:px-10">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="space-y-2 max-w-2xl sm:space-y-3">
          <h2 className="text-2xl font-semibold text-primary break-words sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-secondary break-words sm:text-base lg:text-lg">
            {description}
          </p>
        </div>
        {showCTA && (
          <CTAButton variant="ghost" locale={locale} location="module">
            {ctaLabel}
          </CTAButton>
        )}
      </div>

      <VideoGrid
        videos={visibleVideos}
        locale={locale}
        cardVariant={cardVariant}
        columns={columns}
        onSelect={(video) => handleSelect(video)}
      />

      {hasMore && (
        <div className="mt-6 flex justify-center sm:mt-8">
          <button
            onClick={handleLoadMore}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
          >
            {LOAD_MORE_LABEL[locale]}
          </button>
        </div>
      )}

      <VideoPlayerDialog open={open} video={selected} onClose={handleClose} />
    </section>
  );
}