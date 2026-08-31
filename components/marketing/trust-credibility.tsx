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
    <section className="border-y border-[#E2E7EC] bg-[#FFFFFF] py-7 sm:py-8">
      <div className="mkt-shell">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <p className="text-center text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#475467] md:text-left">
            ENTERPRISE CAPABILITY ACROSS THE DIGITAL CORE
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 md:justify-end">
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
                  className="inline-flex items-center rounded-md border border-[#E2E7EC] bg-[#F7F8FA] px-3.5 py-1.5 text-xs font-semibold text-[#101828] transition-all hover:border-[#B63838] hover:text-[#B63838] hover:bg-[#FFFFFF]"
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
