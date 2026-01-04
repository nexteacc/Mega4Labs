"use client";

import { useState } from "react";
import type { LandingVideo, Company } from "@/lib/types";
import { LOAD_MORE_LABEL } from "@/lib/i18n";
import { VideoGrid } from "@/components/VideoGrid";
import { VideoPlayerDialog } from "@/components/VideoPlayerDialog";
import { OpenAI, Anthropic, Google, Cursor } from "@lobehub/icons";

type CompanySectionProps = {
  company: Company;
  displayName: string;
  description: string;
  videos: LandingVideo[];
};

const INITIAL_LOAD = 6;
const LOAD_MORE_COUNT = 6;

// Company logo mapping
const COMPANY_LOGOS = {
  openai: OpenAI,
  anthropic: Anthropic,
  google: Google,
  cursor: Cursor,
} as const;

export function CompanySection({
  company,
  displayName,
  description,
  videos,
}: CompanySectionProps) {
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

  const LogoComponent = COMPANY_LOGOS[company];

  return (
    <section
      id={company}
      className="mx-auto w-full max-w-[1180px] px-4 py-[var(--spacing-section)] sm:px-8 lg:px-10"
    >
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <LogoComponent size={48} className="flex-shrink-0" />
            <h2 className="text-2xl font-semibold text-primary break-words sm:text-3xl lg:text-4xl">
              {displayName}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-secondary break-words sm:text-base lg:text-lg max-w-2xl">
            {description}
          </p>
        </div>
      </div>

      <VideoGrid
        videos={visibleVideos}
        cardVariant="default"
        columns={{ base: 1, md: 2, lg: 3 }}
        onSelect={handleSelect}
      />

      {hasMore && (
        <div className="mt-6 flex justify-center sm:mt-8">
          <button
            onClick={handleLoadMore}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
          >
            {LOAD_MORE_LABEL}
          </button>
        </div>
      )}

      <VideoPlayerDialog open={open} video={selected} onClose={handleClose} />
    </section>
  );
}
