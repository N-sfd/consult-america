import type { Metadata } from "next";

import AIDataStory from "@/components/marketing/ai-data-story";
import BusinessOutcomes from "@/components/marketing/business-outcomes";
import CareersFeature from "@/components/marketing/careers-feature";
import CRMShowcase from "@/components/marketing/crm-showcase";
import DataAgentFlagship from "@/components/marketing/data-agent-flagship";
import GrowthCta from "@/components/marketing/growth-cta";
import Hero from "@/components/marketing/hero";
import IndustriesSection from "@/components/marketing/industries-section";
import InsightsSection from "@/components/marketing/insights-section";
import LabsShowcase from "@/components/marketing/labs-showcase";
import OracleFlagship from "@/components/marketing/oracle-flagship";
import PlatformsEcosystem from "@/components/marketing/platforms-ecosystem";
import SelectedWorkSection from "@/components/marketing/selected-work-section";
import TrustCredibility from "@/components/marketing/trust-credibility";
import WhatWeDo from "@/components/marketing/what-we-do";
import WhyConsultAmericaSection from "@/components/marketing/why-consult-america-section";
import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Consult America | Enterprise Transformation, Oracle, AI & Application Engineering",
  description:
    "Consult America helps organizations modernize enterprise platforms, operationalize AI and data, transform Oracle environments, and build enterprise applications from strategy through production.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Consult America | Enterprise Transformation, Oracle, AI & Application Engineering",
    description:
      "Consult America helps organizations modernize enterprise platforms, operationalize AI and data, transform Oracle environments, and build enterprise applications from strategy through production.",
    type: "website",
    url: "https://consultamerica.com",
  },
};

export default function Home() {
  return (
    <>
      {/* 01. Premium Minimal Navigation with Top Utility Bar & Mega Menu */}
      <SiteHeader />

      <main className="experience-marketing">
        {/* 02. Sophisticated Editorial Hero (65% copy / 35% photography) */}
        <Hero />

        {/* 03. Credibility / Ecosystem Strip */}
        <TrustCredibility />

        {/* 04. Business Outcome Intro (Large editorial statement + 4 outcome modules) */}
        <BusinessOutcomes />

        {/* 05. What We Do (4 large alternating editorial capability blocks) */}
        <WhatWeDo />

        {/* 06. Oracle Flagship (Modernize the digital core + Oracle + AI) */}
        <OracleFlagship />

        {/* 07. CRM & Customer Experience (Customer journey + connected enterprise fabric) */}
        <CRMShowcase />

        {/* 08. AI + Data Story (Slalom-inspired outcome-first 4-step transformation) */}
        <AIDataStory />

        {/* 09. Data Agent Flagship (Dark editorial section + real product screenshot + workflow) */}
        <DataAgentFlagship />

        {/* 10. Consult America Labs (We don't only advise. We build — 4 large alternating product modules) */}
        <LabsShowcase />

        {/* 11. Enterprise Platforms (Connected software for customer and workforce operations) */}
        <PlatformsEcosystem />

        {/* 12. Selected Work (1 dominant featured case study + 2 supporting cases) */}
        <SelectedWorkSection />

        {/* 13. Industries (4 large industry modules with photography & whitespace) */}
        <IndustriesSection />

        {/* 14. Why Consult America (Strategy that stays connected to delivery + 4 principles) */}
        <WhyConsultAmericaSection />

        {/* 15. Insights & Perspectives (Editorial publication layout) */}
        <InsightsSection />

        {/* 16. Careers (Build what's next + live open requisitions from ATS) */}
        <CareersFeature />

        {/* 17. Contact & Conversion (Warm burgundy section with validated inquiry form) */}
        <GrowthCta />
      </main>

      {/* Enterprise Footer */}
      <SiteFooter />
    </>
  );
}
