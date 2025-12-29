"use client";

import { useState, useMemo } from "react";
import type { LandingVideo } from "@/lib/types";
import {
  HERO_HEADLINE,
  HERO_PILL,
  HERO_SUBHEAD,
} from "@/lib/i18n";
import { VideoCard } from "@/components/VideoCard";
import { VideoPlayerDialog } from "@/components/VideoPlayerDialog";

type HeroSectionProps = {
  videos: LandingVideo[];
  heroSupporting: string;
};

export function HeroSection({ videos, heroSupporting }: HeroSectionProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<LandingVideo | null>(null);

  const heroVideos = useMemo(() => videos.slice(0, 4), [videos]);

  const handleSelect = (video: LandingVideo) => {
    setSelected(video);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelected(null), 250);
  };

  return (
    <section className="relative mx-auto mt-4 w-full max-w-[1180px] overflow-hidden rounded-[32px] bg-hero px-4 py-10 sm:rounded-[48px] sm:px-8 sm:py-14 lg:px-16">
      <div className="absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_top,_rgba(33,128,141,0.18),_transparent_55%)]" />
      <div className="grid gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_1.2fr] lg:items-start">
        <div className="space-y-5 sm:space-y-6">
          <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-accent shadow-sm backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
            {HERO_PILL}
          </span>
          <div className="space-y-3 sm:space-y-4">
            <h1 className="whitespace-pre-line text-3xl font-semibold leading-tight text-primary sm:text-5xl lg:text-6xl break-words">
              {HERO_HEADLINE}
            </h1>
            <p className="text-base leading-relaxed text-secondary sm:text-lg lg:text-xl break-words">
              {HERO_SUBHEAD}
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-secondary/70 sm:text-sm break-words">
              {heroSupporting}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {heroVideos.map((video, index) => (
            <VideoCard
              key={`${video.id}-${index}`}
              video={video}
              variant="hero"
              index={index}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      <VideoPlayerDialog open={open} video={selected} onClose={handleClose} />
    </section>
  );
}
