"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, CheckCircle2, ShieldCheck, Database, Sparkles, FileText, Activity, Users, Layers, Cpu, Search, Check, Workflow } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

// Corporate Browser Frame Helper (Requirement 16)
function CorporateBrowserFrame({
  url = "CONSULT AMERICA LABS · DEMONSTRATION ENVIRONMENT",
  children,
}: {
  url?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-[#102033]/10 bg-white p-2.5 sm:p-3 shadow-[0_24px_60px_rgba(16,32,51,0.10)]">
      {/* Browser Chrome Header (44–48px height) */}
      <div className="flex h-11 sm:h-12 items-center justify-between border-b border-[#E9EEF1] bg-[#F4F6F7] px-4 -mx-2.5 -mt-2.5 mb-2.5 sm:-mx-3 sm:-mt-3 sm:mb-3 rounded-t-[14px]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#DDE4E8]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#DDE4E8]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#DDE4E8]" />
        </div>
        <span className="font-mono text-[0.62rem] sm:text-[0.68rem] font-bold text-[#526170] tracking-wider uppercase truncate px-2">
          CONSULT AMERICA LABS · DEMONSTRATION ENVIRONMENT
        </span>
        <div className="w-8 hidden sm:block" />
      </div>
      {children}
    </div>
  );
}

export default function LabsShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div id="labs-showcase">
      {/* ======================================================== */}
      {/* 1. LABS INTRO & DATA AGENT FLAGSHIP (Section: #0C2233) */}
      {/* ======================================================== */}
      <section className="bg-[#0C2233] text-white py-20 sm:py-24 lg:py-28 border-b border-[#1E3752]">
        <div className="ca-shell">
          {/* Labs Intro Statement */}
          <div className="max-w-3xl pb-12 border-b border-[#1E3752]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1E3752] bg-[#102033] px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#B63A3A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B63A3A]" />
              CONSULT AMERICA LABS
            </div>

            <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-white leading-[1.08]">
              We don&apos;t only advise. We build.
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#97A8B7]">
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

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Turn complex documents into usable enterprise intelligence.
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#97A8B7]">
                Transform contracts and complex enterprise documents into structured, traceable information while keeping users connected to the source.
              </p>

              {/* 6 Capabilities from Section 22 / 24 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {[
                  "Dynamic extraction",
                  "Table intelligence",
                  "Clause intelligence",
                  "Source verification",
                  "Repository intelligence",
                  "Cross-document analysis",
                ].map((cap) => (
                  <div key={cap} className="flex items-center gap-2 text-xs font-semibold text-[#F7F9FA]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#357C78] shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>

              {/* Data Agent End-to-End Workflow */}
              <div className="pt-2 border-t border-[#1E3752]">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#97A8B7]">
                  INTELLIGENCE PIPELINE
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 font-mono text-[0.65rem] text-[#F7F9FA]">
                  {["INGEST", "EXTRACT", "VERIFY", "REVIEW", "ANALYZE", "INTEGRATE"].map((step, idx, arr) => (
                    <span key={step} className="flex items-center gap-1.5">
                      <span className="rounded bg-[#102033] px-2 py-0.5 border border-[#1E3752] font-semibold text-[#357C78]">
                        {step}
                      </span>
                      {idx < arr.length - 1 && <span className="text-[#526170]">→</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/work/innovation/data-agent"
                  className="ca-button-primary inline-flex items-center gap-2 !min-h-[48px] !px-7 text-sm font-semibold rounded-lg cursor-pointer"
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
      {/* 2. DATA EXPLORER (Section: #EEF3F4 | Large Screenshot | Copy) */}
      {/* ======================================================== */}
      <section className="bg-[#EEF3F4] text-[#102033] py-20 sm:py-24 border-b border-[#DDE4E8]">
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
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#47739B]">
                ENTERPRISE REPOSITORY &amp; ANALYTICS
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102033] leading-tight">
                Data Explorer
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#526170]">
                Search, filter, and compare thousands of unstructured documents across common fields, expiration schedules, and regulatory obligations with instant audit traceability.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  "Cross-document entity aggregation",
                  "Structured schema query & export",
                  "Automated FAR / DFARS compliance checks",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#102033]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#47739B] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  href="/ai-data"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#47739B] hover:text-[#102033] transition-colors"
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
      {/* 3. JOBLENS (Section: #FFFFFF | Copy | Screenshot) */}
      {/* ======================================================== */}
      <section className="bg-[#FFFFFF] text-[#102033] py-20 sm:py-24 border-b border-[#DDE4E8]">
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

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102033] leading-tight">
                JobLens
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#526170]">
                A talent matching toolkit that explains every score it gives. Resume analysis, ATS gap detection, and status tracking with complete transparency.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  "Transparent skill gap breakdown",
                  "ATS matching algorithm insights",
                  "Unified candidate pipeline tracking",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#102033]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#357C78] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  href="/work/innovation/joblens"
                  className="ca-button-primary inline-flex items-center gap-2 !min-h-[44px] !px-6 text-xs font-semibold rounded-lg cursor-pointer"
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
      {/* 4. MEDIGUIDE AI (Section: #F3F8F6 | Healthcare Sage/Teal | Screenshot | Copy) */}
      {/* ======================================================== */}
      <section className="bg-[#F3F8F6] text-[#102033] py-20 sm:py-24 border-b border-[#DDE4E8]">
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

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102033] leading-tight">
                MediGuide AI
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#526170]">
                A private, evidence-supported assistant that explains medical documents, synthesizes lab timelines, and prepares patients and clinicians with verified citations.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  "Evidence citations on every response",
                  "Lab timeline & medication trend analysis",
                  "Privacy-first architecture designed for HIPAA-aligned healthcare workflows",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#102033]">
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
      {/* 5. CONVERA (Section: #F4F7F9 | Copy | Screenshot) */}
      {/* ======================================================== */}
      <section className="bg-[#F4F7F9] text-[#102033] py-20 sm:py-24 border-b border-[#DDE4E8]">
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
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#47739B]">
                INTEGRATION &amp; MIDDLEWARE
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102033] leading-tight">
                Convera Integration Hub
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#526170]">
                Enterprise API gateway and message routing bridge connecting Oracle Fusion, Salesforce, and custom microservices with zero-trust security and high-throughput reliability.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  "High-throughput event streaming & OIC bridging",
                  "Automated payload validation & schema mapping",
                  "Resilient continuous deployment pipelines",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#102033]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#47739B] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  href="/capabilities/digital-engineering"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#47739B] hover:text-[#102033] transition-colors"
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
                  <div className="flex items-center justify-between border-b border-[#E9EEF1] pb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-[#47739B]" />
                      <span className="font-bold text-[#102033]">Event Stream Controller</span>
                    </div>
                    <span className="font-mono text-[0.62rem] text-[#357C78] bg-[#DCEAE7] px-2 py-0.5 rounded font-bold">
                      All Routes Operational
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                    <div className="rounded border border-[#DDE4E8] bg-[#F7F9FA] p-3">
                      <p className="text-[0.62rem] text-[#526170] uppercase">Oracle Fusion Bridge</p>
                      <p className="text-sm font-bold text-[#102033] mt-0.5">Low Latency</p>
                    </div>
                    <div className="rounded border border-[#DDE4E8] bg-[#F7F9FA] p-3">
                      <p className="text-[0.62rem] text-[#526170] uppercase">CRM Pipeline Sync</p>
                      <p className="text-sm font-bold text-[#357C78] mt-0.5">Active Sync</p>
                    </div>
                    <div className="rounded border border-[#DDE4E8] bg-[#F7F9FA] p-3">
                      <p className="text-[0.62rem] text-[#526170] uppercase">Event Routing</p>
                      <p className="text-sm font-bold text-[#47739B] mt-0.5">Enterprise Scale</p>
                    </div>
                  </div>
                </div>
              </CorporateBrowserFrame>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. HR & TALENT (Section: #FFFFFF | Screenshot | Copy) */}
      {/* ======================================================== */}
      <section className="bg-[#FFFFFF] text-[#102033] py-20 sm:py-24 border-b border-[#DDE4E8]">
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
                  <div className="flex items-center justify-between border-b border-[#E9EEF1] pb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#B63A3A]" />
                      <span className="font-bold text-[#102033]">Core HR &amp; Workforce Portal</span>
                    </div>
                    <span className="font-mono text-[0.62rem] text-[#526170]">Production Suite</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-[0.65rem] font-bold">
                    <div className="rounded border border-[#DDE4E8] bg-[#F7F9FA] p-2.5">
                      <p className="text-[#526170]">RECRUITING</p>
                      <p className="text-xs font-bold text-[#102033] mt-1">8 Openings</p>
                    </div>
                    <div className="rounded border border-[#DDE4E8] bg-[#F7F9FA] p-2.5">
                      <p className="text-[#526170]">CANDIDATES</p>
                      <p className="text-xs font-bold text-[#102033] mt-1">42 In Pipeline</p>
                    </div>
                    <div className="rounded border border-[#DDE4E8] bg-[#F7F9FA] p-2.5">
                      <p className="text-[#526170]">TIMESHEETS</p>
                      <p className="text-xs font-bold text-[#357C78] mt-1">Period Approved</p>
                    </div>
                    <div className="rounded border border-[#DDE4E8] bg-[#F7F9FA] p-2.5">
                      <p className="text-[#526170]">PAYROLL</p>
                      <p className="text-xs font-bold text-[#B63A3A] mt-1">Reconciled</p>
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
                WORKFORCE PLATFORMS
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102033] leading-tight">
                HR &amp; Talent Suite
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#526170]">
                Connected workforce applications for talent acquisition, candidate pipeline management, employee self-service, leave requests, and payroll reporting.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  "End-to-end recruit to hire automated flow",
                  "Employee self-service leave & time management",
                  "Full audit logging and role-based enterprise access control",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#102033]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#357C78] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  href="/platforms/ats"
                  className="ca-button-primary inline-flex items-center gap-2 !min-h-[44px] !px-6 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  <span>Explore Workforce Suite</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
