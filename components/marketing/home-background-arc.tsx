"use client";

import { cn } from "@/lib/utils";

export default function HomeBackgroundArc({
  className,
  tone = "dark",
  moving = true,
}: {
  className?: string;
  tone?: "dark" | "light";
  moving?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "ca-home-bg-arc ca-background-arc pointer-events-none",
        tone === "light" && "ca-home-bg-arc--light",
        moving && "ca-home-moving",
        className,
      )}
    />
  );
}
