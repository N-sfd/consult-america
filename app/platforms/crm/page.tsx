import type { Metadata } from "next";

import PlatformSuitePage, {
  PlatformWorkflowWindow,
} from "@/components/marketing/platform-suite-page";

export const metadata: Metadata = {
  title: "CRM — Pipeline & ClientFlow",
  description:
    "Consult America CRM — accounts, opportunities, and ClientFlow lifecycle automation inside one workspace.",
};

export default function CRMPlatformPage() {
  return (
    <PlatformSuitePage
      moduleId="crm"
      headline="CRM that carries the client continuum."
      problem="Revenue teams lose context when CRM is disconnected from delivery systems — and automation lives outside the contact timeline."
      capabilities={[
        {
          title: "Accounts & contacts",
          detail: "Customer 360 with normalized identity for durable inquiry capture.",
        },
        {
          title: "Opportunities",
          detail: "Pipeline stages for multi-stakeholder enterprise deals.",
        },
        {
          title: "ClientFlow",
          detail: "Capture → communicate → enroll → automate on the same contact record.",
        },
        {
          title: "Email delivery",
          detail: "Outbox, delivery state, and timeline — inquiry survives provider failure.",
        },
        {
          title: "Templates & workflows",
          detail: "Templates say what; workflows decide when — governed inside CRM.",
        },
        {
          title: "Suite chrome",
          detail: "Same shell and switcher as ATS, HR, and Admin.",
        },
      ]}
      workflowVisual={
        <PlatformWorkflowWindow title="CRM · ClientFlow" badge="Inquiry → timeline">
          <div className="space-y-3 text-sm">
            {[
              ["Talk to Expert", "Inquiry saved"],
              ["Welcome email", "Queued → sent"],
              ["Enrollment", "Service relationship"],
              ["Automation", "Follow-up on contact"],
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
        "Client and opportunity context stay on the contact.",
        "ClientFlow automation runs inside CRM — not a bolt-on ESP.",
        "Admin governs CRM access with the same suite identity model.",
      ]}
      ctaLabel="Open CRM"
    />
  );
}
