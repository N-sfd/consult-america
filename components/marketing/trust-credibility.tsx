"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const capabilities = [
  { name: "Oracle", href: "/oracle" },
  { name: "CRM", href: "/platforms/crm" },
  { name: "AI & Data", href: "/ai-data" },
  { name: "Cloud", href: "/capabilities/digital-engineering" },
  { name: "APIs", href: "/capabilities/digital-engineering" },
  { name: "Digital Engineering", href: "/capabilities/digital-engineering" },
];

export default function TrustCredibility() {
  return (
    <section className="border-y border-[#D7CCBD] bg-[#FFFAF2] py-8 sm:py-10">
      <div className="mkt-shell">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-center text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#695F57] md:text-left">
            ENTERPRISE CAPABILITY ACROSS THE DIGITAL CORE
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:justify-end">
            {capabilities.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
              >
                <Link
                  href={item.href}
                  className="inline-flex items-center rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] px-3.5 py-1.5 text-xs font-bold text-[#261F1B] transition-all hover:border-[#7D2639] hover:text-[#7D2639] hover:shadow-xs"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
