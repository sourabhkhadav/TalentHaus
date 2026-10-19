import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { insights } from "@/content/insights";
import { ArrowLeft, Clock, Calendar, Sparkles, ArrowUpRight } from "lucide-react";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return insights.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = insights.find((p) => p.slug === slug);
    if (!post) return { title: "Insight Not Found" };

    return {
        title: `${post.title} | TalentHaus Intelligence`,
        description: post.excerpt,
    };
}

export default async function InsightDetailPage({ params }: Props) {
    const { slug } = await params;
    const post = insights.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    const related = insights.filter((p) => p.slug !== slug).slice(0, 2);

    return (
        <article className="min-h-screen bg-[#FFFFFF] lg:bg-obsidian text-[#172033] lg:text-ivory pt-24 pb-16 sm:pt-28 sm:pb-20 safe-bottom">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back link */}
                <div className="mb-4 sm:mb-6">
                    <Link
                        href="/insights"
                        className="inline-flex items-center gap-2 text-[#4F46E5] lg:text-stone hover:text-[#312E81] lg:hover:text-gold text-xs uppercase tracking-wider transition-colors min-h-[44px] py-2 font-semibold"
                    >
                        <ArrowLeft size={14} />
                        Back to Intelligence
                    </Link>
                </div>

                {/* Article Header */}
                <header className="mb-10 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#EEF2FF] lg:bg-plum/60 border border-[#DCE5FF] lg:border-gold/25 text-[#4F46E5] lg:text-gold text-xs uppercase tracking-wider mb-4 font-semibold">
                        <Sparkles size={12} />
                        {post.category}
                    </div>
                    <h1 className="font-display font-medium sm:font-normal text-[32px] sm:text-4xl md:text-5xl lg:text-6xl text-[#172033] lg:text-ivory tracking-tight leading-[1.14] sm:leading-tight mb-4 sm:mb-6">
                        {post.title}
                    </h1>
                    <p className="font-body text-[15px] sm:text-lg md:text-xl text-[#64708A] lg:text-stone leading-relaxed mb-6 sm:mb-8 font-normal">
                        {post.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#DCE5FF] lg:border-gold/15 text-xs font-body text-[#64708A] lg:text-stone">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#EEF2FF] lg:bg-gold/15 text-[#4F46E5] lg:text-gold border border-[#DCE5FF] lg:border-transparent flex items-center justify-center font-semibold">
                                {post.author.charAt(0)}
                            </div>
                            <div>
                                <span className="text-[#172033] lg:text-ivory font-medium block">{post.author}</span>
                                <span className="text-[11px] text-[#64708A] lg:text-stone">TalentHaus Editorial</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={13} className="text-[#4F46E5] lg:text-gold" />
                                {post.publishedAt}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={13} className="text-[#4F46E5] lg:text-gold" />
                                {post.readTime}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Article Editorial Body */}
                <div className="prose lg:prose-invert max-w-none space-y-6 font-body text-[#64708A] lg:text-stone leading-relaxed text-[15px] sm:text-base font-normal">
                    <p className="text-[#172033] lg:text-ivory text-base sm:text-lg leading-relaxed font-normal">
                        Over the past twenty-four months, the creator economy has crossed a decisive threshold.
                        The era of indiscriminate sponsorship and superficial view counts has evaporated. In its
                        place stands an exacting marketplace driven by creative autonomy, verifiable brand equity,
                        and long-term enterprise architecture.
                    </p>

                    <h2 className="font-display text-2xl sm:text-3xl text-[#172033] lg:text-ivory tracking-tight mt-8 mb-4 font-bold sm:font-normal">
                        1. The Shift From Reach to Resonance
                    </h2>
                    <p>
                        Leading luxury houses — from Paris to Milan — have ceased evaluating talent strictly
                        through vanity metrics. Follower numbers are easily inflated and frequently disengaged. What
                        commands premium five- and six-figure budgets today is genuine cultural authority: the
                        creator's demonstrated ability to shape wardrobe choices, architectural tastes, and dining
                        reservations among discerning audiences.
                    </p>

                    <blockquote className="my-8 p-6 bg-[#EEF2FF] lg:bg-plum/30 border-l-2 border-[#4F46E5] lg:border-gold rounded-r-lg italic font-display text-xl sm:text-2xl text-[#172033] lg:text-ivory">
                        "The algorithm rewards velocity; luxury rewards conviction. Creators who build distinct points of view command compounding leverage."
                    </blockquote>

                    <h2 className="font-display text-2xl sm:text-3xl text-[#172033] lg:text-ivory tracking-tight mt-8 mb-4 font-bold sm:font-normal">
                        2. The Contract Structuring Paradigm
                    </h2>
                    <p>
                        Modern creator agreements are no longer one-off social deliverables. Our agency structures
                        agreements with explicit provisions for perpetual likeness rights protection, AI licensing
                        safeguards, performance incentives, and direct equity participation in capsule launches.
                        Creators are no longer media inventory; they are co-founders of consumer affinity.
                    </p>

                    <h2 className="font-display text-2xl sm:text-3xl text-[#172033] lg:text-ivory tracking-tight mt-8 mb-4 font-bold sm:font-normal">
                        3. The Strategic Agency Advantage
                    </h2>
                    <p>
                        Operating out of our central Indore headquarters grants TalentHaus roster talent direct
                        access to national and global brand corridors, institutionalizing talent operations and high-conversion commercial campaigns.
                    </p>
                </div>

                {/* Callout */}
                <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#EEF2FF] lg:bg-plum/30 border border-[#DCE5FF] lg:border-gold/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-none">
                    <div>
                        <h3 className="font-display text-xl text-[#172033] lg:text-ivory font-bold sm:font-normal">Partner With TalentHaus</h3>
                        <p className="font-body text-xs sm:text-sm text-[#64708A] lg:text-stone mt-1">
                            Representing the most influential voices in luxury and culture.
                        </p>
                    </div>
                    <Link
                        href="/contact"
                        className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#4F46E5] lg:bg-gold text-white lg:text-obsidian font-body text-xs uppercase tracking-wider font-semibold hover:bg-[#4338CA] lg:hover:bg-gold/90 shadow-[0_8px_20px_rgba(79,70,229,0.25)] lg:shadow-none transition-all inline-flex items-center justify-center shrink-0 w-full sm:w-auto"
                    >
                        Initiate a Brief
                    </Link>
                </div>

                {/* Related Articles */}
                {related.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-[#DCE5FF] lg:border-gold/15">
                        <h3 className="font-display text-2xl text-[#172033] lg:text-ivory mb-6 font-bold sm:font-normal">Further Reading</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {related.map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/insights/${item.slug}`}
                                    className="p-5 rounded-2xl bg-[#EEF2FF] lg:bg-plum/20 border border-[#DCE5FF] lg:border-gold/15 hover:border-[#4F46E5] lg:hover:border-gold/40 shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-none transition-all block group"
                                >
                                    <span className="text-[10px] uppercase tracking-wider text-[#4F46E5] lg:text-gold font-semibold">
                                        {item.category}
                                    </span>
                                    <h4 className="font-display text-lg text-[#172033] lg:text-ivory group-hover:text-[#4F46E5] lg:group-hover:text-gold transition-colors mt-1 font-bold sm:font-normal">
                                        {item.title}
                                    </h4>
                                    <span className="font-body text-xs text-[#64708A] lg:text-stone mt-2 inline-flex items-center gap-1 font-medium">
                                        Read Analysis <ArrowUpRight size={12} className="text-[#4F46E5] lg:text-gold" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
