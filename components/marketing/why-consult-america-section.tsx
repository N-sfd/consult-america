"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/marketing/SectionLabel";

const differentiators = [
  {
    num: "01",
    title: "PRACTITIONERS IN THE WORK",
    description:
      "Senior architects and delivery leaders stay directly embedded in delivery rather than handing off to junior teams after the sale.",
  },
  {
    num: "02",
    title: "ENTERPRISE PLATFORMS + CUSTOM INNOVATION",
    description:
      "Deep Oracle, CRM, and ERP breadth combined with our own Labs engineering capability for workflows where packaged software stops.",
  },
  {
    num: "03",
    title: "AI GROUNDED IN REAL OPERATIONS",
    description:
      "Document intelligence, task-oriented agents, and data pipelines built for accuracy, compliance, and real user adoption.",
  },
  {
    num: "04",
    title: "ACCOUNTABILITY TO PRODUCTION",
    description:
      "We measure success by systems adopted, processes streamlined, and business metrics achieved in live operational environments.",
  },
];

export default function WhyConsultAmericaSection() {
  return (
    <section id="why-consult-america" className="mkt-section bg-[#FCFCFD] text-[#101828] border-y border-[#E2E7EC]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">Why Consult America</SectionLabel>

        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="font-serif text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl"
          >
            Built for execution, not just advice.
          </motion.h2>
          <p className="max-w-md text-sm text-[#475467] sm:text-base">
            What makes our consulting and engineering model distinct for enterprise clients.
          </p>
        </div>

        {/* 4 Editorial Manifesto Rows with Thin Borders */}
        <div className="mt-16 divide-y divide-[#E2E7EC] border-y border-[#E2E7EC]">
          {differentiators.map((diff, idx) => (
            <motion.div
              key={diff.num}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-12 sm:items-baseline sm:gap-8"
            >
              <div className="sm:col-span-2">
                <span className="font-serif text-2xl font-normal text-[#B63838] sm:text-3xl">
                  {diff.num}
                </span>
              </div>
              <div className="sm:col-span-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#101828]">
                  {diff.title}
                </h3>
              </div>
              <div className="sm:col-span-6">
                <p className="text-sm leading-relaxed text-[#475467] sm:text-base">
                  {diff.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
