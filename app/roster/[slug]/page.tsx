import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCreatorsServer, getCreatorBySlugServerAsync } from "@/lib/data/creatorsServer";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    const creators = getCreatorsServer();
    return creators.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const talent = await getCreatorBySlugServerAsync(slug);
    if (!talent) return { title: "Talent Not Found" };
    return {
        title: `${talent.name} — TalentHaus Roster`,
        description: talent.shortBio || talent.bio,
    };
}

export default async function TalentProfilePage({ params }: Props) {
    const { slug } = await params;
    const talent = await getCreatorBySlugServerAsync(slug);
    if (!talent) notFound();

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
                aria-labelledby="talent-name-heading"
            >
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
                    <Link
                        href="/roster"
                        className="inline-flex items-center gap-2 font-body text-xs sm:text-sm text-[#4F46E5] hover:text-[#312E81] transition-colors duration-200 mb-4 sm:mb-6 min-h-[44px] uppercase tracking-wider font-semibold"
                    >
                        <ArrowLeft size={14} /> Back to Creators
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 sm:gap-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                            {talent.image && talent.image !== "/images/roster/placeholder.jpg" && (
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[#DCE5FF] lg:border-white/90 shadow-lg shrink-0 bg-white">
                                    <Image
                                        src={talent.image}
                                        alt={talent.name}
                                        fill
                                        priority
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {talent.niche.map((n) => (
                                        <span key={n} className="font-body text-xs tracking-widest uppercase text-[#4F46E5] lg:text-[#312E81] bg-[#EEF2FF] lg:bg-white/90 backdrop-blur-md border border-[#DCE5FF] lg:border-indigo-200 px-3 py-1 rounded-full font-bold shadow-sm">
                                            {n}
                                        </span>
                                    ))}
                                </div>
                                <h1
                                    id="talent-name-heading"
                                    className={cn(
                                        "font-display font-medium sm:font-normal text-[#172033] lg:text-[#0F172A]",
                                        "text-[36px] sm:text-5xl md:text-6xl lg:text-7xl",
                                        "leading-[1.14] sm:leading-tight tracking-tight"
                                    )}
                                >
                                    {talent.name}
                                </h1>
                                <p className="font-body text-[#64708A] lg:text-[#64748B] text-sm sm:text-base mt-2 sm:mt-3 font-medium">{talent.location}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 sm:gap-6">
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_10px_30px_rgba(30,27,75,0.08)]">
                                <p className="font-display text-[#172033] lg:text-[#0F172A] text-2xl sm:text-3xl md:text-4xl leading-none font-bold">{talent.audienceSize}</p>
                                <p className="font-body text-[#4F46E5] lg:text-[#64748B] text-xs mt-1 uppercase tracking-wider font-semibold">Total Reach</p>
                            </div>
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_10px_30px_rgba(30,27,75,0.08)]">
                                <p className="font-display text-[#172033] lg:text-[#0F172A] text-2xl sm:text-3xl md:text-4xl leading-none font-bold">{talent.engagementRate}</p>
                                <p className="font-body text-[#4F46E5] lg:text-[#64748B] text-xs mt-1 uppercase tracking-wider font-semibold">Avg. Engagement</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-8 pb-16 sm:pt-10 sm:pb-20 relative z-10">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
                        {/* Bio */}
                        <div className="lg:col-span-2">
                            <p className="font-body mb-4 sm:mb-6 text-[#4F46E5] tracking-[0.28em] text-xs uppercase font-semibold">About</p>
                            <p className="font-body text-[#64708A] lg:text-[#334155] text-[15px] sm:text-base leading-relaxed mb-8 max-w-2xl font-normal">{talent.bio}</p>

                            {/* Platforms */}
                            <p className="font-body mb-3 sm:mb-4 text-[#4F46E5] tracking-[0.28em] text-xs uppercase font-semibold">Active Platforms</p>
                            <div className="flex flex-wrap gap-2.5 sm:gap-3">
                                {talent.platforms.map((p) => (
                                    <span
                                        key={p}
                                        className="font-body text-xs sm:text-sm text-[#172033] lg:text-[#0F172A] bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-slate-300 px-3.5 sm:px-4 py-2 rounded-xl backdrop-blur-md font-semibold shadow-sm"
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>

                            {/* Selected work */}
                            {talent.selectedWork && talent.selectedWork.length > 0 && (
                                <div className="mt-10 sm:mt-12">
                                    <p className="font-body mb-4 sm:mb-6 text-[#4F46E5] tracking-[0.28em] text-xs uppercase font-semibold">Selected Work</p>
                                    <div className="space-y-4">
                                        {talent.selectedWork.map((w, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-[#EEF2FF] lg:bg-transparent border border-[#DCE5FF] lg:border-0 lg:border-l-2 lg:border-[#4F46E5] lg:pl-4 lg:py-1">
                                                <p className="font-display text-[#172033] lg:text-[#0F172A] text-lg font-bold">{w.brand}</p>
                                                <p className="font-body text-[#64708A] lg:text-[#475569] text-xs sm:text-sm mt-1">{w.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Enquire sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 rounded-2xl border border-[#DCE5FF] lg:border-white/95 p-6 sm:p-7 bg-[#EEF2FF] lg:bg-white/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(79,70,229,0.06)] lg:shadow-[0_16px_50px_rgba(30,27,75,0.12)]">
                                <p className="font-body mb-3 sm:mb-4 text-[#4F46E5] tracking-[0.28em] text-xs uppercase font-semibold">Work with {talent.name.split(" ")[0]}</p>
                                <p className="font-body text-[#64708A] lg:text-[#334155] text-[15px] sm:text-sm leading-relaxed mb-6 font-normal">
                                    Interested in partnering with {talent.name}? Share your brief and our executive desk will review and respond with availability and custom campaign structures.
                                </p>
                                <Link
                                    href={`/contact?talent=${talent.slug}`}
                                    className="flex items-center justify-center gap-2 w-full py-3.5 min-h-[46px] bg-[#4F46E5] text-white font-body text-xs uppercase tracking-wider font-semibold rounded-full hover:bg-[#4338CA] shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all group"
                                >
                                    Send an Enquiry
                                    <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
