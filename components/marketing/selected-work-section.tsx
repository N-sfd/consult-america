"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { caseStudies } from "@/data/case-studies";
import { cn } from "@/lib/utils";

const stories = [
  caseStudies["oracle-cloud-transformation"],
  caseStudies["ai-document-intelligence"],
  caseStudies["public-sector-finance-procurement"],
].filter(Boolean);

const AUTO_MS = 9000;
const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function SelectedWorkSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const story = stories[index];
  const supporting = stories.filter((_, i) => i !== index);

  const goTo = useCallback((next: number) => {
    setIndex(((next % stories.length) + stories.length) % stories.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || shouldReduceMotion) return;
    const timer = window.setTimeout(next, AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [index, next, paused, shouldReduceMotion]);

  if (!story) return null;

  return (
    <section
      id="featured-work"
      className="border-b border-[#E1ECE8] bg-white py-12 sm:py-14 lg:py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
              Featured Work
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
              Real transformation.
              <br />
              Practical outcomes.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold tabular-nums text-[#5B6D6B]">
              {String(index + 1).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous story"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DDE6E3] bg-white text-[#073B3A] hover:border-[#176A63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176A63]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next story"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DDE6E3] bg-white text-[#073B3A] hover:border-[#176A63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176A63]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="relative lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={story.slug}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, ease: revealEase }}
                className="ca-home-frame-wide ca-home-photo-overlay relative ca-home-img-work h-[240px] sm:h-[300px] lg:h-[360px] shadow-[0_18px_44px_rgba(7,59,58,0.08)] ring-1 ring-[#DDE6E3]"
              >
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  className="ca-home-photo object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${story.slug}-copy`}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: shouldReduceMotion ? 0.2 : 0.55, ease: revealEase }}
              >
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                  {story.category}
                </p>
                <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-[#073B3A] sm:text-2xl">
                  {story.headline}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#5B6D6B]">
                  {story.summary}
                </p>

                <dl className="mt-5 space-y-2 border-t border-[#DDE6E3] pt-4">
                  <div>
                    <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#8A9A97]">
                      Capabilities
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-[#073B3A]">
                      {story.capabilities.slice(0, 4).join(" · ")}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/work/case-studies/${story.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#B83A3A] hover:text-[#992F31]"
                >
                  Read Story
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 hidden space-y-2 lg:block">
              {supporting.map((item) => {
                const idx = stories.findIndex((s) => s.slug === item.slug);
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => goTo(idx)}
                    className="flex w-full items-start gap-3 rounded-lg border border-[#E1ECE8] bg-[#F8FAF9] p-3 text-left transition-colors hover:border-[#176A63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176A63]"
                  >
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="ca-home-photo object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.62rem] font-bold uppercase tracking-[0.1em] text-[#176A63]">
                        {item.category}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-[#073B3A]">
                        {item.headline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2" role="tablist" aria-label="Featured stories">
          {stories.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={item.title}
              onClick={() => goTo(i)}
              className={cn(
                "h-1 flex-1 max-w-[72px] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176A63]",
                i === index ? "bg-[#176A63]" : "bg-[#DDE6E3] hover:bg-[#C9DDD7]",
              )}
            />
          ))}
        </div>

        <Link
          href="/work"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
        >
          Explore all case studies
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
