import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "light" | "dark";
}

export function Skeleton({ className, variant = "light", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl",
        variant === "dark"
          ? "bg-white/[0.06] border border-white/10"
          : "bg-slate-200/70 lg:bg-[#EEF2FF] border border-[#DCE5FF]/80",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonCard({ className, variant = "light" }: { className?: string; variant?: "light" | "dark" }) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 space-y-4 border transition-all",
        variant === "dark"
          ? "bg-[#130B24]/70 border-white/10"
          : "bg-[#EEF2FF] lg:bg-white/90 border-[#DCE5FF] lg:border-white/95 shadow-sm",
        className
      )}
      aria-hidden="true"
    >
      <Skeleton variant={variant} className="h-6 w-1/3" />
      <Skeleton variant={variant} className="h-4 w-3/4" />
      <Skeleton variant={variant} className="h-20 w-full" />
      <div className="flex gap-2 pt-2">
        <Skeleton variant={variant} className="h-7 w-20 rounded-full" />
        <Skeleton variant={variant} className="h-7 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function CreatorCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-[#DCE5FF] lg:border-white/95 bg-[#EEF2FF] lg:bg-white/90 shadow-sm"
      aria-hidden="true"
    >
      <div
        className="w-full animate-pulse bg-gradient-to-br from-indigo-950/40 via-indigo-900/30 to-indigo-950/50"
        style={{ aspectRatio: "3/4" }}
      />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/5" />
        <Skeleton className="h-4 w-2/5" />
        <div className="pt-2 border-t border-[#DCE5FF] flex justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
}
