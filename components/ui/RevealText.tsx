"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface RevealTextProps {
    children: string;
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
    className?: string;
    delay?: number;
    once?: boolean;
}

/**
 * Splits text by lines (word-wrap driven) and reveals each line with a
 * clip-path mask animated by GSAP ScrollTrigger.
 * Falls back to simple opacity fade with prefers-reduced-motion.
 */
export function RevealText({
    children,
    as: Tag = "h2",
    className,
    delay = 0,
    once = true,
}: RevealTextProps) {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Respect reduced motion
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let isCancelled = false;
        let cleanup: (() => void) | undefined;

        const init = async () => {
            const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all([
                import("gsap"),
                import("gsap/ScrollTrigger"),
            ]);

            if (isCancelled) return;
            gsap.registerPlugin(ScrollTrigger);

            // Split into word spans for line-detection
            const text = el.textContent || "";
            const words = text.split(" ").filter(Boolean);
            el.innerHTML = words
                .map((w) => `<span class="th-word" style="display:inline-block;overflow:hidden;vertical-align:bottom;"><span class="th-word-inner" style="display:inline-block;">${w}&nbsp;</span></span>`)
                .join("");

            const inners = el.querySelectorAll<HTMLElement>(".th-word-inner");

            if (prefersReduced) {
                // Just fade in
                gsap.fromTo(inners, { opacity: 0 }, {
                    opacity: 1,
                    stagger: 0.02,
                    duration: 0.4,
                    scrollTrigger: { trigger: el, start: "top 90%" },
                });
            } else {
                gsap.fromTo(
                    inners,
                    { yPercent: 110 },
                    {
                        yPercent: 0,
                        stagger: 0.04,
                        duration: 0.7,
                        ease: "power3.out",
                        delay,
                        scrollTrigger: {
                            trigger: el,
                            start: "top 88%",
                            once,
                        },
                    }
                );
            }

            cleanup = () => {
                ScrollTrigger.getAll().forEach((st) => {
                    if (st.trigger === el) st.kill();
                });
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
    }, [delay, once]);

    return (
        <Tag
            ref={containerRef as React.RefObject<HTMLHeadingElement>}
            className={cn(className)}
        >
            {children}
        </Tag>
    );
}
