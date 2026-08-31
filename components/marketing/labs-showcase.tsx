"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, CheckCircle2, ShieldCheck, Database, Sparkles, FileText, Activity, Users, Layers, Cpu, Search, Check, Workflow } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

// Corporate Browser Frame Helper (Requirements 16 & 17)
function CorporateBrowserFrame({
  url = "CONSULT AMERICA LABS · DEMONSTRATION ENVIRONMENT",
  children,
}: {
  url?: string;
  children: React.ReactNode;
}) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 24, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={shouldReduce ? {} : { y: -3 }}
      className="overflow-hidden rounded-[16px] border border-[#D8D0C5] bg-white p-2.5 sm:p-3 shadow-[0_24px_60px_rgba(38,31,27,0.08)] hover:shadow-[0_28px_68px_rgba(38,31,27,0.12)] transition-shadow duration-300"
    >
      {/* Browser Chrome Header (44–48px height) */}
      <div className="flex h-11 sm:h-12 items-center justify-between border-b border-[#D8D0C5] bg-[#F7F3EC] px-4 -mx-2.5 -mt-2.5 mb-2.5 sm:-mx-3 sm:-mt-3 sm:mb-3 rounded-t-[14px]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#D8D0C5]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#D8D0C5]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#D8D0C5]" />
        </div>
        <span className="font-mono text-[0.62rem] sm:text-[0.68rem] font-bold text-[#695F57] tracking-wider uppercase truncate px-2">
          {url}
        </span>
        <div className="w-8 hidden sm:block" />
      </div>
      {children}
    </motion.div>
  );
}

