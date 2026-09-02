"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";

const principles = [
  "Business context first",
  "Technology depth",
  "Production discipline",
  "Product mindset",
];

const industries = [
  { name: "Government & Public Sector", href: "/industries/government-public-sector" },
  { name: "Financial Services", href: "/industries/financial-services" },
  { name: "Healthcare & Life Sciences", href: "/industries/healthcare" },
  { name: "Technology & Software", href: "/industries/technology" },
];

const featuredInsight = {
  title: "Operationalizing Enterprise AI: From Experimentation to Production",
  href: "/insights/ai-without-a-data-contract",
  image: stockImage("insightsHero", { w: 1200, q: 85 }),
};

const supportingInsights = [
  { title: "What Oracle Cloud Modernization Requires Beyond Technology", href: "/insights/what-stalls-fusion-programs" },
  { title: "Building Trustworthy Document Intelligence with Source Verification", href: "/insights/cutover-checklists-that-work" },
];

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function HomepageClosingSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <section className="border-b border-[#E1ECE8] bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
            Why Consult America
          </p>
          <h2 className="mt-2 font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-semibold text-[#073B3A]">
            Built for execution, not just advice.
          </h2>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
            {principles.map((item) => (
              <li key={item} className="text-sm text-[#5B6D6B]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="industries" className="relative overflow-hidden border-b border-[#E1ECE8] bg-[#F7FAF9] py-12 sm:py-14">
        <div
          aria-hidden="true"
          className="ca-home-ring ca-home-orbit -left-[14%] bottom-[-20%] hidden h-[480px] w-[480px] opacity-[0.06] lg:block"
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 18, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.78, ease: revealEase }}
              className="lg:col-span-5"
            >
              <div className="ca-home-compose relative mx-auto max-w-[440px] lg:mx-0">
                <div
                  aria-hidden="true"
                  className="ca-home-sage-disc ca-home-moving--slow -right-[8%] top-[6%] hidden h-[240px] w-[240px] opacity-70 lg:block"
                />
                <div className="ca-home-frame-cut ca-home-photo-overlay relative z-10 shadow-[0_18px_44px_rgba(7,59,58,0.08)] ring-1 ring-[#DDE6E3]">
                  <div className="ca-home-img-major relative aspect-[4/5] w-full">
                    <Image
                      src={stockImage("industriesGovernment", { w: 1000, q: 85 })}
                      alt="Enterprise industry operations"
                      fill
                      className="ca-home-photo object-cover"
                      sizes="(max-width: 1024px) 100vw, 38vw"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-7">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">Industries</p>
              <h2 className="mt-2 font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-semibold text-[#073B3A]">
                Industry practices.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5B6D6B]">
                Domain knowledge for complex, regulated, and technology-intensive operations.
              </p>
              <ul className="mt-6 divide-y divide-[#DDE6E3] border-y border-[#DDE6E3]">
                {industries.map((ind, index) => (
                  <motion.li
                    key={ind.name}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.04, ease: revealEase }}
                  >
                    <Link
                      href={ind.href}
                      className="ca-home-pillar group flex items-center justify-between py-4"
                    >
                      <span className="ca-home-pillar-label text-sm font-medium text-[#073B3A] group-hover:text-[#176A63]">
                        {ind.name}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-[#176A63] opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <Link
                href="/industries"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
              >
                View all industries
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#E1ECE8] bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">Insights</p>
              <h2 className="mt-2 font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-semibold text-[#073B3A]">
                Ideas for modern enterprise technology.
              </h2>
            </div>
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
            >
              Browse all insights
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <motion.article
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: revealEase }}
              className="overflow-hidden rounded-[14px] border border-[#DDE6E3] bg-[#F8FAF9] lg:col-span-7"
            >
              <Link href={featuredInsight.href} className="group block">
                <div className="ca-home-frame-wide ca-home-photo-overlay relative h-[220px] sm:h-[260px]">
                  <Image
                    src={featuredInsight.image}
                    alt=""
                    fill
                    className="ca-home-photo object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">Featured</p>
                  <h3 className="mt-2 font-serif text-xl font-semibold text-[#073B3A] group-hover:text-[#176A63]">
                    {featuredInsight.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#176A63]">
                    Read article
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.article>

            <div className="flex flex-col justify-center gap-0 lg:col-span-5">
              {supportingInsights.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: revealEase }}
                >
                  <Link
                    href={item.href}
                    className="ca-home-pillar group block border-t border-[#DDE6E3] py-4 first:border-t-0 lg:first:border-t"
                  >
                    <p className="ca-home-pillar-label text-sm font-medium text-[#073B3A] group-hover:text-[#176A63]">
                      {item.title}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
