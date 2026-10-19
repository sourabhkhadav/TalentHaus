"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Minimal12BarSpinner } from "@/components/ui/Minimal12BarSpinner";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentPathRef = useRef(pathname);

  useEffect(() => {
    currentPathRef.current = pathname;
  }, [pathname]);

  const startLoader = useCallback((targetHref: string) => {
    try {
      const url = new URL(targetHref, window.location.origin);
      if (
        url.pathname === currentPathRef.current &&
        url.search === window.location.search
      ) {
        return;
      }

      startTimeRef.current = Date.now();
      setIsLoading(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);

      safetyTimerRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // When pathname or searchParams change, the destination page has arrived!
  useEffect(() => {
    if (!isLoading) return;

    // Minimum display time ensures the user clearly perceives the smooth transition
    const elapsed = Date.now() - startTimeRef.current;
    const minTime = 400;
    const remaining = Math.max(0, minTime - elapsed);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, remaining);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, searchParams, isLoading]);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      if (href.startsWith("/") || href.startsWith(window.location.origin)) {
        startLoader(href);
      }
    };

    const handlePopState = () => {
      startLoader(window.location.href);
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    const handleCustomNavigationStart = (e: Event) => {
      const customEvent = e as CustomEvent<{ href: string }>;
      startLoader(customEvent.detail?.href || "/roster");
    };
    window.addEventListener("th-navigation-start", handleCustomNavigationStart);

    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("th-navigation-start", handleCustomNavigationStart);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, [startLoader]);

  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[9999999] pointer-events-none flex items-center justify-center animate-in fade-in duration-100"
    >
      <Minimal12BarSpinner size={50} />
    </div>
  );
}
