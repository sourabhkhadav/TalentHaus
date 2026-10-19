"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { campaigns } from "@/content/campaigns";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

function CampaignSlide({ campaign }: { campaign: (typeof campaigns)[0] }) {
    return (
        <article
            className={cn(
                "flex-shrink-0 w-[min(340px,85vw)] md:w-[380px] lg:w-[420px]",
                "rounded-2xl overflow-hidden group cursor-pointer",
                "bg-gradient-to-br from-[#1C0D2E] to-[#0D0614] border border-[#C084FC]/20 hover:border-[#C084FC]/60 transition-all duration-300 shadow-2xl"
            )}
        >
            {/* Image container with AI Generated Imagery */}
            <div className="relative h-56 md:h-64 overflow-hidden bg-[#180B2B]">
                {campaign.heroImage && (
                    <Image
                        src={campaign.heroImage}
                        alt={campaign.brand}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 420px"
                    />
                )}
                {/* Gradient vignette for text clarity and atmospheric luxury */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0D2E] via-transparent to-black/50 pointer-events-none" />

                {/* Subtle cosmic violet glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[#C084FC] transition-opacity duration-500 pointer-events-none" />

                {/* Category badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="font-body text-xs tracking-widest uppercase text-white bg-black/50 backdrop-blur-md border border-[#C084FC]/40 px-3 py-1 rounded-full font-medium shadow-md">
                        {campaign.category}
                    </span>
                </div>
                {/* Year */}
                <div className="absolute bottom-4 right-4 z-10 font-body text-xs text-[#DDD6FE]/90 font-medium px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 shadow-sm">
                    {campaign.year}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-7">
                {/* Brand name */}
                <p className="eyebrow mb-3 text-[#C084FC] tracking-[0.25em] text-xs font-semibold uppercase">{campaign.brand}</p>

                {/* Headline */}
                <h3 className="font-display text-white text-xl md:text-2xl leading-snug tracking-tight mb-4 group-hover:text-[#DDD6FE] transition-colors">
                    {campaign.headline}
                </h3>

                {/* Hero metric */}
                <div className="flex items-end gap-3 mb-6">
                    <span className={cn("font-display text-[#C084FC] text-3xl md:text-4xl leading-none font-bold")}>
                        {campaign.heroMetric}
                    </span>
                    <span className="font-body text-[#DDD6FE]/70 text-xs tracking-wide uppercase mb-1">
                        {campaign.heroMetricLabel}
                    </span>
                </div>

                {/* Link */}
                <Link
                    href={`/campaigns/${campaign.slug}`}
                    className="inline-flex items-center gap-2 font-body text-xs sm:text-sm uppercase tracking-wider text-[#C084FC] hover:text-white transition-colors duration-200 group/link font-semibold"
                >
                    Explore Framework
                    <ArrowUpRight size={14} className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
            </div>
        </article>
    );
}

export function CampaignStories() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };

    const scroll = (dir: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir === "right" ? 440 : -440, behavior: "smooth" });
    };

    return (
        <section
            className="py-28 md:py-36 relative overflow-hidden border-b border-[#C084FC]/20"
            style={{
                background:
                    "radial-gradient(ellipse at 40% 40%, rgba(139, 92, 246, 0.22) 0%, rgba(17, 9, 30, 0.96) 60%, #0D0614 100%)",
            }}
            aria-labelledby="campaigns-heading"
        >
            {/* Header */}
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 mb-12 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div>
                        <p className="eyebrow mb-4 text-[#C084FC] tracking-[0.28em] text-xs uppercase font-semibold">
                            06 / Campaign Frameworks
                        </p>
                        <h2
                            id="campaigns-heading"
                            className={cn(
                                "font-display text-white",
                                "text-3xl sm:text-4xl md:text-5xl",
                                "leading-tight tracking-tight"
                            )}
                        >
                            Frameworks that <em className="italic bg-gradient-to-r from-white via-[#E9D5FF] to-[#C084FC] bg-clip-text text-transparent font-normal">drive measurable impact.</em>
                        </h2>
                    </div>

                    {/* Arrow controls */}
                    <div className="flex items-center gap-3" role="group" aria-label="Scroll campaign stories">
                        <button
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            aria-label="Previous campaigns"
                            className={cn(
                                "w-10 h-10 rounded-full border flex items-center justify-center",
                                "transition-all duration-200",
                                canScrollLeft
                                    ? "border-[#C084FC]/40 text-[#C084FC] hover:border-[#C084FC] hover:bg-[#C084FC]/20"
                                    : "border-white/10 text-white/20 cursor-not-allowed"
                            )}
                        >
                            ←
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            aria-label="Next campaigns"
                            className={cn(
                                "w-10 h-10 rounded-full border flex items-center justify-center",
                                "transition-all duration-200",
                                canScrollRight
                                    ? "border-[#C084FC]/40 text-[#C084FC] hover:border-[#C084FC] hover:bg-[#C084FC]/20"
                                    : "border-white/10 text-white/20 cursor-not-allowed"
                            )}
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable card row */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pl-4 sm:pl-6 lg:px-12 pr-4 sm:pr-6 relative z-10"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onScroll={updateScroll}
                role="list"
                aria-label="Campaign case studies"
            >
                {campaigns.map((c) => (
                    <div key={c.slug} className="snap-start" role="listitem">
                        <CampaignSlide campaign={c} />
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-12 relative z-10">
                <Link
                    href="/campaigns"
                    className="font-body text-xs sm:text-sm text-[#C084FC] hover:text-white transition-colors duration-200 underline underline-offset-4 decoration-[#C084FC]/30 hover:decoration-[#C084FC] uppercase tracking-wider font-semibold"
                >
                    View all campaign stories →
                </Link>
            </div>
        </section>
    );
}
