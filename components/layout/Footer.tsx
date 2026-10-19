"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { footerNav, social, siteMeta } from "@/content/site";
import { cn } from "@/lib/utils";

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[#090514] border-t border-white/10 pt-20 pb-10 relative overflow-hidden">
            {/* Architectural Blueprint Grid Lines (User Reference) */}
            <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)`,
                    backgroundSize: "64px 64px",
                }}
                aria-hidden="true"
            />

            {/* Giant gradient wordmark */}
            <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none select-none overflow-hidden"
                aria-hidden="true"
            >
                <span className="block font-display text-white opacity-[0.03] text-center leading-none"
                    style={{ fontSize: "clamp(4rem, 20vw, 18rem)", letterSpacing: "-0.04em" }}>
                    TalentHaus
                </span>
            </div>

            <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
                {/* Top row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Logo variant="light" className="mb-6" />
                        <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                            {siteMeta.description}
                        </p>
                        {/* Social links */}
                        <div className="flex items-center gap-2 mt-6">
                            {social.instagram && (
                                <a
                                    href={social.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="TalentHaus on Instagram"
                                    className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white rounded-full hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-200"
                                >
                                    <Instagram size={17} />
                                </a>
                            )}
                            {social.twitter && (
                                <a
                                    href={social.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="TalentHaus on X (Twitter)"
                                    className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white rounded-full hover:bg-white/10 border border-transparent hover:border-white/30 transition-all duration-200"
                                >
                                    <Twitter size={17} />
                                </a>
                            )}
                            {social.linkedin && (
                                <a
                                    href={social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="TalentHaus on LinkedIn"
                                    className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white rounded-full hover:bg-white/10 border border-transparent hover:border-white/30 transition-all duration-200"
                                >
                                    <Linkedin size={17} />
                                </a>
                            )}
                            {social.youtube && (
                                <a
                                    href={social.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="TalentHaus on YouTube"
                                    className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white rounded-full hover:bg-white/10 border border-transparent hover:border-white/30 transition-all duration-200"
                                >
                                    <Youtube size={17} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Nav columns */}
                    {Object.entries(footerNav).map(([group, links]) => (
                        <div key={group}>
                            <h3 className="eyebrow mb-6 text-[#38BDF8] tracking-[0.25em] text-xs font-bold uppercase">{group}</h3>
                            <ul className="flex flex-col gap-3">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-white/75 text-sm hover:text-white transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="py-8 border-b border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div>
                            <p className="eyebrow mb-1 text-[#38BDF8] tracking-[0.25em] text-xs font-bold uppercase">Newsletter</p>
                            <p className="text-white text-base">
                                Industry intelligence, straight to your inbox.
                            </p>
                        </div>
                        <form
                            className="flex items-stretch gap-0 max-w-sm w-full"
                            onSubmit={(e) => e.preventDefault()}
                            aria-label="Newsletter signup"
                        >
                            <input
                                type="email"
                                required
                                placeholder="your@email.com"
                                autoComplete="email"
                                className={cn(
                                    "flex-1 min-w-0 min-h-[44px] px-4 py-3 bg-white/[0.05] border border-white/20 border-r-0",
                                    "text-white text-base sm:text-sm placeholder:text-white/40",
                                    "rounded-l-full rounded-r-none focus:outline-none focus:border-[#38BDF8]",
                                    "transition-colors duration-200"
                                )}
                            />
                            <button
                                type="submit"
                                className={cn(
                                    "px-6 py-3 min-h-[44px] bg-white text-[#0A0718] text-xs font-bold uppercase tracking-wider",
                                    "rounded-r-full rounded-l-none",
                                    "hover:bg-[#E0F2FE] shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-200",
                                    "whitespace-nowrap flex items-center gap-1.5"
                                )}
                            >
                                Subscribe
                                <ArrowUpRight size={14} className="text-[#2563EB]" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-white/60 text-xs">
                        © {year} TalentHaus. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-white/60 text-xs hover:text-white transition-colors duration-200 min-h-[44px] inline-flex items-center">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-white/60 text-xs hover:text-white transition-colors duration-200 min-h-[44px] inline-flex items-center">
                            Terms of Service
                        </Link>
                        <Link href="/login?redirectTo=/admin" className="text-white/40 hover:text-white/80 text-xs transition-colors duration-200 min-h-[44px] inline-flex items-center">
                            Admin Access
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
