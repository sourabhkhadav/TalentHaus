import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { campaigns } from "@/content/campaigns";
import { roster } from "@/content/roster";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const campaign = campaigns.find((c) => c.slug === slug);
    if (!campaign) return { title: "Campaign Not Found" };
    return {
        title: `${campaign.brand} — ${campaign.category}`,
        description: campaign.headline,
    };
}

export default async function CampaignSlugPage({ params }: Props) {
    const { slug } = await params;
    const campaign = campaigns.find((c) => c.slug === slug);
    if (!campaign) notFound();

    const involvedTalent = roster.filter((t) => campaign.talent.includes(t.slug));

    return (
        <>
            {/* Hero */}
            <section
                className="relative pt-24 pb-8 sm:pt-28 sm:pb-10 bg-[#FFFFFF] lg:bg-transparent border-b border-[#DCE5FF] lg:border-transparent grain"
                style={{
                    backgroundImage: undefined,
                }}
                aria-labelledby="campaign-heading"
            >
                {/* Desktop-only dark gradient background */}
                <div
                    className="absolute inset-0 hidden lg:block -z-10 pointer-events-none"
                    style={{ background: "linear-gradient(160deg, #0B0A0D 0%, #1A1020 50%, #5B1226 85%, #0B0A0D 100%)" }}
                />

                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
                    <Link href="/campaigns" className="inline-flex items-center gap-2 font-body text-xs sm:text-sm text-[#4F46E5] lg:text-stone hover:text-[#312E81] lg:hover:text-ivory transition-colors duration-200 mb-4 sm:mb-6 min-h-[44px] uppercase tracking-wider font-semibold">
                        <ArrowLeft size={14} /> All Campaigns
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="font-body text-xs tracking-widest uppercase text-[#4F46E5] lg:text-gold/80 bg-[#EEF2FF] lg:bg-obsidian/60 border border-[#DCE5FF] lg:border-transparent px-3 py-1 rounded-full font-bold">{campaign.category}</span>
                        <span className="font-body text-xs tracking-widest uppercase text-[#64708A] lg:text-stone/60 bg-[#EEF2FF] lg:bg-obsidian/40 border border-[#DCE5FF] lg:border-transparent px-3 py-1 rounded-full font-medium">{campaign.industry}</span>
                        <span className="font-body text-xs tracking-widest uppercase text-[#64708A] lg:text-stone/60 bg-[#EEF2FF] lg:bg-obsidian/40 border border-[#DCE5FF] lg:border-transparent px-3 py-1 rounded-full font-medium">{campaign.year}</span>
                    </div>
                    <h1
                        id="campaign-heading"
                        className={cn(
                            "font-display text-[#172033] lg:text-ivory font-medium sm:font-normal",
                            "text-[34px] sm:text-4xl md:text-5xl lg:text-6xl",
                            "leading-[1.14] sm:leading-tight tracking-tight max-w-3xl mb-4 sm:mb-6"
                        )}
                    >
                        {campaign.headline}
                    </h1>
                    <p className="font-body text-xs text-[#4F46E5] lg:text-[#C084FC] uppercase tracking-[0.28em] font-semibold mb-6">{campaign.brand}</p>

                    {/* Cinematic Campaign Banner */}
                    {campaign.heroImage && (
                        <div className="relative w-full h-[260px] sm:h-[380px] md:h-[460px] rounded-2xl overflow-hidden border border-[#C084FC]/25 shadow-2xl mt-4">
                            <Image
                                src={campaign.heroImage}
                                alt={campaign.brand}
                                fill
                                priority
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>
                    )}
                </div>
            </section>

            {/* Content */}
            <section className="pt-8 pb-16 sm:pt-10 sm:pb-20 bg-[#FFFFFF] lg:bg-obsidian">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
                    {/* Hero metric */}
                    <div className="flex items-end gap-4 mb-10 sm:mb-16 pb-10 sm:pb-16 border-b border-[#DCE5FF] lg:border-gold/10">
                        <span className="font-display text-[#4F46E5] lg:text-gold" style={{ fontSize: "clamp(3.5rem, 12vw, 10rem)", lineHeight: 1 }}>
                            {campaign.heroMetric}
                        </span>
                        <span className="font-body text-[#64708A] lg:text-stone text-base sm:text-lg mb-2 sm:mb-4 font-medium">{campaign.heroMetricLabel}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
                        <div className="lg:col-span-2 space-y-10 sm:space-y-12">
                            <div>
                                <p className="font-body mb-3 sm:mb-4 text-[#4F46E5] tracking-[0.28em] text-xs uppercase font-semibold">The Brief</p>
                                <p className="font-body text-[#64708A] lg:text-stone text-[15px] sm:text-base leading-relaxed font-normal">{campaign.brief}</p>
                            </div>
                            <div>
                                <p className="font-body mb-3 sm:mb-4 text-[#4F46E5] tracking-[0.28em] text-xs uppercase font-semibold">The Execution</p>
                                <p className="font-body text-[#64708A] lg:text-stone text-[15px] sm:text-base leading-relaxed font-normal">{campaign.execution}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Results */}
                            <div>
                                <p className="font-body mb-4 sm:mb-6 text-[#4F46E5] tracking-[0.28em] text-xs uppercase font-semibold">Results</p>
                                <div className="space-y-4">
                                    {campaign.results.map((r) => (
                                        <div key={r.metric} className="p-4 sm:p-5 rounded-2xl bg-[#EEF2FF] lg:bg-transparent border border-[#DCE5FF] lg:border-0 lg:border-b lg:border-gold/10 lg:p-0 lg:pb-4 shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-none">
                                            <p className="font-display text-[#172033] lg:text-gold text-2xl md:text-3xl leading-none mb-1 font-bold">{r.value}</p>
                                            <p className="font-body text-[#64708A] lg:text-stone text-xs sm:text-sm font-medium">{r.metric}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Talent */}
                            {involvedTalent.length > 0 && (
                                <div>
                                    <p className="font-body mb-4 sm:mb-6 text-[#4F46E5] tracking-[0.28em] text-xs uppercase font-semibold">Talent Involved</p>
                                    <div className="space-y-3">
                                        {involvedTalent.map((t) => (
                                            <Link
                                                key={t.slug}
                                                href={`/roster/${t.slug}`}
                                                className="flex items-center justify-between font-body text-xs sm:text-sm text-[#172033] lg:text-ivory hover:text-[#4F46E5] lg:hover:text-gold transition-colors duration-200 group min-h-[44px] py-2 px-3 sm:px-4 rounded-xl bg-[#EEF2FF] lg:bg-transparent border border-[#DCE5FF] lg:border-0 font-medium"
                                            >
                                                <span>{t.name}</span>
                                                <ArrowUpRight size={14} className="text-[#4F46E5] lg:text-stone group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
