import type { Metadata } from "next";

import AIDataStory from "@/components/marketing/ai-data-story";
import BusinessOutcomes from "@/components/marketing/business-outcomes";
import CareersFeature from "@/components/marketing/careers-feature";
import CRMShowcase from "@/components/marketing/crm-showcase";
import EnterpriseTransformationFeature from "@/components/marketing/enterprise-transformation-feature";
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
        {/* 02. HERO: Light (#F7F9FA), 52/48 split, premium editorial photography */}
        <Hero />

        {/* 03. CAPABILITY STRIP: Restrained capability typography */}
        <TrustCredibility />

        {/* 04. BUSINESS OUTCOMES: 4-column editorial typography & thin dividers */}
        <BusinessOutcomes />

        {/* 05. WHAT WE DO: 4 visual modules with staggered editorial layout */}
        <WhatWeDo />

        {/* 06. ENTERPRISE TRANSFORMATION: Dedicated feature (Image left, Content right) */}
        <EnterpriseTransformationFeature />

        {/* 07. ORACLE FLAGSHIP: Clean architecture & 6 editorial practice rows */}
        <OracleFlagship />

        {/* 08. CRM: Customer-facing photography, journey & architecture line */}
        <CRMShowcase />

        {/* 09. AI & DATA: Soft blue-gray (#EEF3F4) + photography & 4-step intelligence methodology */}
        <AIDataStory />

        {/* 10. APPLICATION ENGINEERING & LABS: Practice intro, Data Agent Flagship, Alternating Products & Portfolio Gallery */}
        <LabsShowcase />

        {/* 11. SELECTED WORK: Transformation in Practice editorial case studies */}
        <SelectedWorkSection />

        {/* 12. INDUSTRIES: 2x2 photography grid without compliance badges */}
        <IndustriesSection />

        {/* 13. WHY CONSULT AMERICA: 4-part minimalist consulting manifesto */}
        <WhyConsultAmericaSection />

        {/* 14. INSIGHTS: Editorial 60/40 publication layout */}
        <InsightsSection />

        {/* 15. CAREERS: 50/50 team photography + dark panel */}
        <CareersFeature />

        {/* 16. CONTACT CTA: Consult America Red (#B63A3A) with clean form */}
        <GrowthCta />
      </main>

      {/* 17. FOOTER: Deep Navy (#0C2233 / #102033) */}
      <SiteFooter />
    </>
  );
}
