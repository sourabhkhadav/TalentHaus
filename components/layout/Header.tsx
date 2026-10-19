"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { nav } from "@/content/site";
import { cn } from "@/lib/utils";

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    // Detect scroll to transition header from transparent to solid
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    scrolled
                        ? "bg-[#0B0616]/88 backdrop-blur-2xl border-b border-[#C084FC]/25 shadow-[0_8px_32px_rgba(0,0,0,0.35)] py-1.5"
                        : "bg-[#0B0616]/75 backdrop-blur-2xl border-b border-[#C084FC]/15 shadow-[0_4px_24px_rgba(0,0,0,0.25)] py-2 sm:py-2.5"
                )}
            >
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="flex items-center justify-between h-11 sm:h-12">
                        {/* Logo */}
                        <Logo variant="light" />

                        {/* Desktop Pill Nav (inspired by reference capsule navigation) */}
                        <nav
                            className="hidden lg:flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.08] border border-white/20 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
                            aria-label="Primary"
                        >
                            {nav.map((item) => {
                                const isActive =
                                    item.href === "/"
                                        ? pathname === "/"
                                        : pathname === item.href || pathname.startsWith(item.href + "/");

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "font-body text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full transition-all duration-200",
                                            isActive
                                                ? "bg-gradient-to-r from-[#C084FC]/35 to-[#A855F7]/45 text-white border border-[#C084FC]/60 shadow-[0_0_14px_rgba(192,132,252,0.4)]"
                                                : "text-white/85 hover:text-white hover:bg-white/10"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Desktop CTA Buttons (Pill styled like reference) */}
                        <div className="hidden lg:flex items-center gap-2.5">
                            <Link
                                href="/join"
                                className="font-body text-xs uppercase tracking-wider text-white/85 hover:text-[#C084FC] transition-colors duration-200 font-semibold px-2"
                            >
                                Join as Creator
                            </Link>
                            <Link
                                href="/contact"
                                className={cn(
                                    "inline-flex items-center gap-1.5 px-5 py-2 rounded-full min-h-[36px]",
                                    "bg-white text-[#0D0614] hover:bg-[#F3E8FF] font-body text-xs font-semibold uppercase tracking-wider",
                                    "shadow-[0_2px_12px_rgba(255,255,255,0.3)] hover:shadow-[0_4px_18px_rgba(255,255,255,0.45)] transition-all",
                                    "group"
                                )}
                            >
                                Book a Call
                                <ArrowUpRight
                                    size={13}
                                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </Link>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-[#C084FC]/30 text-white hover:bg-[#C084FC]/20 transition-colors"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-menu"
                        >
                            {menuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile menu overlay */}
            <MobileMenu
                id="mobile-menu"
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
            />
        </>
    );
}
