import type { Metadata } from "next";

import Capabilities from "@/components/marketing/capabilities";
import CareersFeature from "@/components/marketing/careers-feature";
import FeaturedWork from "@/components/marketing/featured-work";
import GrowthCta from "@/components/marketing/growth-cta";
import Hero from "@/components/marketing/hero";
import Industries from "@/components/marketing/industries";
import InsightsPreview from "@/components/marketing/insights-preview";
import SpecialistShowcase from "@/components/marketing/specialist-showcase";
import TrustCredibility from "@/components/marketing/trust-credibility";
import WhyConsultAmerica from "@/components/marketing/why-consultamerica";
import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "ConsultAmerica | The Enterprise Transformation Partner",
  description:
    "Oracle, AI, data, and enterprise transformation from strategy through production.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TrustCredibility />
        <Capabilities />
        <SpecialistShowcase />
        <Industries />
        <FeaturedWork />
        <WhyConsultAmerica />
        <CareersFeature />
        <InsightsPreview />
        <GrowthCta />
      </main>
      <SiteFooter />
    </>
  );
}
