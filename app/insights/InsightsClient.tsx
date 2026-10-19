"use client";

import React, { useState } from "react";
import Link from "next/link";
import { insights, insightCategories } from "@/content/insights";
import { ArrowUpRight, Clock, Calendar, Sparkles } from "lucide-react";

export function InsightsClient() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredInsights = insights.filter((item) => {
        if (selectedCategory === "All") return true;
        return item.category.toLowerCase() === selectedCategory.toLowerCase();
    });

    return (
        <div className="relative overflow-hidden min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-20">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="max-w-3xl mb-10 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] lg:bg-white/80 border border-[#DCE5FF] lg:border-indigo-200/80 shadow-sm text-[#4F46E5] lg:text-[#312E81] text-xs uppercase tracking-[0.25em] mb-4 font-semibold backdrop-blur-md">
                        <Sparkles size={12} className="text-[#4F46E5]" />
                        TalentHaus Intelligence & Editorial
                    </div>
                    <h1 className="font-display font-medium sm:font-normal text-[36px] sm:text-5xl md:text-6xl text-[#172033] lg:text-[#0F172A] tracking-tight leading-[1.14] sm:leading-tight">
                        Perspectives on{" "}
                        <em className="italic bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent font-normal">
                            culture & capital.
                        </em>
                    </h1>
                    <p className="font-body text-[#64708A] lg:text-[#334155] text-[15px] sm:text-base mt-4 leading-relaxed font-normal">
                        Industry analysis, deal structuring teardowns, and creator economy forecasting
                        from the founders and strategists at TalentHaus.
                    </p>
                </div>

                {/* Categories Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {insightCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`min-h-[44px] px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all uppercase tracking-wider ${selectedCategory === cat
                                    ? "bg-[#4F46E5] text-white shadow-[0_8px_20px_rgba(79,70,229,0.3)]"
                                    : "bg-[#EEF2FF] lg:bg-white/90 text-[#172033] lg:text-slate-700 hover:text-[#0F172A] border border-[#DCE5FF] lg:border-slate-300 hover:border-[#4F46E5] shadow-sm"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredInsights.map((article) => (
                        <article
                            key={article.slug}
                            className="bg-[#EEF2FF] lg:bg-white/90 hover:bg-white border border-[#DCE5FF] lg:border-white/95 hover:border-indigo-300 rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 flex flex-col group shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_12px_40px_rgba(30,27,75,0.08)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.18)]"
                        >
                            {/* Visual Header / Cover */}
                            <div
                                className="relative h-48 w-full p-6 flex flex-col justify-between overflow-hidden"
                                style={{ background: "radial-gradient(ellipse 90% 70% at 20% 20%, #4F46E5 0%, #312E81 50%, #1E1B4B 100%)" }}
                            >
                                <div
                                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(rgba(255, 255, 255, 0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.7) 1px, transparent 1px)",
                                        backgroundSize: "32px 32px",
                                    }}
                                />
                                <div className="flex items-center justify-between relative z-10">
                                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#312E81] border border-white uppercase tracking-wider shadow-md">
                                        {article.category}
                                    </span>
                                    {article.featured && (
                                        <span className="px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-[10px] uppercase tracking-wider font-semibold">
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-white/90 relative z-10 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} className="text-white" />
                                        {article.readTime}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} className="text-white" />
                                        {article.publishedAt}
                                    </span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h2 className="font-display text-xl sm:text-2xl text-[#172033] lg:text-[#0F172A] group-hover:text-[#4F46E5] transition-colors leading-snug font-medium">
                                        <Link href={`/insights/${article.slug}`}>
                                            {article.title}
                                        </Link>
                                    </h2>
                                    <p className="font-body text-[15px] sm:text-sm text-[#64708A] lg:text-[#475569] mt-2.5 line-clamp-3 leading-relaxed font-normal">
                                        {article.excerpt}
                                    </p>
                                </div>

                                <div className="pt-6 mt-6 border-t border-[#DCE5FF] lg:border-slate-200/80 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-white lg:bg-indigo-50 border border-[#DCE5FF] lg:border-indigo-200 text-[#4F46E5] flex items-center justify-center text-xs font-bold">
                                            {article.author.charAt(0)}
                                        </div>
                                        <span className="font-body text-xs text-[#172033] lg:text-[#0F172A] font-medium">{article.author}</span>
                                    </div>
                                    <Link
                                        href={`/insights/${article.slug}`}
                                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#4F46E5] lg:text-[#312E81] hover:text-[#312E81] lg:hover:text-[#4F46E5] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-all"
                                        aria-label={`Read ${article.title}`}
                                    >
                                        <ArrowUpRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
