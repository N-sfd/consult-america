"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Users, Workflow } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import ApplicationPortfolio from "@/components/marketing/application-portfolio";

// Corporate Browser Frame Helper (Section 24 Requirement)
function CorporateBrowserFrame({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#C9DDD7] bg-white p-2 sm:p-2.5 shadow-[0_20px_60px_rgba(16,32,51,0.09)]">
      {/* Browser Chrome Header */}
      <div className="flex items-center justify-between border-b border-[#C9DDD7] bg-[#F4F6F7] px-3.5 py-2 -mx-2 -mt-2 mb-2 sm:-mx-2.5 sm:-mt-2.5 sm:mb-2.5 rounded-t-[8px]">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#C9DDD7]" />
          <span className="h-2 w-2 rounded-full bg-[#C9DDD7]" />
          <span className="h-2 w-2 rounded-full bg-[#C9DDD7]" />
        </div>
        <span className="font-mono text-[0.65rem] text-[#5B6D6B] tracking-wide truncate max-w-[240px] sm:max-w-none">
          {url}
        </span>
        <div className="w-8" />
      </div>
      {children}
    </div>
  );
}

export default function LabsShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div id="labs-showcase">
      {/* Product portfolio sections */}
      <section className="bg-[#E1ECE8] text-[#122D2E] py-20 sm:py-24 border-b border-[#C9DDD7]">
        <div className="ca-shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
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
                    alt="Data Explorer contract repository and aggregation interface"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
              </CorporateBrowserFrame>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 order-1 lg:order-2 space-y-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                DATA REPOSITORY
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#122D2E] leading-tight">
                Data Explorer
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#5B6D6B]">
                Search, filter, and compare unstructured documents across common fields, expiration schedules, and obligations with instant audit traceability.
              </p>

              <div className="space-y-2 pt-1">
                {[
                  "Cross-document entity aggregation",
                  "Structured schema query & export",
                  "Contract clause verification workflows",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#122D2E]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#176A63] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/ai-data"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176A63] hover:text-[#122D2E] transition-colors"
                >
                  <span>Explore Data Architecture</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3B. JOBLENS (Copy left, Screenshot right, white/blue-gray #FFFFFF) */}
      <section className="bg-[#FFFFFF] text-[#122D2E] py-20 sm:py-24 border-b border-[#C9DDD7]">
        <div className="ca-shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 space-y-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                TALENT INTELLIGENCE
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#122D2E] leading-tight">
                JobLens
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#5B6D6B]">
                Turn career information into clearer next steps. AI career platform for resume analysis, ATS keyword feedback, job matching, cover-letter generation, and application tracking.
              </p>

              <div className="space-y-2 pt-1">
                {[
                  "Resume analysis & skill breakdown",
                  "ATS keyword compatibility feedback",
                  "Job matching & cover letter generation",
                  "Application lifecycle tracking",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#122D2E]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#0B4A47] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/work/innovation/joblens"
                  className="ca-button-primary inline-flex items-center gap-2 !min-h-[44px] !px-6 text-xs font-semibold rounded-full cursor-pointer"
                >
                  <span>Explore JobLens</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>

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

      {/* 3C. MEDIGUIDE AI (Screenshot left, Copy right, pale healthcare teal #E1ECE8) */}
      <section className="bg-[#E1ECE8] text-[#122D2E] py-20 sm:py-24 border-b border-[#C9DDD7]">
        <div className="ca-shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
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
                    alt="MediGuide AI healthcare assistant workspace"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
              </CorporateBrowserFrame>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 order-1 lg:order-2 space-y-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#0B4A47]">
                HEALTHCARE AI
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#122D2E] leading-tight">
                MediGuide AI
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#5B6D6B]">
                Make complex health information easier to understand and use. A structured assistant for intake, responsible boundaries, patient-friendly explanations, and clear communication.
              </p>

              <div className="space-y-2 pt-1">
                {[
                  "Clearer patient health conversations",
                  "Structured clinical intake summaries",
                  "Patient-friendly explanations with citations",
                  "Responsible health boundary protocols",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#122D2E]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#0B4A47] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/work/innovation/mediguide-ai"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0B4A47] px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0A3D3B]"
                >
                  <span>Explore MediGuide AI</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3D. CONVERA (Copy left, Screenshot right, cool gray #FFFFFF) */}
      <section className="bg-[#FFFFFF] text-[#122D2E] py-20 sm:py-24 border-b border-[#C9DDD7]">
        <div className="ca-shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 space-y-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                INTEGRATION GATEWAY
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#122D2E] leading-tight">
                Convera Integration Hub
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#5B6D6B]">
                Enterprise API gateway and message routing bridge connecting Oracle Fusion, CRM, and custom microservices with clean schema validation and reliable routing.
              </p>

              <div className="space-y-2 pt-1">
                {[
                  "Event streaming & OIC bridging",
                  "Automated payload validation & schema mapping",
                  "Resilient error deflection & retry queues",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#122D2E]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#176A63] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/capabilities/digital-engineering"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176A63] hover:text-[#122D2E] transition-colors"
                >
                  <span>Explore Integration Services</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-7"
            >
              <div className="rounded-[14px] border border-[#9BC4B8]/45 bg-[#F0F6F4] p-6 sm:p-8 ca-shadow-elevated">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Oracle Fusion", detail: "Event-driven ERP connectivity" },
                    { label: "CRM Platform", detail: "Bidirectional customer data sync" },
                    { label: "API Gateway", detail: "Schema validation & routing" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-[#9BC4B8]/40 bg-white p-4">
                      <Workflow className="h-4 w-4 text-[#176A63] mb-2" />
                      <p className="text-xs font-bold uppercase tracking-wider text-[#073B3A]">{item.label}</p>
                      <p className="mt-1 text-xs text-[#176A63] leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-center gap-3 text-[#9BC4B8]">
                  <span className="h-px flex-1 bg-[#9BC4B8]/40" />
                  <span className="text-[0.62rem] font-bold uppercase tracking-widest text-[#176A63]">Convera Integration Hub</span>
                  <span className="h-px flex-1 bg-[#9BC4B8]/40" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3E. HR & TALENT SUITE (Screenshot left, Copy right, white/soft blue #FFFFFF) */}
      <section className="bg-[#FFFFFF] text-[#122D2E] py-20 sm:py-24 border-b border-[#C9DDD7]">
        <div className="ca-shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-7 order-2 lg:order-1"
            >
              <div className="rounded-[14px] border border-[#9BC4B8]/45 bg-[#F0F6F4] p-6 sm:p-8 ca-shadow-elevated">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Recruiting", detail: "Talent pipeline" },
                    { label: "Candidates", detail: "Evaluation workflow" },
                    { label: "Timesheets", detail: "Manager approvals" },
                    { label: "Payroll", detail: "Ledger integration" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-[#9BC4B8]/40 bg-white p-3 text-center">
                      <Users className="h-4 w-4 text-[#176A63] mx-auto mb-2" />
                      <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[#176A63]">{item.label}</p>
                      <p className="mt-1 text-xs font-semibold text-[#073B3A]">{item.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-center gap-3 text-[#9BC4B8]">
                  <span className="h-px flex-1 bg-[#9BC4B8]/40" />
                  <span className="text-[0.62rem] font-bold uppercase tracking-widest text-[#176A63]">Workforce Suite</span>
                  <span className="h-px flex-1 bg-[#9BC4B8]/40" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 order-1 lg:order-2 space-y-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
                WORKFORCE PLATFORM
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#122D2E] leading-tight">
                HR &amp; Talent Suite
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#5B6D6B]">
                Connected workforce applications for talent acquisition, candidate pipeline management, employee self-service, leave requests, and payroll reporting.
              </p>

              <div className="space-y-2 pt-1">
                {[
                  "End-to-end recruit-to-hire workflow",
                  "Employee self-service leave & time management",
                  "Role-based permission architecture",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#122D2E]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#0B4A47] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/work/innovation"
                  className="ca-button-primary inline-flex items-center gap-2 !min-h-[44px] !px-6 text-xs font-semibold rounded-full cursor-pointer"
                >
                  <span>Explore Applications</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ApplicationPortfolio />
    </div>
  );
}
