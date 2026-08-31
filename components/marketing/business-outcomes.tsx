"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/marketing/SectionLabel";

const outcomes = [
  {
    number: "01",
    title: "TRANSFORM",
    description: "Modernize the processes and platforms at the heart of the enterprise.",
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
    <section className="mkt-section bg-[#FCFCFD] text-[#101828] border-b border-[#E2E7EC]/60">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">Business Outcomes First</SectionLabel>

        {/* Large Editorial Statement */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#101828] sm:text-4xl lg:col-span-7 lg:text-4xl xl:text-[44px] xl:leading-[1.12]"
          >
            Technology transformation should change how the business works — not
            just the systems it runs.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex items-end"
          >
            <p className="text-base leading-relaxed text-[#475467] sm:text-lg">
              We connect strategy, process, enterprise platforms, data, AI and
              engineering so transformation reaches production with less
              friction and more business value.
            </p>
          </motion.div>
        </div>

        {/* 4 Outcome Modules in Large Numbered Editorial Columns */}
        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 border-t border-[#E2E7EC] pt-12">
          {outcomes.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-3xl font-normal text-[#B63838]">
                  {item.number}
                </span>
                <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#101828]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475467]">
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
