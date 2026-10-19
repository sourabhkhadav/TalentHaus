import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { campaigns } from "@/content/campaigns";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Campaign Frameworks",
    description: "Campaign execution frameworks and creator partnership blueprints from TalentHaus.",
    alternates: { canonical: "/campaigns" },
};

export default function CampaignsPage() {
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
                aria-labelledby="campaigns-page-heading"
            >
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] lg:bg-white/80 border border-[#DCE5FF] lg:border-indigo-200/80 shadow-sm text-xs uppercase tracking-[0.25em] font-semibold text-[#4F46E5] lg:text-[#312E81]">
                            01 / CAMPAIGN FRAMEWORKS
                        </span>
                    </div>
                    <h1
                        id="campaigns-page-heading"
                        className={cn(
                            "text-[#172033] lg:text-[#0F172A]",
                            "font-display font-medium sm:font-normal",
                            "text-[36px] sm:text-5xl md:text-6xl lg:text-7xl",
                            "leading-[1.14] sm:leading-tight tracking-tight max-w-4xl"
                        )}
                    >
                        Frameworks that drive measurable{" "}
                        <em className="italic bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent font-normal">
                            impact.
                        </em>
                    </h1>
                </div>
            </section>

            {/* Campaign grid */}
            <section className="pt-6 pb-16 sm:pt-8 sm:pb-20 relative z-10" aria-label="Campaign case studies">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
                    {/* Summary counters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-[#DCE5FF] lg:border-indigo-100/60">
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_10px_30px_rgba(30,27,75,0.08)]">
                            <p className="font-display text-[#172033] lg:text-[#0F172A] text-3xl sm:text-4xl md:text-5xl leading-none mb-2 font-bold">500+</p>
                            <p className="font-body text-[#4F46E5] text-xs uppercase tracking-wider font-semibold">Campaigns Executed</p>
                        </div>
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_10px_30px_rgba(30,27,75,0.08)]">
                            <p className="font-display text-[#172033] lg:text-[#0F172A] text-3xl sm:text-4xl md:text-5xl leading-none mb-2 font-bold">100+</p>
                            <p className="font-body text-[#4F46E5] text-xs uppercase tracking-wider font-semibold">Creators Engaged</p>
                        </div>
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_10px_30px_rgba(30,27,75,0.08)]">
                            <p className="font-display text-[#172033] lg:text-[#0F172A] text-3xl sm:text-4xl md:text-5xl leading-none mb-2 font-bold">Indore</p>
                            <p className="font-body text-[#4F46E5] text-xs uppercase tracking-wider font-semibold">Central Agency HQ</p>
                        </div>
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_10px_30px_rgba(30,27,75,0.08)]">
                            <p className="font-display text-[#172033] lg:text-[#0F172A] text-3xl sm:text-4xl md:text-5xl leading-none mb-2 font-bold">2026</p>
                            <p className="font-body text-[#4F46E5] text-xs uppercase tracking-wider font-semibold">Established Agency</p>
                        </div>
                    </div>

                    {/* Masonry grid */}
                    <ul
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        role="list"
                        aria-label="Campaign case studies"
                    >
                        {campaigns.map((campaign, i) => (
                            <li
                                key={campaign.slug}
                                role="listitem"
                                className={cn(i === 0 && "md:col-span-2 lg:col-span-1")}
                            >
                                <article className="group border border-[#DCE5FF] lg:border-white/95 hover:border-indigo-300 rounded-2xl overflow-hidden bg-[#EEF2FF] lg:bg-white/90 hover:bg-white backdrop-blur-xl transition-all duration-300 h-full flex flex-col shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_12px_40px_rgba(30,27,75,0.08)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.18)]">
                                    {/* Image container with AI Generated Imagery */}
                                    <div
                                        className="relative h-48 md:h-56 overflow-hidden bg-[#180B2B]"
                                    >
                                        {campaign.heroImage && (
                                            <Image
                                                src={campaign.heroImage}
                                                alt={campaign.brand}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, 420px"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />
                                        <div className="absolute top-4 left-4 flex gap-2 z-10">
                                            <span className="font-body text-xs tracking-wider uppercase text-white bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full font-bold shadow-md">
                                                {campaign.category}
                                            </span>
                                            <span className="font-body text-xs tracking-wider uppercase text-white/90 bg-black/40 border border-white/20 px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                                                {campaign.industry}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 right-4 z-10 font-mono text-xs text-white/95 font-semibold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">{campaign.year}</div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <p className="font-body mb-2 text-[#4F46E5] text-xs font-semibold uppercase tracking-wider">{campaign.brand}</p>
                                        <h2 className="font-display text-[#172033] lg:text-[#0F172A] text-xl md:text-2xl leading-snug tracking-tight mb-4 flex-1 group-hover:text-[#4F46E5] transition-colors font-medium">
                                            {campaign.headline}
                                        </h2>
                                        <div className="flex items-end gap-3 mb-6">
                                            <span className="font-display text-[#172033] lg:text-[#0F172A] text-3xl leading-none font-bold">{campaign.heroMetric}</span>
                                            <span className="font-body text-[#64708A] lg:text-[#64748B] text-xs tracking-wide uppercase mb-1 font-semibold">{campaign.heroMetricLabel}</span>
                                        </div>
                                        <Link
                                            href={`/campaigns/${campaign.slug}`}
                                            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider font-semibold text-[#4F46E5] lg:text-[#312E81] hover:text-[#312E81] lg:hover:text-[#4F46E5] transition-colors duration-200 group/link mt-auto min-h-[44px]"
                                        >
                                            View Campaign Framework
                                            <ArrowUpRight size={14} className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                        </Link>
                                    </div>
                                </article>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
}
