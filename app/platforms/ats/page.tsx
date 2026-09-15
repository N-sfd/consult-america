import type { Metadata } from "next";

import PlatformSuitePage, {
  PlatformWorkflowWindow,
} from "@/components/marketing/platform-suite-page";

export const metadata: Metadata = {
  title: "ATS — Recruiting",
  description:
    "Consult America ATS — recruiting through hire lineage into HR. Jobs, pipeline, interviews, and offers.",
};

export default function ATSPlatformPage() {
  return (
    <PlatformSuitePage
      moduleId="ats"
      headline="ATS with Recruiting at the center."
      problem="Hiring stalls when recruiting lives in a silo — offers don’t create employees, and HR re-enters the same people data."
      capabilities={[
        {
          title: "Jobs & pipeline",
          detail: "Requisitions, applications, and stage moves from persisted recruiting records.",
        },
        {
          title: "Interviews & offers",
          detail: "Operational queues with immutable accepted-offer rules under hire lineage.",
        },
        {
          title: "Candidate Match",
          detail: "Advisory scores inside the workflow — human review stays accountable.",
        },
        {
          title: "Hire continuity",
          detail: "Accepted offers create the employee in HR — status-only HIRED is blocked.",
        },
        {
          title: "Shared audit",
          detail: "Recruiting activity remains visible to Admin and HR with the same identity model.",
        },
        {
          title: "Suite chrome",
          detail: "Same platform shell as HR, CRM, and Admin — switch modules without leaving the OS.",
        },
      ]}
      workflowVisual={
        <PlatformWorkflowWindow title="ATS · Recruiting" badge="Hire lineage">
          <div className="space-y-3 text-sm">
            {[
              ["Requisition", "Open"],
              ["Application", "Interview"],
              ["Offer", "Extended"],
              ["Hire", "Creates employee in HR"],
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
        "Recruiting and HR share one people continuum.",
        "No duplicate candidate → employee master data.",
        "Operators switch to HR or Admin without a product hop.",
      ]}
      ctaLabel="Open ATS"
    />
  );
}
