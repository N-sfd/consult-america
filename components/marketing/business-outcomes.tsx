"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/marketing/SectionLabel";

const outcomes = [
  {
    number: "01",
    title: "TRANSFORM",
    description: "Modernize the processes and platforms at the heart of enterprise operations.",
  },
  {
    number: "02",
    title: "CONNECT",
    description: "Bring customer, workforce, financial and operational workflows together.",
  },
  {
    number: "03",
    title: "ACTIVATE",
    description: "Turn trusted data and AI into intelligence teams can use every day.",
  },
  {
    number: "04",
    title: "BUILD",
    description: "Create focused digital products where packaged software stops.",
  },
];

export default function BusinessOutcomes() {
  return (
    <section className="bg-[#F7F9FA] text-[#102033] py-20 sm:py-24 lg:py-28 border-b border-[#DDE4E8]">
      <div className="ca-shell">
        <SectionLabel tone="burgundy">Business Outcomes First</SectionLabel>

        {/* Large Editorial Statement */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#102033] sm:text-4xl lg:col-span-7 lg:text-4xl xl:text-[42px] xl:leading-[1.15]"
          >
            Technology transformation should change how the business works — not just the systems it runs.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-5 flex items-end"
          >
            <p className="text-base sm:text-lg leading-relaxed text-[#526170]">
              We connect process, platforms, data and delivery so transformation
              reaches production with less friction and measurable business return.
            </p>
          </motion.div>
        </div>

        {/* 4 Outcome Columns: Typography + Whitespace + Thin Dividers (No colored cards) */}
        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 border-t border-[#DDE4E8] pt-12">
          {outcomes.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#B63A3A]">
                  {item.number}
                </span>
                <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#102033]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#526170]">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
