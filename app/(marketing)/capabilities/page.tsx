import type { Metadata } from "next";

import { MarketingPage } from "@/components/marketing-page";

export const metadata: Metadata = {
  title: "Capabilities | Consult America",
};

export default function CapabilitiesPage() {
  return (
    <MarketingPage
      eyebrow="Capabilities"
      title="Enterprise delivery across strategy, platforms, and operations."
      description="We help teams modernize core systems, stand up data platforms, and run the programs that make change stick."
      items={[
        {
          title: "Transformation programs",
          description:
            "Roadmaps, operating models, and execution for multi-year change.",
        },
        {
          title: "Platform engineering",
          description:
            "Oracle Cloud, integrations, and the controls needed for production.",
        },
        {
          title: "Data and AI delivery",
          description:
            "Use cases, pipelines, and governed models that land in the business.",
        },
        {
          title: "Managed services",
          description:
            "Run, improve, and support the environments we help you launch.",
        },
      ]}
    />
  );
}
