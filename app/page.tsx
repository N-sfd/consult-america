import type { Metadata } from "next";

import AIDataStory from "@/components/marketing/ai-data-story";
import ApplicationShowcase from "@/components/marketing/application-showcase";
import DeliveryModel from "@/components/marketing/delivery-model";
import EditorialImageBreak from "@/components/marketing/editorial-image-break";
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
      {/* 01. Announcement / Utility Bar & Navigation with Mega Menus */}
      <SiteHeader />

      <main className="experience-marketing">
        {/* 02. HERO: Photo + Command Center UI + Single Data Agent Floating Card */}
        <Hero />

        {/* 03. CAPABILITIES / PRACTICE LEADERSHIP STRIP: Light / Typography */}
        <TrustCredibility />

        {/* 04. EDITORIAL IMAGE BREAK: Wide 1440x600 Photographic Moment with 'TRANSFORMATION AT ENTERPRISE SCALE' */}
        <EditorialImageBreak />

        {/* 05. WHAT WE DO: Light / Reduced Density / 4 Capabilities with Clear Paragraphs */}
        <WhatWeDo />

        {/* 06. CONNECTED CORE: Dark / Architecture Node Hierarchy (Oracle → Integration → Data → AI → Apps → People) */}
        <EnterpriseMotion />

        {/* 07. ORACLE CLOUD: Light + UI + 7% Operations Background + Compact Chips */}
        <OracleFlagship />

        {/* 08. AI & DATA: Dark (#211E1B) + UI + Technical Grid + Data Agent Pipeline */}
        <AIDataStory />

        {/* 09. BUILT BY CONSULT AMERICA: Standardized Browser Frames for Data Agent, MediGuide AI & CRM */}
        <ApplicationShowcase />

        {/* 10. DELIVERY MODEL: Strategy → Design → Build → Integrate → Operate */}
        <DeliveryModel />

        {/* 11. SELECTED WORK: 2-Column Editorial Cards (45% Image / 55% Content) with Qualitative Claims */}
        <SelectedWorkSection />

        {/* 12. INDUSTRIES: Editorial Photographic Grid (50% Government, 25% Finance, 25% Healthcare, Supporting Row) */}
        <IndustriesSection />

        {/* 13. INSIGHTS: Magazine Publication Layout with 16:9 Featured & Editorial Thumbnails */}
        <InsightsSection />

        {/* 14. CONTACT: 52% Cinematic Photo Left / 48% Floating Warm-White Form Right */}
        <GrowthCta />
      </main>

      {/* 15. FOOTER: Textured Dark (#211E1B) with Pre-Footer 'BUILD WHAT'S NEXT' */}
      <SiteFooter />
    </>
  );
}
