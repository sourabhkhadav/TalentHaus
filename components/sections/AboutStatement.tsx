"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AboutStatement() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const heading = headingRef.current;
        if (!heading) return;

        let isCancelled = false;
        let cleanup: (() => void) | undefined;

        const init = async () => {
            const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all([
                import("gsap"),
                import("gsap/ScrollTrigger"),
            ]);

            if (isCancelled) return;
            gsap.registerPlugin(ScrollTrigger);

            const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            if (prefersReduced) {
                gsap.set(heading, { opacity: 1, y: 0 });
                return;
            }

            const anim = gsap.fromTo(
                heading,
                { opacity: 0, y: 32 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: heading,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );

            cleanup = () => {
                anim.kill();
                ScrollTrigger.getAll().forEach((st) => {
                    if (st.trigger === heading) st.kill();
                });
            };

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
            ref={sectionRef}
            className="py-28 sm:py-36 lg:py-44 relative overflow-hidden border-b border-white/10"
            style={{
                // Image 4 deep cosmic violet background with glowing purple nebula
                background:
                    "radial-gradient(ellipse at 75% 50%, rgba(168, 85, 247, 0.28) 0%, rgba(99, 102, 241, 0.12) 40%, transparent 70%), radial-gradient(circle at 20% 80%, rgba(192, 132, 252, 0.12) 0%, transparent 50%), #0A0410",
            }}
            aria-labelledby="who-we-are-heading"
        >
            {/* Fine Star Dust & Ambient Glow */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `radial-gradient(circle, #FFFFFF 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                    }}
                />
                <div
                    className="absolute top-1/3 right-10 w-[550px] h-[550px] rounded-full blur-[170px] opacity-30"
                    style={{ background: "#A855F7" }}
                />
            </div>

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                {/* Two-Column Composition (Exact Image 4 syngri layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* LEFT COLUMN: Badge, Headline, Copy & 2 Buttons (Image 4) */}
                    <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
                        {/* Status Badge: "● Available for Representation" */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 w-fit mb-6 sm:mb-8 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                            <span className="font-body text-xs text-[#DDD6FE] tracking-wider font-medium">
                                Available for Representation
                            </span>
                        </div>

                        {/* Large Modern Headline (Matching Image 4) */}
                        <h2
                            ref={headingRef}
                            id="who-we-are-heading"
                            className={cn(
                                "font-display text-white font-normal leading-[1.05] tracking-tight",
                                "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px]"
                            )}
                        >
                            Transform your vision into{" "}
                            <span className="bg-gradient-to-r from-white via-[#E9D5FF] to-[#C084FC] bg-clip-text text-transparent">
                                cultural success
                            </span>{" "}
                            with us!
                        </h2>

                        {/* Concise Supporting Description */}
                        <p className="font-body text-[#DDD6FE]/75 text-base sm:text-lg leading-relaxed mt-6 sm:mt-8 max-w-xl">
                            We're your strategic partner in creator representation, high-impact brand partnerships, and long-term career growth for the next generation of icons.
                        </p>

                        {/* 2 Buttons matching Image 4 (Solid White Pill + Outlined Hairline Pill) */}
                        <div className="flex flex-wrap items-center gap-4 mt-8 sm:mt-10">
                            <Link
                                href="/services"
                                className={cn(
                                    "inline-flex items-center justify-center px-7 py-3.5 rounded-full min-h-[46px]",
                                    "bg-white text-[#0A0410] font-body text-xs sm:text-sm font-semibold tracking-wider",
                                    "hover:bg-[#F3E8FF] transition-all active:scale-[0.98] shadow-lg"
                                )}
                            >
                                Services
                            </Link>

                            <Link
                                href="/roster"
                                className={cn(
                                    "inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full min-h-[46px]",
                                    "border border-white/20 text-white bg-white/[0.03] backdrop-blur-md",
                                    "font-body text-xs sm:text-sm font-medium tracking-wider",
                                    "hover:bg-white/10 hover:border-[#C084FC]/50 transition-all active:scale-[0.98]"
                                )}
                            >
                                Our Creators
                                <ArrowUpRight size={14} className="text-[#C084FC]" />
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: 3D Twisted Glass Torus Sculpture (Exact Image 4 Visual) */}
                    <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center">
                        <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center">
                            
                            {/* Ambient Violet Core Glow */}
                            <div
                                className="absolute w-80 h-80 rounded-full blur-[100px] opacity-75 pointer-events-none"
                                style={{
                                    background: "radial-gradient(circle, #A855F7 0%, #7C3AED 50%, transparent 75%)",
                                }}
                            />

                            {/* 3D Photorealistic Twisted Glass Ribbon Torus Sculpture (Image 4) */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center group">
                                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(168,85,247,0.4)] backdrop-blur-sm bg-[#0E0617]/50">
                                    <Image
                                        src="/images/syngri_torus.jpg"
                                        alt="3D Twisted Glass Torus Sculpture"
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-cover scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
                                    />
                                    {/* Glass specular overlay reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0614]/40 via-transparent to-white/10 pointer-events-none" />
                                </div>
                            </div>

                            {/* Floating Glass Viewfinder Tag (Image 4 style) */}
                            <div className="absolute -bottom-3 right-4 z-20 px-4 py-2 rounded-full bg-white/[0.08] border border-white/20 backdrop-blur-xl shadow-xl text-[11px] font-mono tracking-widest text-[#DDD6FE] uppercase flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] animate-ping" />
                                <span>TALENTHAUS // CREATOR & BRAND MANAGEMENT</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}


