"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, X, User, LogOut, Briefcase, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { nav } from "@/content/site";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
}

const navMeta: Record<string, { subtitle: string; number: string }> = {
    "/about": { subtitle: "Story, philosophy & leadership", number: "01" },
    "/services": { subtitle: "Talent & brand representation", number: "02" },
    "/roster": { subtitle: "Leading cultural creators", number: "03" },
    "/campaigns": { subtitle: "Campaign execution frameworks", number: "04" },
    "/insights": { subtitle: "Creator economics & analysis", number: "05" },
    "/contact": { subtitle: "Direct booking & brand briefs", number: "06" },
};

export function MobileMenu({ id, isOpen, onClose }: MobileMenuProps) {
    const pathname = usePathname();
    const firstLinkRef = useRef<HTMLAnchorElement>(null);
    const { user, logout } = useAuth();

    // Focus trap
    useEffect(() => {
        if (isOpen && firstLinkRef.current) {
            const timeout = setTimeout(() => firstLinkRef.current?.focus(), 100);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <div
            id={id}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
            className={cn(
                "fixed inset-0 z-50 flex flex-col bg-[#FFFFFF] text-[#172033] lg:hidden overflow-y-auto",
                "transition-all duration-300",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
        >
            {/* Ambient luxury light blooms */}
            <div
                className="fixed inset-0 pointer-events-none opacity-60"
                style={{
                    background:
                        "radial-gradient(circle at 80% 20%, rgba(165, 180, 252, 0.2) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(220, 229, 255, 0.6) 0%, transparent 50%)",
                }}
            />

            <div className="relative z-10 flex flex-col min-h-full px-5 sm:px-6 pt-5 pb-10 safe-bottom">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-4 border-b border-[#DCE5FF]">
                    <Logo variant="dark" />
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#EEF2FF] border border-[#DCE5FF] text-[#172033] hover:bg-[#DCE5FF] transition-colors"
                        aria-label="Close navigation menu"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Subtitle / Agency Location Pill */}
                <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#DCE5FF] text-[10px] uppercase tracking-widest font-semibold text-[#4F46E5]">
                        <Sparkles size={11} />
                        Indore Headquarters
                    </span>
                    <span className="font-body text-[11px] text-[#64708A] uppercase tracking-wider font-medium">
                        Navigation
                    </span>
                </div>

                {/* Main Nav Links */}
                <nav className="flex flex-col gap-2 mt-4" aria-label="Mobile primary">
                    {nav.map((item, i) => {
                        const meta = navMeta[item.href] || { subtitle: "Explore", number: `0${i + 1}` };
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                ref={i === 0 ? firstLinkRef : undefined}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center justify-between p-3.5 rounded-xl border min-h-[46px] transition-all duration-200 group",
                                    isActive
                                        ? "bg-[#EEF2FF] border-[#4F46E5] shadow-[0_4px_16px_rgba(79,70,229,0.08)]"
                                        : "bg-[#EEF2FF] border-[#DCE5FF] hover:bg-white hover:border-[#4F46E5]/40"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-xs text-[#4F46E5] tracking-wider font-semibold">
                                        {meta.number}
                                    </span>
                                    <div>
                                        <span className={cn(
                                            "font-display text-lg tracking-tight block leading-snug",
                                            isActive ? "text-[#172033] font-semibold" : "text-[#172033]"
                                        )}>
                                            {item.label}
                                        </span>
                                        <span className="font-body text-[11px] text-[#64708A] block leading-none">
                                            {meta.subtitle}
                                        </span>
                                    </div>
                                </div>
                                <ArrowUpRight
                                    size={16}
                                    className={cn(
                                        "transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                                        isActive ? "text-[#4F46E5]" : "text-[#64708A]"
                                    )}
                                />
                            </Link>
                        );
                    })}
                </nav>

                {/* Client Portal Card */}
                <div className="mt-6 pt-4 border-t border-[#DCE5FF]">
                    <div className="flex items-center justify-between mb-2.5">
                        <span className="font-body text-[10px] uppercase tracking-widest text-[#4F46E5] font-semibold">
                            Private Portal
                        </span>
                        <span className="font-body text-[10px] text-[#64708A]">
                            Client & Talent Access
                        </span>
                    </div>

                    <Link
                        href="/portal"
                        onClick={onClose}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-[#EEF2FF] border border-[#DCE5FF] text-[#172033] hover:border-[#4F46E5]/50 min-h-[44px] transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-white border border-[#DCE5FF] text-[#4F46E5] flex items-center justify-center shrink-0 shadow-sm">
                            <Briefcase size={14} />
                        </div>
                        <div className="truncate">
                            <span className="font-display text-sm font-semibold block leading-tight text-[#172033]">
                                Client Portal
                            </span>
                            <span className="text-[10px] text-[#64708A] block truncate">
                                Talent & Brand Collaborations
                            </span>
                        </div>
                    </Link>

                    {/* Active User Session Pill */}
                    {user ? (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-[#EEF2FF] border border-[#DCE5FF] flex items-center justify-between">
                            <div className="flex items-center gap-2 truncate">
                                <div className="w-7 h-7 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="truncate">
                                    <span className="text-xs font-semibold text-[#172033] block truncate">
                                        {user.name}
                                    </span>
                                    <span className="text-[9px] uppercase tracking-wider text-[#4F46E5] block font-medium">
                                        {user.role} demo account
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    logout();
                                    onClose();
                                }}
                                className="min-h-[44px] px-3 flex items-center gap-1 text-xs text-[#64708A] hover:text-[#172033] transition-colors"
                                aria-label="Sign out"
                            >
                                <LogOut size={13} />
                                <span className="font-medium text-[11px]">Exit</span>
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            onClick={onClose}
                            className="mt-2.5 min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-[#EEF2FF] border border-[#DCE5FF] text-[#172033] hover:border-[#4F46E5] text-xs font-medium transition-colors"
                        >
                            <User size={14} className="text-[#4F46E5]" />
                            Sign in to TalentHaus
                        </Link>
                    )}
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-6 flex flex-col gap-2.5">
                    <Link
                        href="/contact"
                        onClick={onClose}
                        className={cn(
                            "flex items-center justify-center gap-2 w-full py-3.5 rounded-full min-h-[46px]",
                            "bg-[#4F46E5] text-white font-body text-xs font-semibold tracking-wider uppercase",
                            "hover:bg-[#4338CA] transition-all shadow-[0_8px_25px_rgba(79,70,229,0.3)]"
                        )}
                    >
                        Book a Call
                        <ArrowUpRight size={15} />
                    </Link>
                    <Link
                        href="/join"
                        onClick={onClose}
                        className={cn(
                            "flex items-center justify-center gap-2 w-full py-3.5 rounded-full min-h-[46px]",
                            "border border-[#DCE5FF] text-[#172033] bg-[#EEF2FF] font-body text-xs font-medium tracking-wider uppercase",
                            "hover:border-[#4F46E5] hover:bg-white transition-colors"
                        )}
                    >
                        Join as Creator
                    </Link>
                </div>
            </div>
        </div>
    );
}
