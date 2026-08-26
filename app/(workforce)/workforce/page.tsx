import type { Metadata } from "next";

import WorkforceOverview from "@/components/workforce/workforce-overview";

export const metadata: Metadata = {
  title: "Overview",
};

export default function WorkforceHomePage() {
  return <WorkforceOverview />;
}
