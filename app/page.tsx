import type { Metadata } from "next";

import CapabilitiesShowcase from "@/components/marketing/capabilities-showcase";
import Faqs from "@/components/marketing/faqs";
import GlanceStats from "@/components/marketing/glance-stats";
import GrowthCta from "@/components/marketing/growth-cta";
import Hero from "@/components/marketing/hero";
import InsightsPreview from "@/components/marketing/insights-preview";
import Offices from "@/components/marketing/offices";
import SelectedWork from "@/components/marketing/selected-work";
import Testimonials from "@/components/marketing/testimonials";

export const metadata: Metadata = {
  title: "ConsultAmerica | The Enterprise Transformation Partner",
  description:
    "We help enterprises transform operations, modernize platforms, and unlock intelligent growth through Oracle, cloud, data and AI.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <CapabilitiesShowcase />
      <GlanceStats />
      <Testimonials />
      <SelectedWork />
      <InsightsPreview />
      <GrowthCta />
      <Offices />
      <Faqs />
    </main>
  );
}
