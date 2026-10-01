import type { Metadata } from "next";

import AIDataStory from "@/components/marketing/ai-data-story";
import ApplicationEngineeringSection from "@/components/marketing/application-engineering-section";
import CapabilityEcosystem from "@/components/marketing/capability-ecosystem";
import Hero from "@/components/marketing/hero";
import HomepageCareersSection from "@/components/marketing/homepage-careers-section";
import HomepageClosingSection from "@/components/marketing/homepage-closing-section";
import HomepageContactSection from "@/components/marketing/homepage-contact-section";
import HomepagePlatformBand from "@/components/marketing/homepage-platform-band";
import OracleFlagship from "@/components/marketing/oracle-flagship";
import PositioningSection from "@/components/marketing/positioning-section";
import SelectedWorkSection from "@/components/marketing/selected-work-section";

export const metadata: Metadata = {
  title: "Enterprise Transformation, Oracle, AI & Application Engineering",
  description:
    "Consult America helps organizations modernize enterprise platforms, connect data and workflows, operationalize AI, and engineer digital products from strategy through production.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Enterprise Transformation, Oracle, AI & Application Engineering | Consult America",
    description:
      "Consult America helps organizations modernize enterprise platforms, connect data and workflows, operationalize AI, and engineer digital products from strategy through production.",
    type: "website",
    url: "https://consultamerica.net",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <PositioningSection />
      <CapabilityEcosystem />
      <OracleFlagship />
      <section aria-label="Intelligent engineering" className="border-b border-[var(--ca-line)]">
        <div className="mkt-shell pt-10 lg:pt-12">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
            Intelligent engineering
          </p>
          <h2 className="mt-2 max-w-2xl font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
            AI, data, and the applications around them.
          </h2>
        </div>
        <AIDataStory />
        <ApplicationEngineeringSection />
      </section>
      <HomepagePlatformBand />
      <SelectedWorkSection />
      <HomepageClosingSection />
      <HomepageCareersSection />
      <HomepageContactSection />
    </>
  );
}
