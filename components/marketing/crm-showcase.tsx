"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const journeySteps = [
  { step: "01", name: "DISCOVER", detail: "Intent & Account Intelligence" },
  { step: "02", name: "ENGAGE", detail: "Personalized Outreach" },
  { step: "03", name: "SELL", detail: "Pipeline & Deal Staging" },
  { step: "04", name: "SERVE", detail: "Case & Service Governance" },
  { step: "05", name: "EXPAND", detail: "Lifecycle & Retention" },
];

const connectedLayers = [
  "Customer Data",
  "CRM",
  "Service",
  "Marketing",
  "AI",
  "ERP",
  "Integration",
  "Analytics",
];

export default function CRMShowcase() {
  return (
    <section id="crm-cx" className="mkt-section bg-[#FFFFFF] text-[#101828] border-y border-[#E2E7EC]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">CRM &amp; Customer Experience</SectionLabel>

        {/* Split Layout: Headline & Journey Left (~60%), Contextual Photography Right (~40%) */}
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7 space-y-6"
          >
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#101828] sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              Connect every customer moment to the enterprise behind it.
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-[#475467]">
              CRM works best when customer data, sales, service, operations and
              enterprise systems move together without disjointed handoffs or
              isolated silos.
            </p>

            {/* Customer Journey Stepper */}
            <div className="pt-4">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                Unified Customer Journey
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-5">
                {journeySteps.map((item, idx) => (
                  <div
                    key={item.name}
                    className="rounded-md border border-[#E2E7EC] bg-[#F7F8FA] p-3 shadow-xs"
                  >
                    <span className="text-[0.65rem] font-bold text-[#B63838]">
                      {item.step}
                    </span>
                    <h3 className="mt-1 text-xs font-bold text-[#101828]">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[0.68rem] leading-tight text-[#475467]">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/platforms/crm"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#B63838] transition-colors hover:text-[#8F292D]"
              >
                <span>Explore CRM &amp; Customer Experience</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right: Customer Service / Client Engagement Image (~40%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[4/3] lg:h-[440px] w-full overflow-hidden rounded-lg border border-[#E2E7EC] bg-[#F7F8FA] shadow-[0_12px_36px_rgba(20,30,45,0.06)]">
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80"
                alt="Executive customer experience and client engagement collaboration"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#EEF2F5]">
                  CONNECTED REVENUE OPERATIONS
                </span>
                <p className="mt-1 text-xs text-[#F5F7FA]">
                  Bridging front-office engagement to back-office ERP fulfillment and billing.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Connected Enterprise Flow Strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 rounded-lg border border-[#E2E7EC] bg-[#F7F8FA] p-6 shadow-xs"
        >
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#475467]">
            Connected Enterprise Architecture
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {connectedLayers.map((layer, idx) => (
              <div key={layer} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#101828]">
                  {layer}
                </span>
                {idx < connectedLayers.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-[#5F7D75] hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
