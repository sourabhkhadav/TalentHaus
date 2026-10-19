import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/content/services";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Services | TalentHaus",
    description:
        "Talent Management, Influencer Marketing, and Brand Partnerships — delivered at the highest standard by TalentHaus.",
    alternates: { canonical: "/services" },
};

export default function ServicesPage() {
    return (
        <div className="relative overflow-hidden min-h-screen">
            {/* Fixed Blue & White Luxury Canvas (Exact Same Harmony as About & Campaigns on Desktop) */}
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

            {/* Hero - Compact vertical padding removing huge empty voids */}
            <section
                className="relative pt-24 pb-8 sm:pt-28 sm:pb-10 border-b border-[#DCE5FF] lg:border-indigo-100/60 z-10"
                aria-labelledby="services-page-heading"
            >
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] lg:bg-white/80 border border-[#DCE5FF] lg:border-indigo-200/80 shadow-sm text-xs uppercase tracking-[0.25em] font-semibold text-[#4F46E5] lg:text-[#312E81]">
                            01 / WHAT WE DO
                        </span>
                    </div>
                    <h1
                        id="services-page-heading"
                        className={cn(
                            "text-[#172033] lg:text-[#0F172A]",
                            "font-display font-medium sm:font-normal",
                            "text-[36px] sm:text-5xl md:text-6xl lg:text-7xl",
                            "leading-[1.14] sm:leading-tight tracking-tight max-w-4xl"
                        )}
                    >
                        Full-service talent and{" "}
                        <em className="italic bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent font-normal">
                            brand management.
                        </em>
                    </h1>
                </div>
            </section>

            {/* Services list */}
            <section className="pt-6 pb-16 sm:pt-8 sm:pb-20 relative z-10">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="space-y-8 sm:space-y-12 md:space-y-16">
                        {services.map((service) => (
                            <article
                                key={service.slug}
                                id={service.slug}
                                className={cn(
                                    "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16",
                                    "border-t border-[#DCE5FF] lg:border-indigo-200/80 pt-10 md:pt-14 group"
                                )}
                                aria-labelledby={`service-${service.slug}-heading`}
                            >
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="font-mono text-[#4F46E5] text-xs sm:text-sm tracking-widest font-bold">
                                            {service.number}
                                        </span>
                                        <div className="flex-1 h-px bg-[#DCE5FF] lg:bg-indigo-200/80 group-hover:bg-[#4F46E5]/40 transition-colors duration-300" />
                                    </div>
                                    <h2
                                        id={`service-${service.slug}-heading`}
                                        className="text-[#172033] lg:text-[#0F172A] font-display font-medium sm:font-normal text-[26px] sm:text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight mb-3 group-hover:text-[#4F46E5] transition-colors"
                                    >
                                        {service.title}
                                    </h2>
                                    <p className="font-body text-[#4F46E5] text-xs sm:text-sm tracking-wide italic mb-4 font-semibold">
                                        {service.tagline}
                                    </p>
                                    <p className="font-body text-[#64708A] lg:text-[#334155] text-[15px] sm:text-base leading-relaxed font-normal">
                                        {service.description}
                                    </p>
                                </div>
                                <div className="p-6 sm:p-8 rounded-3xl bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-white/95 backdrop-blur-xl shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_12px_40px_rgba(49,46,129,0.08)] hover:shadow-[0_16px_50px_rgba(79,70,229,0.15)] transition-all duration-300">
                                    <p className="mb-5 text-[#4F46E5] tracking-[0.25em] text-xs font-semibold uppercase font-body">
                                        Key Deliverables
                                    </p>
                                    <ul className="space-y-3">
                                        {service.deliverables.map((d) => (
                                            <li key={d} className="flex items-start gap-3 font-body text-[#172033] lg:text-[#0F172A] text-[15px] sm:text-base font-medium leading-[1.6]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] mt-2 flex-shrink-0" />
                                                <span className="leading-snug break-words">{d}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-12 md:py-20 border-t border-[#DCE5FF] lg:border-indigo-100/60 relative z-10">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
                    <p className="font-body mb-3 text-[#4F46E5] tracking-[0.28em] text-xs font-semibold uppercase">
                        Work With TalentHaus
                    </p>
                    <h2 className="text-[#172033] lg:text-[#0F172A] font-display font-medium sm:font-normal text-[28px] sm:text-4xl md:text-5xl leading-tight tracking-tight mb-8 max-w-2xl mx-auto">
                        Ready to elevate your <em className="italic bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent font-normal">brand & creators?</em>
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4F46E5] text-white font-body text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-[#4338CA] shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all group min-h-[44px]"
                        >
                            Get in Touch
                            <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                        <Link
                            href="/roster"
                            className="inline-flex items-center gap-2 px-8 py-4 border border-[#DCE5FF] lg:border-indigo-200 text-[#172033] lg:text-[#0F172A] bg-[#EEF2FF] lg:bg-white/90 backdrop-blur-md font-body text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-full hover:border-[#4F46E5] hover:bg-white transition-all shadow-sm min-h-[44px]"
                        >
                            Explore Creators
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
