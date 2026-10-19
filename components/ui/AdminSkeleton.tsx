import React from "react";
import { Skeleton } from "./Skeleton";

export function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-[#07030C] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <Skeleton variant="dark" className="h-8 w-64" />
          <Skeleton variant="dark" className="h-4 w-96" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton variant="dark" className="h-10 w-28 rounded-full" />
          <Skeleton variant="dark" className="h-10 w-32 rounded-full" />
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
            <Skeleton variant="dark" className="h-4 w-1/2" />
            <Skeleton variant="dark" className="h-8 w-3/4" />
            <Skeleton variant="dark" className="h-3 w-1/3" />
          </div>
        ))}
      </div>

      {/* Tabs navigation */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="dark" className="h-9 w-24 rounded-lg" />
        ))}
      </div>

      {/* Main Table / Content Section */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <Skeleton variant="dark" className="h-6 w-48" />
          <Skeleton variant="dark" className="h-8 w-36 rounded-lg" />
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-white/[0.03] flex items-center px-4 justify-between">
            <Skeleton variant="dark" className="h-4 w-1/4" />
            <Skeleton variant="dark" className="h-4 w-1/6" />
            <Skeleton variant="dark" className="h-4 w-1/6" />
            <Skeleton variant="dark" className="h-4 w-1/12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
