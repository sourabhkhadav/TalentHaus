"use client";

import React, { useEffect, useRef } from "react";
import { processSteps, stats } from "@/content/site";
import { cn } from "@/lib/utils";

function AnimatedCounter({ target }: { target: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const hasRun = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let isCancelled = false;
        let cleanup: (() => void) | undefined;

        const init = async () => {
            const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all([
                import("gsap"),
                import("gsap/ScrollTrigger"),
            ]);

            if (isCancelled) return;
            gsap.registerPlugin(ScrollTrigger);

            // Extract numeric part
            const numericStr = target.replace(/[^0-9.]/g, "");
            const numericValue = parseFloat(numericStr);
            const prefix = target.match(/^[^0-9]*/)?.[0] ?? "";
            const postfix = target.match(/[^0-9.]+$/)?.[0] ?? "";

            if (!numericValue) {
                el.textContent = target;
                return;
            }

            const st = ScrollTrigger.create({
                trigger: el,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    if (hasRun.current || isCancelled) return;
                    hasRun.current = true;

                    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                    const dur = prefersReduced ? 0 : 1.5;

                    const counterObj = { v: 0 };
                    gsap.to(counterObj, {
                        v: numericValue,
                        duration: dur,
                        ease: "power2.out",
                        onUpdate: () => {
                            if (isCancelled) return;
                            const val = parseFloat(counterObj.v.toFixed(1));
                            el.textContent = `${prefix}${val % 1 === 0 ? Math.floor(val) : val}${postfix}`;
                        },
                        onComplete: () => {
                            if (!isCancelled) el.textContent = target;
                        },
                    });
                },
            });

            cleanup = () => {
                st.kill();
            };

            if (isCancelled) {
                cleanup();
            }
        };

        init();
        return () => {
            isCancelled = true;
            cleanup?.();
        };
    }, [target]);

    return <span ref={ref}>{target}</span>;
}

export function ProcessSection() {
    return (
        <section
            className="py-28 md:py-36 relative overflow-hidden border-b border-[#C084FC]/20"
            style={{
                background:
                    "radial-gradient(ellipse at 30% 60%, rgba(139, 92, 246, 0.22) 0%, rgba(17, 9, 30, 0.96) 60%, #0D0614 100%)",
            }}
            aria-labelledby="process-heading"
        >
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                {/* Heading */}
                <p className="eyebrow mb-4 text-[#C084FC] tracking-[0.28em] text-xs uppercase font-semibold">
                    04 / How We Work
                </p>
                <h2
                    id="process-heading"
                    className={cn(
                        "font-display text-white mb-16",
                        "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
                        "leading-tight tracking-tight max-w-2xl"
                    )}
                >
                    Data-led. <em className="italic bg-gradient-to-r from-white via-[#E9D5FF] to-[#C084FC] bg-clip-text text-transparent font-normal">Human-driven.</em>
                </h2>

                {/* Process steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 md:mb-28">
                    {processSteps.map((step) => (
                        <div key={step.number} className="group">
                            <div className="flex items-start gap-4 mb-4">
                                <span className="font-mono text-[#C084FC] text-xs sm:text-sm tracking-widest mt-1 font-semibold">
                                    {step.number}
                                </span>
                                <div className="flex-1 h-px bg-[#C084FC]/20 mt-3 group-hover:bg-[#C084FC]/60 transition-colors duration-300" />
                            </div>
                            <h3 className="font-display text-white text-xl md:text-2xl mb-3 tracking-tight group-hover:text-[#DDD6FE] transition-colors">
                                {step.title}
                            </h3>
                            <p className="font-body text-[#DDD6FE]/70 text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Stats showcase (Refined Image 2 Marketeam orbital cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-[#C084FC]/20">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className="relative rounded-2xl p-6 sm:p-7 overflow-hidden bg-gradient-to-b from-white/[0.05] via-[#1A0B2E]/60 to-[#0D0614]/90 border border-[#C084FC]/25 shadow-[0_0_30px_rgba(168,85,247,0.12)] backdrop-blur-xl group hover:border-[#C084FC]/60 transition-all duration-300"
                        >
                            {/* Subtle concentric orbit ring watermark in background (Image 2 motif) */}
                            <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full border border-white/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full border border-dashed border-[#C084FC]/20 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-[#C084FC]/30 text-[10px] text-[#C084FC] uppercase tracking-wider font-mono mb-4">
                                    <span>METRIC 0{i + 1}</span>
                                </div>
                                <div className={cn(
                                    "font-display text-white",
                                    "text-4xl sm:text-5xl lg:text-6xl",
                                    "leading-none tracking-tight mb-3 font-bold"
                                )}>
                                    <AnimatedCounter target={stat.numeral} />
                                </div>
                                <p className="font-body text-[#DDD6FE]/80 text-xs sm:text-sm uppercase tracking-wider font-medium">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
