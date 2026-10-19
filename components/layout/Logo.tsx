"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoVariant = "light" | "dark" | "icon";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  href?: string;
}

export function Logo({ variant = "light", className, href = "/" }: LogoProps) {
  const isDarkTheme = variant === "light"; // 'light' variant is used on dark/obsidian backgrounds

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 select-none group transition-transform duration-200 hover:scale-[1.02]",
        className
      )}
      aria-label="TalentHaus"
    >
      {/* Luxury Monogram Emblem */}
      <span
        className={cn(
          "relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shrink-0 transition-all duration-300",
          isDarkTheme
            ? "border border-gold/45 shadow-[0_0_14px_rgba(212,175,55,0.22)] group-hover:border-gold group-hover:shadow-[0_0_22px_rgba(212,175,55,0.45)] bg-[#0B0616]"
            : "border border-indigo-200 shadow-[0_2px_10px_rgba(79,70,229,0.15)] group-hover:border-indigo-400 bg-white"
        )}
        aria-hidden="true"
      >
        <Image
          src="/brand/logo-icon.png"
          alt="TalentHaus Monogram"
          width={36}
          height={36}
          priority
          className="w-full h-full object-cover scale-[1.08] group-hover:scale-115 transition-transform duration-300"
        />
      </span>

      {/* Wordmark (hidden if variant === 'icon') */}
      {variant !== "icon" && (
        <span className="flex items-baseline tracking-tight leading-none">
          <span
            className={cn(
              "font-display text-xl sm:text-[23px] tracking-tight transition-all duration-300",
              isDarkTheme
                ? "bg-gradient-to-r from-ivory via-white to-ivory/90 group-hover:to-gold bg-clip-text text-transparent font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                : "text-[#172033] group-hover:text-[#4F46E5] font-semibold"
            )}
          >
            TalentHaus
          </span>
        </span>
      )}
    </span>
  );

  return (
    <Link
      href={href}
      className="outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian rounded-xl inline-block"
    >
      {content}
    </Link>
  );
}
