"use client";

import Image from "next/image";
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
    <section className="relative overflow-hidden bg-[#FFFDF8] text-[#261F1B] py-20 sm:py-24 border-b border-[#D7CCBD]/80">
      {/* Extremely Subtle Architectural Texture (5–8% Opacity) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06]">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
          alt="Modern corporate architectural environment"
          fill
          className="object-cover object-center grayscale contrast-125"
          sizes="100vw"
        />
      </div>

      <div className="mkt-shell relative z-10">
        <SectionLabel tone="burgundy">Business Outcomes First</SectionLabel>

        {/* Large Editorial Statement */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#261F1B] sm:text-4xl lg:col-span-7 lg:text-4xl xl:text-[44px] xl:leading-[1.12]"
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
            <p className="text-base leading-relaxed text-[#695F57] sm:text-lg">
              We connect strategy, process, enterprise platforms, data, AI and
              engineering so transformation reaches production with less
              friction and more measurable business value.
            </p>
          </motion.div>
        </div>

        {/* 4 Outcome Modules in Large Numbered Editorial Columns */}
        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 border-t border-[#D7CCBD] pt-12">
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
                <span className="font-serif text-3xl font-normal text-[#7D2639]">
                  {item.number}
                </span>
                <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#261F1B]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#695F57]">
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