export default function LabsShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div id="labs-showcase">
      {/* ======================================================== */}
      {/* 1. LABS INTRO & DATA AGENT FLAGSHIP (Warm Ivory #F7F3EC) */}
      {/* ======================================================== */}
      <section className="bg-[#F7F3EC] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D8D0C5]">
        <div className="ca-shell">
          {/* Labs Intro Statement */}
          <div className="max-w-3xl pb-12 border-b border-[#D8D0C5]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8D0C5] bg-white px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#B63A3A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B63A3A]" />
              CONSULT AMERICA LABS
            </div>

            <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#261F1B] leading-[1.08]">
              We don&apos;t only advise. We build.
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#695F57]">
              Consult America Labs turns operational challenges into focused enterprise and AI applications.
            </p>
          </div>

          {/* DATA AGENT FLAGSHIP (40% copy / 60% screenshot) */}
          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
            {/* Left Column (40%): Copy */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 space-y-6"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                FLAGSHIP AI PRODUCT
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                Turn complex documents into usable enterprise intelligence.
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#695F57]">
                Transform contracts and complex enterprise documents into structured, traceable information while keeping users connected to the source.
              </p>

              {/* 6 Capabilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {[
                  "Dynamic extraction",
                  "Table intelligence",
                  "Clause intelligence",
                  "Source verification",
                  "Repository intelligence",
                  "Cross-document analysis",
                ].map((cap) => (
                  <div key={cap} className="flex items-center gap-2 text-xs font-semibold text-[#261F1B]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#357C78] shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>

              {/* Data Agent End-to-End Workflow */}
              <div className="pt-2 border-t border-[#D8D0C5]">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#695F57]">
                  INTELLIGENCE PIPELINE
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 font-mono text-[0.65rem] text-[#261F1B]">
                  {["INGEST", "EXTRACT", "VERIFY", "REVIEW", "ANALYZE", "INTEGRATE"].map((step, idx, arr) => (
                    <span key={step} className="flex items-center gap-1.5">
                      <span className="rounded bg-white px-2 py-0.5 border border-[#D8D0C5] font-semibold text-[#357C78]">
                        {step}
                      </span>
                      {idx < arr.length - 1 && <span className="text-[#695F57]">→</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/work/innovation/data-agent"
                  className="ca-button-primary inline-flex items-center gap-2 !min-h-[48px] !px-7 text-sm font-semibold rounded-lg cursor-pointer !bg-[#B63A3A] hover:!bg-[#942E31]"
                >
                  <span>Explore Data Agent</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column (60%): Large Real Screenshot in White Corporate Frame */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <CorporateBrowserFrame url="https://data-agent-ca.vercel.app">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-white">
                  <Image
                    src="/innovation/data-agent-hero.png"
                    alt="Data Agent document and contract intelligence interface"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
              </CorporateBrowserFrame>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. DATA EXPLORER (Light White #FFFDF8 | Screenshot | Copy) */}
      {/* ======================================================== */}
      <section className="bg-[#FFFDF8] text-[#261F1B] py-20 sm:py-24 border-b border-[#D8D0C5]">
        <div className="ca-shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
            {/* Left Column: Large Screenshot */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 order-2 lg:order-1"
            >
              <CorporateBrowserFrame url="https://data-agent-ca.vercel.app/repository">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-white">
                  <Image
                    src="/innovation/data-agent-platform.png"
                    alt="Data Explorer enterprise contract repository and field intelligence interface"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
              </CorporateBrowserFrame>
            </motion.div>

            {/* Right Column: Copy */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 order-1 lg:order-2 space-y-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#357C78]">
                ENTERPRISE REPOSITORY &amp; ANALYTICS
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                Data Explorer
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#695F57]">
                Search, filter, and compare thousands of unstructured documents across common fields, expiration schedules, and regulatory obligations with instant audit traceability.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  "Cross-document entity aggregation",
                  "Structured schema query & export",
                  "Automated FAR / DFARS compliance checks",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#261F1B]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#357C78] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  href="/ai-data"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B63A3A] hover:text-[#942E31] transition-colors"
                >
                  <span>Explore Data Architecture</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. JOBLENS (Warm Ivory #F7F3EC | Copy | Screenshot) */}
      {/* ======================================================== */}
      <section className="bg-[#F7F3EC] text-[#261F1B] py-20 sm:py-24 border-b border-[#D8D0C5]">
        <div className="ca-shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
            {/* Left Column: Copy */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 space-y-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                TALENT INTELLIGENCE
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                JobLens
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#695F57]">
                A talent matching toolkit that explains every score it gives. Resume analysis, ATS gap detection, and status tracking with complete transparency.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  "Transparent skill gap breakdown",
                  "ATS matching algorithm insights",
                  "Unified candidate pipeline tracking",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#261F1B]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#357C78] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  href="/work/innovation/joblens"
                  className="ca-button-primary inline-flex items-center gap-2 !min-h-[44px] !px-6 text-xs font-semibold rounded-lg cursor-pointer !bg-[#B63A3A] hover:!bg-[#942E31]"
                >
                  <span>Explore JobLens</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Screenshot */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <CorporateBrowserFrame url="https://joblens-seven.vercel.app">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-white">
                  <Image
                    src="/innovation/joblens-hero.png"
                    alt="JobLens talent intelligence and resume analyzer interface"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
              </CorporateBrowserFrame>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. MEDIGUIDE AI (Light White #FFFDF8 | Screenshot | Copy) */}
      {/* ======================================================== */}
      <section className="bg-[#FFFDF8] text-[#261F1B] py-20 sm:py-24 border-b border-[#D8D0C5]">
        <div className="ca-shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
            {/* Left Column: Screenshot */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 order-2 lg:order-1"
            >
              <CorporateBrowserFrame url="https://mediguide-ai-woad.vercel.app">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-white">
                  <Image
                    src="/innovation/mediguide-hero.png"
                    alt="MediGuide AI healthcare assistant and evidence-grounded clinical workspace"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
              </CorporateBrowserFrame>
            </motion.div>

            {/* Right Column: Copy */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 order-1 lg:order-2 space-y-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#357C78]">
                CLINICAL AI &amp; HEALTHCARE
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                MediGuide AI
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#695F57]">
                A private, evidence-supported assistant that explains medical documents, synthesizes lab timelines, and prepares patients and clinicians with verified citations.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  "Evidence citations on every response",
                  "Lab timeline & medication trend analysis",
                  "Privacy-first architecture designed for HIPAA-aligned healthcare workflows",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#261F1B]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#357C78] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  href="/work/innovation/mediguide-ai"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#357C78] px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2B6663]"
                >
                  <span>Explore MediGuide AI</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. CONVERA (Warm Ivory #F7F3EC | Copy | Screenshot) */}
      {/* ======================================================== */}
      <section className="bg-[#F7F3EC] text-[#261F1B] py-20 sm:py-24 border-b border-[#D8D0C5]">
        <div className="ca-shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
            {/* Left Column: Copy */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 space-y-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                INTEGRATION &amp; MIDDLEWARE
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                Convera Integration Hub
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#695F57]">
                Enterprise API gateway and message routing bridge connecting Oracle Fusion, Salesforce, and custom microservices with zero-trust security and high-throughput reliability.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  "High-throughput event streaming & OIC bridging",
                  "Automated payload validation & schema mapping",
                  "Resilient continuous deployment pipelines",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#261F1B]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#357C78] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  href="/capabilities/digital-engineering"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B63A3A] hover:text-[#942E31] transition-colors"
                >
                  <span>Explore Integration Services</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Architectural UI */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <CorporateBrowserFrame>
                <div className="p-6 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-[#D8D0C5] pb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-[#B63A3A]" />
                      <span className="font-bold text-[#261F1B]">Event Stream Controller</span>
                    </div>
                    <span className="font-mono text-[0.62rem] text-[#357C78] bg-[#F7F3EC] border border-[#D8D0C5] px-2 py-0.5 rounded font-bold">
                      All Routes Operational
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                    <div className="rounded border border-[#D8D0C5] bg-[#F7F3EC] p-3">
                      <p className="text-[0.62rem] text-[#695F57] uppercase">Oracle Fusion Bridge</p>
                      <p className="text-sm font-bold text-[#261F1B] mt-0.5">Low Latency</p>
                    </div>
                    <div className="rounded border border-[#D8D0C5] bg-[#F7F3EC] p-3">
                      <p className="text-[0.62rem] text-[#695F57] uppercase">CRM Pipeline Sync</p>
                      <p className="text-sm font-bold text-[#357C78] mt-0.5">Active Sync</p>
                    </div>
                    <div className="rounded border border-[#D8D0C5] bg-[#F7F3EC] p-3">
                      <p className="text-[0.62rem] text-[#695F57] uppercase">Event Routing</p>
                      <p className="text-sm font-bold text-[#B63A3A] mt-0.5">Enterprise Scale</p>
                    </div>
                  </div>
                </div>
              </CorporateBrowserFrame>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. HR & TALENT (Light White #FFFDF8 | Screenshot | Copy) */}
      {/* ======================================================== */}
      <section className="bg-[#FFFDF8] text-[#261F1B] py-20 sm:py-24 border-b border-[#D8D0C5]">
        <div className="ca-shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
            {/* Left Column: UI */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 order-2 lg:order-1"
            >
              <CorporateBrowserFrame>
                <div className="p-6 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-[#D8D0C5] pb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#B63A3A]" />
                      <span className="font-bold text-[#261F1B]">Core HR &amp; Workforce Portal</span>
                    </div>
                    <span className="font-mono text-[0.62rem] text-[#695F57]">Production Suite</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-[0.65rem] font-bold">
                    <div className="rounded border border-[#D8D0C5] bg-[#F7F3EC] p-2.5">
                      <p className="text-[#695F57]">RECRUITING</p>
                      <p className="text-xs font-bold text-[#261F1B] mt-1">8 Openings</p>
                    </div>
                    <div className="rounded border border-[#D8D0C5] bg-[#F7F3EC] p-2.5">
                      <p className="text-[#695F57]">CANDIDATES</p>
                      <p className="text-xs font-bold text-[#261F1B] mt-1">42 In Pipeline</p>
                    </div>
                    <div className="rounded border border-[#D8D0C5] bg-[#F7F3EC] p-2.5">
                      <p className="text-[#695F57]">TIMESHEETS</p>
                      <p className="text-xs font-bold text-[#357C78] mt-1">98% Logged</p>
                    </div>
                    <div className="rounded border border-[#D8D0C5] bg-[#F7F3EC] p-2.5">
                      <p className="text-[#695F57]">DOCUMENTS</p>
                      <p className="text-xs font-bold text-[#B63A3A] mt-1">I-9 Verified</p>
                    </div>
                  </div>
                </div>
              </CorporateBrowserFrame>
            </motion.div>

            {/* Right Column: Copy */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 order-1 lg:order-2 space-y-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                WORKFORCE OPERATIONS
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                Core HR &amp; Workforce Suite
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#695F57]">
                Internal operations platform for employee onboarding, leave management, timesheets, and enterprise compliance tracking.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  "Automated I-9 and visa verification workflows",
                  "Multi-state payroll & benefits sync",
                  "Enterprise role-based access control",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#261F1B]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#357C78] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  href="/employee"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B63A3A] hover:text-[#942E31] transition-colors"
                >
                  <span>Explore Workforce Suite</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
