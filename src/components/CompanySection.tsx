"use client";

import { useState, useMemo } from "react";
import type { LandingVideo, Company } from "@/lib/types";
import { LOAD_MORE_LABEL } from "@/lib/i18n";
import { VideoGrid } from "@/components/VideoGrid";
import { VideoPlayerDialog } from "@/components/VideoPlayerDialog";
import { OpenAI, Anthropic, Google, Cursor } from "@lobehub/icons";
import { PersonVideoList } from "@/components/PersonVideoList";

type CompanySectionProps = {
  company: Company;
  displayName: string;
  description: string;
  color: string;
  videos: LandingVideo[];
};

const INITIAL_LOAD = 6;
const LOAD_MORE_COUNT = 6;

// Company logo mapping
const COMPANY_LOGOS = {
  openai: OpenAI,
  anthropic: Anthropic,
  google: Google,
  cursor: Cursor,
} as const;

export function CompanySection({
  company,
  displayName,
  description,
  color,
  videos,
}: CompanySectionProps) {
  // Group videos by person
  const groupedVideos = useMemo(() => {
    const groups: Record<string, LandingVideo[]> = {};
    
    videos.forEach(video => {
      const person = video.person || 'Unknown';
      if (!groups[person]) {
        groups[person] = [];
      }
      groups[person].push(video);
    });
    
    // Sort videos by date (newest first)
    Object.keys(groups).forEach(person => {
      groups[person].sort((a, b) => {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      });
    });
    
    return groups;
  }, [videos]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<LandingVideo | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);

  // Get all persons and their videos
  const persons = Object.keys(groupedVideos);
  
  // Calculate total videos across all persons
  const totalVideos = persons.reduce((sum, person) => sum + groupedVideos[person].length, 0);
  
  // Calculate how many videos to show based on visibleCount
  let videosToShow = [];
  let count = 0;
  
  for (const person of persons) {
    const personVideos = groupedVideos[person];
    for (const video of personVideos) {
      if (count < visibleCount) {
        videosToShow.push(video);
        count++;
      } else {
        break;
      }
    }
    if (count >= visibleCount) break;
  }
  
  const hasMore = visibleCount < totalVideos;

  const handleSelect = (video: LandingVideo) => {
    setSelected(video);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelected(null), 200);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, totalVideos));
  };

  const LogoComponent = COMPANY_LOGOS[company];

  return (
    <section
      id={company}
      className="mx-auto w-full max-w-[1180px] px-4 py-[var(--spacing-section)] sm:px-8 lg:px-10"
    >
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <LogoComponent size={48} className="flex-shrink-0" />
            <h2 className="text-2xl font-semibold text-primary break-words sm:text-3xl lg:text-4xl">
              {displayName}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-secondary break-words sm:text-base lg:text-lg max-w-2xl">
            {description}
          </p>
        </div>
      </div>

      {/* Display videos grouped by person in horizontal 3-column layout using PersonVideoList component */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {persons.map((person) => (
          <PersonVideoList 
            key={person} 
            person={person} 
            videos={groupedVideos[person]} 
            onSelect={handleSelect} 
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center sm:mt-8">
          <button
            onClick={handleLoadMore}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:px-6 sm:py-3 sm:text-base"
          >
            {LOAD_MORE_LABEL}
          </button>
        </div>
      )}

      <VideoPlayerDialog open={open} video={selected} onClose={handleClose} />
    </section>
  );
}
