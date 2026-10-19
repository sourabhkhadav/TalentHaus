import React from "react";
import { Skeleton } from "./Skeleton";

export function PortalSkeleton() {
  return (
    <div className="min-h-screen bg-[#07030C] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Top Welcome Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/20 border border-white/10 space-y-3">
        <Skeleton variant="dark" className="h-4 w-32" />
        <Skeleton variant="dark" className="h-8 w-72" />
        <Skeleton variant="dark" className="h-4 w-96 max-w-full" />
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
            <Skeleton variant="dark" className="h-4 w-1/3" />
            <Skeleton variant="dark" className="h-8 w-2/3" />
            <Skeleton variant="dark" className="h-3 w-1/2" />
          </div>
        ))}
      </div>

      {/* Active Deliverables / Contracts Section */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <Skeleton variant="dark" className="h-6 w-48" />
          <Skeleton variant="dark" className="h-8 w-28 rounded-full" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-white/[0.03] space-y-2">
            <div className="flex justify-between">
              <Skeleton variant="dark" className="h-5 w-1/3" />
              <Skeleton variant="dark" className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton variant="dark" className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
