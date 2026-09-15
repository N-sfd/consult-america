import type { Metadata } from "next";

import PlatformSuitePage, {
  PlatformWorkflowWindow,
} from "@/components/marketing/platform-suite-page";

export const metadata: Metadata = {
  title: "Employee — Self-Service",
  description:
    "Consult America Employee — profile, time, leave, and requests on the same people continuum as ATS and HR.",
};

export default function EmployeePlatformPage() {
  return (
    <PlatformSuitePage
      moduleId="employee"
      headline="Employee self-service on shared people data."
      problem="Portals that reinvent employee identity break the hire continuum — time, leave, and documents drift from HR."
      capabilities={[
        {
          title: "Profile",
          detail: "Personal data and preferences on the employee created from hire.",
        },
        {
          title: "Time & leave",
          detail: "Timesheets and PTO that managers and payroll can trust.",
        },
        {
          title: "Documents",
          detail: "Self-service document tasks without a second vault.",
        },
        {
          title: "HR requests",
          detail: "Employees raise requests that land in the HR queue.",
        },
        {
          title: "Pay visibility",
          detail: "Connects forward to Payroll on the same identity.",
        },
        {
          title: "Suite chrome",
          detail: "Same design DNA as ATS, HR, and Admin — lighter density for self-service.",
        },
      ]}
      workflowVisual={
        <PlatformWorkflowWindow title="Employee · Self-service" badge="Day-to-day work">
          <div className="space-y-3 text-sm">
            {[
              ["My profile", "Current"],
              ["Time entry", "This week"],
              ["Leave request", "Pending manager"],
              ["HR request", "Routed to HR"],
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
        "Employee identity is the hire outcome — not a parallel user store.",
        "Requests and time flow into HR and Payroll without re-entry.",
        "Switcher keeps Employee beside ATS, HR, and Admin.",
      ]}
      ctaLabel="Open Employee"
    />
  );
}
