import type { Metadata } from "next";

import AIDataStory from "@/components/marketing/ai-data-story";
import BusinessOutcomes from "@/components/marketing/business-outcomes";
import CRMShowcase from "@/components/marketing/crm-showcase";
import DeliveryModel from "@/components/marketing/delivery-model";
import EnterpriseMotion from "@/components/marketing/enterprise-motion";
import GrowthCta from "@/components/marketing/growth-cta";
import Hero from "@/components/marketing/hero";
import IndustriesSection from "@/components/marketing/industries-section";
import InsightsSection from "@/components/marketing/insights-section";
import LabsShowcase from "@/components/marketing/labs-showcase";
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
      {/* 01. Announcement / Utility Bar & Navigation with Mega Menus */}
      <SiteHeader />

      <main className="experience-marketing">
        {/* 02. Upgraded Enterprise Transformation Hero (Atmospheric Photo, Warm Ivory Overlay, Command Center, Floating UI, Capability Rail) */}
        <Hero />

        {/* 03. Practice Leadership Credibility Strip */}
        <TrustCredibility />

        {/* 04. Business Outcomes First (Large Editorial Statement with 6% Texture) */}
        <BusinessOutcomes />

        {/* 05. What We Do (4 Practices with Cohesive Photography & UI Overlays) */}
        <WhatWeDo />

        {/* 06. Enterprise in Motion (Dark Architectural Connected Systems #2B2420) */}
        <EnterpriseMotion />

        {/* 07. Oracle Transformation (Oracle Control Center & Connected Core Architecture) */}
        <OracleFlagship />

        {/* 08. CRM & Customer Experience (Customer 360 Workspace & Unified Customer Journey) */}
        <CRMShowcase />

        {/* 09. Governed AI & Data (Dark Section #211E1B with 5-Step Extraction Pipeline) */}
        <AIDataStory />

        {/* 10. Consult America Labs ("We don't only advise. We build." — Data Agent, MediGuide AI, Convera, HR & Talent) */}
        <LabsShowcase />

        {/* 11. Transformation Delivery Model (Strategy → Design → Build → Integrate → Operate) */}
        <DeliveryModel />

        {/* 12. Selected Work (Featured Oracle Case & 16:9 Editorial Stories) */}
        <SelectedWorkSection />

        {/* 13. Industries (4 Large Full-Bleed Photographic Panels: Government, Finance, Healthcare, Tech) */}
        <IndustriesSection />

        {/* 14. Insights (50/50 Publication Layout with Editorial Thumbnails) */}
        <InsightsSection />

        {/* 15. Contact CTA (Cinematic Background Photo with Floating Warm-White Form) */}
        <GrowthCta />
      </main>

      {/* 16. Textured Dark Footer with 'BUILD WHAT'S NEXT' Pre-Footer Statement */}
      <SiteFooter />
    </>
  );
}
