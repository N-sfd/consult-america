"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import Reveal from "@/components/marketing/inner-page/reveal";
import { portfolioProjects } from "@/lib/marketing/portfolio-data";
import { stockImage } from "@/lib/marketing/stock-images";

const strategicApps = [
  { name: "MediGuide AI", href: "/work/innovation/mediguide-ai", image: "/innovation/mediguide-hero.png" },
  { name: "JobLens", href: "/work/innovation/joblens", image: "/innovation/joblens-hero.png" },
  { name: "Data Explorer", href: "/ai-data", image: "/innovation/data-agent-platform.png" },
  { name: "Convera", href: "/capabilities/digital-engineering", image: "/innovation/data-agent-platform.png" },
];

const otherApps = portfolioProjects.filter((project) => project.tier === 3);
const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function ApplicationEngineeringSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="application-engineering" className="relative overflow-hidden border-b border-[#E1ECE8] bg-[#F8FAF9] py-14 sm:py-16 lg:py-20">
      <div
        aria-hidden="true"
        className="ca-home-sage-disc ca-home-moving--slow -bottom-[12%] -right-[6%] hidden h-[330px] w-[330px] opacity-60 lg:block"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
              Application Engineering
            </p>
            <h2 className="mt-3 max-w-xl font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
              We build where packaged software stops.
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
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.12, ease: revealEase }}
                className="ca-home-product-ui absolute -bottom-3 -right-1 z-20 hidden w-[min(280px,48%)] sm:block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/innovation/mediguide-hero.png"
                  alt="MediGuide AI application interface"
                  width={800}
                  height={500}
                  loading="lazy"
                  className="max-h-[150px] w-full object-cover object-top"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Data Agent flagship stage */}
        <div className="ca-home-product-stage mt-14 lg:mt-16">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <Reveal delay={0.06} className="lg:col-span-5">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#9BC4B8]">Flagship</p>
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

        {/* Strategic products */}
        <div className="mt-14 border-t border-[#E1ECE8] pt-12">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
            Strategic Products
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {strategicApps.map((app, index) => (
              <Reveal key={app.name} delay={index * 0.06}>
                <Link
                  href={app.href}
                  className="group block rounded-xl border border-[#DDE6E3] bg-white p-3 transition-shadow hover:shadow-[0_12px_32px_rgba(7,59,58,0.08)]"
                >
                  <div className="ca-home-product-ui overflow-hidden bg-[#F6F9F8]">
                    <Image
                      src={app.image}
                      alt={app.name}
                      width={640}
                      height={400}
                      className="h-[130px] w-full object-contain object-top sm:h-[150px]"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-[#073B3A] group-hover:text-[#176A63]">
                    {app.name}
                  </h4>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Other portfolio */}
        <div className="mt-10">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5B6D6B]">
            Other Applications
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {otherApps.map((app) => (
              <a
                key={app.id}
                href={app.liveUrl ?? app.detailHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#E1ECE8] bg-white px-3 py-1.5 text-xs font-medium text-[#5B6D6B] transition-colors hover:border-[#176A63] hover:text-[#176A63]"
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
