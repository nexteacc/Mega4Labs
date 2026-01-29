"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

type ShareButtonProps = {
  videoId: string;
  videoTitle: string;
};

const shareOptions = [
  {
    name: "X",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Reddit",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    name: "Copy Link",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" />
      </svg>
    ),
    action: async (url: string) => {
      try {
        await navigator.clipboard.writeText(url);
        return true;
      } catch (err) {
        console.error("Failed to copy link:", err);
        return false;
      }
    },
  },
];

export function ShareButton({ videoId, videoTitle }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { track } = useAnalytics();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay setting mounted to avoid synchronous setState warning
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const getVideoUrl = () => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("video", videoId);
    return url.toString();
  };

  const handleShare = async (option: typeof shareOptions[0]) => {
    const url = getVideoUrl();
    
    track("share_click", {
      platform: option.name,
      videoId,
      title: videoTitle,
    });

    if ('action' in option && option.action) {
      const success = await option.action(url);
      if (success) {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          // Don't close immediately for copy action, let user see feedback
          // But maybe for modal we can close after a delay or just show feedback
          setTimeout(() => setIsOpen(false), 1000);
        }, 1500);
      }
    } else if ('getUrl' in option && option.getUrl) {
      window.open(option.getUrl(url, videoTitle), "_blank", "noopener,noreferrer");
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Share video"
      >
        <Image
          src="/ai-analysis-icon.svg"
          alt="Share"
          width={64}
          height={64}
          className="relative z-10 animate-wiggle transition-transform duration-200 group-hover:scale-110 group-hover:animate-none"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(74, 125, 255, 0.6)) drop-shadow(0 0 12px rgba(74, 125, 255, 0.3))'
          }}
          aria-hidden="true"
        />
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Modal */}
          <div 
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bg-[#1a1a2e]/95 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-md animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Share video"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">分享视频</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => handleShare(option)}
                  className="group flex items-center gap-4 rounded-2xl bg-white/5 p-4 text-left transition-all hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-accent/20 group-hover:text-accent">
                    {option.name === "Copy Link" && copied ? (
                      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-green-400">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    ) : (
                      option.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="block text-base font-medium text-white">
                      {option.name === "Copy Link" && copied ? "已复制链接" : option.name}
                    </span>
                  </div>
                  {option.name === "Copy Link" && copied && (
                    <span className="text-sm font-medium text-green-400 animate-in fade-in slide-in-from-right-2">Copied!</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
