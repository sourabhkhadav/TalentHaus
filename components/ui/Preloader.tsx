"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Preloader({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
    const timersRef = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
        // Respect reduced motion preference
        if (typeof window !== "undefined") {
            const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const hasShown =
                sessionStorage.getItem("th-intro-shown") ||
                sessionStorage.getItem("th-preloader-shown");

            if (prefersReduced || hasShown) {
                onComplete();
                return;
            }
        }

        // Sequence timing (~1.3s - 1.4s total for brisk, elegant intro)
        // 1. Initial glow & backdrop fade in
        const t1 = setTimeout(() => setStep(1), 50);
        // 2. TalentHaus wordmark reveal (slight upward motion + opacity)
        const t2 = setTimeout(() => setStep(2), 180);
        // 3. Tagline reveal with short delay
        const t3 = setTimeout(() => setStep(3), 550);
        // 4. Smooth exit transition into homepage
        const t4 = setTimeout(() => setStep(4), 1050);
        // 5. Complete and unmount
        const t5 = setTimeout(() => {
            try {
                sessionStorage.setItem("th-intro-shown", "1");
                sessionStorage.setItem("th-preloader-shown", "1");
            } catch {
                // Ignore storage errors in private browsing modes
            }
            onComplete();
        }, 1400);

        timersRef.current = [t1, t2, t3, t4, t5];

        return () => {
            timersRef.current.forEach((t) => clearTimeout(t));
        };
    }, [onComplete]);

    return (
        <aside
            aria-label="Website loading animation"
            aria-live="polite"
            className={cn(
                "fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#0B0A0A] overflow-hidden select-none",
                "transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                step === 4 ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
        >
            {/* Cinematic subtle burgundy radial glow */}
            <div
                className={cn(
                    "absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out",
                    step >= 1 ? "opacity-100" : "opacity-0"
                )}
                style={{
                    background:
                        "radial-gradient(circle 480px at 50% 50%, rgba(91, 18, 38, 0.45) 0%, rgba(45, 9, 19, 0.22) 45%, rgba(11, 10, 10, 0) 75%)",
                }}
            />

            {/* Subtle luxury film grain */}
            <div
                className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Central Brand Composition */}
            <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-lg">
                {/* Monogram Emblem Reveal */}
                <div
                    className={cn(
                        "relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden mb-4 border border-[#C7A46A]/50 shadow-[0_0_30px_rgba(199,164,106,0.3)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        step >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    )}
                >
                    <Image
                        src="/brand/logo-icon.png"
                        alt="TalentHaus Emblem"
                        fill
                        className="object-cover scale-105"
                        priority
                    />
                </div>

                {/* Wordmark */}
                <div className="overflow-hidden pb-1">
                    <h1
                        className={cn(
                            "font-display text-[#F4F0E8] text-4xl sm:text-5xl md:text-6xl tracking-[-0.02em] font-normal leading-none",
                            "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            step >= 2
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-6"
                        )}
                    >
                        TalentHaus
                    </h1>
                </div>

                {/* Burgundy hairline divider */}
                <div
                    className={cn(
                        "h-px bg-gradient-to-r from-transparent via-[#C7A46A]/40 to-transparent my-4 sm:my-5 transition-all duration-700 ease-out",
                        step >= 3 ? "w-36 opacity-100" : "w-0 opacity-0"
                    )}
                />

                {/* Uppercase Tagline */}
                <div className="overflow-hidden">
                    <p
                        className={cn(
                            "font-body text-[11px] sm:text-xs font-medium uppercase tracking-[0.28em] sm:tracking-[0.32em] text-[#C7A46A]",
                            "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            step >= 3
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-3"
                        )}
                    >
                        WHERE TALENT MEETS OPPORTUNITY
                    </p>
                </div>
            </div>
        </aside>
    );
}

