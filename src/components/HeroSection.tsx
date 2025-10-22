"use client";

import { useState, useMemo } from "react";
import type { LandingVideo } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import {
  HERO_HEADLINE,
  HERO_PILL,
  HERO_SUBHEAD,
  HERO_SUPPORTING,
  CTA_LABELS,
} from "@/lib/i18n";
import { CTAButton } from "@/components/CTAButton";
import { VideoCard } from "@/components/VideoCard";
import { VideoPlayerDialog } from "@/components/VideoPlayerDialog";

type HeroSectionProps = {
  videos: LandingVideo[];
  locale: Locale;
};

export function HeroSection({ videos, locale }: HeroSectionProps) {
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
    <section className="relative mx-auto mt-4 w-full max-w-[1180px] overflow-hidden rounded-[48px] bg-hero px-6 py-14 sm:px-8 lg:px-16">
      <div className="absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_top,_rgba(33,128,141,0.18),_transparent_55%)]" />
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_1.2fr] lg:items-start">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-accent shadow-sm backdrop-blur">
            {HERO_PILL[locale]}
          </span>
          <div className="space-y-4">
            <h1 className="whitespace-pre-line text-4xl font-semibold leading-tight text-primary sm:text-5xl lg:text-6xl">
              {HERO_HEADLINE[locale]}
            </h1>
            <p className="text-lg leading-relaxed text-secondary sm:text-xl">
              {HERO_SUBHEAD[locale]}
            </p>
            <p className="text-sm font-medium uppercase tracking-wide text-secondary/70">
              {HERO_SUPPORTING[locale]}
            </p>
          </div>
          <CTAButton locale={locale} location="hero">
            {CTA_LABELS[locale]}
          </CTAButton>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {heroVideos.map((video, index) => (
            <VideoCard
              key={`${video.id}-${index}`}
              video={video}
              locale={locale}
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