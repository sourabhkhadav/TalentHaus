import type { Metadata } from "next";
import Image from "next/image";
import { getTeamServer } from "@/lib/data/teamServer";
import { facts } from "@/content/team";
import { stats } from "@/content/site";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "About | TalentHaus",
    description:
        "Learn about TalentHaus — our story, values, leadership team, and the approach that makes us different.",
    alternates: { canonical: "/about" },
};

export default function AboutPage() {
    const team = getTeamServer();
    return (
        <div className="relative overflow-hidden min-h-screen">
            {/* Fixed Blue & White Luxury Canvas (Exact Image 3 Harmony as in Campaigns) */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
                {/* Base Gradient: Luminous crisp white on the left, transitioning into rich royal blue on the right */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(115deg, #FFFFFF 0%, #F8FAFC 30%, #EEF2FF 52%, #C7D2FE 72%, #818CF8 88%, #4F46E5 100%)",
                    }}
                />

                {/* Radiant Pure White Wash (Left 50%) - Keeps text 100% visible and crisp */}
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

            {/* Hero - Compact vertical padding removing the huge empty grid void */}
            <section
                className="relative pt-24 pb-8 sm:pt-28 sm:pb-10 border-b border-[#DCE5FF] lg:border-indigo-100/60 z-10"
                aria-labelledby="about-heading"
            >
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] lg:bg-white/80 border border-[#DCE5FF] lg:border-indigo-200/80 shadow-sm text-xs uppercase tracking-[0.25em] font-semibold text-[#4F46E5] lg:text-[#312E81]">
                            01 / ABOUT TALENTHAUS
                        </span>
                    </div>
                    <h1
                        id="about-heading"
                        className={cn(
                            "text-[#172033] lg:text-[#0F172A]",
                            "font-display font-medium sm:font-normal",
                            "text-[36px] sm:text-5xl md:text-6xl lg:text-7xl",
                            "leading-[1.14] sm:leading-tight tracking-tight max-w-4xl"
                        )}
                    >
                        Built for creators who{" "}
                        <em className="italic bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent font-normal">
                            come to define their era.
                        </em>
                    </h1>
                </div>
            </section>

            {/* Story - Balanced top padding flowing directly from the headline without large empty gap */}
            <section className="pt-6 pb-12 sm:pt-8 sm:pb-16 border-b border-[#DCE5FF] lg:border-indigo-100/60 relative z-10" aria-labelledby="story-heading">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        <div>
                            <p className="font-body text-[#4F46E5] mb-2.5 tracking-[0.28em] text-xs uppercase font-semibold">
                                Our Story
                            </p>
                            <h2
                                id="story-heading"
                                className="font-display font-medium sm:font-normal text-[#172033] lg:text-[#0F172A] text-[26px] sm:text-4xl md:text-5xl leading-tight tracking-tight mb-4"
                            >
                                We started because the industry deserved better.
                            </h2>
                            <p className="text-[#64708A] lg:text-[#334155] font-body text-[15px] sm:text-base leading-relaxed font-normal">
                                TalentHaus was founded to redefine representation in the creator economy. We operate as a boutique practice — treating each creator as an enduring commercial business and building iconic brand partnerships that define culture.
                            </p>
                        </div>

                        {/* Fact chips */}
                        <div className="flex flex-col justify-center mt-2 lg:mt-0">
                            <p className="font-body text-[#4F46E5] mb-3 tracking-[0.28em] text-xs uppercase font-semibold">
                                At a Glance
                            </p>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {facts.map((fact) => (
                                    <div
                                        key={fact.label}
                                        className="p-4 sm:p-5 rounded-2xl bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_10px_30px_rgba(30,27,75,0.08)]"
                                    >
                                        <p className="font-display text-[#172033] lg:text-[#0F172A] text-2xl sm:text-3xl lg:text-4xl leading-none mb-2 font-bold">
                                            {fact.value}
                                        </p>
                                        <p className="font-body text-[#4F46E5] text-xs uppercase tracking-wider font-semibold">
                                            {fact.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-10 md:py-16 border-b border-[#DCE5FF] lg:border-indigo-100/60 relative z-10" aria-labelledby="values-heading">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
                    <p className="font-body mb-2.5 text-[#4F46E5] tracking-[0.28em] text-xs uppercase font-semibold">
                        Our Values
                    </p>
                    <h2
                        id="values-heading"
                        className="font-display text-[#172033] lg:text-[#0F172A] text-[26px] sm:text-4xl md:text-5xl leading-tight tracking-tight mb-8 max-w-xl"
                    >
                        What we believe <em className="italic bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent font-normal">drives everything.</em>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { number: "01", title: "Authenticity above all", body: "We don't manufacture moments. We find the authentic story in every creator-brand pairing and make it visible to people who actually care." },
                            { number: "02", title: "Long-term thinking", body: "Weekly metrics matter. Lasting careers matter more. Every decision we make is filtered through what's best for the next five years, not the next five days." },
                            { number: "03", title: "Creative courage", body: "The safest brief is always the most forgettable one. We push our creators and clients toward work that has something real to say." },
                            { number: "04", title: "Commercial rigour", body: "Beautiful storytelling means nothing if it doesn't deliver results. We hold every campaign to clear, honest commercial standards." },
                            { number: "05", title: "Radical transparency", body: "No hidden fees, no soft-pedalled bad news, no surprises. Our clients and talent always know exactly where they stand." },
                            { number: "06", title: "Selective representation", body: "We believe in boutique, dedicated representation rather than mass rosters. Quality of attention and strategic longevity are non-negotiable." },
                        ].map((v) => (
                            <div key={v.number} className="border-t border-[#DCE5FF] lg:border-indigo-200/80 pt-5 group">
                                <span className="font-mono text-[#4F46E5] text-xs tracking-widest block mb-3 font-semibold">{v.number}</span>
                                <h3 className="text-[#172033] lg:text-[#0F172A] font-body font-bold sm:font-display sm:font-normal text-lg sm:text-xl md:text-2xl tracking-tight mb-2 group-hover:text-[#4F46E5] transition-colors">{v.title}</h3>
                                <p className="font-body text-[#64708A] lg:text-[#475569] text-[15px] sm:text-sm leading-relaxed font-normal">{v.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-10 md:py-16 border-b border-[#DCE5FF] lg:border-indigo-100/60 relative z-10" aria-labelledby="team-heading">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
                    <p className="font-body mb-3 text-[#4F46E5] tracking-[0.28em] text-xs uppercase font-semibold">
                        Founding Team
                    </p>
                    <h2
                        id="team-heading"
                        className="font-display font-medium sm:font-normal text-[#172033] lg:text-[#0F172A] text-[26px] sm:text-4xl md:text-5xl leading-tight tracking-tight mb-8 md:mb-10 max-w-xl"
                    >
                        The people who <em className="italic bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent font-normal">make it happen.</em>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {team.map((member) => (
                            <article key={member.name} className="group rounded-2xl p-5 sm:p-6 bg-[#EEF2FF] lg:bg-white/90 hover:bg-white border border-[#DCE5FF] lg:border-white/95 hover:border-indigo-300 transition-all duration-300 shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_12px_40px_rgba(30,27,75,0.08)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.18)]">
                                {/* Portrait photo or monogram placeholder */}
                                <div
                                    className="relative w-full rounded-xl overflow-hidden mb-5 flex items-center justify-center bg-obsidian border border-indigo-200/50"
                                    style={{
                                        aspectRatio: "3/4",
                                        background: member.image
                                            ? undefined
                                            : "radial-gradient(ellipse 90% 70% at 70% 20%, #4F46E5 0%, #312E81 55%, #1E1B4B 100%)",
                                    }}
                                >
                                    {member.image ? (
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <>
                                            {/* Delicate inner white grid */}
                                            <div
                                                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                                                style={{
                                                    backgroundImage:
                                                        "linear-gradient(rgba(255, 255, 255, 0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.7) 1px, transparent 1px)",
                                                    backgroundSize: "32px 32px",
                                                }}
                                            />
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/30 flex items-center justify-center bg-white/10 shadow-[0_0_25px_rgba(255,255,255,0.25)] group-hover:scale-105 transition-transform duration-300">
                                                <span className="font-display text-2xl sm:text-3xl text-white font-medium">
                                                    {member.name.split(" ").map((n) => n[0]).join("")}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <h3 className="font-display font-medium sm:font-normal text-[#172033] lg:text-[#0F172A] text-xl tracking-tight leading-snug">{member.name}</h3>
                                <p className="font-body text-[#4F46E5] text-[11px] sm:text-xs tracking-wider uppercase mt-1 mb-2.5 font-semibold">{member.role}</p>
                                <p className="font-body text-[#64708A] lg:text-[#475569] text-xs sm:text-sm leading-relaxed font-normal">{member.bio}</p>
                                {member.linkedin && (
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${member.name} on LinkedIn`}
                                        className="inline-flex items-center gap-1.5 mt-3.5 font-body text-xs text-[#4F46E5] hover:text-[#312E81] transition-colors duration-200 font-semibold"
                                    >
                                        LinkedIn <ArrowUpRight size={13} />
                                    </a>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Numbers */}
            <section className="py-10 md:py-16 relative z-10">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {stats.map((stat, i) => (
                            <div
                                key={stat.label}
                                className="p-4 sm:p-6 rounded-2xl bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-white/95 backdrop-blur-xl shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_10px_30px_rgba(30,27,75,0.08)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.15)] transition-all"
                            >
                                <span className="font-mono text-[10px] text-[#4F46E5] tracking-widest uppercase block mb-2 sm:mb-3 font-semibold">
                                    STAT // 0{i + 1}
                                </span>
                                <p className="font-display text-[#172033] lg:text-[#0F172A] text-3xl sm:text-4xl md:text-5xl leading-none mb-1.5 sm:mb-2 font-bold">{stat.numeral}</p>
                                <p className="font-body text-[#4F46E5] text-[11px] sm:text-xs uppercase tracking-wider font-semibold">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
