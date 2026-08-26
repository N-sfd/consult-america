import type { Metadata } from "next";

import AiDataFeature from "@/components/marketing/ai-data-feature";
import Capabilities from "@/components/marketing/capabilities";
import CareersFeature from "@/components/marketing/careers-feature";
import FeaturedWork from "@/components/marketing/featured-work";
import GrowthCta from "@/components/marketing/growth-cta";
import Hero from "@/components/marketing/hero";
import Industries from "@/components/marketing/industries";
import InsightsPreview from "@/components/marketing/insights-preview";
import Introduction from "@/components/marketing/introduction";
import OracleFeature from "@/components/marketing/oracle-feature";
import TrustCredibility from "@/components/marketing/trust-credibility";
import WhyConsultAmerica from "@/components/marketing/why-consultamerica";
import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "ConsultAmerica | The Enterprise Transformation Partner",
  description:
    "Technology that moves business forward—enterprise cloud, Oracle, and AI integration from roadmap to production.",
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* 01 Cinematic hero — dark + full visual */}
        <Hero />
        {/* 02 Trust — white + logos + photography */}
        <TrustCredibility />
        {/* 03 Who we are — editorial split */}
        <Introduction />
        {/* 04 Capabilities — dark interactive service index */}
        <Capabilities />
        {/* 05 Oracle — deep navy + product visualization */}
        <OracleFeature />
        {/* 06 Featured work — full-bleed case studies */}
        <FeaturedWork />
        {/* 07 AI + Data — light + Data Agent UI */}
        <AiDataFeature />
        {/* 08 Industries — image mosaic */}
        <Industries />
        {/* 09 Why ConsultAmerica — metrics + differentiators */}
        <WhyConsultAmerica />
        {/* 10 Careers — people photography + live jobs */}
        <CareersFeature />
        {/* 11 Insights — editorial cards */}
        <InsightsPreview />
        {/* 12 CTA — bold closing statement */}
        <GrowthCta />
      </main>
      <SiteFooter />
    </>
  );
}
