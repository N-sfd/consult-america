"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const featuredIndustries = [
  {
    name: "Government & Public Sector",
    description: "Modernizing core state and federal systems, grant disbursement, FAR/DFARS compliance, and public civilian workflows.",
    href: "/industries/public-sector",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    badge: "FedRAMP & FISMA",
    span: "lg:col-span-6",
    aspect: "aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[380px]",
  },
  {
    name: "Financial Services",
    description: "Multi-entity Fusion ERP accounting, automated compliance, and unified banking CRM.",
    href: "/industries/financial-services",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    badge: "SOX & Period Close",
    span: "lg:col-span-3",
    aspect: "aspect-[4/5] lg:h-[380px]",
  },
  {
    name: "Healthcare & Life Sciences",
    description: "Clinical documentation intelligence, patient record pipelines, and HIPAA compliance.",
    href: "/industries/healthcare",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    badge: "HIPAA Compliant AI",
    span: "lg:col-span-3",
    aspect: "aspect-[4/5] lg:h-[380px]",
  },
];

const secondaryIndustries = [
  {
    name: "Technology & Software",
    description: "Full-stack digital engineering, API platform ecosystems, modern data architecture, and AI scale.",
    href: "/industries/technology",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    badge: "Cloud Native & APIs",
  },
  {
    name: "Retail & Commerce",
    description: "Omnichannel inventory synchronization, supplier procurement portals, and customer lifetime value.",
    href: "/platforms/crm",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    badge: "Supply Chain & SCM",
  },
  {
    name: "Professional Services",
    description: "Project costing and billing, utilization analytics, and automated applicant tracking pipelines.",
    href: "/platforms/ats",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    badge: "PPM & Workforce",
  },
];

export default function IndustriesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="industries" className="bg-[#F7F3EC] text-[#261F1B] py-24 sm:py-28 lg:py-32 border-b border-[#D7CCBD]">
      <div className="mkt-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-10 border-b border-[#D7CCBD]">
          <div>
            <SectionLabel tone="burgundy">INDUSTRIES</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#261F1B] sm:text-4xl lg:text-5xl">
              Domain depth where operations matter most.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#695F57]">
            Vertical expertise combining strict regulatory compliance, industry standards, and production execution.
          </p>
        </div>

        {/* Editorial Image Grid */}
        <div className="mt-14 space-y-6">
          {/* Row 1: Featured 50% / 25% / 25% */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
            {featuredIndustries.map((ind, idx) => (
              <motion.div
                key={ind.name}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={ind.span}
              >
                <Link
                  href={ind.href}
                  className={`group relative block w-full overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#211E1B] shadow-[0_12px_36px_rgba(38,31,27,0.08)] ${ind.aspect}`}
                >
                  <Image
                    src={ind.image}
                    alt={ind.name}
                    fill
                    className="object-cover mkt-img-graded transition-transform duration-700 group-hover:scale-103"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211E1B]/95 via-[#211E1B]/55 to-transparent transition-opacity duration-300 group-hover:from-[#211E1B]/98" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div className="flex justify-end">
                      <span className="rounded-full bg-white/10 backdrop-blur-md px-2.5 py-1 text-[0.62rem] font-bold tracking-wider text-[#D8C5AA] border border-white/15">
                        {ind.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight group-hover:text-[#D8C5AA] transition-colors">
                        {ind.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#C5BCB3] line-clamp-2">
                        {ind.description}
                      </p>
                      <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold text-[#D8C5AA]">
                        <span>View industry</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Row 2: Secondary 33% / 33% / 33% */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondaryIndustries.map((ind, idx) => (
              <motion.div
                key={ind.name}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.08 }}
              >
                <Link
                  href={ind.href}
                  className="group relative block aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#211E1B] shadow-[0_12px_36px_rgba(38,31,27,0.08)]"
                >
                  <Image
                    src={ind.image}
                    alt={ind.name}
                    fill
                    className="object-cover mkt-img-graded transition-transform duration-700 group-hover:scale-103"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211E1B]/95 via-[#211E1B]/55 to-transparent transition-opacity duration-300 group-hover:from-[#211E1B]/98" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div className="flex justify-end">
                      <span className="rounded-full bg-white/10 backdrop-blur-md px-2.5 py-1 text-[0.62rem] font-bold tracking-wider text-[#D8C5AA] border border-white/15">
                        {ind.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-[#D8C5AA] transition-colors">
                        {ind.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#C5BCB3] line-clamp-2">
                        {ind.description}
                      </p>
                      <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold text-[#D8C5AA]">
                        <span>View industry</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
