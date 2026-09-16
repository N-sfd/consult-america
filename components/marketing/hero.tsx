"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";

import HomeBackgroundArc from "@/components/marketing/home-background-arc";
import PracticeAiPaths from "@/components/marketing/practice-ai-paths";
import { useContactPanel } from "@/components/providers/contact-provider";
import { cn } from "@/lib/utils";
import { stockImage, type StockImageKey } from "@/lib/marketing/stock-images";
import { useStableReducedMotion } from "@/lib/marketing/use-stable-reduced-motion";

type HeroSlide = {
  id: string;
  navLabel: string;
  eyebrow: string;
  headline: ReactNode;
  supporting: string;
  exploreCta: { label: string; href: string };
  tone: "transform" | "oracle" | "ai";
  visual: "photo-overlay" | "tall-arch" | "product";
  imageKey?: StockImageKey;
  imageAlt: string;
  overlaySrc?: string;
  overlayAlt?: string;
  productSrc?: string;
  secondaryProductSrc?: string;
};

const SLIDES: HeroSlide[] = [
  {
    id: "transform",
    navLabel: "Enterprise",
    eyebrow: "Enterprise Transformation",
    headline: (
      <>
        Transform the core.
        <br />
        Build what comes next.
      </>
    ),
    supporting:
      "Modernize enterprise platforms, connect data and workflows, operationalize AI, and engineer digital products from strategy through production.",
    exploreCta: { label: "Explore What We Do", href: "#capabilities-ecosystem" },
    tone: "transform",
    visual: "photo-overlay",
    imageKey: "hero",
    imageAlt: "Enterprise technology leaders collaborating",
    overlaySrc: "/innovation/data-agent-hero.png",
    overlayAlt: "Data Agent enterprise interface",
  },
  {
    id: "oracle",
    navLabel: "Oracle",
    eyebrow: "Oracle Transformation",
    headline: (
      <>
        Modernize the
        <br />
        digital core.
      </>
    ),
    supporting:
      "Connect finance, procurement, supply chain, projects, workforce operations and enterprise data through modern Oracle Cloud delivery.",
    exploreCta: { label: "Explore Oracle", href: "/oracle" },
    tone: "oracle",
    visual: "tall-arch",
    imageKey: "oracleFinanceOps",
    imageAlt: "Enterprise operations and Oracle Cloud transformation",
  },
  {
    id: "ai",
    navLabel: "AI + Engineering",
    eyebrow: "AI + Application Engineering",
    headline: (
      <>
        Put intelligence
        <br />
        into the work.
      </>
    ),
    supporting:
      "Turn trusted enterprise data and workflows into governed AI experiences and production-ready digital products.",
    exploreCta: { label: "Explore AI & Applications", href: "/ai-data" },
    tone: "ai",
    visual: "product",
    imageAlt: "Data Agent document intelligence interface",
    productSrc: "/innovation/data-agent-hero.png",
    secondaryProductSrc: "/innovation/data-agent-platform.png",
  },
];

const AUTO_MS = 7000;
const revealEase = [0.2, 0.8, 0.2, 1] as const;

