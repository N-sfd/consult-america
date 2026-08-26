"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import MediaPanel from "@/components/marketing/MediaPanel";
import SectionLabel from "@/components/marketing/SectionLabel";

const PRIMARY_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80";
const SECONDARY_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80";

const flow = ["Strategy", "Technology", "Execution"];

export default function Introduction() {
  return (
    <section id="who-we-are" className="mkt-section bg-[var(--mkt-ink)] text-white">
      <div className="mkt-shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel tone="light">Who We Are</SectionLabel>
          </div>
          <div className="lg:col-span-8 lg:pt-2">
            <EditorialHeading className="max-w-3xl text-white">
              We work where business, technology and transformation come
              together.
            </EditorialHeading>
          </div>
        </div>

        <div className="mt-14 grid items-start gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <MediaPanel
              src={PRIMARY_IMAGE}
              alt="Consulting team collaborating on enterprise delivery"
              className="aspect-[4/5] w-full lg:min-h-[520px]"
              sizes="(max-width: 1024px) 100vw, 42vw"
              overlay="dark"
            />
          </motion.div>

          <div className="flex flex-col lg:col-span-7 lg:pt-10">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65 }}
              className="mkt-body-lg max-w-xl text-white/70"
            >
              We combine strategy, Oracle, AI, data and engineering to move
              complex initiatives from planning into production.
            </motion.p>

            <p className="mkt-body mt-6 max-w-lg text-white/50">
              ConsultAmerica helps organizations modernize enterprise platforms,
              transform business processes, and build intelligent digital
              capabilities—with senior practitioners close to the work.
            </p>

            <Link href="/about" className="ca-link mt-8 w-fit">
              About ConsultAmerica
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <div className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/12 pt-8">
              {flow.map((item, index) => (
                <div key={item} className="flex items-center gap-5">
                  <span className="text-sm font-medium tracking-[-0.01em] text-white/80">
                    {item}
                  </span>
                  {index < flow.length - 1 ? (
                    <span aria-hidden="true" className="text-white/25">
                      →
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="mt-10 self-end lg:mt-14 lg:w-[72%]"
            >
              <MediaPanel
                src={SECONDARY_IMAGE}
                alt="Technology and data engineering environment"
                className="aspect-[16/10] w-full"
                sizes="(max-width: 1024px) 100vw, 40vw"
                overlay="navy"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
