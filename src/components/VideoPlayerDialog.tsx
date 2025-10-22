"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { formatEmbedUrl, formatVideoUrl } from "@/lib/format";
import type { LandingVideo } from "@/lib/types";

type VideoPlayerDialogProps = {
  open: boolean;
  video: LandingVideo | null;
  onClose: () => void;
};

const overlayClass = "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4";

export function VideoPlayerDialog({ open, video, onClose }: VideoPlayerDialogProps) {
  useEffect(() => {
    if (!open) return;

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
  }, [open, onClose]);

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
      <div className="relative z-[101] w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-[32px] bg-black shadow-[0_40px_90px_rgba(0,0,0,0.45)]">
          <iframe
            className="aspect-video w-full"
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Close video"
          >
            ×
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-panel/95 px-6 py-4 shadow-[0_14px_40px_rgba(17,24,39,0.18)]">
          <div className="min-w-0">
            <p className="text-base font-semibold text-primary">{video.title}</p>
            <p className="text-sm text-secondary">{video.channelTitle}</p>
          </div>
          <a
            href={formatVideoUrl(video.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Watch on YouTube
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}