"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";
import { ArchImage } from "@/components/marketing/image-system";

const journeySteps = [
  { step: "01", name: "DISCOVER", detail: "Account intelligence & intent signals" },
  { step: "02", name: "ENGAGE", detail: "Personalized multi-channel outreach" },
  { step: "03", name: "SELL", detail: "Pipeline, quotes & deal governance" },
  { step: "04", name: "SERVE", detail: "Case deflection & omni-channel support" },
  { step: "05", name: "EXPAND", detail: "Lifecycle health & contract renewal" },
];

export default function CRMShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="crm-cx" className="bg-[#FFFDF8] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D8D0C5]">
      <div className="ca-shell">
        <SectionLabel tone="burgundy">CRM &amp; CUSTOMER EXPERIENCE</SectionLabel>

        {/* 50/50 Split: Left Content + Journey, Right Professional Customer-Facing Photography */}
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left Column: Heading, Copy, Journey Steps */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#261F1B] leading-[1.08]">
              Connect every customer moment to the enterprise behind it.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#695F57]">
              CRM delivers real value when customer data, sales, service, and backend ERP operations move together seamlessly without friction or disconnected silos.
            </p>

            {/* Journey: DISCOVER → ENGAGE → SELL → SERVE → EXPAND */}
            <div className="pt-2">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                Unified Customer Journey
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-5 gap-2">
                {journeySteps.map((item) => (
                  <div
                    key={item.name}
                    className="rounded border border-[#D8D0C5] bg-[#F7F3EC] p-2.5 transition-all hover:border-[#B63A3A]"
                  >
                    <span className="font-mono text-[0.62rem] font-bold text-[#B63A3A]">
                      {item.step}
                    </span>
                    <h3 className="mt-0.5 text-xs font-bold text-[#261F1B]">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[0.62rem] leading-tight text-[#695F57]">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/platforms/crm"
                className="ca-button-primary inline-flex items-center gap-2 !min-h-[48px] !px-7 text-sm font-semibold rounded-lg cursor-pointer !bg-[#B63A3A] hover:!bg-[#942E31] text-white"
              >
                <span>Explore CRM Solutions</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Professional Customer Interaction in Architectural Arch Frame (Shape C) */}
          <div className="lg:col-span-6">
            <ArchImage
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=85"
              alt="Executive enterprise customer relationship and consultation inside modern workspace"
              showBackingArc={true}
              overlay={
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-5 right-5 rounded-[10px] border border-[#D8D0C5]/60 bg-white/95 p-4 backdrop-blur-md shadow-md text-xs">
                    <p className="font-bold text-[#261F1B]">Customer 360 &amp; Enterprise Pipeline</p>
                    <p className="text-[0.68rem] text-[#695F57] mt-0.5">Unified telemetry across Salesforce, Microsoft Dynamics, and Oracle ERP</p>
                  </div>
                </>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
