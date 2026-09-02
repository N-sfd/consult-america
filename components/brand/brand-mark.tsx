"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

export type BrandMarkTone = "executive" | "inverse";

interface BrandMarkProps {
  className?: string;
  tone?: BrandMarkTone;
}

/**
 * @deprecated Replaced by approved Executive Teal raster assets in lib/brandAssets.ts.
 * Retained only for reference — do not use in new UI.
 */
export default function BrandMark({ className, tone = "executive" }: BrandMarkProps) {
  const uid = useId().replace(/:/g, "");
  const isInverse = tone === "inverse";

  const cOuterStart = isInverse ? "#FFFFFF" : "#45A89A";
  const cOuterMid = isInverse ? "#E1ECE8" : "#168078";
  const cOuterEnd = isInverse ? "#9BCFC5" : "#0B5B57";
  const cOuterDeep = isInverse ? "#C9DDD7" : "#073B3A";

  const cInnerStart = isInverse ? "#FFFFFF" : "#9BCFC5";
  const cInnerMid = isInverse ? "#C9DDD7" : "#45A89A";
  const cInnerEnd = isInverse ? "#9BCFC5" : "#168078";

  const aStart = isInverse ? "#FFFFFF" : "#0B5B57";
  const aMid = isInverse ? "#E1ECE8" : "#073B3A";
  const aEnd = isInverse ? "#C9DDD7" : "#073B3A";

  const highlight = isInverse ? "#FFFFFF" : "#9BCFC5";
  const aCut = isInverse ? "#073B3A" : "#0B5B57";
  const accent = "#C52F32";

  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`${uid}-c-outer`} x1="6" y1="8" x2="58" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor={cOuterStart} />
          <stop offset="0.35" stopColor={cOuterMid} />
          <stop offset="0.72" stopColor={cOuterEnd} />
          <stop offset="1" stopColor={cOuterDeep} />
        </linearGradient>
        <linearGradient id={`${uid}-c-inner`} x1="16" y1="18" x2="50" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor={cInnerStart} />
          <stop offset="0.48" stopColor={cInnerMid} />
          <stop offset="1" stopColor={cInnerEnd} />
        </linearGradient>
        <linearGradient id={`${uid}-a-body`} x1="64" y1="8" x2="114" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor={aStart} />
          <stop offset="0.45" stopColor={aMid} />
          <stop offset="1" stopColor={aEnd} />
        </linearGradient>
      </defs>

      <path
        d="M56 8C30 8 8 26 6 44C4 60 18 74 38 76C46 77 52 75 58 71C50 77 38 80 26 80C8 80 0 62 2 42C5 18 28 0 56 0C64 0 70 2 74 6C68 4 62 4 56 8Z"
        fill={`url(#${uid}-c-outer)`}
      />

      <path
        d="M52 18C34 18 20 30 18 42C16 52 24 62 36 64C42 65 48 63 52 60C44 65 34 67 26 67C12 67 4 55 6 43C8 29 24 16 44 16C50 16 54 17 56 18C52 17 52 17 52 18Z"
        fill={`url(#${uid}-c-inner)`}
      />

      <path
        d="M18 28C22 22 32 16 44 16C48 16 52 17 54 19C46 15 36 16 28 22C22 26 19 31 18 28Z"
        fill={highlight}
        opacity={isInverse ? 0.88 : 0.52}
      />

      <path
        d="M64 6L114 74H96L86 58H74L64 74H44L64 6ZM70 20L76 40H84L90 20H70Z"
        fill={`url(#${uid}-a-body)`}
      />

      <path
        d="M70 20L76 40H84L90 20H70ZM68 44L74 52H86L92 44H68Z"
        fill={aCut}
        opacity={isInverse ? 0.18 : 0.42}
      />

      <path d="M74 48L80 40H86L80 58L74 48Z" fill={accent} />
    </svg>
  );
}
