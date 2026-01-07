"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { readStreamableValue } from '@ai-sdk/rsc';
import ReactMarkdown from "react-markdown";
import { analyzeVideo } from "@/app/actions/analyze-video";
import type { LandingVideo } from "@/lib/types";
import { Sparkle } from "lucide-react";
import { loadFull } from "tsparticles";
import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const particleConfig: ISourceOptions = {
    key: "star",
    name: "Star",
    particles: {
        number: { value: 20, density: { enable: false } },
        color: { value: ["#7c3aed", "#bae6fd", "#a78bfa", "#93c5fd", "#0284c7", "#fafafa", "#38bdf8"] },
        shape: { type: "star", options: { star: { sides: 4 } } },
        opacity: { value: 0.8 },
        size: { value: { min: 1, max: 4 } },
        rotate: {
            value: { min: 0, max: 360 },
            enable: true,
            direction: "clockwise",
            animation: { enable: true, speed: 10, sync: false },
        },
        links: { enable: false },
        reduceDuplicates: true,
        move: { enable: true, center: { x: 120, y: 45 } },
    },
    interactivity: { events: {} },
    smooth: true,
    fpsLimit: 120,
    background: { color: "transparent", size: "cover" },
    fullScreen: { enable: false },
    detectRetina: true,
    emitters: [{
        autoPlay: true,
        fill: true,
        life: { wait: true },
        rate: { quantity: 5, delay: 0.5 },
        position: { x: 110, y: 45 },
    }],
};

type VideoAnalysisDialogProps = {
    open: boolean;
    video: LandingVideo | null;
    onClose: () => void;
};

const overlayClass = "fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4";

export function VideoAnalysisDialog({ open, video, onClose }: VideoAnalysisDialogProps) {
    const [content, setContent] = useState<any>(null); // Use proper type if possible, or any for agile dev
    const [isGenerating, setIsGenerating] = useState(false);
    const [customPrompt, setCustomPrompt] = useState("");
    const [language, setLanguage] = useState("Chinese (Simplified)");

    // Particle Button State
    const [particleState, setParticlesReady] = useState<"loaded" | "ready">();
    const [isHoveringButton, setIsHoveringButton] = useState(false);

    // Auto-scroll to bottom
    const contentEndRef = useRef<HTMLDivElement>(null);

    // Initialize Particles
    useEffect(() => {
        if (open) {
            initParticlesEngine(async (engine) => {
                await loadFull(engine);
            }).then(() => {
                setParticlesReady("loaded");
            });
        }
    }, [open]);

    const particleOptions = useMemo(() => {
        const newOptions = JSON.parse(JSON.stringify(particleConfig)) as ISourceOptions;
        newOptions.autoPlay = isHoveringButton;
        return newOptions;
    }, [isHoveringButton]);

    useEffect(() => {
        if (open && video && !content) {
            handleGenerate();
        }
    }, [open, video]);

    useEffect(() => {
        if (contentEndRef.current) {
            contentEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [content]);

    // Prevent background scroll
    useEffect(() => {
        if (!open) return;
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [open]);

    const handleGenerate = async () => {
        if (!video) return;
        setIsGenerating(true);
        setContent(null); // Clear previous content

        const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;

        try {
            const { output } = await analyzeVideo(videoUrl, customPrompt, language);

            for await (const delta of readStreamableValue(output)) {
                setContent(delta);
            }
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!open || !video) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <div className={overlayClass}>
                    {/* Backdrop Click to Close */}
                    <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/5 bg-[#151518] px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                                    <span className="text-sm font-bold text-white">AI</span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold" style={{ color: 'white' }}>Conversation Analysis</h3>
                                    <p className="text-xs truncate max-w-[300px]" style={{ color: 'rgba(255,255,255,0.8)' }}>{video.title}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content Area - wider side margins for better readability */}
                        <div className="flex-1 overflow-y-auto px-10 py-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                            {content && content.analysis ? (
                                <div className="space-y-10">
                                    {content.analysis.map((qa: any, index: number) => (
                                        <div key={index} className="space-y-4">
                                            <h4 className="text-lg font-bold leading-relaxed" style={{ color: '#a5b4fc' }}>
                                                Q{index + 1}: {qa.question}
                                            </h4>
                                            <div className="pl-6 space-y-3">
                                                {qa.answer && qa.answer.map((point: string, i: number) => (
                                                    <p key={i} className="leading-loose text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.9)' }}>{point}</p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={contentEndRef} />
                                </div>
                            ) : (
                                <div className="flex h-full min-h-[300px] items-center justify-center">
                                    {isGenerating ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                                            <p className="text-sm font-medium animate-pulse" style={{ color: 'rgba(255,255,255,0.8)' }}>Listening & Analyzing...</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Ready to analyze structure.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sticky Bottom Bar */}
                        <div className="border-t border-white/5 bg-[#151518] px-6 py-4">
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={customPrompt}
                                        onChange={(e) => setCustomPrompt(e.target.value)}
                                        placeholder="E.g. Focus more on technical architecture..."
                                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 pr-12 text-sm text-white focus:border-indigo-500/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 placeholder:text-white/20"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleGenerate();
                                        }}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/30">
                                        ⏎
                                    </div>
                                </div>

                                {/* Language Selector */}
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="max-w-[100px] rounded-xl border border-white/10 bg-black/20 px-2 py-2.5 text-xs font-medium text-white focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 cursor-pointer hover:bg-black/30 truncate"
                                    title="Output Language"
                                >
                                    <option value="English">English</option>
                                    <option value="Chinese (Simplified)">Chinese</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="Japanese">Japanese</option>
                                </select>

                                {/* Analyze Button with Particle Effects */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="group relative rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    onMouseEnter={() => setIsHoveringButton(true)}
                                    onMouseLeave={() => setIsHoveringButton(false)}
                                >
                                    <div className="relative flex items-center gap-2 rounded-xl bg-black/90 px-5 py-2.5 transition-all group-hover:bg-black/0">
                                        {isGenerating ? (
                                            <span className="block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        ) : (
                                            <>
                                                <Sparkle className="h-4 w-4 animate-sparkle fill-white text-white" />
                                                {/* Extra sparkles for effect */}
                                                <Sparkle className="absolute bottom-2 left-3 h-1.5 w-1.5 rotate-12 animate-sparkle fill-white text-white opacity-0 transition-opacity group-hover:opacity-100" style={{ animationDelay: '0.2s' }} />
                                                <Sparkle className="absolute top-2 right-3 h-1 w-1 -rotate-12 animate-sparkle fill-white text-white opacity-0 transition-opacity group-hover:opacity-100" style={{ animationDelay: '0.4s' }} />
                                            </>
                                        )}
                                        <span className="font-semibold text-white">{content ? 'Regenerate' : 'Analyze'}</span>
                                    </div>

                                    {/* Particles Container */}
                                    {particleState === "ready" && (
                                        <Particles
                                            id="dialog-btn-particles"
                                            className={cn("pointer-events-none absolute -bottom-4 -left-4 -right-4 -top-4 z-0 opacity-0 transition-opacity", {
                                                "group-hover:opacity-100": !isGenerating,
                                            })}
                                            options={particleOptions}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
