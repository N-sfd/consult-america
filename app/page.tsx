import type { Metadata } from "next";

import CareersFeature from "@/components/marketing/careers-feature";
import EnterprisePlatforms from "@/components/marketing/enterprise-platforms";
import FeaturedWork from "@/components/marketing/featured-work";
import GrowthCta from "@/components/marketing/growth-cta";
import Hero from "@/components/marketing/hero";
import Industries from "@/components/marketing/industries";
import InnovationPreview from "@/components/marketing/innovation-preview";
import InsightsPreview from "@/components/marketing/insights-preview";
import SpecialistShowcase from "@/components/marketing/specialist-showcase";
import ThreePillars from "@/components/marketing/three-pillars";
import TrustCredibility from "@/components/marketing/trust-credibility";
import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "ConsultAmerica | Enterprise Consulting, Technology & Platforms",
  description:
    "ConsultAmerica delivers enterprise transformation consulting, Oracle and AI technology architecture, and unified software platforms from strategy through production.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="experience-marketing">
        {/* 01. Light Hero with Application Platform Shell */}
        <Hero />

        {/* 02. Dark Enterprise Proof Strip */}
        <TrustCredibility />

        {/* 03. Three Flagship Pillars: Consulting | Technology | Platforms */}
        <ThreePillars />

        {/* 04. Dark Technology Architecture Showcase (Oracle, Integration, AI/Data) */}
        <SpecialistShowcase />

        {/* 05. Light Enterprise Platforms Showcase (CRM, ATS, HR & Workforce) */}
        <EnterprisePlatforms />

        {/* 06. Single Powerful Data Agent AI Flagship Presentation */}
        <InnovationPreview />

        {/* 07. Image-Led Industries Mosaic */}
        <Industries />

        {/* 08. Dark Selected Work (Dominant Flagship + 2 Supporting) */}
        <FeaturedWork />

        {/* 09. Light Careers (ATS-backed live requisitions) */}
        <CareersFeature />

        {/* 10. Light Insights (Enterprise Transformation & Tech Articles) */}
        <InsightsPreview />

        {/* 11. Final Royal Blue Growth CTA */}
        <GrowthCta />
      </main>
      <SiteFooter />
    </>
  );
}
