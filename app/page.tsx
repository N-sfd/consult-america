import type { Metadata } from "next";

import Capabilities from "@/components/marketing/capabilities";
import CareersFeature from "@/components/marketing/careers-feature";
import EnterprisePlatforms from "@/components/marketing/enterprise-platforms";
import FeaturedWork from "@/components/marketing/featured-work";
import GrowthCta from "@/components/marketing/growth-cta";
import Hero from "@/components/marketing/hero";
import Industries from "@/components/marketing/industries";
import InnovationPreview from "@/components/marketing/innovation-preview";
import InsightsPreview from "@/components/marketing/insights-preview";
import PlatformExperience from "@/components/marketing/platform-experience";
import SpecialistShowcase from "@/components/marketing/specialist-showcase";
import TrustCredibility from "@/components/marketing/trust-credibility";
import WhyConsultAmerica from "@/components/marketing/why-consultamerica";
import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "ConsultAmerica | Enterprise Platforms, Technology & Transformation",
  description:
    "Oracle Cloud, AI & data platforms, CRM, ATS, and enterprise transformation from strategy through production.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="experience-marketing">
        {/* 1. Light Hero */}
        <Hero />

        {/* 2. Dark Enterprise Proof Strip */}
        <TrustCredibility />

        {/* 3. Light Capabilities Explorer */}
        <Capabilities />

        {/* 4. Dark Technology Platform Showcase (Oracle, AI/Data, Cloud) */}
        <SpecialistShowcase />

        {/* 5. Light Enterprise Platforms (CRM Workspace, Tech Stack, ATS Talent) */}
        <EnterprisePlatforms />

        {/* 6. Image-led Industries Mosaic */}
        <Industries />

        {/* 7. Dark Selected Work */}
        <FeaturedWork />

        {/* 8. Light Innovation Showcase (Data Agent Flagship) */}
        <InnovationPreview />

        {/* 9. Platform Lifecycle (From Consulting to Operations) */}
        <PlatformExperience />

        {/* 10. Dark Why ConsultAmerica */}
        <WhyConsultAmerica />

        {/* 11. Light Careers (ATS-backed open roles) */}
        <CareersFeature />

        {/* 12. Light Insights */}
        <InsightsPreview />

        {/* 13. Strong Royal Blue CTA */}
        <GrowthCta />
      </main>
      <SiteFooter />
    </>
  );
}
