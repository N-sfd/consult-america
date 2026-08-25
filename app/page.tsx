import type { Metadata } from "next";

import Capabilities from "@/components/marketing/capabilities";
import FeaturedWork from "@/components/marketing/featured-work";
import Hero from "@/components/marketing/hero";
import InsightsPreview from "@/components/marketing/insights-preview";
import Introduction from "@/components/marketing/introduction";
import TrustCredibility from "@/components/marketing/trust-credibility";

export const metadata: Metadata = {
  title: "ConsultAmerica | The Enterprise Transformation Partner",
  description:
    "Technology that moves business forward—enterprise cloud, Oracle, and AI integration from roadmap to production.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustCredibility />
      <Introduction />
      <Capabilities />
      <FeaturedWork />
      <InsightsPreview />
    </main>
  );
}
