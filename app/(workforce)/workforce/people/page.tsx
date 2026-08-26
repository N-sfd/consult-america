import type { Metadata } from "next";

import WorkforcePlaceholderPage from "@/components/workforce/workforce-placeholder";

export const metadata: Metadata = { title: "Employees" };

export default function Page() {
  return (
    <WorkforcePlaceholderPage
      section="People"
      title="Employees"
      description="Directory, assignments, and workforce records across the organization."
    />
  );
}
