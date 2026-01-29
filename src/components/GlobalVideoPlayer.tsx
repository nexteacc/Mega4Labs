'use client';

import { useVideoPlayer } from '@/lib/video-context';
import { VideoPlayerDialog } from './VideoPlayerDialog';

export function GlobalVideoPlayer() {
  const { currentVideo, isOpen, closeVideo } = useVideoPlayer();

  return (
    <VideoPlayerDialog
      open={isOpen}
      video={currentVideo}
      onClose={closeVideo}
    />
  );
}
