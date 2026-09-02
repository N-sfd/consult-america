"use client";

import { cn } from "@/lib/utils";

export type ParallaxVariant = "arc" | "arch" | "panel" | "circle";
export type ParallaxSpeed = "slow" | "slower" | "spin" | "spin-slow";
export type ParallaxDirection = "x" | "y";

const speedClass: Record<ParallaxSpeed, string> = {
  slow: "ca-shape--float-one",
  slower: "ca-shape--float-two",
  spin: "ca-shape--spin",
  "spin-slow": "ca-shape--spin-slow",
};

const variantClass: Record<ParallaxVariant, string> = {
  arc: "ca-hero-shape-arch",
  arch: "ca-hero-shape-arch",
  panel: "ca-hero-shape-panel",
  circle: "rounded-full",
};

export default function ParallaxShape({
  variant = "arch",
  speed = "slow",
  direction = "y",
  className,
  style,
}: {
  variant?: ParallaxVariant;
  speed?: ParallaxSpeed;
  direction?: ParallaxDirection;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "ca-shape ca-parallax ca-background-motion pointer-events-none absolute",
        variantClass[variant],
        speedClass[speed],
        direction === "x" && "ca-shape--float-three",
        className,
      )}
      style={style}
    />
  );
}
