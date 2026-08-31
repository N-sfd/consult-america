"use client";

import { motion, useReducedMotion } from "framer-motion";

const outcomes = [
  {
    number: "01",
    title: "TRANSFORM",
    description:
      "Modernize the processes and platforms at the heart of the enterprise.",
  },
  {
    number: "02",
    title: "CONNECT",
    description:
      "Bring customer, financial, workforce and operational workflows together.",
  },
  {
    number: "03",
    title: "ACTIVATE",
    description:
      "Turn trusted data and AI into intelligence teams can use daily.",
  },
  {
    number: "04",
    title: "BUILD",
    description:
      "Create focused digital products where packaged software stops.",
  },
];

export default function BusinessOutcomes() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="text-white py-16 sm:py-20 lg:py-24 border-b border-[#0B3332] bg-[#103F3E]"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#9DC8BC]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#9DC8BC]">
            BUSINESS OUTCOMES FIRST
          </span>
        </div>

        {/* Large Editorial Statement */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-14">
          <motion.h2
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="font-serif text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:col-span-8 lg:text-4xl xl:text-[44px] xl:leading-[1.14]"
          >
            Technology transformation should change how the business works — not
            just the systems it runs.
          </motion.h2>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-4 flex items-end"
          >
            <p className="text-sm sm:text-base leading-relaxed text-white/80">
              We connect process, platforms, data and delivery so technology creates a
              more connected, intelligent and adaptable enterprise.
            </p>
          </motion.div>
        </div>

        {/* 4 Outcome Columns with Vertical Separators */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/20 pt-10">
          {outcomes.map((item, index) => (
            <motion.div
              key={item.number}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
              className={`flex flex-col justify-between ${
                index > 0 ? "lg:border-l lg:border-white/20 lg:pl-6" : ""
              }`}
            >
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-normal text-white/35">
                  {item.number}
                </span>
                <h3 className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-white/80">
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
