import type { Metadata } from "next";

import WorkforcePlaceholderPage from "@/components/workforce/workforce-placeholder";

export const metadata: Metadata = { title: "Organization" };

export default function Page() {
  return (
    <WorkforcePlaceholderPage
      section="People"
      title="Organization"
      description="Departments, reporting lines, and location structure."
    />
  );
}
