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
        {/* 02. HERO: Very Light (#F8FAF9), 50/50 split, premium editorial photography */}
        <Hero />

        {/* 03. CAPABILITY STRIP: White (#FFFFFF) restrained capability typography */}
        <TrustCredibility />

        {/* 04. BUSINESS OUTCOMES: Dark Green (#103F3E) 4-column editorial typography & thin dividers */}
        <BusinessOutcomes />

        {/* 05. WHAT WE DO: White (#FFFFFF) 4 visual modules with staggered editorial layout */}
        <WhatWeDo />

        {/* 06. ENTERPRISE TRANSFORMATION: Light Gray-Green (#EEF3F1) dedicated feature (Image left, Content right) */}
        <EnterpriseTransformationFeature />

        {/* 07. ORACLE FLAGSHIP: White (#FFFFFF) clean architecture & 6 editorial practice rows */}
        <OracleFlagship />

        {/* 08. CRM: Light Gray-Green (#EEF3F1) customer-facing photography, journey & architecture line */}
        <CRMShowcase />

        {/* 09. AI & DATA: Dark Green (#103F3E) + photography & 4-step intelligence methodology */}
        <AIDataStory />

        {/* 10. APPLICATION ENGINEERING & LABS: Practice intro, Data Agent Flagship, Alternating Products & Portfolio Gallery */}
        <LabsShowcase />

        {/* 11. SELECTED WORK: White (#FFFFFF) transformation in practice editorial case studies */}
        <SelectedWorkSection />

        {/* 12. INDUSTRIES: Dark Green (#103F3E) 2x2 photography grid */}
        <IndustriesSection />

        {/* 13. WHY CONSULT AMERICA: White (#FFFFFF) 4-part minimalist consulting manifesto */}
        <WhyConsultAmericaSection />

        {/* 14. INSIGHTS: Light (#F8FAF9) editorial publication layout */}
        <InsightsSection />

        {/* 15. CAREERS: White (#FFFFFF) team photography + green-gray panel */}
        <CareersFeature />

        {/* 16. CONTACT CTA: Dark Green (#103F3E / #0B3332) with clean white form */}
        <GrowthCta />
      </main>

      {/* 17. FOOTER: Deepest Green (#092C2D) */}
      <SiteFooter />
    </>
  );
}
