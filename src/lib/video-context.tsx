'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
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
  const [currentVideo, setCurrentVideo] = useState<LandingVideo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Handle URL synchronization on mount and when URL changes
  useEffect(() => {
    const videoId = searchParams.get('video');
    
    if (videoId) {
      // Only find and set if we're not already playing this video or if it's not open
      if (!isOpen || currentVideo?.id !== videoId) {
        const allVideos = getAllVideos();
        const video = allVideos.find((v) => v.id === videoId);
        
        if (video) {
          // Use a small timeout to ensure state updates don't conflict with render cycle
          // and to match the previous behavior in sections
          const timer = setTimeout(() => {
            setCurrentVideo(video);
            setIsOpen(true);
          }, 0);
          return () => clearTimeout(timer);
        }
      }
    } else {
      // If no video param, ensure we are closed
      if (isOpen) {
        setIsOpen(false);
        setCurrentVideo(null);
      }
    }
  }, [searchParams, isOpen, currentVideo]);

  const playVideo = useCallback((video: LandingVideo) => {
    setCurrentVideo(video);
    setIsOpen(true);
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('video', video.id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const closeVideo = useCallback(() => {
    setIsOpen(false);
    setCurrentVideo(null);
    
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
