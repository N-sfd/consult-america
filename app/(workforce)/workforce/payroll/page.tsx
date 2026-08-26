import type { Metadata } from "next";

import WorkforcePlaceholderPage from "@/components/workforce/workforce-placeholder";

export const metadata: Metadata = { title: "Payroll" };

export default function Page() {
  return (
    <WorkforcePlaceholderPage
      section="Payroll"
      title="Payroll"
      description="Pay runs, adjustments, and earnings visibility—coming online with HRIS integration."
    />
  );
}
