import React from "react";
import { cn } from "@/lib/utils";

// Exact 12-bar color sequence matching reference image (deep royal purple -> soft lavender)
const SPOKE_COLORS = [
  "#3B28CC", // 12 o'clock - Deep royal purple / indigo
  "#D7DBF8", // 1 o'clock - Faint lavender
  "#BAC2F6", // 2 o'clock - Light lavender
  "#9DA9F3", // 3 o'clock - Soft lavender blue
  "#8190F1", // 4 o'clock - Light slate blue
  "#6577EE", // 5 o'clock - Medium slate blue
  "#5756E2", // 6 o'clock - Blue purple
  "#4C43DA", // 7 o'clock - Deep blue purple
  "#4332D2", // 8 o'clock - Rich purple indigo
  "#3E2ACF", // 9 o'clock - Deep rich purple
  "#412ECC", // 10 o'clock - Royal purple
  "#3A23C0", // 11 o'clock - Deep indigo purple
];

interface Minimal12BarSpinnerProps {
  size?: number;
  className?: string;
}

export function Minimal12BarSpinner({
  size = 50,
  className,
}: Minimal12BarSpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("animate-spin shrink-0 select-none pointer-events-none", className)}
      style={{
        transformOrigin: "center",
        animationDuration: "0.85s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.45))",
      }}
      role="status"
      aria-label="Loading"
    >
      {SPOKE_COLORS.map((color, i) => (
        <line
          key={i}
          x1="24"
          y1="4"
          x2="24"
          y2="13.5"
          stroke={color}
          strokeWidth="3.6"
          strokeLinecap="round"
          transform={`rotate(${i * 30} 24 24)`}
        />
      ))}
    </svg>
  );
}

export { Minimal12BarSpinner as HausSpinner };
export default Minimal12BarSpinner;
