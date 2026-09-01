"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

export type BackdropVariant =
  | "hero"
  | "positioning"
  | "oracle"
  | "ai"
  | "applications"
  | "soft"
  | "workforce"
  | "dark"
  | "cta";

type ParallaxOffsets = { slow: number; mid: number; fast: number };

function ShapeLayer({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("absolute", className)} style={style}>
      {children}
    </div>
  );
}

export default function SectionBackdrop({
  variant,
  className,
}: {
  variant: BackdropVariant;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<ParallaxOffsets>({ slow: 0, mid: 0, fast: 0 });

  useEffect(() => {
    if (reduced) return;

    const media = window.matchMedia("(min-width: 768px)");
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const norm = (window.innerHeight / 2 - center) / window.innerHeight;
      const scale = media.matches ? 1 : 0.35;
      setOffset({
        slow: norm * 28 * scale,
        mid: norm * 16 * scale,
        fast: norm * 10 * scale,
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  const parallax = (amount: number) =>
    reduced ? undefined : { transform: `translate3d(0, ${amount}px, 0)` };

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {variant === "hero" && (
        <>
          <ShapeLayer className="top-[8%] -left-[6%]" style={parallax(offset.slow)}>
            <div
              className="ca-shape ca-shape--float-three ca-shape--delay-2 h-[220px] w-[220px] rounded-full border border-[#C9DDD7]/60 bg-[#F0F6F4]/40 opacity-60"
            />
          </ShapeLayer>
          <ShapeLayer className="top-[70px] -right-[120px]" style={parallax(offset.slow)}>
            <div className="ca-shape ca-shape--float-one ca-shape--delay-1 ca-shape--hero-arc h-[560px] w-[560px] rounded-full bg-[rgba(155,196,184,0.18)]" />
          </ShapeLayer>
          <ShapeLayer className="right-[6%] top-[10%] hidden md:block" style={parallax(offset.mid)}>
            <div
              className="ca-shape ca-shape--float-two ca-shape--delay-3 ca-shape--hero-arch h-[480px] w-[420px] ca-bg-drift"
              style={{
                background:
                  "linear-gradient(145deg, rgba(225,236,232,.8), rgba(155,196,184,.25))",
                borderRadius: "160px 30px 120px 30px",
              }}
            />
          </ShapeLayer>
          <ShapeLayer className="bottom-[12%] right-[18%] hidden lg:block" style={parallax(offset.fast)}>
            <div
              className="ca-shape ca-shape--float-one ca-shape--delay-2 h-[140px] w-[140px] rounded-full bg-[#176A63]/10"
            />
          </ShapeLayer>
        </>
      )}

      {variant === "positioning" && (
        <>
          <ShapeLayer className="-right-[12%] top-[8%]" style={parallax(offset.slow)}>
            <div className="ca-shape ca-shape--float-three ca-shape--delay-1 ca-shape--positioning-arc h-[640px] w-[640px] rounded-full border border-[#E1ECE8] bg-[#F0F6F4] opacity-[0.09]" />
          </ShapeLayer>
          <ShapeLayer className="-left-[8%] bottom-[6%] hidden md:block" style={parallax(offset.fast)}>
            <div
              className="ca-shape ca-shape--float-two ca-shape--delay-3 h-[280px] w-[240px] bg-[rgba(225,236,232,0.55)]"
              style={{ borderRadius: "24px 100px 24px 24px" }}
            />
          </ShapeLayer>
        </>
      )}

      {variant === "oracle" && (
        <>
          <ShapeLayer className="-right-20 top-[6%] hidden lg:block" style={parallax(offset.slow)}>
            <div
              className="ca-shape ca-shape--float-two ca-shape--delay-2 h-[620px] w-[420px] bg-[rgba(155,196,184,0.18)]"
              style={{ borderRadius: "220px 220px 24px 24px" }}
            />
          </ShapeLayer>
          <ShapeLayer className="left-[4%] top-[18%] hidden xl:block" style={parallax(offset.fast)}>
            <div className="ca-shape ca-shape--float-one ca-shape--delay-1 h-[180px] w-[180px] rounded-full border border-[#C9DDD7]/50 bg-white/40" />
          </ShapeLayer>
        </>
      )}

      {variant === "ai" && (
        <>
          <div className="ca-ai-line-pattern absolute inset-0" />
          <ShapeLayer className="right-[8%] top-[12%] hidden lg:block" style={parallax(offset.mid)}>
            <div className="ca-shape ca-shape--float-three ca-shape--delay-2 h-[200px] w-[200px] rounded-full bg-[#176A63]/[0.06]" />
          </ShapeLayer>
        </>
      )}

      {variant === "applications" && (
        <>
          <ShapeLayer className="-left-16 bottom-[8%] hidden lg:block" style={parallax(offset.fast)}>
            <div
              className="ca-shape ca-shape--float-one ca-shape--delay-1 h-[380px] w-[320px] bg-[rgba(225,236,232,0.65)]"
              style={{ borderRadius: "24px 140px 24px 100px" }}
            />
          </ShapeLayer>
          <ShapeLayer className="right-[6%] top-[10%] hidden lg:block" style={parallax(offset.slow)}>
            <div
              className="ca-shape ca-shape--float-two ca-shape--delay-3 h-[260px] w-[200px] border border-[#E1ECE8] bg-white/30"
              style={{ borderRadius: "100px 14px 14px 14px" }}
            />
          </ShapeLayer>
        </>
      )}

      {variant === "soft" && (
        <>
          <div
            className="ca-bg-drift absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(circle at 12% 50%, rgba(155,196,184,0.18) 0%, transparent 42%), radial-gradient(circle at 88% 30%, rgba(75,148,136,0.14) 0%, transparent 48%)",
            }}
          />
          <ShapeLayer className="right-[5%] top-[20%] hidden sm:block" style={parallax(offset.fast)}>
            <div className="ca-shape ca-shape--float-one ca-shape--delay-2 h-[120px] w-[120px] rounded-full bg-[#9BC4B8]/15" />
          </ShapeLayer>
        </>
      )}

      {variant === "workforce" && (
        <>
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "linear-gradient(135deg, rgba(240,246,244,0.9) 0%, rgba(247,250,249,1) 50%, rgba(225,236,232,0.35) 100%)",
            }}
          />
          <ShapeLayer className="-right-[6%] top-[15%]" style={parallax(offset.slow)}>
            <div
              className="ca-shape ca-shape--float-three ca-shape--delay-1 h-[360px] w-[360px] rounded-full border border-[#E1ECE8] bg-white/50"
            />
          </ShapeLayer>
          <ShapeLayer className="left-[2%] bottom-[10%] hidden md:block" style={parallax(offset.fast)}>
            <div
              className="ca-shape ca-shape--float-two ca-shape--delay-3 h-[160px] w-[200px] bg-[#9BC4B8]/12"
              style={{ borderRadius: "14px 80px 14px 14px" }}
            />
          </ShapeLayer>
        </>
      )}

      {variant === "dark" && (
        <>
          <div
            className="ca-bg-drift absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 70% 30%, rgba(155,196,184,0.22) 0%, transparent 55%), radial-gradient(circle at 15% 80%, rgba(23,106,99,0.18) 0%, transparent 45%)",
            }}
          />
          <ShapeLayer className="-right-[10%] -top-[8%] hidden md:block" style={parallax(offset.slow)}>
            <div
              className="ca-shape ca-shape--float-two ca-shape--delay-2 h-[480px] w-[480px] rounded-full border border-[#9BC4B8]/15 bg-[#0B4A47]/30"
            />
          </ShapeLayer>
          <ShapeLayer className="-left-[6%] bottom-[5%] hidden lg:block" style={parallax(offset.fast)}>
            <div
              className="ca-shape ca-shape--float-one ca-shape--delay-1 h-[280px] w-[220px] bg-[#176A63]/20"
              style={{ borderRadius: "24px 120px 24px 80px" }}
            />
          </ShapeLayer>
        </>
      )}

      {variant === "cta" && (
        <>
          <div
            className="ca-bg-drift absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 20% 40%, rgba(23,106,99,0.35) 0%, transparent 50%), radial-gradient(circle at 85% 60%, rgba(155,196,184,0.12) 0%, transparent 45%)",
            }}
          />
          <ShapeLayer className="right-[4%] top-[8%] hidden md:block" style={parallax(offset.slow)}>
            <div
              className="ca-shape ca-shape--float-three ca-shape--delay-2 h-[320px] w-[320px] rounded-full border border-white/10 bg-white/[0.03]"
            />
          </ShapeLayer>
          <ShapeLayer className="-left-[4%] bottom-[0%] hidden lg:block" style={parallax(offset.fast)}>
            <div
              className="ca-shape ca-shape--float-one ca-shape--delay-1 h-[240px] w-[200px] bg-[#176A63]/25"
              style={{ borderRadius: "120px 24px 80px 24px" }}
            />
          </ShapeLayer>
        </>
      )}
    </div>
  );
}
