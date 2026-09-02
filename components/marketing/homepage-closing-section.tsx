"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage, type StockImageKey } from "@/lib/marketing/stock-images";
import { cn } from "@/lib/utils";

const principles = [
  { num: "01", title: "Business context first" },
  { num: "02", title: "Technology depth" },
  { num: "03", title: "Production discipline" },
  { num: "04", title: "Product mindset" },
];

const industries: {
  name: string;
  href: string;
  imageKey: StockImageKey;
}[] = [
  { name: "Public Sector", href: "/industries/government-public-sector", imageKey: "industriesGovernment" },
  { name: "Healthcare & Life Sciences", href: "/industries/healthcare", imageKey: "industriesHealthcare" },
  { name: "Financial Services", href: "/industries/financial-services", imageKey: "industriesFinancial" },
  { name: "Technology & Software", href: "/industries/technology", imageKey: "industriesTech" },
];

const featuredInsight = {
  title: "Operationalizing Enterprise AI: From Experimentation to Production",
  href: "/insights/ai-without-a-data-contract",
  image: stockImage("insightsHero", { w: 1200, q: 85 }),
};

const supportingInsights = [
  { title: "What Oracle Cloud Modernization Requires Beyond Technology", href: "/insights/what-stalls-fusion-programs" },
  { title: "Building Trustworthy Document Intelligence with Source Verification", href: "/insights/cutover-checklists-that-work" },
  { title: "Why Integration Must Come Before Analytics at Scale", href: "/insights/integration-before-analytics" },
];

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function HomepageClosingSection() {
  const [activeIndustry, setActiveIndustry] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const industry = industries[activeIndustry];

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
          <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
            {principles.map((item, index) => (
              <motion.div
                key={item.title}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04, ease: revealEase }}
                className="ca-home-pillar"
              >
                <p className="ca-home-pillar-num">{item.num}</p>
                <p className="ca-home-pillar-label mt-2 text-sm font-semibold uppercase tracking-[0.06em] text-[#073B3A]">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="industries" className="relative overflow-hidden border-b border-[#E1ECE8] bg-[#F7FAF9] py-10 sm:py-12">
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
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
                      key={industry.imageKey}
                      src={stockImage(industry.imageKey, { w: 1000, q: 85 })}
                      alt={industry.name}
                      fill
                      className="ca-home-photo object-cover transition-opacity duration-500"
                      sizes="(max-width: 1024px) 100vw, 38vw"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-7">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">Industries</p>
              <h2 className="mt-2 font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-semibold text-[#073B3A]">
                Technology grounded in industry operations.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5B6D6B]">
                Domain knowledge for complex, regulated, and technology-intensive operations.
              </p>
              <ul className="mt-5 divide-y divide-[#DDE6E3] border-y border-[#DDE6E3]" role="tablist">
                {industries.map((ind, index) => (
                  <li key={ind.name}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={index === activeIndustry}
                      onMouseEnter={() => setActiveIndustry(index)}
                      onFocus={() => setActiveIndustry(index)}
                      onClick={() => setActiveIndustry(index)}
                      className={cn(
                        "ca-home-pillar group flex w-full items-center justify-between py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176A63]",
                        index === activeIndustry && "border-l-2 border-l-[#176A63] pl-3",
                      )}
                    >
                      <span
                        className={cn(
                          "ca-home-pillar-label text-sm font-medium transition-colors",
                          index === activeIndustry ? "text-[#176A63]" : "text-[#073B3A] group-hover:text-[#176A63]",
                        )}
                      >
                        {ind.name}
                      </span>
                      <ArrowUpRight
                        className={cn(
                          "h-4 w-4 text-[#176A63] transition-opacity",
                          index === activeIndustry ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                        )}
                      />
                    </button>
                    <Link href={ind.href} className="sr-only">
                      {ind.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/industries"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
              >
                View all industries
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#E1ECE8] bg-white py-10 sm:py-12">
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

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <motion.article
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: revealEase }}
              className="overflow-hidden rounded-[14px] border border-[#DDE6E3] bg-[#F8FAF9] lg:col-span-7"
            >
              <Link href={featuredInsight.href} className="group block">
                <div className="ca-home-frame-wide ca-home-photo-overlay relative h-[200px] sm:h-[240px]">
                  <Image
                    src={featuredInsight.image}
                    alt=""
                    fill
                    className="ca-home-photo object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">Featured</p>
                  <h3 className="mt-2 font-serif text-lg font-semibold text-[#073B3A] group-hover:text-[#176A63] sm:text-xl">
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
                  key={item.href + item.title}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: revealEase }}
                >
                  <Link
                    href={item.href}
                    className="ca-home-pillar group block border-t border-[#DDE6E3] py-3.5 first:border-t-0 lg:first:border-t"
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
