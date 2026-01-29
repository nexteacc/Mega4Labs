"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { LandingVideo } from "@/lib/types";
import { ShareButton } from "./ShareButton";
import { VideoSidekick } from "./content-sidekick/VideoSidekick";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (element: HTMLElement | null, options: object) => YouTubePlayer;
      PlayerState: {
        PLAYING: number;
      };
    } | undefined;
  }
}

interface YouTubePlayer {
  destroy: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  getCurrentTime: () => number;
}

type VideoPlayerDialogProps = {
  open: boolean;
  video: LandingVideo | null;
  onClose: () => void;
};

const overlayClass = "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 md:px-8";

export function VideoPlayerDialog({ open, video, onClose }: VideoPlayerDialogProps) {
  const { track } = useAnalytics();
  const [currentTime, setCurrentTime] = useState(0);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<YouTubePlayer | null>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!open || !video) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player && playerContainerRef.current) {
        if (playerInstanceRef.current) {
          playerInstanceRef.current.destroy();
        }
        playerInstanceRef.current = new window.YT.Player(playerContainerRef.current, {
          videoId: video.id,
          playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event: { target: YouTubePlayer }) => {
              playerInstanceRef.current = event.target;
            },
            onStateChange: (event: { data: number; target: YouTubePlayer }) => {
              // Start/Stop time tracking
              if (window.YT && event.data === window.YT.PlayerState.PLAYING) {
                if (!timeIntervalRef.current) {
                  timeIntervalRef.current = setInterval(() => {
                    setCurrentTime(event.target.getCurrentTime());
                  }, 500);
                }
              } else {
                if (timeIntervalRef.current) {
                  clearInterval(timeIntervalRef.current);
                  timeIntervalRef.current = null;
                }
              }
            }
          }
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    track('video_play', {
      videoId: video.id,
      title: video.title,
      channelTitle: video.channelTitle
    });

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
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
    };
  }, [open, video, onClose, track]);

  const seekTo = (time: number) => {
    if (playerInstanceRef.current) {
      playerInstanceRef.current.seekTo(time, true);
      playerInstanceRef.current.playVideo();
    }
  };

  if (!open || !video) return null;
  if (typeof document === "undefined") return null;

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

      <div className="relative z-[101] flex flex-col lg:flex-row items-stretch gap-6 w-full max-w-[1400px] h-[85vh]">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="relative flex-1 overflow-hidden rounded-[32px] bg-black shadow-[0_40px_90px_rgba(0,0,0,0.45)]">
            <div ref={playerContainerRef} className="w-full h-full" />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-panel/95 px-6 py-4 shadow-[0_14px_40px_rgba(17,24,39,0.18)]">
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-primary line-clamp-1">{video.title}</p>
              <p className="text-sm text-secondary">{video.channelTitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <ShareButton videoId={video.id} videoTitle={video.title} />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col h-full">
          <VideoSidekick 
            video={video} 
            currentTime={currentTime} 
            onSeek={seekTo} 
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
