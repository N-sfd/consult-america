import type { Metadata } from "next";

import PlatformSuitePage, {
  PlatformWorkflowWindow,
} from "@/components/marketing/platform-suite-page";

export const metadata: Metadata = {
  title: "Payroll — Runs & Earnings",
  description:
    "Consult America Payroll — runs, earnings, and deductions on the employee continuum from ATS → HR.",
};

export default function PayrollPlatformPage() {
  return (
    <PlatformSuitePage
      moduleId="payroll"
      headline="Payroll on the people continuum."
      problem="Payroll that can’t see the hire and HR record invents another employee file — and corrections never close."
      capabilities={[
        {
          title: "Payroll runs",
          detail: "Period-based runs with operational visibility.",
        },
        {
          title: "Earnings & deductions",
          detail: "Configured components on the shared employee pay record.",
        },
        {
          title: "Employee pay",
          detail: "Reads from the same people data HR maintains after hire.",
        },
        {
          title: "Approvals adjacency",
          detail: "Works with manager and HR queues already in the suite.",
        },
        {
          title: "Reporting",
          detail: "Operational reports without exporting a shadow workforce.",
        },
        {
          title: "Suite chrome",
          detail: "Same shell tokens and switcher as ATS, HR, and Admin.",
        },
      ]}
      workflowVisual={
        <PlatformWorkflowWindow title="Payroll · Runs" badge="On employee record">
          <div className="space-y-3 text-sm">
            {[
              ["Pay period", "Open"],
              ["Earnings", "Configured"],
              ["Deductions", "Configured"],
              ["Run", "Ready to start"],
            ].map(([label, status]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg border border-[var(--ca-line)] bg-[var(--ca-canvas)] px-3 py-2.5"
              >
                <span className="font-medium text-[var(--ca-ink)]">{label}</span>
                <span className="text-xs font-semibold text-[var(--ca-teal)]">{status}</span>
              </div>
            ))}
          </div>
        </PlatformWorkflowWindow>
      }
      outcomes={[
        "Pay sits on the employee created through ATS → HR.",
        "No third people master for payroll-only records.",
        "Operators stay in the same enterprise suite chrome.",
      ]}
      ctaLabel="Open Payroll"
    />
  );
}
