"use client";

import { cn } from "@/lib/utils";

export default function PlatformLineSystem({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ca-line-fade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9BC4B8" stopOpacity="0" />
          <stop offset="50%" stopColor="#9BC4B8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#9BC4B8" stopOpacity="0" />
        </linearGradient>
      </defs>

      <circle cx="600" cy="400" r="280" fill="none" stroke="url(#ca-line-fade)" strokeWidth="1" opacity="0.5" />
      <circle cx="600" cy="400" r="200" fill="none" stroke="#9BC4B8" strokeWidth="0.75" opacity="0.25" />
      <circle cx="600" cy="400" r="120" fill="none" stroke="#9BC4B8" strokeWidth="0.75" opacity="0.2" />

      <path
        d="M 80 520 Q 320 380 600 400 T 1120 280"
        fill="none"
        stroke="#9BC4B8"
        strokeWidth="0.75"
        opacity="0.3"
      />
      <path
        d="M 120 680 Q 400 560 600 520 T 1080 420"
        fill="none"
        stroke="#176A63"
        strokeWidth="0.5"
        opacity="0.2"
      />

      {[
        [320, 380],
        [600, 400],
        [880, 320],
        [480, 520],
        [720, 480],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#9BC4B8" opacity="0.35" />
      ))}
    </svg>
  );
}
