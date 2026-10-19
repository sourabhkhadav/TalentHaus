"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { roster as initialRoster, niches, platforms, type Niche, type Platform, type TalentProfile } from "@/content/roster";
import { getCreators } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export default function RosterPage() {
    const [creatorsList, setCreatorsList] = useState<TalentProfile[]>(initialRoster);
    const [search, setSearch] = useState("");
    const [selectedNiche, setSelectedNiche] = useState<Niche | "All">("All");
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | "All">("All");

    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 8;

    useEffect(() => {
        let mounted = true;
        const sync = () => {
            getCreators().then((data) => {
                if (mounted && data && data.length > 0) {
                    setCreatorsList(data);
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

    const filtered = useMemo(() => {
        return creatorsList.filter((t) => {
            const matchesSearch =
                !search ||
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.niche.some((n) => n.toLowerCase().includes(search.toLowerCase()));
            const matchesNiche = selectedNiche === "All" || t.niche.includes(selectedNiche);
            const matchesPlatform = selectedPlatform === "All" || t.platforms.includes(selectedPlatform);
            return matchesSearch && matchesNiche && matchesPlatform;
        });
    }, [creatorsList, search, selectedNiche, selectedPlatform]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, safePage]);

    return (
        <div className="relative overflow-hidden min-h-screen">
            {/* Fixed Blue & White Luxury Canvas (Exact Image 3 Harmony) */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
                {/* Base Gradient: Luminous crisp white on the left, transitioning into rich royal blue on the right */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(115deg, #FFFFFF 0%, #F8FAFC 30%, #EEF2FF 52%, #C7D2FE 72%, #818CF8 88%, #4F46E5 100%)",
                    }}
                />

                {/* Radiant Pure White Wash (Left 50%) */}
                <div
                    className="absolute -top-32 -left-20 w-[900px] h-[900px] rounded-full blur-[120px] opacity-95"
                    style={{
                        background: "radial-gradient(circle, #FFFFFF 0%, #FAF8F5 45%, #EEF2FF 70%, transparent 90%)",
                    }}
                />

                {/* Electric Royal Blue & Violet Glow (Right 50%) */}
                <div
                    className="absolute top-10 -right-20 w-[850px] h-[850px] rounded-full blur-[130px] opacity-80"
                    style={{
                        background: "radial-gradient(circle, #4F46E5 0%, #6366F1 40%, #818CF8 65%, transparent 90%)",
                    }}
                />

                {/* Subtle Deep Royal Blue Depth at bottom right */}
                <div
                    className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full blur-[140px] opacity-45"
                    style={{
                        background: "radial-gradient(circle, #312E81 0%, #4338CA 40%, transparent 80%)",
                    }}
                />

                {/* Delicate Blueprint Architectural Grid Lines (Horizontal & Vertical, subtle visibility) */}
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#312E81 1px, transparent 1px), linear-gradient(90deg, #312E81 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                    }}
                />

                {/* Mobile Text Protection & Light Canvas (<lg only): Predominantly pure crisp white #FFFFFF background */}
                <div
                    className="absolute inset-0 bg-[#FFFFFF] lg:hidden pointer-events-none"
                    style={{
                        background: "linear-gradient(180deg, #FFFFFF 0%, #F6F8FF 40%, #FFFFFF 100%)",
                    }}
                />
            </div>

            {/* Hero */}
            <section
                className="relative pt-24 pb-8 sm:pt-28 sm:pb-10 border-b border-[#DCE5FF] lg:border-indigo-100/60 z-10"
                aria-labelledby="roster-heading"
            >
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] lg:bg-white/80 border border-[#DCE5FF] lg:border-indigo-200/80 shadow-sm text-xs uppercase tracking-[0.25em] font-semibold text-[#4F46E5] lg:text-[#312E81]">
                            01 / OUR CREATORS
                        </span>
                    </div>
                    <h1
                        id="roster-heading"
                        className={cn(
                            "text-[#172033] lg:text-[#0F172A]",
                            "font-display font-medium sm:font-normal",
                            "text-[36px] sm:text-5xl md:text-6xl lg:text-7xl",
                            "leading-[1.14] sm:leading-tight tracking-tight max-w-4xl"
                        )}
                    >
                        Creators who{" "}
                        <em className="italic bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent font-normal">
                            define the conversation.
                        </em>
                    </h1>
                    <p className="font-body text-[#64708A] lg:text-[#334155] text-[15px] sm:text-base mt-4 leading-relaxed max-w-2xl font-normal">
                        Our selective, high-impact roster of visionary creators. We represent dedicated talent and review new creator applications continuously.
                    </p>
                </div>
            </section>

            <section className="pt-6 pb-16 sm:pt-8 sm:pb-20 relative z-10" aria-label="Roster filter and grid">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 sm:mb-8">
                        {/* Search */}
                        <div className="relative flex-1 max-w-sm">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64708A] lg:text-slate-400 pointer-events-none" />
                            <input
                                type="search"
                                placeholder="Search by name or niche…"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className={cn(
                                    "w-full min-h-[46px] pl-10 pr-4 py-2.5 bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-slate-300 rounded-xl text-[#172033] lg:text-slate-900 text-base sm:text-sm backdrop-blur-md shadow-sm",
                                    "placeholder:text-[#64708A] lg:placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5] focus:bg-white focus:ring-1 focus:ring-[#4F46E5]/40 transition-all"
                                )}
                                aria-label="Search roster"
                            />
                        </div>

                        {/* Niche filter */}
                        <select
                            value={selectedNiche}
                            onChange={(e) => {
                                setSelectedNiche(e.target.value as Niche | "All");
                                setCurrentPage(1);
                            }}
                            className={cn(
                                "w-full sm:w-auto min-h-[46px] px-4 py-2.5 bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-slate-300 rounded-xl text-[#172033] lg:text-slate-900 text-base sm:text-sm shadow-sm",
                                "focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/40 transition-all cursor-pointer"
                            )}
                            aria-label="Filter by niche"
                        >
                            <option value="All">All Niches</option>
                            {niches.map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>

                        {/* Platform filter */}
                        <select
                            value={selectedPlatform}
                            onChange={(e) => {
                                setSelectedPlatform(e.target.value as Platform | "All");
                                setCurrentPage(1);
                            }}
                            className={cn(
                                "w-full sm:w-auto min-h-[46px] px-4 py-2.5 bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-slate-300 rounded-xl text-[#172033] lg:text-slate-900 text-base sm:text-sm shadow-sm",
                                "focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/40 transition-all cursor-pointer"
                            )}
                            aria-label="Filter by platform"
                        >
                            <option value="All">All Platforms</option>
                            {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    {/* Results count */}
                    <p className="font-body text-[#64708A] lg:text-[#334155] text-sm mb-8 font-medium">
                        {filtered.length} {filtered.length === 1 ? "creator" : "creators"} {selectedNiche !== "All" || selectedPlatform !== "All" || search ? "matching" : "total"}
                    </p>

                    {/* Grid */}
                    {filtered.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="font-display text-[#172033] lg:text-slate-700 text-2xl">No creators found.</p>
                            <button
                                onClick={() => { setSearch(""); setSelectedNiche("All"); setSelectedPlatform("All"); }}
                                className="mt-4 font-body text-sm text-[#4F46E5] hover:text-[#312E81] underline underline-offset-4"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <ul
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            role="list"
                            aria-label="Talent roster"
                        >
                            {paginated.map((talent) => (
                                <li key={talent.slug} role="listitem">
                                    <Link
                                        href={`/roster/${talent.slug}`}
                                        className="group block rounded-2xl overflow-hidden border border-[#DCE5FF] lg:border-white/95 hover:border-indigo-300 transition-all duration-300 bg-[#EEF2FF] lg:bg-white/90 hover:bg-white backdrop-blur-xl shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_12px_40px_rgba(30,27,75,0.08)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.18)]"
                                        aria-label={`View ${talent.name}'s profile`}
                                    >
                                        {/* Portrait container */}
                                        <div
                                            className="relative w-full overflow-hidden"
                                            style={{
                                                aspectRatio: "3/4",
                                                background: "radial-gradient(ellipse 90% 70% at 70% 20%, #4F46E5 0%, #312E81 55%, #1E1B4B 100%)",
                                            }}
                                        >
                                            {/* Low opacity inner white grid lines */}
                                            <div
                                                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                                                style={{
                                                    backgroundImage:
                                                        "linear-gradient(rgba(255, 255, 255, 0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.7) 1px, transparent 1px)",
                                                    backgroundSize: "32px 32px",
                                                }}
                                            />
                                            {/* Creator Image or Monogram */}
                                            {talent.image && talent.image !== "/images/roster/placeholder.jpg" ? (
                                                <Image
                                                    src={talent.image}
                                                    alt={talent.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center bg-white/10 shadow-[0_0_25px_rgba(255,255,255,0.25)] group-hover:scale-105 transition-transform duration-300">
                                                        <span className="font-display text-3xl text-white font-medium">
                                                            {talent.name.split(" ").map((n) => n[0]).join("")}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Niche badge */}
                                            <div className="absolute top-3.5 left-3.5">
                                                <span className="font-body text-xs tracking-wider uppercase text-[#312E81] bg-white/95 backdrop-blur-md border border-white px-3 py-1 rounded-full font-bold shadow-md">
                                                    {talent.niche[0]}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <h2 className="font-display text-[#172033] lg:text-[#0F172A] text-xl tracking-tight leading-tight group-hover:text-[#4F46E5] transition-colors font-medium">{talent.name}</h2>
                                            <p className="font-body text-[#64708A] lg:text-[#64748B] text-xs mt-1 uppercase tracking-wider font-semibold">{talent.location}</p>
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#DCE5FF] lg:border-slate-200/80">
                                                <span className="font-body text-[#172033] lg:text-[#0F172A] text-sm font-bold">{talent.audienceSize}</span>
                                                <span className="font-body text-[#64708A] lg:text-[#64748B] text-xs font-medium">{talent.engagementRate} eng.</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {talent.platforms.slice(0, 3).map((p) => (
                                                    <span key={p} className="font-body text-[11px] text-[#4F46E5] lg:text-[#312E81] bg-white lg:bg-indigo-50/90 border border-[#DCE5FF] lg:border-indigo-100 px-2.5 py-0.5 rounded-full font-medium">{p}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Pagination Controls (renders when creator count exceeds page size) */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-[#DCE5FF] lg:border-indigo-100/60">
                            <button
                                type="button"
                                disabled={safePage <= 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                className="px-4 py-2 rounded-full border border-[#DCE5FF] lg:border-white/90 bg-[#EEF2FF] lg:bg-white text-xs font-semibold text-[#172033] lg:text-[#0F172A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all min-h-[40px]"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setCurrentPage(num)}
                                    className={cn(
                                        "w-10 h-10 rounded-full text-xs font-semibold transition-all",
                                        safePage === num
                                            ? "bg-[#4F46E5] text-white shadow-md shadow-indigo-500/30"
                                            : "border border-[#DCE5FF] lg:border-white/90 bg-[#EEF2FF] lg:bg-white text-[#172033] hover:bg-white"
                                    )}
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                type="button"
                                disabled={safePage >= totalPages}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                className="px-4 py-2 rounded-full border border-[#DCE5FF] lg:border-white/90 bg-[#EEF2FF] lg:bg-white text-xs font-semibold text-[#172033] lg:text-[#0F172A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all min-h-[40px]"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
