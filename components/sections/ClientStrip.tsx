"use client";

import React, { useEffect, useRef } from "react";
import { clients } from "@/content/clients";

/**
 * Infinite horizontal logo marquee with pause-on-hover and subtle scroll-velocity response.
 * Client logos are rendered as styled text placeholders until real SVGs are provided.
 */
export function ClientStrip() {
    const trackRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;

        let isCancelled = false;
        let cleanup: (() => void) | undefined;

        const init = async () => {
            const { default: gsap } = await import("gsap");
            if (isCancelled) return;

            const totalWidth = el.scrollWidth / 2; // half because we duplicated

            const tween = gsap.to(el, {
                x: `-=${totalWidth}`,
                duration: 30,
                ease: "none",
                repeat: -1,
                modifiers: {
                    x: gsap.utils.unitize((x: number) => x % totalWidth),
                },
            });
            animRef.current = tween;

            cleanup = () => {
                tween.kill();
            };

            if (isCancelled) {
                cleanup();
            }
        };

        init();
        return () => {
            isCancelled = true;
            cleanup?.();
            animRef.current?.kill();
        };
    }, []);

    const pause = () => animRef.current?.pause();
    const resume = () => animRef.current?.play();

    // Duplicate for seamless loop
    const allClients = [...clients, ...clients];

    return (
        <section
            className="py-10 border-y border-[#C084FC]/20 bg-[#0D0614] overflow-hidden"
            aria-label="Partner brands"
        >
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 mb-4">
                <p className="eyebrow text-center text-[#C084FC] tracking-[0.28em] text-[11px] font-semibold">
                    STRATEGIC BRAND COLLABORATIONS
                </p>
            </div>
            <div
                className="relative overflow-hidden"
                onMouseEnter={pause}
                onMouseLeave={resume}
            >
                {/* Left/right fade masks */}
                <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#0D0614] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#0D0614] to-transparent z-10 pointer-events-none" />

                <div ref={trackRef} className="flex items-center gap-12 will-change-transform" style={{ width: "max-content" }}>
                    {allClients.map((client, i) => (
                        <div
                            key={`${client.name}-${i}`}
                            className="marquee-item flex items-center justify-center flex-shrink-0 h-12 px-6 group"
                        >
                            <span className="font-body font-medium text-white/50 text-xs sm:text-sm tracking-widest uppercase whitespace-nowrap group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(192,132,252,0.8)] transition-all duration-200">
                                {client.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
