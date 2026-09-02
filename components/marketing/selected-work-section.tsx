"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";

const featuredCase = {
  client: "Public Sector Enterprise",
  title: "Multi-Entity Financial Platform Modernization",
  summary:
    "Unified Oracle Fusion ERP foundation with standardized accounting, validation rules, and integration pipelines across operating units.",
  image: stockImage("selectedWorkHero", { w: 1200, q: 85 }),
  href: "/work/case-studies/oracle-cloud-transformation",
};

const supportingCases = [
  {
    industry: "Commercial Contracting",
    headline: "Contract Intelligence & Compliance Analysis",
    href: "/work/case-studies/ai-document-intelligence",
    image: stockImage("selectedWorkProject1", { w: 1000, q: 85 }),
  },
  {
    industry: "Healthcare Technology",
    headline: "Clinical Intake & Patient Guidance Workflows",
    href: "/work/innovation/mediguide-ai",
    image: stockImage("selectedWorkProject2", { w: 1000, q: 85 }),
  },
];

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function SelectedWorkSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="featured-work" className="border-b border-[#E1ECE8] bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
              Featured Work
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
              Solving complex challenges.
              <br />
              Creating lasting value.
            </h2>
            <p className="mt-4 max-w-xl text-base text-[#5B6D6B]">
              Selected examples of strategy, platforms, data, and engineering in delivery.
            </p>
          </div>
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
          >
            Explore all case studies
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <motion.article
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.78, ease: revealEase }}
            className="overflow-hidden rounded-[14px] border border-[#DDE6E3] bg-[#F8FAF9] lg:col-span-7"
          >
            <div className="ca-home-frame-wide ca-home-photo-overlay relative ca-home-img-work h-[280px] sm:h-[340px] lg:h-[400px]">
              <Image
                src={featuredCase.image}
                alt={featuredCase.title}
                fill
                className="ca-home-photo object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                {featuredCase.client}
              </p>
              <h3 className="mt-2 font-serif text-xl font-semibold text-[#073B3A] sm:text-2xl">
                {featuredCase.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5B6D6B]">{featuredCase.summary}</p>
              <Link
                href={featuredCase.href}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#B83A3A] hover:text-[#992F31]"
              >
                Read case study
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>

          <div className="flex flex-col gap-6 lg:col-span-5">
            {supportingCases.map((item, idx) => (
              <motion.article
                key={item.headline}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06, ease: revealEase }}
                className="flex flex-1 overflow-hidden rounded-[14px] border border-[#DDE6E3] bg-[#F8FAF9]"
              >
                <div className="relative h-[140px] w-[38%] shrink-0 sm:h-[160px] lg:h-auto lg:min-h-[180px]">
                  <Image
                    src={item.image}
                    alt={item.headline}
                    fill
                    className="ca-home-photo object-cover"
                    sizes="200px"
                  />
                </div>
                <div className="flex flex-col justify-center p-5">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#176A63]">
                    {item.industry}
                  </p>
                  <h3 className="mt-2 text-sm font-semibold text-[#073B3A] sm:text-base">
                    {item.headline}
                  </h3>
                  <Link
                    href={item.href}
                    className="mt-3 text-xs font-semibold text-[#B83A3A] hover:text-[#992F31]"
                  >
                    View project →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
