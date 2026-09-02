"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import ImageReveal from "@/components/marketing/inner-page/image-reveal";
import Reveal from "@/components/marketing/inner-page/reveal";
import SectionBackdrop from "@/components/marketing/section-backdrop";
import { portfolioProjects } from "@/lib/marketing/portfolio-data";

const strategicApps = [
  { name: "MediGuide AI", href: "/work/innovation/mediguide-ai", image: "/innovation/mediguide-hero.png" },
  { name: "JobLens", href: "/work/innovation/joblens", image: "/innovation/joblens-hero.png" },
  { name: "Data Explorer", href: "/ai-data", image: "/innovation/data-agent-platform.png" },
  { name: "Convera", href: "/capabilities/digital-engineering", image: "/innovation/data-agent-platform.png" },
];

const otherApps = portfolioProjects.filter((project) => project.tier === 3);

export default function ApplicationEngineeringSection() {
  return (
    <section id="application-engineering" className="relative overflow-hidden border-b border-[#E1ECE8] bg-white py-14 sm:py-16 lg:py-20">
      <SectionBackdrop variant="soft" />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <Reveal>
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
            Application Engineering
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
            We build where packaged software stops.
          </h2>
        </Reveal>

        {/* Flagship */}
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal delay={0.06} className="lg:col-span-5">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">Flagship</p>
            <h3 className="mt-2 font-serif text-2xl font-semibold text-[#073B3A]">Data Agent</h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-[#5B6D6B]">
              Turn complex documents into usable intelligence with source grounding and human review.
            </p>
            <Link
              href="/work/innovation/data-agent"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
            >
              Explore Data Agent
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <ImageReveal delay={0.1} className="lg:col-span-7">
            <div className="ca-product-frame mx-auto max-h-[460px] max-w-[680px] lg:ml-auto lg:mr-0">
              <img
                src="/innovation/data-agent-hero.png"
                alt="Data Agent document intelligence interface"
                width={1440}
                height={900}
                loading="lazy"
                decoding="async"
                className="h-auto max-h-[440px] w-full rounded-[10px] object-cover object-top"
              />
            </div>
          </ImageReveal>
        </div>

        {/* Strategic */}
        <div className="mt-14 border-t border-[#E1ECE8] pt-12">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
            Strategic Products
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {strategicApps.map((app, index) => (
              <Reveal key={app.name} delay={index * 0.06}>
                <Link
                  href={app.href}
                  className="group block rounded-xl border border-[#DDE6E3] bg-[#F8FAF9] p-3 transition-shadow hover:shadow-[0_12px_32px_rgba(7,59,58,0.08)]"
                >
                  <div className="ca-product-frame overflow-hidden">
                    <Image
                      src={app.image}
                      alt={app.name}
                      width={640}
                      height={400}
                      className="h-[130px] w-full object-cover object-top sm:h-[150px]"
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
                className="rounded-full border border-[#E1ECE8] bg-[#F8FAF9] px-3 py-1.5 text-xs font-medium text-[#5B6D6B] transition-colors hover:border-[#176A63] hover:text-[#176A63]"
              >
                {app.name}
              </a>
            ))}
          </div>
          <Link
            href="/work/innovation"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
          >
            View application portfolio
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
