"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/data/store";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    CheckCircle2,
    Building2,
    AlertCircle,
} from "lucide-react";

export function ContactClient() {
    const { addInquiry } = useStore();
    const [brandName, setBrandName] = useState("");
    const [contactName, setContactName] = useState("");
    const [email, setEmail] = useState("");
    const [budget, setBudget] = useState("");
    const [timeline, setTimeline] = useState("");
    const [message, setMessage] = useState("");
    const [honeypot, setHoneypot] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Anti-bot trap
        if (honeypot) {
            setSubmitted(true);
            return;
        }

        if (!brandName.trim() || !contactName.trim() || !email.trim()) {
            setError("Please fill in the required brand, contact and email fields.");
            return;
        }

        if (!budget.trim()) {
            setError("Please specify your estimated campaign budget or scope.");
            return;
        }

        if (!message.trim() || message.trim().length < 10) {
            setError("Please provide at least 10 characters describing your campaign scope.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    brandName: brandName.trim(),
                    contactName: contactName.trim(),
                    email: email.trim(),
                    budget: budget.trim(),
                    timeline: timeline.trim() || "Immediate / Flexible",
                    message: message.trim(),
                    honeypot,
                }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                addInquiry({
                    brandName: brandName.trim(),
                    contactName: contactName.trim(),
                    email: email.trim(),
                    budget: budget.trim(),
                    timeline: timeline.trim() || "Immediate / Flexible",
                    message: message.trim(),
                });
                setSubmitted(true);
            } else {
                setError(data.error || "Failed to transmit brief. Please try again.");
            }
        } catch {
            setError("Network connection issue. Please check your internet and retry.");
        } finally {
            setSubmitting(false);
        }
    };

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
                {/* Hero Header */}
                <div className="max-w-3xl mb-10 sm:mb-14">
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] lg:bg-white/80 border border-[#DCE5FF] lg:border-indigo-200/80 shadow-sm text-xs uppercase tracking-[0.25em] font-semibold text-[#4F46E5] lg:text-[#312E81]">
                            01 / DIRECT PARTNERSHIPS & BOOKINGS
                        </span>
                    </div>
                    <h1 className="font-display font-medium sm:font-normal text-[36px] sm:text-5xl md:text-6xl text-[#172033] lg:text-[#0F172A] tracking-tight leading-[1.14] sm:leading-tight">
                        Initiate a{" "}
                        <em className="italic bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent font-normal">
                            partnership.
                        </em>
                    </h1>
                    <p className="font-body text-[#64708A] lg:text-[#334155] text-[15px] sm:text-base md:text-lg mt-4 leading-relaxed max-w-xl font-normal">
                        Connecting forward-thinking brands with our selective creator roster. Connect directly with our team in Indore, India.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Contact Info & Indore Headquarters */}
                    <div className="lg:col-span-5 space-y-5 sm:space-y-6">
                        {/* Indore HQ - High contrast frosted white/light-blue luxury glass card */}
                        <div className="bg-[#EEF2FF] lg:bg-white/85 backdrop-blur-xl border border-[#DCE5FF] lg:border-white/90 rounded-2xl p-6 sm:p-7 shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_12px_40px_rgba(30,27,75,0.08)] hover:shadow-[0_16px_50px_rgba(30,27,75,0.12)] transition-all duration-300">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0E7FF] lg:bg-indigo-50/90 border border-[#C7D2FE] lg:border-indigo-100 text-[#4338CA] text-[11px] uppercase tracking-[0.22em] mb-3.5 font-bold font-body">
                                <Building2 size={13} className="text-[#4F46E5]" />
                                <span>Indore Central HQ</span>
                            </div>
                            <h2 className="font-body font-extrabold text-2xl sm:text-[28px] text-[#0F172A] tracking-tight leading-snug">
                                TalentHaus Central
                            </h2>
                            <p className="font-body text-xs sm:text-sm text-[#475569] mt-2.5 leading-relaxed font-medium">
                                Indore, Madhya Pradesh, India
                            </p>
                            <div className="mt-5 pt-5 border-t border-[#DCE5FF] lg:border-slate-200/80 space-y-3 text-xs sm:text-[13px] font-body">
                                <a
                                    href="mailto:info@talenthaus.in"
                                    className="text-[#4F46E5] lg:text-[#312E81] hover:text-[#312E81] lg:hover:text-[#4F46E5] flex items-center gap-2.5 transition-colors font-semibold"
                                >
                                    <Mail size={15} className="text-[#4F46E5] shrink-0" />
                                    info@talenthaus.in
                                </a>
                                <div className="space-y-1.5 pt-1">
                                    <a
                                        href="tel:+916262786992"
                                        className="text-[#475569] hover:text-[#0F172A] flex items-center gap-2.5 transition-colors font-medium"
                                    >
                                        <Phone size={15} className="text-[#4F46E5] shrink-0" />
                                        +91 62627 86992
                                    </a>
                                    <a
                                        href="tel:+919713810302"
                                        className="text-[#475569] hover:text-[#0F172A] flex items-center gap-2.5 transition-colors font-medium"
                                    >
                                        <Phone size={15} className="text-[#4F46E5] shrink-0" />
                                        +91 97138 10302
                                    </a>
                                    <a
                                        href="tel:+917879591250"
                                        className="text-[#475569] hover:text-[#0F172A] flex items-center gap-2.5 transition-colors font-medium"
                                    >
                                        <Phone size={15} className="text-[#4F46E5] shrink-0" />
                                        +91 78795 91250
                                    </a>
                                </div>
                                <div className="text-[#475569] flex items-center gap-2.5 font-medium pt-1">
                                    <MapPin size={15} className="text-[#4F46E5] shrink-0" />
                                    <span>Indore, Madhya Pradesh, India</span>
                                </div>
                            </div>
                        </div>

                        {/* Founder Direct Line - High contrast frosted white glass card */}
                        <div className="bg-[#EEF2FF] lg:bg-white/85 backdrop-blur-xl border border-[#DCE5FF] lg:border-white/90 rounded-2xl p-6 sm:p-7 shadow-[0_4px_16px_rgba(79,70,229,0.04)] lg:shadow-[0_12px_40px_rgba(30,27,75,0.08)]">
                            <h3 className="font-body font-bold text-lg sm:text-xl text-[#172033] lg:text-[#0F172A] mb-2 tracking-tight">
                                Direct Leadership Desk
                            </h3>
                            <p className="font-body text-xs text-[#64708A] lg:text-[#475569] mb-4 leading-relaxed font-normal">
                                For brand partnerships, talent representation, or commercial campaigns:
                            </p>
                            <div className="space-y-2.5 text-xs font-body">
                                <div className="flex items-center justify-between py-1.5 border-b border-[#DCE5FF] lg:border-slate-200/80">
                                    <div>
                                        <p className="text-[#172033] lg:text-[#0F172A] font-semibold">Sourabh Khadav</p>
                                        <p className="text-[#64708A] text-[11px]">Co-Founder & Managing Director</p>
                                    </div>
                                    <span className="text-[#4F46E5] font-mono text-[11px] font-medium">info@talenthaus.in</span>
                                </div>
                                <div className="flex items-center justify-between py-1.5 border-b border-[#DCE5FF] lg:border-slate-200/80">
                                    <div>
                                        <p className="text-[#172033] lg:text-[#0F172A] font-semibold">Navneet Jat</p>
                                        <p className="text-[#64708A] text-[11px]">Founder & Head of Brand Partnerships</p>
                                    </div>
                                    <span className="text-[#4F46E5] font-mono text-[11px] font-medium">info@talenthaus.in</span>
                                </div>
                                <div className="flex items-center justify-between py-1.5">
                                    <div>
                                        <p className="text-[#172033] lg:text-[#0F172A] font-semibold">Atharv Sharma</p>
                                        <p className="text-[#64708A] text-[11px]">Co-Founder & Managing Director</p>
                                    </div>
                                    <span className="text-[#4F46E5] font-mono text-[11px] font-medium">info@talenthaus.in</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inbound Brand Brief Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-[#EEF2FF] lg:bg-[#0B061E]/80 border border-[#DCE5FF] lg:border-white/25 rounded-2xl sm:rounded-3xl p-6 sm:p-9 shadow-[0_4px_20px_rgba(79,70,229,0.06)] lg:shadow-2xl backdrop-blur-2xl">
                            {submitted ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h2 className="font-display text-2xl sm:text-3xl text-[#172033] lg:text-white mb-2">
                                        Inquiry Received
                                    </h2>
                                    <p className="font-body text-[#64708A] lg:text-white/85 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-6">
                                        Thank you, <strong className="text-[#172033] lg:text-white">{contactName}</strong>. Your campaign brief for <strong className="text-[#172033] lg:text-white">{brandName}</strong> has been logged to our executive desk. Our leadership team will review and respond promptly.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSubmitted(false);
                                            setBrandName("");
                                            setContactName("");
                                            setEmail("");
                                            setBudget("");
                                            setTimeline("");
                                            setMessage("");
                                        }}
                                        className="min-h-[44px] px-6 py-2.5 rounded-full border border-[#DCE5FF] lg:border-white/20 text-[#172033] lg:text-white hover:border-[#4F46E5] lg:hover:border-white hover:bg-white lg:hover:bg-white/10 text-xs font-semibold uppercase tracking-wider transition-all"
                                    >
                                        Submit Another Brief
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="font-display text-2xl sm:text-3xl text-[#172033] lg:text-white mb-2">
                                        Brand Campaign Brief
                                    </h2>
                                    <p className="font-body text-xs sm:text-sm text-[#64708A] lg:text-white/80 mb-6">
                                        Share your brief. We respond with custom proposals based on your campaign scope and objectives.
                                    </p>

                                    {error && (
                                        <div
                                            role="alert"
                                            className="mb-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2"
                                        >
                                            <AlertCircle size={15} className="shrink-0 text-red-400" />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Honeypot */}
                                        <div className="hidden" aria-hidden="true">
                                            <label htmlFor="company_website">Website</label>
                                            <input
                                                id="company_website"
                                                type="text"
                                                tabIndex={-1}
                                                autoComplete="off"
                                                value={honeypot}
                                                onChange={(e) => setHoneypot(e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="brandName"
                                                    className="block font-body text-xs font-semibold text-[#172033] lg:text-white uppercase tracking-wider mb-2"
                                                >
                                                    Brand / Agency Name *
                                                </label>
                                                <input
                                                    id="brandName"
                                                    type="text"
                                                    required
                                                    value={brandName}
                                                    onChange={(e) => setBrandName(e.target.value)}
                                                    placeholder="e.g. Your Brand or Agency Name"
                                                    className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-white lg:bg-white/[0.08] border border-[#DCE5FF] lg:border-white/20 text-[#172033] lg:text-white font-body text-base sm:text-sm placeholder:text-[#64708A]/70 lg:placeholder:text-white/45 focus:border-[#4F46E5] lg:focus:border-white focus:bg-white lg:focus:bg-white/[0.14] focus:ring-1 focus:ring-[#4F46E5]/30 lg:focus:ring-white/40 outline-none transition-all shadow-sm"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="contactName"
                                                    className="block font-body text-xs font-semibold text-[#172033] lg:text-white uppercase tracking-wider mb-2"
                                                >
                                                    Your Name & Title *
                                                </label>
                                                <input
                                                    id="contactName"
                                                    type="text"
                                                    required
                                                    value={contactName}
                                                    onChange={(e) => setContactName(e.target.value)}
                                                    placeholder="e.g. Marketing Director"
                                                    className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-white lg:bg-white/[0.08] border border-[#DCE5FF] lg:border-white/20 text-[#172033] lg:text-white font-body text-base sm:text-sm placeholder:text-[#64708A]/70 lg:placeholder:text-white/45 focus:border-[#4F46E5] lg:focus:border-white focus:bg-white lg:focus:bg-white/[0.14] focus:ring-1 focus:ring-[#4F46E5]/30 lg:focus:ring-white/40 outline-none transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="block font-body text-xs font-semibold text-[#172033] lg:text-white uppercase tracking-wider mb-2"
                                                >
                                                    Corporate Email *
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="contact@company.com"
                                                    className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-white lg:bg-white/[0.08] border border-[#DCE5FF] lg:border-white/20 text-[#172033] lg:text-white font-body text-base sm:text-sm placeholder:text-[#64708A]/70 lg:placeholder:text-white/45 focus:border-[#4F46E5] lg:focus:border-white focus:bg-white lg:focus:bg-white/[0.14] focus:ring-1 focus:ring-[#4F46E5]/30 lg:focus:ring-white/40 outline-none transition-all shadow-sm"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="budget"
                                                    className="block font-body text-xs font-semibold text-[#172033] lg:text-white uppercase tracking-wider mb-2"
                                                >
                                                    Estimated Campaign Budget *
                                                </label>
                                                <input
                                                    id="budget"
                                                    type="text"
                                                    required
                                                    value={budget}
                                                    onChange={(e) => setBudget(e.target.value)}
                                                    placeholder="e.g. ₹5,00,000 / Custom Scope"
                                                    className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-white lg:bg-white/[0.08] border border-[#DCE5FF] lg:border-white/20 text-[#172033] lg:text-white font-body text-base sm:text-sm placeholder:text-[#64708A]/70 lg:placeholder:text-white/45 focus:border-[#4F46E5] lg:focus:border-white focus:bg-white lg:focus:bg-white/[0.14] focus:ring-1 focus:ring-[#4F46E5]/30 lg:focus:ring-white/40 outline-none transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="timeline"
                                                className="block font-body text-xs font-semibold text-[#172033] lg:text-white uppercase tracking-wider mb-2"
                                            >
                                                Campaign Timeline / Target Launch
                                            </label>
                                            <input
                                                id="timeline"
                                                type="text"
                                                value={timeline}
                                                onChange={(e) => setTimeline(e.target.value)}
                                                placeholder="e.g. Q4 2026 / Next Month"
                                                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-white lg:bg-white/[0.08] border border-[#DCE5FF] lg:border-white/20 text-[#172033] lg:text-white font-body text-base sm:text-sm placeholder:text-[#64708A]/70 lg:placeholder:text-white/45 focus:border-[#4F46E5] lg:focus:border-white focus:bg-white lg:focus:bg-white/[0.14] focus:ring-1 focus:ring-[#4F46E5]/30 lg:focus:ring-white/40 outline-none transition-all shadow-sm"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="message"
                                                className="block font-body text-xs font-semibold text-[#172033] lg:text-white uppercase tracking-wider mb-2"
                                            >
                                                Campaign Scope & Deliverables
                                            </label>
                                            <textarea
                                                id="message"
                                                rows={4}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Describe campaign goals, targeted creators (or niche), deliverables (Reels, Long-form, Brand Ambassadorship)..."
                                                className="w-full p-4 rounded-xl bg-white lg:bg-white/[0.08] border border-[#DCE5FF] lg:border-white/20 text-[#172033] lg:text-white font-body text-base sm:text-sm placeholder:text-[#64708A]/70 lg:placeholder:text-white/45 focus:border-[#4F46E5] lg:focus:border-white focus:bg-white lg:focus:bg-white/[0.14] focus:ring-1 focus:ring-[#4F46E5]/30 lg:focus:ring-white/40 outline-none transition-all shadow-sm"
                                            />
                                        </div>

                                        <div className="pt-3">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full min-h-[48px] px-8 py-3.5 rounded-full bg-[#4F46E5] lg:bg-white text-white lg:text-[#0A0614] font-body text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#4338CA] lg:hover:bg-white/95 shadow-[0_10px_30px_rgba(79,70,229,0.3)] lg:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
                                            >
                                                {submitting ? "Transmitting Brief..." : "Submit Brand Brief"}
                                                <Send size={15} className="group-hover:translate-x-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
