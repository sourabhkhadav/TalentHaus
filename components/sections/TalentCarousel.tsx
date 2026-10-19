"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { roster, TalentProfile } from "@/content/roster";
import { getFeaturedCreators } from "@/lib/data";
import { cn } from "@/lib/utils";

// Luxury cosmic violet & light purple palette matching Images 2, 3, 4
const cosmicVioletGradient =
    "radial-gradient(ellipse 90% 70% at 20% 20%, #220F3A 0%, #170A28 45%, #0D0614 100%)";

const cardPalettes: Record<string, { bg: string; accent: string; badge: string }> = {
    "najim-pathan": {
        bg: cosmicVioletGradient,
        accent: "#C084FC",
        badge: "Entertainment • Fashion",
    },
    "rishi-agrawal": {
        bg: cosmicVioletGradient,
        accent: "#C084FC",
        badge: "Fashion • Lifestyle",
    },
    "ayuxiety": {
        bg: cosmicVioletGradient,
        accent: "#A855F7",
        badge: "Digital Culture • Lifestyle",
    },
};

function TalentShowcaseCard({
    talent,
    isActive,
    index,
}: {
    talent: TalentProfile;
    isActive: boolean;
    index: number;
}) {
    const palette = cardPalettes[talent.slug] || {
        bg: cosmicVioletGradient,
        accent: "#C084FC",
        badge: (talent.niche && talent.niche.length > 0) ? talent.niche.join(" • ") : "Lifestyle • Culture",
    };

    return (
        <div
            className={cn(
                "relative rounded-2xl overflow-hidden select-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "w-[310px] sm:w-[350px] lg:w-[380px] h-[450px] sm:h-[500px] lg:h-[530px]",
                "border flex flex-col justify-between p-6 sm:p-7 shadow-2xl",
                isActive
                    ? "border-[#C084FC]/80 shadow-[0_24px_60px_-12px_rgba(168,85,247,0.55)] brightness-100 ring-1 ring-[#C084FC]/50"
                    : "border-white/10 shadow-none brightness-[0.65] pointer-events-none sm:pointer-events-auto"
            )}
            style={{
                background: palette.bg,
            }}
            aria-hidden={!isActive}
        >
            {/* Fine Geometric Texture */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#C084FC 1px, transparent 1px), linear-gradient(90deg, #C084FC 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Glowing Light Purple Atmosphere in Upper Corner */}
            <div
                className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-40"
                style={{ background: "#8B5CF6" }}
            />

            {/* Top Bar: Haus Monogram & Category Badge */}
            <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="font-body text-[10px] tracking-[0.25em] uppercase text-[#C084FC] font-semibold">
                    TH // 0{index + 1}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase font-medium bg-white/[0.08] backdrop-blur-md border border-[#C084FC]/30 text-white">
                    {(talent.niche && talent.niche[0]) ? talent.niche[0] : "TALENT"}
                </span>
            </div>

            {/* Mid Silhouette / Artistic Editorial Portrait */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-6">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#C084FC]/30 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#7C3AED]/35 via-white/[0.04] to-transparent shadow-[0_0_25px_rgba(168,85,247,0.25)]">
                    {talent.image && talent.image !== "/images/roster/placeholder.jpg" ? (
                        <Image
                            src={talent.image}
                            alt={talent.name}
                            fill
                            unoptimized={talent.image.startsWith("data:") || talent.image.startsWith("blob:")}
                            className="object-cover"
                        />
                    ) : (
                        <span className="font-display text-4xl sm:text-5xl text-white select-none">
                            {talent.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </span>
                    )}
                    {/* Ring highlight */}
                    <div className="absolute inset-0 rounded-full border border-[#C084FC]/40 scale-95 pointer-events-none" />
                </div>
                <p className="mt-3.5 font-body text-[11px] tracking-[0.22em] uppercase text-[#C084FC] font-medium">
                    {talent.location}
                </p>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 pt-4 border-t border-[#C084FC]/20 bg-gradient-to-t from-[#0D0614]/95 via-[#0D0614]/60 to-transparent -mx-6 -mb-6 p-6 sm:-mx-7 sm:-mb-7 sm:p-7">
                <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-2xl sm:text-3xl text-white tracking-tight leading-none">
                        {talent.name}
                    </h3>
                    <span className="font-body text-xs font-semibold text-[#C084FC] tracking-wider shrink-0">
                        {talent.audienceSize}
                    </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#DDD6FE]/70 mt-2.5 pt-2 border-t border-white/10">
                    <span className="font-body text-[11px]">
                        {talent.engagementRate} avg. engagement
                    </span>
                    <span className="inline-flex items-center gap-1 font-body text-[11px] text-[#C084FC] group-hover:text-white transition-colors font-medium">
                        View Profile
                        <ArrowUpRight size={13} />
                    </span>
                </div>
            </div>
        </div>
    );
}

export function TalentCarousel({ initialCreators }: { initialCreators?: TalentProfile[] } = {}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const sectionRef = useRef<HTMLElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchDeltaX = useRef<number>(0);

    const [featured, setFeatured] = useState<TalentProfile[]>(() => {
        if (initialCreators && initialCreators.length > 0) {
            return initialCreators;
        }
        if (typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem("th_agency_roster_v5") || localStorage.getItem("th_agency_roster");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        const feat = parsed.filter((t: TalentProfile) => t.featured !== false && t.status !== "draft");
                        if (feat.length > 0) return feat;
                    }
                }
            } catch {}
        }
        return roster.filter((t) => t.featured !== false && t.status !== "draft");
    });

    useEffect(() => {
        if (initialCreators && initialCreators.length > 0) {
            setFeatured(initialCreators);
        }
    }, [initialCreators]);

    useEffect(() => {
        let mounted = true;
        const sync = () => {
            getFeaturedCreators().then((data) => {
                if (mounted && data && data.length > 0) {
                    setFeatured(data);
                    try {
                        localStorage.setItem("th_agency_roster_v5", JSON.stringify(data));
                        localStorage.setItem("th_agency_roster", JSON.stringify(data));
                    } catch {}
                }
            });
        };
        sync();
        window.addEventListener("th-roster-updated", sync);
        window.addEventListener("storage", sync);
        return () => {
            mounted = false;
            window.removeEventListener("th-roster-updated", sync);
            window.removeEventListener("storage", sync);
        };
    }, []);

    const advance = useCallback(() => {
        setActiveIndex((i) => (i + 1) % featured.length);
    }, [featured.length]);

    const retreat = useCallback(() => {
        setActiveIndex((i) => (i - 1 + featured.length) % featured.length);
    }, [featured.length]);

    // Track section visibility for pausing autoplay
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.25 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Autoplay handling with pause on hover/out-of-view/reduced-motion
    useEffect(() => {
        if (typeof window !== "undefined") {
            const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (prefersReduced) return;
        }

        if (!isVisible || isHovered) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(advance, 4800);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [advance, isVisible, isHovered]);

    // Touch Swipe with vertical scroll lock protection
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        touchDeltaX.current = 0;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = touchStartX.current - currentX;
        const diffY = touchStartY.current - currentY;

        // If predominantly horizontal, track delta
        if (Math.abs(diffX) > Math.abs(diffY)) {
            touchDeltaX.current = diffX;
        }
    };

    const handleTouchEnd = () => {
        const minSwipeDistance = 45;
        if (touchDeltaX.current > minSwipeDistance) {
            advance();
        } else if (touchDeltaX.current < -minSwipeDistance) {
            retreat();
        }
        touchStartX.current = null;
        touchStartY.current = null;
        touchDeltaX.current = 0;
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            retreat();
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            advance();
        }
    };

    return (
        <section
            ref={sectionRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-roledescription="carousel"
            aria-label="TalentHaus Talent Showcase"
            className={cn(
                "relative py-28 md:py-36 min-h-[90svh] flex flex-col justify-between bg-[#0D0614] overflow-hidden select-none outline-none border-b border-[#C084FC]/20"
            )}
        >
            {/* Ethereal Light Purple Ambient Lighting */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 75% 55% at 50% 55%, rgba(139, 92, 246, 0.28) 0%, rgba(20, 10, 36, 0.6) 50%, transparent 80%)",
                }}
            />

            {/* Subtle Luxury Grid Lines */}
            <div
                className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#C084FC 1px, transparent 1px), linear-gradient(90deg, #C084FC 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Section Header */}
            <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 w-full mb-8 sm:mb-12">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] animate-ping" />
                            <p className="font-body text-xs uppercase tracking-[0.28em] text-[#C084FC] font-semibold">
                                01 / CREATORS
                            </p>
                        </div>
                        <h2 className="font-display text-white text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] max-w-2xl">
                            Exceptional talent.{" "}
                            <span className="italic font-normal bg-gradient-to-r from-white via-[#E9D5FF] to-[#C084FC] bg-clip-text text-transparent">
                                Cultural resonance.
                            </span>
                        </h2>
                    </div>

                    {/* Desktop Navigation Controls */}
                    <div className="hidden sm:flex items-center gap-3">
                        <button
                            onClick={retreat}
                            className="w-12 h-12 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-md text-white hover:border-[#C084FC] hover:bg-[#C084FC]/20 active:scale-95 flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] shadow-lg"
                            aria-label="Previous creator"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={advance}
                            className="w-12 h-12 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-md text-white hover:border-[#C084FC] hover:bg-[#C084FC]/20 active:scale-95 flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] shadow-lg"
                            aria-label="Next creator"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Cinematic 3D Carousel Showcase Stage */}
            <div
                className="relative z-10 w-full flex items-center justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[550px] my-auto"
                style={{ perspective: "1200px" }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="relative flex items-center justify-center w-full max-w-6xl h-full"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {featured.map((talent, i) => {
                        const offset = i - activeIndex;
                        const clampedOffset =
                            ((offset + featured.length + Math.floor(featured.length / 2)) % featured.length) -
                            Math.floor(featured.length / 2);

                        const isCenter = clampedOffset === 0;
                        const isAdjacent = Math.abs(clampedOffset) === 1;

                        // Responsive 3D geometry: flanked neighboring cards
                        const rotateY = clampedOffset * -10;
                        // Spacing calibrated for 380px cards with restrained overlap
                        const translateX = clampedOffset * 335;
                        const translateZ = Math.abs(clampedOffset) * -95;
                        const scale = isCenter ? 1 : 0.9;
                        const opacity = isCenter ? 1 : isAdjacent ? 0.58 : 0.2;

                        return (
                            <div
                                key={talent.slug}
                                className="absolute transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                style={{
                                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                                    opacity,
                                    zIndex: 20 - Math.abs(clampedOffset),
                                    visibility: Math.abs(clampedOffset) > 2 ? "hidden" : "visible",
                                }}
                            >
                                <Link
                                    href={`/roster/${talent.slug}`}
                                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] rounded-2xl group"
                                    aria-label={`View full profile of ${talent.name}`}
                                    tabIndex={isCenter ? 0 : -1}
                                >
                                    <TalentShowcaseCard
                                        talent={talent}
                                        isActive={isCenter}
                                        index={i}
                                    />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Controls & Indicators */}
            <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 w-full mt-8 sm:mt-12">
                <div className="flex flex-col sm:grid sm:grid-cols-3 items-center gap-4">
                    {/* Mobile Prev / Next Buttons (centered on mobile, hidden on desktop) */}
                    <div className="flex sm:hidden items-center justify-between w-full max-w-xs">
                        <button
                            onClick={retreat}
                            className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl bg-white/[0.04] border border-[#C084FC]/30 text-white text-xs font-body flex items-center gap-1 active:bg-[#C084FC] active:text-[#0D0614] transition-colors"
                            aria-label="Previous creator"
                        >
                            <ChevronLeft size={16} />
                            <span>Prev</span>
                        </button>

                        <span className="font-body text-xs text-[#DDD6FE]/70 tracking-wider tabular-nums">
                            {activeIndex + 1} / {featured.length}
                        </span>

                        <button
                            onClick={advance}
                            className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl bg-white/[0.04] border border-[#C084FC]/30 text-white text-xs font-body flex items-center gap-1 active:bg-[#C084FC] active:text-[#0D0614] transition-colors"
                            aria-label="Next creator"
                        >
                            <span>Next</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Desktop spacer to keep the 3-column layout balanced */}
                    <div className="hidden sm:block" aria-hidden="true" />

                    {/* Dot / Pill Indicators perfectly centered */}
                    <div
                        className="flex items-center justify-center gap-1.5"
                        role="tablist"
                        aria-label="Talent roster pagination"
                    >
                        {featured.map((t, i) => (
                            <button
                                key={t.slug}
                                role="tab"
                                aria-selected={i === activeIndex}
                                aria-label={`Show ${t.name}`}
                                onClick={() => setActiveIndex(i)}
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C084FC]"
                            >
                                <span
                                    className={cn(
                                        "rounded-full transition-all duration-300 block",
                                        i === activeIndex
                                            ? "w-8 h-2 bg-[#C084FC] shadow-[0_0_12px_rgba(192,132,252,0.8)]"
                                            : "w-2 h-2 bg-white/20 hover:bg-white/40"
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    {/* View Full Creators Link (aligned to right on desktop, centered on mobile) */}
                    <div className="flex items-center justify-center sm:justify-end w-full">
                        <Link
                            href="/roster"
                            className="min-h-[44px] inline-flex items-center gap-1.5 font-body text-xs sm:text-sm uppercase tracking-wider text-[#C084FC] hover:text-white transition-colors underline underline-offset-4 decoration-[#C084FC]/30 hover:decoration-[#C084FC] font-semibold"
                        >
                            Explore all represented creators
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

