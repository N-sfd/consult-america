import type { Metadata } from "next";

import PlatformSuitePage, {
  PlatformWorkflowWindow,
} from "@/components/marketing/platform-suite-page";

export const metadata: Metadata = {
  title: "Admin — Workforce Administration",
  description:
    "Consult America Admin — users, roles, security, audit, and configuration across ATS, HR, and CRM.",
};

export default function AdminPlatformPage() {
  return (
    <PlatformSuitePage
      moduleId="admin"
      headline="Admin governs the suite — it isn’t another product."
      problem="When administration is disconnected, every module invents its own users, roles, and audit trail — and security becomes inconsistent."
      capabilities={[
        {
          title: "Workforce Administration",
          detail: "Primary control plane for users, roles, and platform configuration.",
        },
        {
          title: "Users & access",
          detail: "Shared accounts across ATS, HR, Payroll, CRM, and Employee.",
        },
        {
          title: "Security & roles",
          detail: "Role grants that gate recruiting, HR, and admin surfaces consistently.",
        },
        {
          title: "Audit",
          detail: "Unified timeline across recruiting and workforce operations.",
        },
        {
          title: "System health",
          detail: "Connectivity and notification delivery visibility for operators.",
        },
        {
          title: "Suite chrome",
          detail: "Same application shell — Admin is a module, not a fork.",
        },
      ]}
      workflowVisual={
        <PlatformWorkflowWindow title="Admin · Workforce Administration" badge="Control plane">
          <div className="space-y-3 text-sm">
            {[
              ["Users & Access", "Role-governed"],
              ["Security", "Shared across suite"],
              ["Audit", "Recruiting + HR ops"],
              ["Configuration", "Persists for ATS / HR / CRM"],
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
        "One identity and role model for the enterprise suite.",
        "Audit and configuration stay beside the work — not in a silo.",
        "Operators reach ATS, HR, and CRM through the same chrome.",
      ]}
      ctaLabel="Open Admin"
    />
  );
}
