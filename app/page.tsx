import type { Metadata } from "next";

import AIDataStory from "@/components/marketing/ai-data-story";
import ApplicationShowcase from "@/components/marketing/application-showcase";
import DeliveryModel from "@/components/marketing/delivery-model";
import EnterpriseMotion from "@/components/marketing/enterprise-motion";
import GrowthCta from "@/components/marketing/growth-cta";
import Hero from "@/components/marketing/hero";
import IndustriesSection from "@/components/marketing/industries-section";
import InsightsSection from "@/components/marketing/insights-section";
import OracleFlagship from "@/components/marketing/oracle-flagship";
import SelectedWorkSection from "@/components/marketing/selected-work-section";
import TrustCredibility from "@/components/marketing/trust-credibility";
import WhatWeDo from "@/components/marketing/what-we-do";
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
    url: "https://consultamerica.net",
  },
};

export default function Home() {
  return (
    <>
      {/* 01 & 02. Announcement / Utility Bar & Navigation with Mega Menus */}
      <SiteHeader />

      <main className="experience-marketing">
        {/* 03. Enterprise Transformation Hero (56% copy / 44% interactive workspace) */}
        <Hero />

        {/* 04. Client / Capability Credibility Strip */}
        <TrustCredibility />

        {/* 05. What We Do (Editorial Value Proposition & 4 Minimal Columns) */}
        <WhatWeDo />

        {/* 06. Enterprise in Motion (Dark Architectural Connected Systems #2B2420) */}
        <EnterpriseMotion />

        {/* 07. Oracle Transformation (Fusion Cloud Operating Core & OIC Hub) */}
        <OracleFlagship />

        {/* 08. AI & Data (Governed AI, Document Intelligence & Live Workspace) */}
        <AIDataStory />

        {/* 09. Built by Consult America / Application Showcase (Data Agent, MediGuide AI, CRM Workspace) */}
        <ApplicationShowcase />

        {/* 10. Transformation Delivery Model (Strategy → Design → Build → Integrate → Operate) */}
        <DeliveryModel />

        {/* 11. Selected Work (16:9 Editorial Case Studies) */}
        <SelectedWorkSection />

        {/* 12. Industries (Interactive domain expertise & compliance focus) */}
        <IndustriesSection />

        {/* 13. Insights (Magazine Publication Layout & Perspectives) */}
        <InsightsSection />

        {/* 14. Contact CTA (Warm Ivory + Burgundy Action Form) */}
        <GrowthCta />
      </main>

      {/* 15. Dark Footer with 'BUILD WHAT'S NEXT' Pre-Footer Statement */}
      <SiteFooter />
    </>
  );
}
