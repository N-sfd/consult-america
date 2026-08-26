import type { Metadata } from "next";

import { MarketingPage } from "@/components/marketing-page";

export const metadata: Metadata = {
  title: "Industries | Consult America",
};

export default function IndustriesPage() {
  return (
    <MarketingPage
      eyebrow="Industries"
      title="Sector context, not generic playbooks."
      description="We work with public sector, regulated enterprise, and high-growth operators who need systems that hold up under scrutiny."
      items={[
        {
          title: "Government & Public Sector",
          description:
            "Modernize public-sector finance, procurement, grants, workforce, data, and service delivery.",
        },
        {
          title: "Financial Services",
          description:
            "Connect finance, data, automation, reporting, and enterprise platforms for operational control.",
        },
        {
          title: "Healthcare",
          description:
            "Modernize enterprise operations, workforce, financial systems, and clinical technology environments.",
        },
        {
          title: "Retail & Consumer",
          description:
            "Connect finance, supply chain, planning, analytics, and digital platforms for faster decisions.",
        },
        {
          title: "Transportation",
          description:
            "Improve asset, project, procurement, workforce, and operational processes across infrastructure.",
        },
        {
          title: "Technology",
          description:
            "Scale enterprise platforms, automate operations, integrate systems, and turn data into decisions.",
        },
      ]}
    />
  );
}
