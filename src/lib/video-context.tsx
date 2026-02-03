'use client';

import React, { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { LandingVideo } from '@/lib/types';
import { getAllVideos } from '@/lib/content';

interface VideoPlayerContextType {
  currentVideo: LandingVideo | null;
  isOpen: boolean;
  playVideo: (video: LandingVideo) => void;
  closeVideo: () => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

export function VideoPlayerProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Derived state directly from URL
  const videoId = searchParams.get('video');
  const allVideos = getAllVideos();
  
  const currentVideo = useMemo(() => {
    if (!videoId) return null;
    return allVideos.find((v) => v.id === videoId) || null;
  }, [videoId, allVideos]);

  const isOpen = !!currentVideo;

  const playVideo = useCallback((video: LandingVideo) => {
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('video', video.id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const closeVideo = useCallback(() => {
    // Clean up URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('video');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  return (
    <VideoPlayerContext.Provider value={{ currentVideo, isOpen, playVideo, closeVideo }}>
      {children}
    </VideoPlayerContext.Provider>
  );
}

export function useVideoPlayer() {
  const context = useContext(VideoPlayerContext);
  if (context === undefined) {
    throw new Error('useVideoPlayer must be used within a VideoPlayerProvider');
  }
  return context;
}
