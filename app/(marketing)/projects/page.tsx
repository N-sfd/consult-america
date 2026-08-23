import type { Metadata } from "next";

import { MarketingPage } from "@/components/marketing-page";

export const metadata: Metadata = {
  title: "Projects | Consult America",
};

export default function ProjectsPage() {
  return (
    <MarketingPage
      eyebrow="Projects"
      title="Selected work across platforms, programs, and products."
      description="A sample of delivery patterns we repeat: scoped outcomes, named owners, and a path to production."
      items={[
        {
          title: "Oracle Fusion rollout",
          description:
            "Multi-entity finance transformation with a staged cutover.",
        },
        {
          title: "Public-sector data platform",
          description:
            "Shared analytics layer with role-based access and audit trails.",
        },
        {
          title: "AI document intake",
          description:
            "Classification and extraction pipeline that reduced manual review.",
        },
        {
          title: "Integration rebuild",
          description:
            "Replaced brittle point-to-point flows with a monitored hub.",
        },
      ]}
    />
  );
}
