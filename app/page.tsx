import type { Metadata } from "next";

import AiDataFeature from "@/components/marketing/ai-data-feature";
import Capabilities from "@/components/marketing/capabilities";
import CareersFeature from "@/components/marketing/careers-feature";
import FeaturedWork from "@/components/marketing/featured-work";
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
        <Hero />
        <TrustCredibility />
        <Introduction />
        <Capabilities />
        <OracleFeature />
        <AiDataFeature />
        <Industries />
        <FeaturedWork />
        <WhyConsultAmerica />
        <CareersFeature />
        <InsightsPreview />
      </main>
      <SiteFooter />
    </>
  );
}
