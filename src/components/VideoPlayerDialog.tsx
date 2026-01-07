"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { formatEmbedUrl, formatVideoUrl } from "@/lib/format";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { LandingVideo } from "@/lib/types";
import { ShareButton } from "./ShareButton";

type VideoPlayerDialogProps = {
  open: boolean;
  video: LandingVideo | null;
  onClose: () => void;
};

const overlayClass = "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4";

export function VideoPlayerDialog({ open, video, onClose }: VideoPlayerDialogProps) {
  const { track } = useAnalytics();

  useEffect(() => {
    if (!open) return;

    if (video) {
      track('video_play', {
        videoId: video.id,
        title: video.title,
        channelTitle: video.channelTitle
      });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [open, onClose, video, track]);

  if (!open || !video) return null;
  if (typeof document === "undefined") return null;

  const embedUrl = `${formatEmbedUrl(video.id)}&autoplay=1`;

  return createPortal(
    <div
      className={overlayClass}
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${video.title}`}
    >
      <div
        className="absolute inset-0"
        aria-hidden="true"
        onClick={onClose}
      />

      <div className="relative z-[101] flex items-start gap-6">
        <div className="w-full max-w-4xl">
          <div className="relative overflow-hidden rounded-[32px] bg-black shadow-[0_40px_90px_rgba(0,0,0,0.45)]">
            <iframe
              className="aspect-video w-full"
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-panel/95 px-6 py-4 shadow-[0_14px_40px_rgba(17,24,39,0.18)]">
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-primary">{video.title}</p>
              <p className="text-sm text-secondary">{video.channelTitle}</p>
            </div>
            <a
              href={formatVideoUrl(video.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={() => track('external_link_click', { url: formatVideoUrl(video.id), linkText: 'Watch on YouTube' })}
            >
              Watch on YouTube
              <span aria-hidden>↗</span>
            </a>
          </div>

          {video.description && (
            <div className="mt-4 max-h-[200px] overflow-y-auto rounded-3xl bg-panel/95 px-6 py-4 shadow-[0_14px_40px_rgba(17,24,39,0.18)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  ✨ AI Summary
                </span>
              </div>
              <p className="text-sm leading-relaxed text-secondary">
                {video.description}
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 lg:pt-16">
          <ShareButton
            videoId={video.id}
            videoTitle={video.title}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
