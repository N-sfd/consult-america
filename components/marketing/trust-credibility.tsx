"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const capabilities = [
  { name: "Oracle Fusion Cloud", href: "/oracle" },
  { name: "Enterprise CRM & CX", href: "/platforms/crm" },
  { name: "AI & Governed Data", href: "/ai-data" },
  { name: "Cloud Infrastructure", href: "/capabilities/digital-engineering" },
  { name: "API Integration & OIC", href: "/capabilities/digital-engineering" },
  { name: "Full-Stack Digital Engineering", href: "/capabilities/digital-engineering" },
];

export default function TrustCredibility() {
  return (
    <section className="border-b border-[#D7CCBD] bg-[#FFFDF8] py-6 sm:py-7">
      <div className="mkt-shell">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7D2639]" />
            <p className="text-center text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#695F57] md:text-left">
              ENTERPRISE CAPABILITY ACROSS THE DIGITAL CORE
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 md:justify-end">
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
                  className="inline-flex items-center rounded-md border border-[#D7CCBD] bg-[#FFFAF2] px-3 py-1 text-xs font-semibold text-[#261F1B] transition-all hover:border-[#7D2639] hover:text-[#7D2639] hover:bg-[#FFFDF8]"
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
