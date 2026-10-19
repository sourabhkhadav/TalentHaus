import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy | TalentHaus",
    description: "TalentHaus Privacy Policy and data handling practices.",
    alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
    return (
        <div className="relative overflow-hidden min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-20">
            {/* Background Canvas */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(115deg, #FFFFFF 0%, #F8FAFC 30%, #EEF2FF 52%, #C7D2FE 72%, #818CF8 88%, #4F46E5 100%)",
                    }}
                />
                <div
                    className="absolute -top-32 -left-20 w-[900px] h-[900px] rounded-full blur-[120px] opacity-95"
                    style={{
                        background: "radial-gradient(circle, #FFFFFF 0%, #FAF8F5 45%, #EEF2FF 70%, transparent 90%)",
                    }}
                />
                <div
                    className="absolute inset-0 bg-[#FFFFFF] lg:hidden pointer-events-none"
                    style={{
                        background: "linear-gradient(180deg, #FFFFFF 0%, #F6F8FF 40%, #FFFFFF 100%)",
                    }}
                />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 font-body text-xs sm:text-sm text-[#4F46E5] hover:text-[#312E81] transition-colors uppercase tracking-wider font-semibold min-h-[44px]"
                    >
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                </div>

                <div className="bg-[#EEF2FF] lg:bg-white/90 border border-[#DCE5FF] lg:border-white/95 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_4px_20px_rgba(79,70,229,0.06)] lg:shadow-[0_16px_50px_rgba(30,27,75,0.08)] backdrop-blur-xl">
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0E7FF] lg:bg-indigo-50 border border-[#C7D2FE] lg:border-indigo-100 text-xs uppercase tracking-[0.25em] font-semibold text-[#4338CA]">
                            LEGAL & PRIVACY
                        </span>
                    </div>

                    <h1 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl text-[#0F172A] tracking-tight mb-4">
                        Privacy Policy
                    </h1>
                    <p className="font-body text-xs sm:text-sm text-[#475569] mb-8 font-medium">
                        Last updated: October 2026 · TalentHaus (Indore, Madhya Pradesh, India)
                    </p>

                    <div className="space-y-6 font-body text-sm sm:text-base text-[#334155] leading-relaxed">
                        <section>
                            <h2 className="font-display font-bold text-lg sm:text-xl text-[#0F172A] mb-2">1. Overview</h2>
                            <p>
                                TalentHaus (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is committed to protecting the personal data of our talent, clients, and website visitors. This notice describes how we collect, use, and protect information submitted through our website and agency communications.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display font-bold text-lg sm:text-xl text-[#0F172A] mb-2">2. Information We Collect</h2>
                            <p>
                                We collect information provided directly by you, including contact details and campaign requirements submitted via our Brand Brief form, as well as representation applications submitted by creators. We do not sell or monetize personal information.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display font-bold text-lg sm:text-xl text-[#0F172A] mb-2">3. Use of Information</h2>
                            <p>
                                Information is used solely to respond to business inquiries, evaluate creator representation applications, manage talent engagements, and fulfill commercial contracts.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display font-bold text-lg sm:text-xl text-[#0F172A] mb-2">4. Contact & Inquiries</h2>
                            <p>
                                For any questions regarding this Privacy Policy or your data, please contact our team directly at{" "}
                                <a href="mailto:info@talenthaus.in" className="text-[#4F46E5] font-semibold underline underline-offset-2">
                                    info@talenthaus.in
                                </a>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
