"use client";

import { useEffect, useRef } from "react";

/**
 * Returns true if the user prefers reduced motion
 */
export function useReducedMotion(): boolean {
    const prefersRef = useRef(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        prefersRef.current = mq.matches;
        const handler = (e: MediaQueryListEvent) => {
            prefersRef.current = e.matches;
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return prefersRef.current;
}
