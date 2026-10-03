"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { caseStudies } from "@/data/case-studies";
import { useStableReducedMotion } from "@/lib/marketing/use-stable-reduced-motion";
import { cn } from "@/lib/utils";

const stories = [
  caseStudies["public-sector-finance-procurement"],
  caseStudies["oracle-cloud-transformation"],
  caseStudies["ai-document-intelligence"],
].filter(Boolean);

const visuals: Record<string, { src: string; alt: string; product?: boolean }> = {
  "public-sector-finance-procurement": {
    src: "/company/source/finance-workplace.jpg",
    alt: "Enterprise finance and operations workplace",
  },
  "oracle-cloud-transformation": {
    src: "/company/source/connected-systems.jpg",
    alt: "Connected enterprise operations environment",
  },
  "ai-document-intelligence": {
    src: "/innovation/data-agent-hero.png",
    alt: "Data Agent document intelligence interface",
    product: true,
  },
};

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function SelectedWorkSection() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useStableReducedMotion();
  const story = stories[index];

  const goTo = useCallback((next: number) => {
    setIndex(((next % stories.length) + stories.length) % stories.length);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  };

  if (!story) return null;

  const visual = visuals[story.slug] ?? {
    src: story.image,
    alt: story.imageAlt,
  };
  const outcome = story.outcomes[0];

  return (
    <section
      id="featured-work"
      className="border-b border-[var(--ca-line)] bg-[var(--ca-canvas)] py-12 sm:py-14 lg:py-16"
      onKeyDown={onKeyDown}
    >
      <div className="mkt-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
              Selected Work
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.875rem,3.2vw,2.75rem)] font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
              Problem, system, and result.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--ca-text-secondary)]">
              Representative engagement patterns from enterprise programs. No invented client scores.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold tabular-nums text-[var(--ca-text-secondary)]">
              {String(index + 1).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous work"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ca-line)] bg-white text-[var(--ca-ink)] hover:border-[var(--ca-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-lime)]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next work"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ca-line)] bg-white text-[var(--ca-ink)] hover:border-[var(--ca-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-lime)]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={story.slug}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.15 : 0.4, ease: revealEase }}
              className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-5">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
                  {String(index + 1).padStart(2, "0")} / {story.category}
                </p>
                <h3 className="mt-3 font-serif text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
                  {story.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ca-text-secondary)]">{story.headline}</p>

                <dl className="mt-6 space-y-4 border-t border-[var(--ca-line)] pt-5">
                  <div>
                    <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--ca-teal)]">Problem</dt>
                    <dd className="mt-1 line-clamp-3 text-sm leading-relaxed text-[var(--ca-ink)]">{story.challenge}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--ca-teal)]">What we built</dt>
                    <dd className="mt-1 line-clamp-3 text-sm leading-relaxed text-[var(--ca-ink)]">{story.solution}</dd>
                  </div>
                  {outcome ? (
                    <div>
                      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--ca-teal)]">Outcome</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-[var(--ca-ink)]">
                        <span className="font-semibold">{outcome.title}. </span>
                        {outcome.description}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {story.capabilities.slice(0, 4).map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-[var(--ca-line)] bg-white px-3 py-1 text-xs font-semibold text-[var(--ca-ink)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/work/case-studies/${story.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ca-teal)] hover:text-[var(--ca-ink)]"
                >
                  View work
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="lg:col-span-7">
                <div
                  className={cn(
                    "relative overflow-hidden bg-white shadow-[0_18px_44px_rgba(16,47,53,0.08)] ring-1 ring-[var(--ca-line)]",
                    visual.product ? "rounded-md" : "ca-home-frame-wide",
                  )}
                >
                  <div className={cn("relative w-full", visual.product ? "aspect-[16/10]" : "aspect-[16/11]")}>
                    <Image
                      src={visual.src}
                      alt={visual.alt}
                      fill
                      unoptimized={visual.src.endsWith(".jpg")}
                      className={cn(
                        "transition-transform duration-700 hover:scale-[1.02]",
                        visual.product ? "object-contain object-top bg-white" : "ca-home-photo object-cover",
                      )}
                      sizes="(max-width: 1024px) 100vw, 54vw"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex gap-2" role="tablist" aria-label="Selected work">
          {stories.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={item.title}
              onClick={() => goTo(i)}
              className={cn(
                "h-1 max-w-[72px] flex-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-lime)]",
                i === index ? "bg-[var(--ca-teal)]" : "bg-[var(--ca-line)]",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
