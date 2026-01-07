"use client";

import { useAnalytics } from "@/hooks/useAnalytics";

type AIAnalysisButtonProps = {
  videoId: string;
  videoTitle: string;
  onClick?: () => void;
};

export function AIAnalysisButton({ videoId, videoTitle, onClick }: AIAnalysisButtonProps) {
  const { track } = useAnalytics();

  const handleAnalysis = () => {
    track('ai_analysis_click', {
      videoId,
      title: videoTitle
    });

    if (onClick) {
      onClick();
    } else {
      console.log('AI Analysis clicked for:', videoTitle);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAnalysis}
      className="group relative flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      aria-label={`AI Analyze ${videoTitle}`}
    >
      {/* 核心按钮图片 */}
      <img
        src="/ai-analysis-icon.svg"
        alt="AI Analysis"
        width={64}
        height={64}
        className="relative z-10 animate-wiggle transition-transform duration-200 group-hover:scale-110 group-hover:animate-none"
        style={{
          filter: 'drop-shadow(0 0 6px rgba(74, 125, 255, 0.6)) drop-shadow(0 0 12px rgba(74, 125, 255, 0.3))'
        }}
        aria-hidden="true"
      />
    </button>
  );
}
