import type { Metadata } from "next";

import PlatformSuitePage, {
  PlatformWorkflowWindow,
} from "@/components/marketing/platform-suite-page";

export const metadata: Metadata = {
  title: "HR — Requests & People",
  description:
    "Consult America HR — requests and people operations from hire onward, continuous with ATS and Employee.",
};

export default function HRPlatformPage() {
  return (
    <PlatformSuitePage
      moduleId="hr"
      headline="HR starts where ATS finishes."
      problem="After hire, teams lose continuity when HR is a separate system — onboarding, documents, and requests start from a blank employee."
      capabilities={[
        {
          title: "Requests",
          detail: "Service desk for employees from hire onward — the primary HR operating queue.",
        },
        {
          title: "People records",
          detail: "Employee directory and 360 profile seeded by accepted ATS offers.",
        },
        {
          title: "Onboarding continuity",
          detail: "Pre-hire and active employees without re-keying recruiting data.",
        },
        {
          title: "Documents & compliance",
          detail: "Role-governed document workflows on the same employee identity.",
        },
        {
          title: "Time & leave handoff",
          detail: "Connects to Employee self-service and Payroll on shared people data.",
        },
        {
          title: "Suite chrome",
          detail: "Same shell and switcher as ATS, Employee, Payroll, and Admin.",
        },
      ]}
      workflowVisual={
        <PlatformWorkflowWindow title="HR · Requests" badge="From hire onward">
          <div className="space-y-3 text-sm">
            {[
              ["New hire from ATS", "Pre-hire"],
              ["Onboarding checklist", "In progress"],
              ["HR request", "Queued"],
              ["Employee self-service", "Active"],
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
        "Hire in ATS becomes the employee record in HR.",
        "Requests operate on real people — not a parallel HR database.",
        "Employee and Payroll stay on the same continuum.",
      ]}
      ctaLabel="Open HR Requests"
    />
  );
}
