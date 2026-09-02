"use client";

import ParallaxShape from "@/components/marketing/inner-page/parallax-shape";
import { cn } from "@/lib/utils";

export type AccentPreset =
  | "hero"
  | "hero-oracle"
  | "hero-ai"
  | "hero-ai-dark"
  | "hero-product"
  | "hero-careers"
  | "hero-industries"
  | "hero-company"
  | "hero-resources"
  | "section-soft"
  | "section-sage"
  | "section-white"
  | "section-dark"
  | "section-cta"
  | "minimal";

type AccentConfig = {
  shapes: Array<{
    variant: "arc" | "arch" | "panel" | "circle";
    speed: "slow" | "slower";
    className: string;
  }>;
  grid?: boolean;
  lines?: boolean;
};

const presets: Record<AccentPreset, AccentConfig> = {
  hero: {
    shapes: [
      {
        variant: "circle",
        speed: "slower",
        className:
          "right-[-4%] top-[8%] h-[min(340px,42vw)] w-[min(340px,42vw)] border border-[#C9DDD7]/35 bg-[#E1ECE8]/25",
      },
      {
        variant: "arch",
        speed: "slow",
        className:
          "left-[-6%] bottom-[12%] h-[min(200px,28vw)] w-[min(280px,38vw)] bg-[#4B9488]/6",
      },
      {
        variant: "panel",
        speed: "slower",
        className:
          "right-[18%] bottom-[-8%] h-[min(180px,22vh)] w-[min(160px,18vw)] bg-[#176A63]/5",
      },
    ],
    grid: true,
  },
  "hero-oracle": {
    shapes: [
      {
        variant: "panel",
        speed: "slower",
        className:
          "right-0 top-0 h-[min(440px,58vh)] w-[min(300px,30vw)] bg-[#E1ECE8]/55",
      },
      {
        variant: "circle",
        speed: "slow",
        className:
          "left-[52%] top-[8%] h-[min(380px,44vw)] w-[min(380px,44vw)] border border-[#C9DDD7]/45 bg-transparent",
      },
      {
        variant: "circle",
        speed: "slower",
        className:
          "left-[56%] top-[14%] h-[min(260px,30vw)] w-[min(260px,30vw)] border border-[#4B9488]/15 bg-[#4B9488]/4",
      },
    ],
    lines: true,
  },
  "hero-ai": {
    shapes: [
      {
        variant: "panel",
        speed: "slow",
        className:
          "right-[2%] top-[14%] h-[min(400px,50vh)] w-[min(260px,28vw)] bg-[#4B9488]/10",
      },
      {
        variant: "circle",
        speed: "slower",
        className:
          "left-[-5%] bottom-[10%] h-[min(280px,35vw)] w-[min(280px,35vw)] bg-[#073B3A]/4",
      },
    ],
    lines: true,
  },
  "hero-ai-dark": {
    shapes: [
      {
        variant: "circle",
        speed: "slow",
        className:
          "right-[-6%] top-[6%] h-[min(420px,48vw)] w-[min(420px,48vw)] border border-white/8 bg-white/[0.03]",
      },
      {
        variant: "panel",
        speed: "slower",
        className:
          "left-[-4%] bottom-[8%] h-[min(240px,30vh)] w-[min(200px,22vw)] bg-[#4B9488]/12",
      },
    ],
    lines: true,
  },
  "hero-product": {
    shapes: [
      {
        variant: "arch",
        speed: "slow",
        className:
          "-left-[4%] bottom-[6%] h-[min(260px,34vw)] w-[min(360px,48vw)] bg-[#E1ECE8]/65",
      },
      {
        variant: "circle",
        speed: "slower",
        className:
          "right-[4%] top-[10%] h-[min(200px,26vw)] w-[min(200px,26vw)] bg-[#4B9488]/8",
      },
    ],
    grid: true,
  },
  "hero-careers": {
    shapes: [
      {
        variant: "arch",
        speed: "slower",
        className:
          "right-[2%] top-[6%] h-[min(300px,38vw)] w-[min(380px,44vw)] bg-[#E1ECE8]/50",
      },
      {
        variant: "circle",
        speed: "slow",
        className:
          "left-[-4%] bottom-[14%] h-[min(220px,28vw)] w-[min(220px,28vw)] border border-[#C9DDD7]/40 bg-transparent",
      },
    ],
    grid: true,
  },
  "hero-industries": {
    shapes: [
      {
        variant: "panel",
        speed: "slower",
        className:
          "right-[-2%] top-[10%] h-[min(360px,46vh)] w-[min(240px,26vw)] bg-[#4B9488]/8",
      },
      {
        variant: "circle",
        speed: "slow",
        className:
          "left-[8%] bottom-[8%] h-[min(200px,24vw)] w-[min(200px,24vw)] bg-[#E1ECE8]/55",
      },
    ],
    lines: true,
  },
  "hero-company": {
    shapes: [
      {
        variant: "circle",
        speed: "slower",
        className:
          "left-[-5%] top-[12%] h-[min(300px,36vw)] w-[min(300px,36vw)] border border-[#C9DDD7]/35 bg-[#E1ECE8]/20",
      },
      {
        variant: "panel",
        speed: "slow",
        className:
          "right-[6%] bottom-[6%] h-[min(180px,22vh)] w-[min(150px,16vw)] bg-[#176A63]/6",
      },
    ],
    grid: true,
  },
  "hero-resources": {
    shapes: [
      {
        variant: "arch",
        speed: "slow",
        className:
          "right-[4%] bottom-[10%] h-[min(240px,30vw)] w-[min(320px,38vw)] bg-[#E1ECE8]/45",
      },
      {
        variant: "circle",
        speed: "slower",
        className:
          "left-[-3%] top-[18%] h-[min(180px,22vw)] w-[min(180px,22vw)] bg-[#4B9488]/6",
      },
    ],
    lines: true,
  },
  "section-soft": {
    shapes: [
      {
        variant: "circle",
        speed: "slower",
        className:
          "right-[-8%] top-[20%] h-[min(280px,32vw)] w-[min(280px,32vw)] bg-[#E1ECE8]/40",
      },
      {
        variant: "arch",
        speed: "slow",
        className:
          "left-[-6%] bottom-[-10%] h-[min(160px,20vw)] w-[min(220px,28vw)] bg-[#4B9488]/5",
      },
    ],
  },
  "section-sage": {
    shapes: [
      {
        variant: "panel",
        speed: "slower",
        className:
          "right-[4%] top-[15%] h-[min(200px,24vh)] w-[min(140px,16vw)] bg-white/40",
      },
      {
        variant: "circle",
        speed: "slow",
        className:
          "left-[-5%] bottom-[10%] h-[min(220px,26vw)] w-[min(220px,26vw)] border border-[#C9DDD7]/30 bg-transparent",
      },
    ],
    lines: true,
  },
  "section-white": {
    shapes: [
      {
        variant: "circle",
        speed: "slower",
        className:
          "right-[6%] top-[12%] h-[min(180px,22vw)] w-[min(180px,22vw)] bg-[#F0F6F4]",
      },
    ],
  },
  "section-dark": {
    shapes: [
      {
        variant: "circle",
        speed: "slow",
        className:
          "right-[-5%] top-[10%] h-[min(360px,40vw)] w-[min(360px,40vw)] border border-white/6 bg-white/[0.02]",
      },
      {
        variant: "panel",
        speed: "slower",
        className:
          "left-[-3%] bottom-[5%] h-[min(200px,25vh)] w-[min(180px,20vw)] bg-[#4B9488]/10",
      },
    ],
    lines: true,
  },
  "section-cta": {
    shapes: [
      {
        variant: "circle",
        speed: "slow",
        className:
          "right-[-8%] top-[-20%] h-[min(400px,45vw)] w-[min(400px,45vw)] border border-white/10 bg-white/[0.04]",
      },
      {
        variant: "arch",
        speed: "slower",
        className:
          "left-[-6%] bottom-[-15%] h-[min(220px,28vw)] w-[min(300px,36vw)] bg-white/[0.03]",
      },
    ],
  },
  minimal: { shapes: [] },
};

export default function BackgroundAccent({
  preset = "hero",
  className,
  intensity = "normal",
}: {
  preset?: AccentPreset;
  className?: string;
  intensity?: "subtle" | "normal" | "rich";
}) {
  const config = presets[preset];
  const opacity =
    intensity === "subtle" ? "opacity-60" : intensity === "rich" ? "opacity-100" : "opacity-85";

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {config.grid ? (
        <div className="ca-section-grid absolute inset-0" />
      ) : null}
      {config.lines ? (
        <div className="ca-data-lines absolute inset-0" />
      ) : null}
      {config.shapes.map((shape, i) => (
        <ParallaxShape
          key={`${preset}-${i}`}
          variant={shape.variant}
          speed={shape.speed}
          className={cn(shape.className, opacity)}
        />
      ))}
    </div>
  );
}
