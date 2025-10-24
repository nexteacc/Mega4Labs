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
    <section className="mx-auto w-full max-w-[1180px] px-6 py-[var(--spacing-section)] sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3 max-w-2xl">
          <h2 className="text-3xl font-semibold text-primary sm:text-4xl">
            {title}
          </h2>
          <p className="text-base leading-relaxed text-secondary sm:text-lg">
            {description}
          </p>
        </div>
        <CTAButton variant="ghost" locale={locale} location="module">
          {ctaLabel}
        </CTAButton>
      </div>

      <VideoGrid
        videos={visibleVideos}
        locale={locale}
        cardVariant={cardVariant}
        columns={columns}
        onSelect={(video) => handleSelect(video)}
      />

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {LOAD_MORE_LABEL[locale]}
          </button>
        </div>
      )}

      <VideoPlayerDialog open={open} video={selected} onClose={handleClose} />
    </section>
  );
}