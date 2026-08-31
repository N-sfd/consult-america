"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const capabilityPillars = [
  { name: "ORACLE", href: "/oracle" },
  { name: "CRM", href: "/platforms/crm" },
  { name: "AI & DATA", href: "/ai-data" },
  { name: "CLOUD", href: "/capabilities/digital-engineering" },
  { name: "INTEGRATION", href: "/capabilities/digital-engineering" },
  { name: "APPLICATION ENGINEERING", href: "/capabilities/digital-engineering" },
];

export default function TrustCredibility() {
  return (
    <section className="border-b border-[#DCE4E1] bg-[#FFFFFF] py-6 sm:py-7">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#103F3E]" />
            <p className="text-[0.68rem] sm:text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#596968]">
              ENTERPRISE TECHNOLOGY ACROSS THE MODERN STACK
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-y-2 text-xs font-semibold text-[#163536] md:justify-end">
            {capabilityPillars.map((item, idx) => (
              <div key={item.name} className="inline-flex items-center">
                <Link
                  href={item.href}
                  className="transition-colors hover:text-[#B63A3A] px-3 py-1"
                >
                  {item.name}
                </Link>
                {idx < capabilityPillars.length - 1 && (
                  <span className="text-[#DCE4E1] font-normal select-none" aria-hidden="true">
                    /
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
