import type { Metadata } from "next";

import WorkforcePlaceholderPage from "@/components/workforce/workforce-placeholder";

export const metadata: Metadata = { title: "Interviews" };

export default function Page() {
  return (
    <WorkforcePlaceholderPage
      section="Recruiting"
      title="Interviews"
      description="Schedule, scorecards, and feedback loops for active requisitions."
    />
  );
}
