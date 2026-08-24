"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { capabilityGroups } from "@/lib/site-data";

export default function CapabilitiesShowcase() {
  const [active, setActive] = useState(0);

  return (
    <section className="border-t border-white/10 bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[94.5em]">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-sm tracking-[0.16em] uppercase text-white/55">
            Capabilities
          </h2>
          <p className="text-sm text-white/45">
            {String(active + 1).padStart(1, "0")}/{capabilityGroups.length}
          </p>
        </div>

        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {capabilityGroups.map((group, index) => {
            const isOpen = index === active;

            return (
              <div key={group.title}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className={`flex w-full items-center justify-between py-5 text-left transition-colors duration-300 lg:py-7 ${
                    isOpen ? "text-white" : "text-white/40"
                  }`}
                >
                  <span className="ca-h3">{group.title}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.77, 0, 0.175, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 pb-10 lg:grid-cols-12">
                        <p className="ca-body-lg lg:col-span-7">
                          {group.description}
                        </p>
                        <div className="lg:col-span-5">
                          <Link href={group.href} className="ca-link">
                            Explore our Services
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                          <div className="mt-6 flex flex-wrap gap-2">
                            {group.services.map((service) => (
                              <Link
                                key={service.label}
                                href={service.href}
                                className="ca-tag text-white/70 hover:text-white"
                              >
                                {service.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
