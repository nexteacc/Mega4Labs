import { useState } from 'react';
import { LandingVideo } from '@/lib/types';
import { VideoGrid } from '@/components/VideoGrid';

interface PersonVideoListProps {
  person: string;
  videos: LandingVideo[];
  onSelect?: (video: LandingVideo) => void;
}

export function PersonVideoList({ person, videos, onSelect }: PersonVideoListProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Only show first 5 videos by default
  const displayedVideos = showAll ? videos : videos.slice(0, 5);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{person}</h3>
        {videos.length > 5 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showAll ? 'Show Less' : `Show ${videos.length - 5} More`}
          </button>
        )}
      </div>
      <div className="space-y-4">
        <VideoGrid
          videos={displayedVideos}
          cardVariant="compact"
          columns={{ base: 1, md: 1, lg: 1 }}
          onSelect={onSelect}
        />
        {videos.length > 5 && !showAll && (
          <div className="mt-4">
            <button 
              onClick={() => setShowAll(true)}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Show {videos.length - 5} More Videos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}