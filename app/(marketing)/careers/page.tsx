import type { Metadata } from "next";

import { MarketingPage } from "@/components/marketing-page";

export const metadata: Metadata = {
  title: "Careers | Consult America",
};

export default function CareersPage() {
  return (
    <MarketingPage
      eyebrow="Careers"
      title="Senior practitioners who want to own outcomes."
      description="We hire people who have shipped enterprise systems and still want to be close to clients and code."
      items={[
        {
          title: "Oracle consultants",
          description: "Fusion, EPM, and integration leads with delivery scars.",
        },
        {
          title: "Data and AI engineers",
          description:
            "People who can design a platform and sit in a steering meeting.",
        },
        {
          title: "Program managers",
          description:
            "Operators who keep scope honest and sponsors informed.",
        },
        {
          title: "How we hire",
          description:
            "A working conversation and a short case—not a twelve-round process.",
        },
      ]}
    />
  );
}
