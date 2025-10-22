"use client";

import { useMemo, useState } from "react";
import type { LandingVideo } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
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

  const visibleVideos = useMemo(() => videos.slice(0, 6), [videos]);

  const handleSelect = (video: LandingVideo) => {
    setSelected(video);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelected(null), 200);
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

      <VideoPlayerDialog open={open} video={selected} onClose={handleClose} />
    </section>
  );
}