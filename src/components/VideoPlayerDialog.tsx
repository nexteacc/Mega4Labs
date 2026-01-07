"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { formatEmbedUrl, formatVideoUrl } from "@/lib/format";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { LandingVideo } from "@/lib/types";
import { AIAnalysisButton } from "./AIAnalysisButton";

type VideoPlayerDialogProps = {
  open: boolean;
  video: LandingVideo | null;
  onClose: () => void;
};

const overlayClass = "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4";

import { VideoAnalysisDialog } from "./content-sidekick/VideoAnalysisDialog";
import { useState } from "react";

// ... (existing imports, but note: I need to handle imports carefully if replacing only a chunk or injecting at top)
// Re-writing the full component to avoid import injection issues with partial replace
// Wait, I can't easily inject imports with replace_file_content if I don't target the top. 
// I will use multi_replace_file_content to handle imports and the component body separately.

// Actually, I'll use replace_file_content for the whole file since I have the content and it's small enough (127 lines).
// But wait, allow_multiple is safer if I just target specific blocks. 
// Let's stick to ReplaceFileContent but carefully rewrite.
// Actually, I will use MultiReplaceFileContent.

export function VideoPlayerDialog({ open, video, onClose }: VideoPlayerDialogProps) {
  const { track } = useAnalytics();
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    // 追踪视频播放
    if (video) {
      track('video_play', {
        videoId: video.id,
        title: video.title,
        channelTitle: video.channelTitle
      });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // If analysis dialog is open, let it handle its own escape or let this one close everything? 
      // Usually, top-most modal handles escape. 
      // If I don't block propagation in analysis dialog, this might close the player too.
      // VideoAnalysisDialog doesn't have escape handler in my code above? 
      // Wait, VideoAnalysisDialog doesn't implement keyboard listener. 
      // But typically we want ESC to close Analysis first. 
      // For now, let's keep it simple.
      if (event.key === "Escape" && !isAnalysisOpen) {
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
  }, [open, onClose, video, isAnalysisOpen]);

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

      {/* 内容包装器 - 作为 ShareButton 的定位参考 */}
      <div className="relative z-[101] flex items-start gap-6">
        {/* 主内容区 */}
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

          {/* Video Info Card */}
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

          {/* AI Summary Section - Scrollable */}
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

        {/* AI Analysis button - 在内容区右侧，使用 flex gap 自然排列 */}
        <div className="pt-4 lg:pt-16">
          <AIAnalysisButton
            videoId={video.id}
            videoTitle={video.title}
            onClick={() => setIsAnalysisOpen(true)}
          />
        </div>
      </div>

      <VideoAnalysisDialog
        open={isAnalysisOpen}
        video={video}
        onClose={() => setIsAnalysisOpen(false)}
      />
    </div>,
    document.body,
  );
}