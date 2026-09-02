"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import Reveal from "@/components/marketing/inner-page/reveal";
import { portfolioProjects } from "@/lib/marketing/portfolio-data";
import { stockImage } from "@/lib/marketing/stock-images";
import { cn } from "@/lib/utils";

const strategicApps = portfolioProjects.filter((p) => p.tier === 2);
const otherApps = portfolioProjects.filter((p) => p.tier === 3);
const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function ApplicationEngineeringSection() {
  const [active, setActive] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const current = strategicApps[active] ?? strategicApps[0];

  const next = () => setActive((i) => (i + 1) % strategicApps.length);
  const prev = () => setActive((i) => (i - 1 + strategicApps.length) % strategicApps.length);

  return (
    <section
      id="application-engineering"
      className="relative overflow-hidden border-b border-[#E1ECE8] bg-white py-14 sm:py-16 lg:py-20"
    >
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        {/* Engineering composition */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
              Application Engineering
            </p>
            <h2 className="mt-3 max-w-xl font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
              Build where packaged software stops.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[#5B6D6B]">
              Engineering teams attached to delivery — building focused applications around real
              operational workflows.
            </p>
            <Link
              href="/work/innovation"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
            >
              View application portfolio
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.78, ease: revealEase }}
            className="lg:col-span-7"
          >
            <div className="ca-home-compose relative mx-auto max-w-[590px] lg:ml-auto lg:mr-0">
              <div
                aria-hidden="true"
                className="ca-home-sage-disc ca-home-moving--fast -left-[10%] bottom-0 hidden h-[260px] w-[260px] opacity-70 lg:block"
              />
              <div className="ca-home-frame-apps ca-home-photo-overlay relative z-10 shadow-[0_20px_48px_rgba(7,59,58,0.10)] ring-1 ring-[#DDE6E3]">
                <div className="ca-home-img-major relative aspect-[3/2] w-full max-h-[420px]">
                  <Image
                    src={stockImage("capabilitiesBuild", { w: 1200, q: 85 })}
                    alt="Engineering team building enterprise applications"
                    fill
                    className="ca-home-photo object-cover"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                </div>
              </div>
              <div className="ca-home-product-ui absolute -bottom-3 -right-1 z-20 hidden w-[min(280px,48%)] sm:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/innovation/mediguide-hero.png"
                  alt="MediGuide AI application interface"
                  width={800}
                  height={500}
                  loading="lazy"
                  className="max-h-[150px] w-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Data Agent flagship */}
        <div className="ca-home-product-stage mt-14 lg:mt-16">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <Reveal delay={0.06} className="lg:col-span-5">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#9BC4B8]">
                Flagship
              </p>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-white">Data Agent</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-white/78">
                Turn complex documents into usable intelligence with source grounding and human review.
              </p>
              <Link
                href="/work/innovation/data-agent"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#9BC4B8] hover:text-white"
              >
                Explore Data Agent
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <Reveal delay={0.1} className="relative lg:col-span-7">
              <div
                aria-hidden="true"
                className="ca-home-sage-panel absolute -right-4 top-4 hidden h-[280px] w-[160px] opacity-30 lg:block"
              />
              <div className="ca-home-product-ui relative z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/innovation/data-agent-hero.png"
                  alt="Data Agent document intelligence interface"
                  width={1440}
                  height={900}
                  loading="lazy"
                  className="max-h-[440px] w-full"
                />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Strategic product showcase — manual carousel */}
        <div className="relative mt-14 overflow-hidden border-t border-[#E1ECE8] pt-12">
          <div
            aria-hidden="true"
            className="ca-home-sage-disc ca-home-moving--slow -right-[8%] top-[20%] hidden h-[360px] w-[360px] opacity-50 lg:block"
          />

          <div className="relative z-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                Strategic Products
              </p>
              <h3 className="mt-2 font-serif text-xl font-semibold text-[#073B3A] sm:text-2xl">
                Applications shaped around real work.
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous product"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DDE6E3] bg-white text-[#073B3A] hover:border-[#176A63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176A63]"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next product"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DDE6E3] bg-white text-[#073B3A] hover:border-[#176A63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176A63]"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid gap-4 lg:grid-cols-12">
            <AnimatePresence mode="wait">
              <motion.article
                key={current.id}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -14 }}
                transition={{ duration: 0.45, ease: revealEase }}
                className="overflow-hidden rounded-[16px] border border-[#DDE6E3] bg-[#F8FAF9] lg:col-span-7"
              >
                <div className="ca-home-product-ui m-3 overflow-hidden bg-[#F6F9F8] sm:m-4">
                  <Image
                    src={current.image}
                    alt={current.imageAlt}
                    width={960}
                    height={600}
                    className="h-[220px] w-full object-contain object-top sm:h-[260px]"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
                <div className="px-5 pb-6 sm:px-6">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                    {current.categoryLabel}
                  </p>
                  <h4 className="mt-2 font-serif text-xl font-semibold text-[#073B3A]">
                    {current.name}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#5B6D6B]">{current.summary}</p>
                  <Link
                    href={current.detailHref}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#B83A3A] hover:text-[#992F31]"
                  >
                    View Product
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            </AnimatePresence>

            <div className="hidden flex-col gap-3 lg:col-span-5 lg:flex">
              {strategicApps
                .filter((_, i) => i !== active)
                .slice(0, 2)
                .map((app) => {
                  const idx = strategicApps.findIndex((p) => p.id === app.id);
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setActive(idx)}
                      className="flex flex-1 overflow-hidden rounded-[14px] border border-[#DDE6E3] bg-[#F8FAF9] text-left transition-shadow hover:shadow-[0_12px_28px_rgba(7,59,58,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176A63]"
                    >
                      <div className="relative h-full min-h-[110px] w-[42%] shrink-0 bg-[#F6F9F8]">
                        <Image
                          src={app.image}
                          alt=""
                          fill
                          className="object-cover object-top"
                          sizes="180px"
                        />
                      </div>
                      <div className="flex flex-col justify-center p-4">
                        <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#176A63]">
                          {app.categoryLabel}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#073B3A]">{app.name}</p>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="relative z-10 mt-5 flex justify-center gap-2 lg:hidden">
            {strategicApps.map((app, i) => (
              <button
                key={app.id}
                type="button"
                aria-label={app.name}
                aria-current={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "h-2 w-2 rounded-full",
                  i === active ? "bg-[#176A63]" : "bg-[#C9DDD7]",
                )}
              />
            ))}
          </div>
        </div>

        {/* Broader portfolio */}
        <div className="mt-12">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5B6D6B]">
            Broader Portfolio
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {otherApps.map((app) => (
              <a
                key={app.id}
                href={app.liveUrl ?? app.detailHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-[#E1ECE8] bg-[#F8FAF9] px-3 py-1.5 text-xs font-medium text-[#5B6D6B] transition-colors hover:border-[#176A63] hover:text-[#176A63]"
              >
                {app.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
