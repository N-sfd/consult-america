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
      {/* 01. Minimal & Sophisticated Header with Deep Green Utility Bar */}
      <SiteHeader />

      <main className="experience-marketing">
        {/* 02. HERO: Pale Green Atmosphere (#F0F6F4), Layered Asymmetric Arch Composition */}
        <Hero />

        {/* 03. CAPABILITY STRIP: White (#FFFFFF) restrained capability typography */}
        <TrustCredibility />

        {/* 04. BUSINESS OUTCOMES: Dark Emerald Gradient (#073B3A -> #0B4A47 -> #176A63) */}
        <BusinessOutcomes />

        {/* 05. WHAT WE DO: White (#FFFFFF) 4 Shaped Architectural Service Cards */}
        <WhatWeDo />

        {/* 06. ENTERPRISE TRANSFORMATION: Pale Sage (#E1ECE8) Two-Image Composition */}
        <EnterpriseTransformationFeature />

        {/* 07. ORACLE FLAGSHIP: White (#FFFFFF) Tall Arch Image & Geometric Backdrop Panel */}
        <OracleFlagship />

        {/* 08. CRM: Green 50 (#F0F6F4) Asymmetric Customer Photography & Journey Line */}
        <CRMShowcase />

        {/* 09. AI & DATA: Deep Emerald Gradient (#073B3A -> #105A55) Architectural Cut Mask */}
        <AIDataStory />

        {/* 10. APPLICATION ENGINEERING & LABS: Practice Intro, Data Agent (#073B3A), Alternating Products */}
        <LabsShowcase />

        {/* 11. SELECTED WORK: White (#FFFFFF) Transformation in Practice Shaped Case Studies */}
        <SelectedWorkSection />

        {/* 12. INDUSTRIES: Deep Green (#073B3A) Editorial Mosaic with Mixed Shapes */}
        <IndustriesSection />

        {/* 13. WHY CONSULT AMERICA: White (#FFFFFF) 4-part Minimalist Consulting Manifesto */}
        <WhyConsultAmericaSection />

        {/* 14. INSIGHTS: Pale Green Atmosphere (#F0F6F4) Editorial Publication Layout */}
        <InsightsSection />

        {/* 15. CAREERS: White (#FFFFFF) + Shaped Team Arch Photo & Pale Sage Panel */}
        <CareersFeature />

        {/* 16. CONTACT CTA: Deep Emerald Gradient (#073B3A -> #105A55) with Clean White Form */}
        <GrowthCta />
      </main>

      {/* 17. FOOTER: Deepest Green-Black (#052827) */}
      <SiteFooter />
    </>
  );
}
