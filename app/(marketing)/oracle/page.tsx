import type { Metadata } from "next";

import { MarketingPage } from "@/components/marketing-page";

export const metadata: Metadata = {
  title: "Oracle | Consult America",
};

export default function OraclePage() {
  return (
    <MarketingPage
      eyebrow="Oracle"
      title="Oracle Cloud programs that reach go-live and stay healthy."
      description="From Fusion and EPM to integrations and data, we plan, implement, and stabilize Oracle estates."
      items={[
        {
          title: "Fusion Cloud",
          description: "ERP, HCM, and SCM implementations with a clean cutover.",
        },
        {
          title: "EPM and analytics",
          description: "Planning, close, and reporting that finance teams will use.",
        },
        {
          title: "Integrations",
          description: "OIC, APIs, and event flows that keep systems in sync.",
        },
        {
          title: "Optimization",
          description:
            "Health checks, upgrades, and operating-model support after go-live.",
        },
      ]}
    />
  );
}
