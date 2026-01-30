"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LandingVideo } from "@/lib/types";
import { GradientButton } from "@/components/ui/gradient-button";
import { Sparkle, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type AnalysisItem = {
    timestamp: number;
    topic: string;
    question: string;
    answer: string[];
};

type AnalysisContent = {
    analysis: AnalysisItem[];
};

interface VideoSidekickProps {
    video: LandingVideo;
    currentTime: number;
    onSeek: (time: number) => void;
}

// Mock data to simulate the "Card" experience requested by the user
const MOCK_ANALYSIS: AnalysisItem[] = [
    {
        timestamp: 0,
        topic: "Machine Learning",
        question: "How is ML evolving?",
        answer: ["The pace of innovation is accelerating faster than we anticipated.", "We're seeing new architectures emerge beyond just transformers."]
    },
    {
        timestamp: 15,
        topic: "AI Safety",
        question: "What are the risks?",
        answer: ["Alignment is the critical challenge we face today.", "Ensuring AI goals match human values to avoid unintended consequences."]
    },
    {
        timestamp: 45,
        topic: "Regulation",
        question: "What about policy?",
        answer: ["Governments are starting to take this seriously.", "We need global cooperation on safety standards."]
    },
    {
        timestamp: 120,
        topic: "Future of Work",
        question: "Will AI replace jobs?",
        answer: ["AI will augment human capabilities rather than replace them entirely.", "New categories of jobs will emerge that we can't yet imagine."]
    },
    {
        timestamp: 240,
        topic: "AGI Timeline",
        question: "When will we reach AGI?",
        answer: ["Predictions vary, but many experts believe it could happen within this decade.", "Compute power and data availability are the main bottlenecks."]
    }
];

export function VideoSidekick({ currentTime, onSeek }: VideoSidekickProps) {
    // Initialize with mock data directly
    const content = useMemo<AnalysisContent>(() => ({ analysis: MOCK_ANALYSIS }), []);
    const containerRef = useRef<HTMLDivElement>(null);

    const activeIndex = useMemo(() => {
        if (!content?.analysis) return -1;
        let index = -1;
        // Find the current active card based on timestamp
        for (let i = 0; i < content.analysis.length; i++) {
            if (currentTime >= content.analysis[i].timestamp) {
                index = i;
            } else {
                break;
            }
        }
        return index;
    }, [content, currentTime]);

    // Scroll active item into view
    useEffect(() => {
        if (activeIndex !== -1 && containerRef.current) {
            const activeElement = containerRef.current.children[0]?.children[activeIndex] as HTMLElement;
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [activeIndex]);

    return (
        <div className="flex flex-col h-full bg-black/40 rounded-[32px] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)] overflow-hidden backdrop-blur-xl">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md z-10">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl border border-accent/10 shadow-[0_0_15px_rgba(33,128,141,0.2)]">
                        <Sparkle className="w-4 h-4 text-accent" />
                    </div>
                    <span className="font-bold text-white tracking-tight text-sm">TuTu</span>
                </div>
            </div>

            {/* Content Area */}
            <div ref={containerRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                <AnimatePresence mode="popLayout">
                    {content?.analysis.map((item, idx) => {
                        const isActive = activeIndex === idx;

                        const CardInner = (
                            <>
                                {/* Topic Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors",
                                        isActive 
                                            ? "bg-accent !text-white border-accent shadow-[0_2px_10px_rgba(33,128,141,0.3)]" 
                                            : "bg-white/10 !text-white border-white/10"
                                    )}>
                                        TOPIC: {item.topic}
                                    </span>
                                    {isActive && (
                                        <Play className="w-3 h-3 text-accent animate-pulse" />
                                    )}
                                </div>

                                {/* Question (Host) */}
                                <div className="mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wide mb-1.5 block !text-white">
                                        Host
                                    </span>
                                    <h3 className="text-sm font-semibold leading-snug !text-white">
                                        {item.question}
                                    </h3>
                                </div>

                                {/* Answer (Guest) */}
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wide mb-1.5 block !text-white">
                                        Guest
                                    </span>
                                    <p className="text-xs leading-relaxed line-clamp-3 !text-white">
                                        {item.answer[0]}
                                    </p>
                                </div>
                            </>
                        );

                        const motionProps = {
                            initial: { opacity: 0, y: 20 },
                            animate: { 
                                opacity: 1, 
                                y: 0,
                                scale: isActive ? 1 : 0.98,
                            },
                            transition: { duration: 0.4, delay: idx * 0.1 },
                            onClick: () => onSeek(item.timestamp),
                            className: cn(
                                "relative rounded-2xl p-5 transition-all duration-500 cursor-pointer border w-full text-left",
                                isActive 
                                    ? "bg-transparent border-transparent shadow-none" 
                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                            )
                        };

                        if (isActive) {
                            return (
                                <GradientButton 
                                    key={idx} 
                                    asChild 
                                    className="w-full h-auto p-0 rounded-2xl border-0 block"
                                >
                                    <motion.div {...motionProps}>
                                        {CardInner}
                                    </motion.div>
                                </GradientButton>
                            );
                        }

                        return (
                            <motion.div key={idx} {...motionProps}>
                                {CardInner}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
