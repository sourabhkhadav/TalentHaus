"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/ui/Preloader";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { LoadingProvider } from "@/lib/context/LoadingContext";

export function LayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === "/";

    // Preloader state: initialize identically on server & initial client render to prevent hydration mismatches
    const [preloaderDone, setPreloaderDone] = useState(true);
    const [mounted, setMounted] = useState(false);
    const tickerRef = useRef<((time: number) => void) | null>(null);

    useEffect(() => {
        setMounted(true);
        if (!isHome) {
            setPreloaderDone(true);
            return;
        }
        try {
            const hasShown =
                sessionStorage.getItem("th-intro-shown") ||
                sessionStorage.getItem("th-preloader-shown");
            if (!hasShown) {
                setPreloaderDone(false);
            }
        } catch {
            setPreloaderDone(true);
        }
    }, [isHome]);

    useEffect(() => {
        // Initialize Lenis smooth scroll on desktop only
        if (typeof window === "undefined") return;
        const isTouch = window.matchMedia("(hover: none)").matches;
        if (isTouch) return;

        let lenis: import("lenis").default | null = null;
        let isCancelled = false;

        const init = async () => {
            const [{ default: Lenis }, { default: gsap }, { default: ScrollTrigger }] = await Promise.all([
                import("lenis"),
                import("gsap"),
                import("gsap/ScrollTrigger"),
            ]);

            if (isCancelled) return;

            lenis = new Lenis({
                duration: 1.2,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
            });

            gsap.registerPlugin(ScrollTrigger);

            // Sync Lenis with GSAP ticker cleanly
            const tickerCb = (time: number) => {
                lenis?.raf(time * 1000);
            };
            tickerRef.current = tickerCb;
            gsap.ticker.add(tickerCb);
            gsap.ticker.lagSmoothing(0);
            ScrollTrigger.refresh();
        };

        init();

        return () => {
            isCancelled = true;
            if (tickerRef.current) {
                import("gsap").then(({ default: gsap }) => {
                    if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
                });
            }
            lenis?.destroy();
        };
    }, []);

    return (
        <AuthProvider>
            <LoadingProvider>
                {mounted && isHome && !preloaderDone && (
                    <Preloader onComplete={() => setPreloaderDone(true)} />
                )}
                <div
                    className="min-h-[100svh] flex flex-col"
                    style={
                        mounted && isHome && !preloaderDone
                            ? { opacity: 0, transition: "opacity 0.4s ease" }
                            : undefined
                    }
                >
                    <Header />
                    <main id="main-content" className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </div>
            </LoadingProvider>
        </AuthProvider>
    );
}
