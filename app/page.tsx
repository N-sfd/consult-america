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
        {/* 01 Hero — Cloud Blue visual */}
        <Hero />
        {/* 02 Trust — white + logos + photography */}
        <TrustCredibility />
        {/* 03 Who we are — Warm White editorial split */}
        <Introduction />
        {/* 04 Capabilities — Deep Navy interactive service index */}
        <Capabilities />
        {/* 05 Oracle — Pale Blue + product visualization */}
        <OracleFeature />
        {/* 06 Featured work — white + full-bleed case studies */}
        <FeaturedWork />
        {/* 07 AI + Data — Ice Blue Data Agent UI */}
        <AiDataFeature />
        {/* 08 Industries — Warm White photographic mosaic */}
        <Industries />
        {/* 09 Why ConsultAmerica — Deep Navy metrics + differentiators */}
        <WhyConsultAmerica />
        {/* 10 Careers — Pale Blue + people photography + live jobs */}
        <CareersFeature />
        {/* 11 Insights — white editorial cards */}
        <InsightsPreview />
        {/* 12 CTA — Blue closing statement */}
        <GrowthCta />
      </main>
      <SiteFooter />
    </>
  );
}
