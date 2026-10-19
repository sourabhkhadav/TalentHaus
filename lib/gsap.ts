"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/**
 * Registers GSAP plugins and returns a matchMedia context.
 * All heavy animations should be wrapped in the returned mm context.
 */
export function registerGSAP() {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * Creates a consistent GSAP matchMedia context for responsive animations
 */
export function createMatchMedia() {
    return gsap.matchMedia();
}

export const EASES = {
    power3: "power3.out",
    expo: "expo.out",
    power4: "power4.out",
};

export const DURATIONS = {
    fast: 0.4,
    normal: 0.6,
    medium: 0.8,
    slow: 1.0,
    slower: 1.2,
};
