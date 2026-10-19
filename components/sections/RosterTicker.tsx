"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { roster as staticRoster, TalentProfile } from "@/content/roster";
import { getCreators } from "@/lib/data";
import { cn } from "@/lib/utils";

export function RosterTicker({ initialCreators }: { initialCreators?: TalentProfile[] } = {}) {
    const trackRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<gsap.core.Tween | null>(null);
    const [talentList, setTalentList] = useState<TalentProfile[]>(initialCreators && initialCreators.length > 0 ? initialCreators : staticRoster);
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (initialCreators && initialCreators.length > 0) {
            setTalentList(initialCreators);
        }
    }, [initialCreators]);

    useEffect(() => {
        let mounted = true;
        const sync = () => {
            getCreators().then((data) => {
                if (mounted && data && data.length > 0) {
                    setTalentList(data);
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

    // Double the list for seamless loop
    const allTalent = [...talentList, ...talentList];

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;

        let isCancelled = false;
        let cleanup: (() => void) | undefined;

        const init = async () => {
            const { default: gsap } = await import("gsap");
            if (isCancelled) return;

            const totalWidth = el.scrollWidth / 2;

            const tween = gsap.to(el, {
                x: `-=${totalWidth}`,
                duration: 40,
                ease: "none",
                repeat: -1,
                modifiers: {
                    x: gsap.utils.unitize((x: number) => x % totalWidth),
                },
            });
            animRef.current = tween;

            cleanup = () => {
                tween.kill();
            };

            if (isCancelled) {
                cleanup();
            }
        };

        init();
        return () => {
            isCancelled = true;
            cleanup?.();
            animRef.current?.kill();
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    const pause = () => animRef.current?.pause();
    const resume = (slug?: string) => {
        if (!slug) animRef.current?.play();
    };

    const hoveredCreator = hoveredSlug ? talentList.find((t) => t.slug === hoveredSlug) : null;

    return (
        <section
            className="py-28 md:py-36 relative overflow-hidden border-b border-[#C084FC]/20"
            style={{
                background:
                    "radial-gradient(ellipse at 70% 50%, rgba(139, 92, 246, 0.22) 0%, rgba(17, 9, 30, 0.95) 55%, #0D0614 100%)",
            }}
            aria-label="Talent roster ticker"
        >
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 mb-10 relative z-10">
                <p className="eyebrow mb-4 text-[#C084FC] tracking-[0.28em] text-xs uppercase font-semibold">
                    05 / Our Talent
                </p>
                <h2 className={cn(
                    "font-display text-white",
                    "text-3xl sm:text-4xl md:text-5xl",
                    "leading-tight tracking-tight"
                )}>
                    Culture-defining <em className="italic bg-gradient-to-r from-white via-[#E9D5FF] to-[#C084FC] bg-clip-text text-transparent font-normal">creators.</em>
                </h2>
            </div>

            {/* Ticker */}
            <div
                className="relative overflow-hidden border-y border-[#C084FC]/20 py-8 cursor-default z-10"
                onMouseEnter={pause}
                onMouseLeave={() => { setHoveredSlug(null); resume(); }}
                onMouseMove={handleMouseMove}
                role="marquee"
                aria-label="Scrolling talent names"
            >
                <div
                    ref={trackRef}
                    className="flex items-center gap-0 will-change-transform"
                    style={{ width: "max-content" }}
                >
                    {allTalent.map((talent, i) => (
                        <React.Fragment key={`${talent.slug}-${i}`}>
                            <Link
                                href={`/roster/${talent.slug}`}
                                className={cn(
                                    "inline-flex items-center font-display tracking-tight leading-none",
                                    "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
                                    "px-6 md:px-10 transition-colors duration-200 whitespace-nowrap",
                                    hoveredSlug === talent.slug ? "text-[#C084FC]" : "text-white/40 hover:text-white"
                                )}
                                onMouseEnter={() => setHoveredSlug(talent.slug)}
                                onMouseLeave={() => setHoveredSlug(null)}
                                aria-label={`View ${talent.name}'s profile`}
                                tabIndex={i < talentList.length ? 0 : -1}
                            >
                                {talent.name}
                            </Link>
                            <span className="text-[#C084FC]/40 text-2xl" aria-hidden="true">·</span>
                        </React.Fragment>
                    ))}
                </div>

                {/* Floating portrait card on hover */}
                {hoveredCreator && (
                    <div
                        className={cn(
                            "fixed pointer-events-none z-50",
                            "w-48 sm:w-52 aspect-[3/4] rounded-2xl overflow-hidden border border-[#C084FC]/60 shadow-[0_20px_50px_rgba(168,85,247,0.55)] backdrop-blur-xl bg-[#0D0614]",
                            "transition-all duration-150 ease-out animate-in fade-in zoom-in-95"
                        )}
                        style={{
                            left: typeof window !== "undefined" && mousePos.x + 220 > window.innerWidth
                                ? mousePos.x - 220
                                : mousePos.x + 24,
                            top: typeof window !== "undefined" && mousePos.y + 280 > window.innerHeight
                                ? mousePos.y - 280 + 30
                                : Math.max(16, mousePos.y - 100),
                        }}
                        aria-hidden="true"
                    >
                        {/* Real Creator Photo */}
                        {hoveredCreator.image && hoveredCreator.image !== "/images/roster/placeholder.jpg" ? (
                            <Image
                                src={hoveredCreator.image}
                                alt={hoveredCreator.name}
                                fill
                                unoptimized={hoveredCreator.image.startsWith("data:") || hoveredCreator.image.startsWith("blob:")}
                                className="object-cover"
                                sizes="220px"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#2E1065] via-[#1E0B38] to-[#0D0614] text-white">
                                <span className="font-display text-4xl sm:text-5xl font-bold text-white/90">
                                    {hoveredCreator.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </span>
                            </div>
                        )}

                        {/* Fine geometric texture */}
                        <div
                            className="absolute inset-0 opacity-[0.05] pointer-events-none"
                            style={{
                                backgroundImage: `linear-gradient(#C084FC 1px, transparent 1px), linear-gradient(90deg, #C084FC 1px, transparent 1px)`,
                                backgroundSize: "24px 24px",
                            }}
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-1 pointer-events-none">
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] tracking-wider uppercase font-semibold bg-black/60 backdrop-blur-md border border-[#C084FC]/40 text-white shadow-sm">
                                {hoveredCreator.niche?.[0] || "TALENT"}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] tracking-wider uppercase font-semibold bg-[#7C3AED]/80 backdrop-blur-md border border-white/20 text-white shadow-sm">
                                {hoveredCreator.audienceSize || "VERIFIED"}
                            </span>
                        </div>

                        {/* Gradient Vignette & Creator Info */}
                        <div className="absolute inset-x-0 bottom-0 z-10 p-4 pt-12 bg-gradient-to-t from-[#0D0614] via-[#0D0614]/85 to-transparent">
                            <h4 className="font-display text-white text-lg font-bold leading-tight tracking-tight">
                                {hoveredCreator.name}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-[#DDD6FE]/80 mt-1 pt-1.5 border-t border-white/10 font-body">
                                <span className="text-[11px] text-[#C084FC] font-medium">
                                    {hoveredCreator.location || "India"}
                                </span>
                                <span className="text-[10px] text-[#DDD6FE]/70">
                                    {hoveredCreator.engagementRate || "High Engagement"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center mt-12 relative z-10">
                <Link
                    href="/roster"
                    className="font-body text-xs sm:text-sm text-[#C084FC] hover:text-white transition-colors duration-200 underline underline-offset-4 decoration-[#C084FC]/30 hover:decoration-[#C084FC] uppercase tracking-wider font-semibold"
                >
                    Explore all creators →
                </Link>
            </div>
        </section>
    );
}
