"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function CtaBand() {
    return (
        <section
            className="relative py-28 md:py-36 overflow-hidden"
            style={{
                background:
                    "radial-gradient(ellipse at 50% 30%, rgba(168, 85, 247, 0.35) 0%, rgba(18, 9, 32, 0.98) 60%, #0D0614 100%)",
            }}
            aria-labelledby="cta-band-heading"
        >
            {/* Top Hairline accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C084FC]/30 to-transparent pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
                <p className="eyebrow mb-6 text-[#C084FC] tracking-[0.28em] text-xs font-semibold uppercase">Ready to start?</p>
                <h2
                    id="cta-band-heading"
                    className={cn(
                        "font-display text-white",
                        "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
                        "leading-[1.08] tracking-tight mb-6 max-w-3xl mx-auto"
                    )}
                >
                    Your brand deserves{" "}
                    <em className="italic bg-gradient-to-r from-white via-[#E9D5FF] to-[#C084FC] bg-clip-text text-transparent font-normal">better stories.</em>
                </h2>
                <p className="font-body text-[#DDD6FE]/80 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                    Whether you're a brand looking to connect with the right creators, or a creator ready to build something bigger — let's talk.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 max-w-sm sm:max-w-none mx-auto">
                    <Button
                        as="link"
                        href="/contact"
                        variant="solid"
                        size="lg"
                        icon
                        className="w-full sm:w-auto justify-center rounded-full bg-white text-[#0D0614] hover:bg-[#F3E8FF] shadow-[0_0_30px_rgba(255,255,255,0.35)] font-semibold"
                    >
                        Book a Call
                    </Button>
                    <Button
                        as="link"
                        href="/join"
                        variant="outlined"
                        size="lg"
                        className="w-full sm:w-auto justify-center rounded-full border border-white/20 text-white bg-white/[0.04] hover:bg-white/10 hover:border-[#C084FC]/50 backdrop-blur-md"
                    >
                        Join as Creator
                    </Button>
                </div>
            </div>

            {/* Bottom hairline */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C084FC]/25 to-transparent pointer-events-none" aria-hidden="true" />
        </section>
    );
}
