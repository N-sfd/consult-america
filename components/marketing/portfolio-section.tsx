"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const supportingApps = [
  {
    name: "MediGuide AI",
    summary: "Healthcare assistant for structured intake and patient-friendly explanations.",
    href: "/work/innovation/mediguide-ai",
    image: "/innovation/mediguide-hero.png",
  },
  {
    name: "JobLens",
    summary: "Resume analysis, ATS keyword feedback, and job matching.",
    href: "/work/innovation/joblens",
    image: "/innovation/joblens-hero.png",
  },
  {
    name: "Data Explorer",
    summary: "Repository intelligence for searching and comparing enterprise documents.",
    href: "/ai-data",
    image: "/innovation/data-agent-platform.png",
  },
];

export default function PortfolioSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="application-portfolio" className="border-b border-[#E1ECE8] bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="max-w-3xl">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
            Application Development Portfolio
          </p>
          <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
            From idea to working product.
          </h2>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-[#5B6D6B]">
            Consult America Labs builds focused enterprise applications around real operational
            problems — we don&apos;t only advise, we build.
          </p>
        </div>

        {/* Flagship: Data Agent */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10"
        >
          <div className="lg:col-span-5">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
              Featured Product
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold text-[#073B3A]">Data Agent</h3>
            <p className="mt-3 text-base leading-relaxed text-[#5B6D6B]">
              Turn complex documents into usable intelligence.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
              {["Extract", "Verify", "Compare", "Explore"].map((cap) => (
                <li key={cap} className="text-xs font-bold uppercase tracking-[0.12em] text-[#073B3A]">
                  {cap}
                </li>
              ))}
            </ul>
            <Link
              href="/work/innovation/data-agent"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
            >
              Explore Data Agent
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-[11px] border border-[#DDE6E3] bg-white p-2 shadow-[0_18px_50px_rgba(7,59,58,0.08)]">
              <img
                src="/innovation/data-agent-hero.png"
                alt="Data Agent document intelligence interface"
                width={1440}
                height={900}
                loading="lazy"
                decoding="async"
                className="h-auto w-full rounded-[8px]"
              />
            </div>
          </div>
        </motion.div>

        {/* Supporting products */}
        <div className="mt-12 border-t border-[#E1ECE8] pt-10">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
            Strategic Applications
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {supportingApps.map((app) => (
              <Link
                key={app.name}
                href={app.href}
                className="group rounded-[12px] border border-[#DDE6E3] bg-[#F7FAF9] p-3 transition-shadow hover:shadow-[0_12px_32px_rgba(7,59,58,0.06)]"
              >
                <div className="overflow-hidden rounded-[8px] border border-[#DDE6E3] bg-white">
                  <Image
                    src={app.image}
                    alt={app.name}
                    width={1440}
                    height={900}
                    className="h-[120px] w-full object-contain object-top sm:h-[130px]"
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-[#073B3A] group-hover:text-[#176A63]">
                  {app.name}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#5B6D6B]">{app.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
