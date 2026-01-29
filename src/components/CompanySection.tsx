"use client";

import { useState } from "react";
import type { LandingVideo, Company } from "@/lib/types";
import { LOAD_MORE_LABEL } from "@/lib/i18n";
import { VideoGrid } from "@/components/VideoGrid";
import { useVideoPlayer } from "@/lib/video-context";
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
  const { playVideo } = useVideoPlayer();
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  
  const visibleVideos = videos.slice(0, visibleCount);
  const hasMore = visibleCount < videos.length;

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
          <p className="max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
            {description}
          </p>
        </div>
      </div>

      <VideoGrid
        videos={visibleVideos}
        onSelect={playVideo}
      />

      {hasMore && (
        <div className="mt-8 flex justify-center sm:mt-12">
          <button
            onClick={handleLoadMore}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-surface px-6 py-2.5 text-sm font-medium text-primary transition-all hover:bg-surface-hover hover:text-accent sm:px-8 sm:py-3 sm:text-base"
          >
            <span className="relative z-10">{LOAD_MORE_LABEL}</span>
          </button>
        </div>
      )}
    </section>
  );
}
