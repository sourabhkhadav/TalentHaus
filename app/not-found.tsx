import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial gradient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-40 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle, #7C3AED 0%, #4F46E5 40%, transparent 75%)",
        }}
      />

      <div className="max-w-xl mx-auto text-center space-y-6 relative z-10 py-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] lg:bg-white/10 border border-[#DCE5FF] lg:border-white/15 text-xs font-semibold uppercase tracking-[0.25em] text-[#4F46E5] lg:text-[#C084FC]">
          <Compass size={14} />
          <span>404 / Route Missing</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl text-[#172033] lg:text-white tracking-tight leading-tight">
          Page not <em className="italic bg-gradient-to-r from-[#4F46E5] to-[#C084FC] bg-clip-text text-transparent font-normal">found.</em>
        </h1>

        <p className="font-body text-[#64708A] lg:text-stone text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          The requested creator dossier, campaign case study, or agency resource does not exist or has been relocated.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4F46E5] text-white hover:bg-[#4338CA] text-xs font-semibold uppercase tracking-wider shadow-lg shadow-indigo-500/25 transition-all min-h-[44px]"
          >
            <ArrowLeft size={14} />
            Return Home
          </Link>

          <Link
            href="/roster"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-white lg:bg-white/10 text-[#172033] lg:text-white border border-[#DCE5FF] lg:border-white/20 hover:bg-[#EEF2FF] lg:hover:bg-white/20 text-xs font-semibold uppercase tracking-wider transition-all min-h-[44px]"
          >
            Explore Creators
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
