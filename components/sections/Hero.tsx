"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCreators } from "@/lib/data";

// Default orbital creator nodes with verified TalentHaus talent
const defaultOrbitalCreators = [
    {
        name: "Najim Pathan",
        role: "Entertainment & Fashion",
        tag: "Najim",
        slug: "najim-pathan",
        color: "#C084FC",
        img: "https://res.cloudinary.com/nssbycq1/image/upload/v1792376694/talenthaus/creators/nsg1jedw2ukkofiwfvvg.jpg",
    },
    {
        name: "Rishi Agrawal",
        role: "Lifestyle & Entertainment",
        tag: "Rishi",
        slug: "rishi-agrawal",
        color: "#A855F7",
        img: "https://res.cloudinary.com/nssbycq1/image/upload/v1792335379/talenthaus/creators/rp1kdc7fqpow1wurnyzb.jpg",
    },
    {
        name: "Ayuxiety",
        role: "Fashion & Lifestyle",
        tag: "Ayuxiety",
        slug: "ayuxiety",
        color: "#E879F9",
        img: "https://res.cloudinary.com/nssbycq1/image/upload/v1792335899/talenthaus/creators/qnnux0dlefehbhdke7xz.jpg",
    },
];

export function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const radarRef = useRef<HTMLDivElement>(null);

    const [talents, setTalents] = useState(defaultOrbitalCreators);

    useEffect(() => {
        let mounted = true;
        const sync = () => {
            getCreators().then((data) => {
                if (mounted && data && data.length > 0) {
                    const mapped = data.slice(0, 4).map((c, i) => ({
                        name: c.name,
                        role: (c.niche && c.niche[0]) ? `${c.niche[0]} · ${c.audienceSize || "Verified"}` : "Exclusive Talent",
                        tag: c.name.split(" ")[0],
                        slug: c.slug,
                        color: i === 0 ? "#C084FC" : i === 1 ? "#A855F7" : i === 2 ? "#E879F9" : "#818CF8",
                        img: c.image && c.image !== "/images/roster/placeholder.jpg"
                            ? c.image
                            : defaultOrbitalCreators[i % defaultOrbitalCreators.length].img,
                    }));
                    if (mapped.length > 0) setTalents(mapped);
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

    useEffect(() => {
        let isCancelled = false;
        let cleanup: (() => void) | undefined;

        const init = async () => {
            const { default: gsap } = await import("gsap");
            if (isCancelled) return;

            const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            const elements = [
                labelRef.current,
                headlineRef.current,
                subRef.current,
                ctaRef.current,
                radarRef.current,
            ].filter(Boolean);

            if (prefersReduced) {
                gsap.set(elements, { opacity: 1, y: 0 });
                return;
            }

            // GSAP slow fade-up: 0.9s duration, power3.out ease, 0.1s stagger
            gsap.set(elements, { opacity: 0, y: 28 });

            const tl = gsap.timeline({ delay: 0.1 });
            tl.to(elements, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.1,
                ease: "power3.out",
            });

            cleanup = () => tl.kill();
            if (isCancelled) {
                cleanup();
            }
        };

        init();
        return () => {
            isCancelled = true;
            cleanup?.();
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className={cn(
                "relative min-h-[100svh] flex items-center overflow-hidden",
                "pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-28",
                "border-b border-white/10"
            )}
            style={{
                // Ethereal white + light purple + deep violet gradient (Images 2 & 3 palette)
                background:
                    "radial-gradient(ellipse at 15% 15%, rgba(254, 243, 226, 0.22) 0%, transparent 45%), radial-gradient(ellipse at 70% 30%, rgba(139, 92, 246, 0.38) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%), radial-gradient(circle at 50% 85%, rgba(192, 132, 252, 0.18) 0%, transparent 60%), #0D0614",
            }}
            aria-labelledby="hero-heading"
        >
            {/* Top Hairline border */}
            <div
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C084FC]/30 to-transparent pointer-events-none"
                aria-hidden="true"
            />

            {/* Ambient luxury light blooms & subtle mesh grid */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                {/* Upper Left Warm Peach/Gold Glow (Image 2/3) */}
                <div
                    className="absolute -top-32 -left-20 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20"
                    style={{ background: "#FDE68A" }}
                />
                {/* Center Purple Nebula Bloom */}
                <div
                    className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full blur-[160px] opacity-35"
                    style={{ background: "#8B5CF6" }}
                />
                {/* Right Violet Bloom */}
                <div
                    className="absolute -bottom-20 right-0 w-[650px] h-[650px] rounded-full blur-[180px] opacity-25"
                    style={{ background: "#C084FC" }}
                />
                {/* Ultra fine geometric grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                        backgroundSize: "64px 64px",
                    }}
                />
            </div>

            {/* Main Content: Left Editorial Headline + Right Concentric Orbital Radar Stats */}
            <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
                    
                    {/* LEFT COLUMN: Clean, High-Contrast Typography & CTA (Image 1, 2, 3) */}
                    <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-left">
                        {/* Glowing Pill Badge (Image 1 style) */}
                        <div ref={labelRef} className="mb-6 opacity-0">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#C084FC]/40 shadow-[0_0_20px_rgba(192,132,252,0.25)] text-xs uppercase tracking-[0.25em] font-semibold text-[#DDD6FE]">
                                <Sparkles size={13} className="text-[#C084FC] animate-pulse" />
                                TALENT & INFLUENCER MANAGEMENT
                            </span>
                        </div>

                        {/* Large Modern Headline (Image 1 & 2 inspiration) */}
                        <h1
                            ref={headlineRef}
                            id="hero-heading"
                            className={cn(
                                "font-display text-white leading-[1.04] tracking-tight opacity-0",
                                "text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-[80px]"
                            )}
                        >
                            Building the Future of{" "}
                            <span className="bg-gradient-to-r from-white via-[#E9D5FF] to-[#C084FC] bg-clip-text text-transparent">
                                Digital Talent
                            </span>
                        </h1>

                        {/* Short Supporting Paragraph */}
                        <p
                            ref={subRef}
                            className="font-body text-[#DDD6FE]/80 text-base sm:text-lg max-w-xl leading-relaxed mt-6 sm:mt-8 opacity-0"
                        >
                            TalentHaus connects visionary creators with ambitious brands through strategic talent management and high-impact partnerships.
                        </p>

                        {/* Max 2 Buttons: Glowing Gradient Pill + Frosted Glass Pill (Image 1 style) */}
                        <div
                            ref={ctaRef}
                            className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 opacity-0"
                        >
                            {/* Primary Button: Glowing Purple Pill */}
                            <Link
                                href="/join"
                                className={cn(
                                    "inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full min-h-[48px]",
                                    "bg-gradient-to-r from-[#D946EF] via-[#A855F7] to-[#7C3AED] text-white font-body text-xs sm:text-sm font-semibold tracking-wider",
                                    "hover:opacity-95 shadow-[0_0_30px_rgba(168,85,247,0.55)] transition-all active:scale-[0.98] group"
                                )}
                            >
                                Join as Creator
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                                    <ArrowUpRight size={13} className="text-white" />
                                </div>
                            </Link>

                            {/* Secondary Button: Clean Outlined Hairline Pill */}
                            <Link
                                href="/contact"
                                className={cn(
                                    "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full min-h-[48px]",
                                    "border border-white/20 text-white bg-white/[0.04] backdrop-blur-md",
                                    "font-body text-xs sm:text-sm font-medium tracking-wider",
                                    "hover:bg-white/10 hover:border-[#C084FC]/50 transition-all active:scale-[0.98]"
                                )}
                            >
                                Contact Us
                            </Link>
                        </div>

                        {/* Micro Trust Indicators */}
                        <div className="mt-10 pt-6 border-t border-white/10 flex items-center gap-6 text-xs text-[#DDD6FE]/60">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-[#C084FC]" />
                                <span>Verified Representation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp size={16} className="text-[#C084FC]" />
                                <span>Indore HQ · 500+ Campaigns</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Concentric Orbital Radar Stats Showcase (Exact Image 2 Implementation) */}
                    <div
                        ref={radarRef}
                        className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end opacity-0"
                    >
                        <div className="relative w-full max-w-[560px] aspect-square rounded-3xl p-6 sm:p-8 flex items-center justify-center overflow-hidden">
                            
                            {/* Ambient Center Glow */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        "radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.35) 0%, rgba(99, 102, 241, 0.12) 45%, transparent 70%)",
                                }}
                            />

                            {/* Outer Radar Ring 3 */}
                            <div className="absolute w-[440px] sm:w-[480px] h-[440px] sm:h-[480px] rounded-full border border-white/10 animate-[spin_60s_linear_infinite]" />
                            <div className="absolute w-[440px] sm:w-[480px] h-[440px] sm:h-[480px] rounded-full border border-dashed border-[#C084FC]/15 pointer-events-none" />

                            {/* Middle Radar Ring 2 */}
                            <div className="absolute w-[320px] sm:w-[350px] h-[320px] sm:h-[350px] rounded-full border border-white/15 animate-[spin_40s_linear_infinite_reverse]" />
                            <div className="absolute w-[320px] sm:w-[350px] h-[320px] sm:h-[350px] rounded-full border border-dashed border-[#A855F7]/25 pointer-events-none" />

                            {/* Inner Radar Ring 1 */}
                            <div className="absolute w-[200px] sm:w-[220px] h-[200px] sm:h-[220px] rounded-full border border-white/20" />
                            <div className="absolute w-[200px] sm:w-[220px] h-[200px] sm:h-[220px] rounded-full border border-dashed border-[#C084FC]/30 pointer-events-none" />

                            {/* CENTER STAT CORE (Exact Image 2: "100+ Creators" style) */}
                            <Link
                                href="/roster"
                                aria-label="Explore represented creators"
                                className="relative z-20 flex flex-col items-center justify-center text-center p-6 rounded-full bg-gradient-to-b from-[#1E0F33]/90 to-[#0D0614]/90 border border-[#C084FC]/40 shadow-[0_0_50px_rgba(168,85,247,0.45)] backdrop-blur-xl w-36 h-36 sm:w-44 sm:h-44 group cursor-pointer transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#C084FC]"
                            >
                                <div className="absolute inset-0 rounded-full bg-[#C084FC]/10 animate-ping opacity-25" />
                                <span className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-none group-hover:text-[#DDD6FE] transition-colors">
                                    100+
                                </span>
                                <span className="font-body text-xs sm:text-sm font-medium text-[#DDD6FE] tracking-wide mt-1">
                                    Creators
                                </span>
                                <span className="text-[10px] text-[#A78BFA] uppercase tracking-widest mt-0.5 group-hover:underline">
                                    Selective Roster
                                </span>
                            </Link>

                            {/* ORBITING TALENT AVATARS WITH REAL CREATORS */}
                            {/* Avatar 1: Top Right on Inner Orbit — Najim Pathan */}
                            {talents[0] && (
                                <div className="absolute top-[20%] right-[20%] z-20 group">
                                    <Link
                                        href={`/roster/${talents[0].slug}`}
                                        className="relative flex items-center justify-center focus:outline-none"
                                        title={`${talents[0].name} — ${talents[0].role}`}
                                    >
                                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#C084FC] shadow-[0_0_20px_rgba(192,132,252,0.9)] overflow-hidden bg-black/60 transition-transform duration-300 group-hover:scale-115 ring-2 ring-white/20">
                                            <Image
                                                src={talents[0].img}
                                                alt={talents[0].name}
                                                fill
                                                unoptimized={talents[0].img.startsWith("data:") || talents[0].img.startsWith("blob:")}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-[#C084FC]/50 text-[10px] font-semibold text-white tracking-wide shadow-lg z-30">
                                            {talents[0].name}
                                        </div>
                                    </Link>
                                </div>
                            )}

                            {/* Avatar 2: Left Middle on Middle Orbit — Rishi Agrawal */}
                            {talents[1] && (
                                <div className="absolute top-[30%] left-[8%] z-20 group">
                                    <Link
                                        href={`/roster/${talents[1].slug}`}
                                        className="relative flex items-center justify-center focus:outline-none"
                                        title={`${talents[1].name} — ${talents[1].role}`}
                                    >
                                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.9)] overflow-hidden bg-black/60 transition-transform duration-300 group-hover:scale-115 ring-2 ring-white/20">
                                            <Image
                                                src={talents[1].img}
                                                alt={talents[1].name}
                                                fill
                                                unoptimized={talents[1].img.startsWith("data:") || talents[1].img.startsWith("blob:")}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-[#A855F7]/50 text-[10px] font-semibold text-white tracking-wide shadow-lg z-30">
                                            {talents[1].name}
                                        </div>
                                    </Link>
                                </div>
                            )}

                            {/* Avatar 3: Bottom Left on Middle Orbit — Ayuxiety with Floating Badge */}
                            {talents[2] && (
                                <div className="absolute bottom-[22%] left-[18%] z-20 flex items-center gap-2 group">
                                    <Link
                                        href={`/roster/${talents[2].slug}`}
                                        className="flex items-center gap-2 focus:outline-none"
                                        title={`${talents[2].name} — ${talents[2].role}`}
                                    >
                                        <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-[#E879F9] shadow-[0_0_20px_rgba(232,121,249,0.9)] overflow-hidden bg-black/60 transition-transform duration-300 group-hover:scale-115 ring-2 ring-white/20">
                                            <Image
                                                src={talents[2].img}
                                                alt={talents[2].name}
                                                fill
                                                unoptimized={talents[2].img.startsWith("data:") || talents[2].img.startsWith("blob:")}
                                                className="object-cover"
                                            />
                                        </div>
                                        {/* Floating cursor tag */}
                                        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] border border-[#C084FC]/60 shadow-[0_4px_16px_rgba(124,58,237,0.5)] text-[11px] font-semibold text-white tracking-wide flex items-center gap-1.5 animate-bounce group-hover:scale-105 transition-transform">
                                            <span>TalentHaus</span>
                                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                            <span className="text-[#E9D5FF]">{talents[2].tag}</span>
                                        </div>
                                    </Link>
                                </div>
                            )}

                            {/* Avatar 4: Bottom Right on Middle Orbit */}
                            <div className="absolute bottom-[16%] right-[26%] z-20 group">
                                <Link
                                    href={talents[3] ? `/roster/${talents[3].slug}` : "/roster"}
                                    className="relative flex items-center justify-center focus:outline-none"
                                    title={talents[3] ? `${talents[3].name} — ${talents[3].role}` : "Explore All Creators"}
                                >
                                    <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#818CF8] shadow-[0_0_18px_rgba(129,140,248,0.85)] overflow-hidden bg-black/60 transition-transform duration-300 group-hover:scale-115 ring-2 ring-white/20 flex items-center justify-center">
                                        {talents[3] ? (
                                            <Image
                                                src={talents[3].img}
                                                alt={talents[3].name}
                                                fill
                                                unoptimized={talents[3].img.startsWith("data:") || talents[3].img.startsWith("blob:")}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#312E81] via-[#1E1B4B] to-[#0D0614] text-white">
                                                <span className="font-display text-xs font-bold text-[#C084FC]">TH</span>
                                                <span className="text-[7px] uppercase tracking-wider text-[#DDD6FE]">ROSTER</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-[#818CF8]/50 text-[10px] font-semibold text-white tracking-wide shadow-lg z-30">
                                        {talents[3] ? talents[3].name : "Explore Roster ↗"}
                                    </div>
                                </Link>
                            </div>

                            {/* Floating brand / feature nodes on Outer Orbit */}
                            <div className="absolute top-[12%] left-[45%] z-20 w-8 h-8 rounded-full bg-[#240E3A] border border-[#C084FC]/40 shadow-[0_0_12px_rgba(192,132,252,0.4)] flex items-center justify-center text-white text-xs font-mono">
                                ✦
                            </div>
                            <div className="absolute bottom-[36%] right-[8%] z-20 w-9 h-9 rounded-full bg-[#1A0B2E] border border-[#818CF8]/40 shadow-[0_0_12px_rgba(129,140,248,0.4)] flex items-center justify-center text-[#DDD6FE] text-xs font-mono">
                                ◈
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Hairline border */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C084FC]/25 to-transparent pointer-events-none"
                aria-hidden="true"
            />
        </section>
    );
}