const toneBackground: Record<HeroSlide["tone"], string> = {
  transform:
    "radial-gradient(circle at 82% 22%, rgba(201,244,90,.12), transparent 28%), radial-gradient(circle at 18% 78%, rgba(134,174,178,.2), transparent 32%), linear-gradient(165deg, #073B4C 0%, #0B4655 45%, #356D76 72%, #D7E2E1 100%)",
  oracle:
    "radial-gradient(circle at 78% 26%, rgba(201,244,90,.1), transparent 28%), radial-gradient(circle at 20% 80%, rgba(134,174,178,.18), transparent 30%), linear-gradient(160deg, #073B4C 0%, #0B4655 48%, #86AEB2 78%, #D7E2E1 100%)",
  ai:
    "radial-gradient(circle at 86% 20%, rgba(201,244,90,.14), transparent 26%), radial-gradient(circle at 16% 82%, rgba(53,109,118,.35), transparent 30%), linear-gradient(155deg, #052A36 0%, #073B4C 40%, #0B4655 70%, #356D76 100%)",
};

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useStableReducedMotion();
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const slide = SLIDES[index];
  const autoplayActive = !paused && !hovered && !focused && !hidden && !isMobile && !shouldReduceMotion;

  const goTo = useCallback((next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
    setProgressKey((k) => k + 1);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!autoplayActive) return;
    const timer = window.setTimeout(next, AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [autoplayActive, index, next, progressKey]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
  };

  const contentTransition = shouldReduceMotion
    ? { duration: 0.25, ease: "easeOut" as const }
    : { duration: 0.72, ease: revealEase };

  /* Transform/opacity only — never translateX (avoids horizontal overflow at 100% zoom) */
  const visualVariants = shouldReduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: { opacity: 0, y: 18, scale: 1.015 },
        center: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 1 },
      };

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      className="ca-home-hero-grid relative overflow-x-clip overflow-y-hidden border-b border-[var(--ca-line)]"
      style={{ background: toneBackground[slide.tone], minHeight: "clamp(620px, 72vh, 680px)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
      }}
      onKeyDown={onKeyDown}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 48) {
          if (delta < 0) next();
          else prev();
        }
        touchStartX.current = null;
      }}
    >
      <h2 id={labelId} className="sr-only">
        Consult America enterprise stories
      </h2>

      <div
        aria-hidden="true"
        className={cn(
          "ca-home-sage-disc pointer-events-none absolute hidden lg:block",
          slide.tone === "ai" ? "right-[-8%] top-[6%] h-[420px] w-[420px] opacity-50" : "right-[-4%] top-[-6%] h-[480px] w-[480px] opacity-65",
          slide.tone !== "ai" && !shouldReduceMotion && "ca-decor-drift--slow",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "ca-home-ring pointer-events-none absolute hidden opacity-[0.10] lg:block",
          slide.tone === "oracle" ? "left-[-8%] bottom-[-18%] h-[420px] w-[420px]" : "right-[8%] top-[18%] h-[340px] w-[340px]",
        )}
      />
      <HomeBackgroundArc
        className={cn(
          "opacity-70",
          slide.tone === "ai" ? "-left-[16%] bottom-[-20%]" : "-right-[14%] top-[4%]",
        )}
        moving={!shouldReduceMotion && slide.tone === "transform"}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-between px-6 py-14 sm:py-16 lg:min-h-[640px] lg:px-8 lg:py-[4.5rem] xl:px-10">
        <div className="grid flex-1 grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={contentTransition}
              >
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-lime)]">
                  {slide.eyebrow}
                </p>
                <h1 className="mt-5 max-w-[680px] font-serif text-[length:var(--mkt-home-hero)] font-semibold leading-[1.04] tracking-[-0.035em] text-white">
                  {slide.headline}
                </h1>
                <p className="mt-6 max-w-[34rem] text-[clamp(1.0625rem,1.05vw,1.1875rem)] leading-[1.65] text-white/78">
                  {slide.supporting}
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="inline-flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--ca-lime)] px-6 text-sm font-semibold text-[var(--ca-ink)] shadow-[0_8px_24px_rgba(201,244,90,0.28)] transition-colors hover:bg-[var(--ca-accent-hover)]"
                  >
                    Talk to an Expert
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <Link
                    href={slide.exploreCta.href}
                    className="inline-flex h-[52px] items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/[0.06] px-6 text-sm font-semibold text-white transition-colors hover:border-white/45 hover:bg-white/10"
                  >
                    {slide.exploreCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative lg:col-span-7" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${slide.id}-visual`}
                variants={visualVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={contentTransition}
                className="ca-home-compose ca-practice-stable relative mx-auto w-full max-w-[700px] lg:ml-auto lg:mr-0"
              >
                {slide.visual === "photo-overlay" && slide.imageKey ? (
                  <>
                    <div className="ca-home-frame-hero-offset ca-home-photo-overlay relative z-10 mx-auto w-[92%] max-w-[680px] shadow-[0_24px_60px_rgba(33,30,27,0.10)] ring-1 ring-[var(--ca-line)] sm:w-[88%] lg:ml-auto lg:mr-[4%]">
                      <div className="ca-home-img-hero relative aspect-[3/2] w-full">
                        <Image
                          src={stockImage(slide.imageKey, { w: 1400, q: 85 })}
                          alt={slide.imageAlt}
                          fill
                          priority={index === 0}
                          className="ca-home-photo object-cover object-center"
                          sizes="(max-width: 1024px) 92vw, 46vw"
                        />
                      </div>
                    </div>
                    {slide.overlaySrc ? (
                      <>
                        <svg
                          aria-hidden="true"
                          className="ca-home-connector-curve absolute bottom-[18%] left-[14%] z-20 hidden sm:block lg:left-[10%]"
                          viewBox="0 0 72 48"
                        >
                          <path d="M4 44 C 18 8, 42 8, 68 24" />
                        </svg>
                        <div
                          aria-hidden="true"
                          className="ca-home-connector absolute bottom-[22%] left-[38%] z-20 hidden h-9 w-9 sm:block lg:left-[34%]"
                        />
                        <div className="ca-home-product-ui absolute -bottom-3 left-0 z-30 w-[min(340px,58%)] max-w-[340px] sm:-bottom-4 sm:left-2 lg:-left-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={slide.overlaySrc}
                            alt={slide.overlayAlt ?? ""}
                            width={1440}
                            height={900}
                            className="max-h-[170px] w-full object-cover object-top"
                          />
                        </div>
                      </>
                    ) : null}
                  </>
                ) : null}

                {slide.visual === "tall-arch" && slide.imageKey ? (
                  <div className="ca-practice-stable relative mx-auto max-w-[460px] lg:mr-8 lg:ml-auto">
                    <div aria-hidden="true" className="ca-practice-oracle-panel hidden lg:block" />
                    <div
                      aria-hidden="true"
                      className={cn(
                        "ca-practice-oracle-ring left-[-10%] top-[8%] hidden h-[min(420px,40vw)] w-[min(420px,40vw)] lg:block",
                        !shouldReduceMotion && "ca-decor-orbit",
                      )}
                    />
                    <div className="ca-practice-oracle-arch ca-home-photo-overlay relative z-10 shadow-[0_24px_56px_rgba(33,30,27,0.10)] ring-1 ring-[var(--ca-line)]">
                      <div className="ca-practice-img-oracle relative aspect-[4/5] w-full">
                        <Image
                          src={stockImage(slide.imageKey, { w: 1200, q: 88 })}
                          alt={slide.imageAlt}
                          fill
                          className="ca-home-photo object-cover object-center"
                          sizes="(max-width: 1024px) 90vw, 34vw"
                        />
                      </div>
                    </div>
                    <div className="ca-practice-workflow-panel -bottom-3 -right-2 hidden lg:block">
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={stockImage("oracleWorkflowDetail", { w: 480, q: 85 })}
                          alt="Enterprise finance and operations workflow"
                          fill
                          className="ca-home-photo object-cover object-center"
                          sizes="220px"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                {slide.visual === "product" && slide.productSrc ? (
                  <div className="ca-home-compose ca-practice-stable relative mx-auto max-w-[640px] lg:ml-auto">
                    <div aria-hidden="true" className="ca-practice-ai-panel hidden lg:block" />
                    <PracticeAiPaths
                      className={cn(
                        "ca-practice-ai-paths absolute inset-0 hidden lg:block",
                        !shouldReduceMotion && "ca-decor-drift--slow",
                      )}
                    />
                    <div className="ca-home-product-ui ca-practice-img-ai-ui relative z-10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.productSrc}
                        alt={slide.imageAlt}
                        width={1440}
                        height={900}
                        className="max-h-[420px] w-full object-cover object-top"
                      />
                    </div>
                    {slide.secondaryProductSrc ? (
                      <div className="ca-home-product-ui absolute -bottom-4 -left-2 z-20 hidden w-[220px] sm:block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slide.secondaryProductSrc}
                          alt="Data Agent verification interface"
                          width={800}
                          height={500}
                          className="max-h-[120px] w-full object-cover object-top"
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Story selector — integrated hero chrome, not a detached nav bar */}
        <div className="mt-10 rounded-xl border border-white/12 bg-white/[0.05] px-4 py-4 backdrop-blur-[2px] sm:mt-12 sm:px-5 sm:py-5 lg:mt-14">
          <div className="flex items-center justify-between gap-4">
            <div className="hidden flex-1 grid-cols-3 gap-6 md:grid" role="tablist" aria-label="Hero stories">
              {SLIDES.map((item, i) => {
                const active = i === index;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls={`hero-story-${item.id}`}
                    onClick={() => goTo(i)}
                    className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    <div className="flex items-baseline gap-3">
                      <span
                        className={cn(
                          "text-[0.7rem] font-bold tracking-[0.14em]",
                          active ? "text-white" : "text-white/45",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          active
                            ? "text-white"
                            : "text-white/55 group-hover:text-white",
                        )}
                      >
                        {item.navLabel}
                      </span>
                    </div>
                    <div className="mt-2.5 h-px overflow-hidden bg-white/15">
                      <div
                        key={active ? `progress-${progressKey}` : `idle-${i}`}
                        className={cn(
                          "h-full origin-left bg-[var(--ca-lime)]",
                          active && autoplayActive && "ca-hero-progress-fill",
                          active && !autoplayActive && "w-full",
                          !active && "w-0",
                        )}
                        style={
                          active && !autoplayActive
                            ? undefined
                            : active
                              ? { animationDuration: `${AUTO_MS}ms` }
                              : undefined
                        }
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile simplified nav */}
            <div className="flex flex-1 items-center gap-3 md:hidden">
              <div className="flex gap-2" role="tablist" aria-label="Hero stories">
                {SLIDES.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={item.navLabel}
                    onClick={() => goTo(i)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-lime)]",
                      i === index ? "bg-[var(--ca-lime)]" : "bg-white/30",
                    )}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-white">{slide.navLabel}</p>
            </div>

            <div className="flex items-center gap-2">
              {!isMobile && !shouldReduceMotion ? (
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-lime)]"
                  aria-label={paused ? "Play hero stories" : "Pause hero stories"}
                >
                  {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                </button>
              ) : null}
              <button
                type="button"
                onClick={prev}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-lime)]"
                aria-label="Previous story"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-lime)]"
                aria-label="Next story"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
