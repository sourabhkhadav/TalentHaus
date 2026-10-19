"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error internally in non-production environments
    if (process.env.NODE_ENV !== "production") {
      console.error("Route error boundary caught:", error);
    }
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-[#EEF2FF] lg:bg-[#120822]/80 border border-[#DCE5FF] lg:border-white/15 shadow-2xl backdrop-blur-2xl">
        <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle size={28} />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl text-[#172033] lg:text-white tracking-tight">
            Unexpected Exception
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#64708A] lg:text-stone leading-relaxed">
            A temporary system error interrupted this view. Our executive operations desk has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#4F46E5] text-white hover:bg-[#4338CA] text-xs font-semibold uppercase tracking-wider transition-all min-h-[44px]"
          >
            <RotateCcw size={14} />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white lg:bg-white/10 text-[#172033] lg:text-white border border-[#DCE5FF] lg:border-white/20 hover:bg-[#EEF2FF] lg:hover:bg-white/20 text-xs font-semibold uppercase tracking-wider transition-all min-h-[44px]"
          >
            <Home size={14} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
