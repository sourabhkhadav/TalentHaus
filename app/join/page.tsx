import type { Metadata } from "next";
import { CreatorApplicationForm } from "@/components/forms/CreatorApplicationForm";
import { Sparkles, Award, Globe, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
    title: "Join the Roster | TalentHaus Representation",
    description: "Apply for exclusive talent representation across luxury fashion, culture, and high-impact brand campaigns.",
};

export default function JoinPage() {
    return (
        <div className="relative overflow-hidden min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-20 safe-bottom">
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

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] lg:bg-white/80 border border-[#DCE5FF] lg:border-indigo-200/80 shadow-sm text-[#4F46E5] lg:text-[#312E81] text-xs uppercase tracking-[0.25em] mb-4 font-semibold backdrop-blur-md">
                        <Sparkles size={12} className="text-[#4F46E5]" />
                        Talent Representation Application
                    </div>
                    <h1 className="font-display font-medium sm:font-normal text-[36px] sm:text-5xl md:text-6xl text-[#172033] lg:text-[#0F172A] tracking-tight leading-[1.14] sm:leading-tight">
                        Shape the future of <em className="italic bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent font-normal">culture.</em>
                    </h1>
                    <p className="font-body text-[#64708A] lg:text-[#334155] text-[15px] sm:text-base mt-4 leading-relaxed font-normal">
                        TalentHaus manages exceptional creators, cultural taste-makers, and visionaries.
                        We build enduring commercial partnerships and brand ambassadorships.
                    </p>
                </div>

                {/* Benefits Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 sm:mb-12">
                    <div className="bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-white/95 rounded-2xl p-5 backdrop-blur-xl shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_10px_30px_rgba(30,27,75,0.08)]">
                        <Award size={20} className="text-[#4F46E5] mb-2" />
                        <h2 className="font-display text-lg text-[#172033] lg:text-[#0F172A] font-bold">Strategic Deal Flow</h2>
                        <p className="font-body text-xs text-[#64708A] lg:text-[#475569] mt-1 leading-relaxed">
                            Dedicated representation for brand partnerships, campaign negotiations, and commercial sponsorships.
                        </p>
                    </div>
                    <div className="bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-white/95 rounded-2xl p-5 backdrop-blur-xl shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_10px_30px_rgba(30,27,75,0.08)]">
                        <Globe size={20} className="text-[#4F46E5] mb-2" />
                        <h2 className="font-display text-lg text-[#172033] lg:text-[#0F172A] font-bold">Full-Spectrum Support</h2>
                        <p className="font-body text-xs text-[#64708A] lg:text-[#475569] mt-1 leading-relaxed">
                            Legal, contract negotiation, and talent ops managed directly by our leadership team.
                        </p>
                    </div>
                    <div className="bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-white/95 rounded-2xl p-5 backdrop-blur-xl shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_10px_30px_rgba(30,27,75,0.08)]">
                        <TrendingUp size={20} className="text-[#4F46E5] mb-2" />
                        <h2 className="font-display text-lg text-[#172033] lg:text-[#0F172A] font-bold">Career Longevity</h2>
                        <p className="font-body text-xs text-[#64708A] lg:text-[#475569] mt-1 leading-relaxed">
                            Strategic guidance to expand your personal brand into sustainable ventures, ambassadorships, and long-term equity.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-[#EEF2FF] lg:bg-white/95 border border-[#DCE5FF] lg:border-white/95 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_4px_20px_rgba(79,70,229,0.06)] lg:shadow-[0_16px_50px_rgba(30,27,75,0.12)]">
                    <CreatorApplicationForm />
                </div>
            </div>
        </div>
    );
}
