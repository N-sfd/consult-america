"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const platforms = [
  { name: "Oracle", href: "/oracle" },
  { name: "CRM", href: "/platforms/crm" },
  { name: "AI", href: "/ai-data" },
  { name: "Data", href: "/ai-data" },
  { name: "Cloud", href: "/capabilities/digital-engineering" },
  { name: "Integration", href: "/capabilities/digital-engineering" },
  { name: "Digital Engineering", href: "/capabilities/digital-engineering" },
];

export default function TrustCredibility() {
  return (
    <section className="border-b border-[#D8D0C5] bg-[#FFFDF8] py-6 sm:py-7">
      <div className="ca-shell">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B63A3A]" />
            <p className="text-[0.68rem] sm:text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#695F57]">
              ENTERPRISE TECHNOLOGY ACROSS THE MODERN STACK
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:justify-end">
            {platforms.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 4 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
              >
                <Link
                  href={item.href}
                  className="inline-flex items-center rounded border border-[#D8D0C5] bg-[#F7F3EC] px-3 py-1 text-xs font-semibold text-[#261F1B] transition-all hover:border-[#B63A3A] hover:text-[#B63A3A] hover:bg-white"
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
