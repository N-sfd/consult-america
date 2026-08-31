import type { Metadata } from "next";

import AIDataStory from "@/components/marketing/ai-data-story";
import BusinessOutcomes from "@/components/marketing/business-outcomes";
import CareersFeature from "@/components/marketing/careers-feature";
import CRMShowcase from "@/components/marketing/crm-showcase";
import GrowthCta from "@/components/marketing/growth-cta";
import Hero from "@/components/marketing/hero";
import IndustriesSection from "@/components/marketing/industries-section";
import InsightsSection from "@/components/marketing/insights-section";
import LabsShowcase from "@/components/marketing/labs-showcase";
import OracleFlagship from "@/components/marketing/oracle-flagship";
import SelectedWorkSection from "@/components/marketing/selected-work-section";
import TrustCredibility from "@/components/marketing/trust-credibility";
import WhatWeDo from "@/components/marketing/what-we-do";
import WhyConsultAmericaSection from "@/components/marketing/why-consult-america-section";
import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Consult America | Enterprise Transformation, Oracle, AI & Application Engineering",
  description:
    "Consult America helps organizations modernize enterprise platforms, connect data and workflows, operationalize AI, and engineer digital products from strategy through production.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Consult America | Enterprise Transformation, Oracle, AI & Application Engineering",
    description:
      "Consult America helps organizations modernize enterprise platforms, connect data and workflows, operationalize AI, and engineer digital products from strategy through production.",
    type: "website",
    url: "https://consultamerica.net",
  },
};

export default function Home() {
  return (
    <>
      {/* 01. Minimal & Sophisticated Header with Full-Width Mega Menus */}
      <SiteHeader />

      <main className="experience-marketing">
        {/* 02. HERO: Light (#F7F9FA), 55/45 split, enterprise photography, 1 floating panel */}
        <Hero />

        {/* 03. CREDIBILITY: White (#FFFFFF) Platform Ecosystem Strip */}
        <TrustCredibility />

        {/* 04. BUSINESS OUTCOMES: Off-white (#F7F9FA) 4-column editorial typography & thin dividers */}
        <BusinessOutcomes />

        {/* 05. WHAT WE DO: White (#FFFFFF), Intro column + 4 visual modules with photography */}
        <WhatWeDo />

        {/* 06. ORACLE: Light (#F7F9FA) architectural design, 45% image / 55% capability rows + 1 controlled dark moment */}
        <OracleFlagship />

        {/* 07. CRM: White (#FFFFFF) with customer-facing photography, journey & connected system diagram */}
        <CRMShowcase />

        {/* 08. AI & DATA: Soft blue-gray (#EEF3F4) + photography & 4-step intelligence methodology */}
        <AIDataStory />

        {/* 09. CONSULT AMERICA LABS: Deep Navy (#0C2233) intro & Data Agent Flagship + Individual Products (Data Explorer, JobLens, MediGuide AI, Convera, HR & Talent) */}
        <LabsShowcase />

        {/* 10. SELECTED WORK: Off-white (#F7F9FA) editorial case study with 55/45 featured story & secondary modules */}
        <SelectedWorkSection />

        {/* 11. INDUSTRIES: 2x2 photography grid with subtle navy overlay */}
        <IndustriesSection />

        {/* 12. WHY CONSULT AMERICA: White (#FFFFFF) 4-part editorial manifesto */}
        <WhyConsultAmericaSection />

        {/* 13. INSIGHTS: Soft gray (#F7F9FA) publication-style interface */}
        <InsightsSection />

        {/* 14. CAREERS: 50/50 team photography + deep navy panel */}
        <CareersFeature />

        {/* 15. CONTACT CTA: Consult America Red (#B63A3A) with clean white form */}
        <GrowthCta />
      </main>

      {/* 16. FOOTER: Deep Navy (#0C2233 / #102033) */}
      <SiteFooter />
    </>
  );
}
