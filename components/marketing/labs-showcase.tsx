"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  X,
  ShoppingBag,
  Calendar,
  Wrench,
  PenTool,
  Workflow,
  Users,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";
import { useContactPanel } from "@/components/providers/contact-provider";

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

// Portfolio Category Filter List (Section 25)
const portfolioCategories = [
  { id: "all", label: "ALL" },
  { id: "enterprise-ai", label: "ENTERPRISE AI" },
  { id: "data", label: "DATA" },
  { id: "healthcare", label: "HEALTHCARE" },
  { id: "talent", label: "TALENT" },
  { id: "commerce", label: "COMMERCE" },
  { id: "business-apps", label: "BUSINESS APPLICATIONS" },
];

interface PortfolioProject {
  id: string;
  name: string;
  categoryKey: string;
  categoryLabel: string;
  headline: string;
  description: string;
  problem: string;
  solution: string;
  capabilities: string[];
  techStack: string[];
  liveUrl: string;
  displayUrl: string;
  icon: React.ComponentType<{ className?: string }>;
}

const portfolioProjects: PortfolioProject[] = [
  {
    id: "importnest",
    name: "ImportNest AI Agent",
    categoryKey: "commerce",
    categoryLabel: "COMMERCE & AI",
    headline: "Compare offers with more context",
    description: "AI shopping comparison platform calculating Total Known Cost across verified retailers.",
    problem: "Cross-border purchasers encounter unexpected shipping duties, hidden currency markups, and unverified merchant pricing.",
    solution: "Engineered an AI shopping agent using natural language prompts to calculate Total Known Cost including landed shipping and taxes.",
    capabilities: [
      "Natural-language product search",
      "Approved retailer discovery",
      "Total Known Cost calculation",
      "Price trend notifications",
    ],
    techStack: ["Next.js", "OpenAI API", "Tailwind CSS", "Vercel"],
    liveUrl: "https://importnest.vercel.app",
    displayUrl: "importnest.vercel.app",
    icon: ShoppingBag,
  },
  {
    id: "smartwrite",
    name: "SmartWrite AI",
    categoryKey: "enterprise-ai",
    categoryLabel: "ENTERPRISE AI",
    headline: "Contextual writing & document refinement",
    description: "AI writing assistant for grammar correction, rewriting, tone calibration, and readability scoring.",
    problem: "Enterprise teams lose time manually adapting tones, polishing proposals, and reviewing complex documentation.",
    solution: "Built a high-performance writing workspace offering instant structural grammar checks, tone adjustment, and readability scoring.",
    capabilities: [
      "Syntax & grammar verification",
      "Contextual paragraph rewriting",
      "Executive tone calibration",
      "Readability scoring metrics",
    ],
    techStack: ["React", "Next.js", "OpenAI API", "Vercel"],
    liveUrl: "https://grammarly-app-seven.vercel.app",
    displayUrl: "grammarly-app-seven.vercel.app",
    icon: PenTool,
  },
  {
    id: "bosiano",
    name: "Bosiano",
    categoryKey: "commerce",
    categoryLabel: "COMMERCE",
    headline: "Brand experience & marketplace presentation",
    description: "Italian heritage-inspired luxury fashion e-commerce platform with responsive shopping pages.",
    problem: "Luxury brands require editorial visual storytelling combined with high-speed catalog navigation and responsive mobile UX.",
    solution: "Designed and engineered an immersive fashion marketplace showcasing high-resolution collections and frictionless checkout flows.",
    capabilities: [
      "Luxury catalog presentation",
      "Responsive category navigation",
      "Mobile-first architecture",
      "Optimized product viewports",
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://bosiano.vercel.app",
    displayUrl: "bosiano.vercel.app",
    icon: ShoppingBag,
  },
  {
    id: "sarco-appliances",
    name: "SarCO Appliances",
    categoryKey: "business-apps",
    categoryLabel: "BUSINESS APPLICATIONS",
    headline: "Commercial sales & service delivery",
    description: "Appliance sales and service business platform for delivery, installation, repair, and customer workflows.",
    problem: "Commercial service providers struggle with fragmented inquiry intake and disorganized technician dispatching.",
    solution: "Developed a comprehensive commercial hub for appliance specifications, delivery scheduling, and repair dispatch.",
    capabilities: [
      "Appliance catalog & specs",
      "Installation & repair workflows",
      "Delivery request scheduling",
      "Customer service inquiry handling",
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://sarco-appliances.vercel.app",
    displayUrl: "sarco-appliances.vercel.app",
    icon: Wrench,
  },
  {
    id: "smart-appliances",
    name: "Smart Appliances",
    categoryKey: "business-apps",
    categoryLabel: "BUSINESS APPLICATIONS",
    headline: "HVAC & home service dispatch",
    description: "Home-service booking platform for appliance, HVAC, and repair services with customer request handling.",
    problem: "Homeowners need transparent technician availability and streamlined diagnostic request intake.",
    solution: "Built a dispatch and service discovery marketplace allowing customers to schedule HVAC diagnostics and track repairs.",
    capabilities: [
      "Service discovery & diagnostics",
      "HVAC & repair scheduling",
      "Customer request dispatching",
      "Appointment confirmations",
    ],
    techStack: ["Next.js", "Tailwind CSS", "Vercel"],
    liveUrl: "https://project-i8icw-ebon.vercel.app",
    displayUrl: "project-i8icw-ebon.vercel.app",
    icon: Wrench,
  },
  {
    id: "appointease",
    name: "AppointEase",
    categoryKey: "business-apps",
    categoryLabel: "BUSINESS APPLICATIONS",
    headline: "Frictionless appointment scheduling",
    description: "Appointment booking application for service selection, date/time scheduling, and customer confirmations.",
    problem: "Professional service businesses lose clients due to multi-step booking friction and manual calendar coordination.",
    solution: "Engineered an intuitive scheduling tool supporting calendar availability, client intake, and automated confirmations.",
    capabilities: [
      "Service & provider selection",
      "Interactive calendar picker",
      "Customer details verification",
      "Automated booking confirmations",
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://appointease-psi.vercel.app",
    displayUrl: "appointease-psi.vercel.app",
    icon: Calendar,
  },
];

export default function LabsShowcase() {
  const shouldReduceMotion = useReducedMotion();
  const { setOpen: setContactOpen } = useContactPanel();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeModalProject, setActiveModalProject] = useState<PortfolioProject | null>(null);

  const filteredProjects = portfolioProjects.filter((proj) => {
    if (selectedFilter === "all") return true;
    return proj.categoryKey === selectedFilter;
  });

  return (
    <div id="labs-showcase">
      {/* ======================================================== */}
      {/* 1. APPLICATION ENGINEERING PRACTICE (Section 19)         */}
      {/* ======================================================== */}
      <section className="bg-[#FFFFFF] text-[#122D2E] py-20 sm:py-24 lg:py-28 border-b border-[#C9DDD7]">
        <div className="ca-shell">
          <SectionLabel tone="burgundy">APPLICATION ENGINEERING PRACTICE</SectionLabel>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
            {/* Left: Editorial Copy */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-6 space-y-6"
            >
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#122D2E] leading-[1.08]">
                Build what packaged software cannot.
              </h2>

              <p className="text-base sm:text-lg leading-relaxed text-[#5B6D6B]">
                Design and engineer applications, portals, AI experiences and integration services around the workflows that differentiate the business.
              </p>

              <div className="pt-2">
                <Link
                  href="/capabilities/digital-engineering"
                  className="ca-button-primary inline-flex items-center gap-2 !min-h-[48px] !px-7 text-sm font-semibold rounded-lg cursor-pointer"
                >
                  <span>Explore Engineering Capabilities</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right: Collage of Real Consult America Application Interfaces */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg border border-[#C9DDD7] bg-white shadow-sm p-1.5">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-[#0B3332]">
                    <Image
                      src="/innovation/data-agent-hero.png"
                      alt="Data Agent document intelligence interface"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[0.62rem] font-bold text-[#122D2E] px-1">Data Agent</p>
                </div>

                <div className="overflow-hidden rounded-lg border border-[#C9DDD7] bg-white shadow-sm p-1.5">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-white">
                    <Image
                      src="/innovation/joblens-hero.png"
                      alt="JobLens talent matching interface"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[0.62rem] font-bold text-[#122D2E] px-1">JobLens</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 sm:pt-8">
                <div className="overflow-hidden rounded-lg border border-[#C9DDD7] bg-white shadow-sm p-1.5">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-[#E1ECE8]">
                    <Image
                      src="/innovation/mediguide-hero.png"
                      alt="MediGuide AI clinical assistant"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[0.62rem] font-bold text-[#122D2E] px-1">MediGuide AI</p>
                </div>

                <div className="overflow-hidden rounded-lg border border-[#C9DDD7] bg-white shadow-sm p-1.5">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-white">
                    <Image
                      src="/innovation/data-agent-platform.png"
                      alt="Data Explorer repository interface"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[0.62rem] font-bold text-[#122D2E] px-1">Data Explorer</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. CONSULT AMERICA LABS & DATA AGENT (Section 24 & 27)   */}
      {/* ======================================================== */}
      <section
        className="py-16 sm:py-20 lg:py-24 border-b border-[#073B3A] bg-[#073B3A] text-white relative overflow-hidden"
      >
        {/* Subtle ambient light */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: "radial-gradient(circle at 80% 30%, rgba(40,123,114,0.3) 0%, transparent 60%)",
          }}
        />

        <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 relative z-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            {/* Left ~34%: Copy */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-4 space-y-5"
            >
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#9BC4B8]" />
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9BC4B8]">
                  CONSULT AMERICA LABS
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-[-0.03em] text-white leading-tight">
                We don&apos;t only advise.
                <br />
                <span className="text-[#9BC4B8]">We build.</span>
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-white/80">
                Our applications solve real business problems with AI, data and
                customer-centric design.
              </p>

              {/* 6 Capabilities */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {[
                  "Dynamic extraction",
                  "Table intelligence",
                  "Clause intelligence",
                  "Source verification",
                  "Repository intelligence",
                  "Cross-document analysis",
                ].map((cap) => (
                  <div
                    key={cap}
                    className="flex items-center gap-2 text-xs font-semibold text-white/90"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#9BC4B8] shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  href="/work/innovation/data-agent"
                  className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[8px] bg-[#B83A3A] px-6 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_16px_rgba(184,58,58,0.22)] hover:bg-[#992F31] transition-all cursor-pointer"
                >
                  <span>Explore our applications</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right ~66%: Large Real Screenshot with Muted Teal Arch Backdrop (Section 27 Specification) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-8 relative flex flex-col items-center"
            >
              <div className="relative w-full">
                {/* Large Muted Teal Arch behind Screenshot (Section 27) */}
                <div
                  className="absolute -top-6 -right-6 w-[94%] h-[94%] rounded-t-[140px] rounded-b-[16px] pointer-events-none -z-0 hidden sm:block"
                  style={{
                    background: "linear-gradient(145deg, #0B4A47, #287B72)",
                    opacity: 0.25,
                  }}
                />

                <div className="relative z-10">
                  <CorporateBrowserFrame url="https://data-agent-ca.vercel.app">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-white">
                      <Image
                        src="/innovation/data-agent-hero.png"
                        alt="Data Agent document and contract intelligence interface"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                    </div>
                  </CorporateBrowserFrame>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. ALTERNATING PRODUCT PORTFOLIO SECTIONS (Section 22-23) */}
      {/* ======================================================== */}

      {/* 3A. DATA EXPLORER (Screenshot left, Copy right, soft blue-gray #E1ECE8) */}
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
                  className="ca-button-primary inline-flex items-center gap-2 !min-h-[44px] !px-6 text-xs font-semibold rounded-lg cursor-pointer"
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
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0B4A47] px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0A3D3B]"
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

      {/* ======================================================== */}
      {/* 4. FULL APPLICATION PORTFOLIO GALLERY (Section 25)       */}
      {/* ======================================================== */}
      <section className="bg-[#E1ECE8] text-[#122D2E] py-20 sm:py-24 border-b border-[#C9DDD7]">
        <div className="ca-shell">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-8 border-b border-[#C9DDD7]">
            <div>
              <SectionLabel tone="burgundy">APPLICATION DEVELOPMENT PORTFOLIO</SectionLabel>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#122D2E]">
                From idea to working product.
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-[#5B6D6B]">
              Our application portfolio demonstrates how Consult America moves from business problem to interface, workflow, integration and deployed software.
            </p>
          </div>

          {/* Filter Navigation (Section 25) */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {portfolioCategories.map((cat) => {
              const isSelected = selectedFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#122D2E] text-white shadow-xs"
                      : "bg-white text-[#5B6D6B] border border-[#C9DDD7] hover:border-[#B83A3A] hover:text-[#122D2E]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* 3 Columns Desktop, 2 Tablet, 1 Mobile */}
          <motion.div
            layout
            className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => {
                const IconComponent = project.icon;
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    className="group flex flex-col justify-between rounded-xl border border-[#C9DDD7] bg-white p-5 shadow-2xs hover:border-[#B83A3A]/50 hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      {/* Browser Mockup Top */}
                      <div className="overflow-hidden rounded-lg border border-[#C9DDD7] bg-[#F4F6F7]">
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#C9DDD7] bg-white">
                          <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#C9DDD7]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#C9DDD7]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#C9DDD7]" />
                          </div>
                          <span className="font-mono text-[0.6rem] text-[#5B6D6B] truncate max-w-[160px]">
                            {project.displayUrl}
                          </span>
                          <span className="h-1 w-4" />
                        </div>

                        <div className="relative h-40 w-full bg-[#E1ECE8] p-5 flex flex-col justify-between overflow-hidden">
                          <div className="flex items-center justify-between">
                            <span className="rounded bg-white px-2 py-0.5 text-[0.62rem] font-bold text-[#122D2E] border border-[#C9DDD7]">
                              {project.categoryLabel}
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-[#C9DDD7] shadow-2xs">
                              <IconComponent className="h-4 w-4 text-[#122D2E]" />
                            </div>
                          </div>

                          <div>
                            <p className="font-serif text-lg font-bold text-[#122D2E]">
                              {project.name}
                            </p>
                            <p className="text-[0.68rem] text-[#5B6D6B] line-clamp-1 mt-0.5">
                              {project.headline}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mt-5 space-y-2.5">
                        <h4 className="font-serif text-lg font-bold text-[#122D2E] group-hover:text-[#B83A3A] transition-colors">
                          {project.name}
                        </h4>
                        <p className="text-xs text-[#5B6D6B] leading-relaxed line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.capabilities.slice(0, 3).map((cap) => (
                            <span
                              key={cap}
                              className="rounded bg-[#E1ECE8] px-2 py-0.5 text-[0.65rem] font-medium text-[#122D2E]"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 pt-4 border-t border-[#C9DDD7] flex items-center justify-between text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setActiveModalProject(project)}
                        className="text-[#B83A3A] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>

                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#5B6D6B] hover:text-[#122D2E] transition-colors"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Application Development CTA */}
          <div className="mt-16 rounded-xl border border-[#C9DDD7] bg-white p-8 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
                  CUSTOM APPLICATION ENGINEERING
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#122D2E]">
                  Have a workflow that packaged software cannot solve?
                </h3>
                <p className="text-sm sm:text-base text-[#5B6D6B] leading-relaxed max-w-2xl">
                  From AI-assisted applications to customer portals, commerce, booking and enterprise workflow tools, we design and ship focused software around the job your users actually need to perform.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="ca-button-primary !min-h-[48px] !px-6 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Discuss an Application</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="https://agentomatix-portfolio.pages.dev/portfolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex !min-h-[48px] items-center justify-center gap-1.5 rounded-lg border border-[#C9DDD7] bg-white px-5 text-xs sm:text-sm font-semibold text-[#122D2E] hover:border-[#B83A3A] hover:text-[#B83A3A] transition-all"
                >
                  <span>Explore Full Portfolio</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalProject(null)}
              className="absolute inset-0 bg-[#0B3332]/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-[#C9DDD7] bg-white p-6 sm:p-8 shadow-2xl text-[#122D2E]"
            >
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#E1ECE8] text-[#5B6D6B] hover:bg-[#E1ECE8] hover:text-[#122D2E] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
                  {activeModalProject.categoryLabel}
                </span>
                <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#122D2E]">
                  {activeModalProject.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[#5B6D6B]">
                  {activeModalProject.headline}
                </p>
              </div>

              <div className="mt-6 space-y-4 border-t border-[#C9DDD7] pt-4 text-xs sm:text-sm">
                <div>
                  <strong className="text-[#122D2E] font-bold uppercase tracking-wider text-[0.68rem] block mb-1">
                    The Business Problem
                  </strong>
                  <p className="text-[#5B6D6B] leading-relaxed">
                    {activeModalProject.problem}
                  </p>
                </div>

                <div>
                  <strong className="text-[#122D2E] font-bold uppercase tracking-wider text-[0.68rem] block mb-1">
                    The Engineered Solution
                  </strong>
                  <p className="text-[#5B6D6B] leading-relaxed">
                    {activeModalProject.solution}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-[#C9DDD7] pt-4">
                <strong className="text-[#122D2E] font-bold uppercase tracking-wider text-[0.68rem] block mb-2.5">
                  Key Capabilities
                </strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalProject.capabilities.map((cap) => (
                    <div key={cap} className="flex items-center gap-2 text-xs font-semibold text-[#122D2E]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#0B4A47] shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-[#C9DDD7] pt-4">
                <strong className="text-[#122D2E] font-bold uppercase tracking-wider text-[0.68rem] block mb-2">
                  Technology Stack
                </strong>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-[#E1ECE8] px-2.5 py-1 text-xs font-mono font-medium text-[#122D2E]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[#C9DDD7] flex flex-col sm:flex-row items-center justify-between gap-4">
                <a
                  href={activeModalProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ca-button-primary w-full sm:w-auto !min-h-[44px] !px-6 text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
                >
                  <span>Open Live Application Demo</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setActiveModalProject(null);
                    setContactOpen(true);
                  }}
                  className="text-xs font-bold text-[#B83A3A] hover:underline cursor-pointer"
                >
                  Inquire about a custom build →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
