"use client";

import PlatformShell from "@/components/platform/platform-shell";
import type { PlatformNavGroup } from "@/components/platform/platform-nav";

const LEGACY_WORKFORCE_NAV: PlatformNavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/workforce", label: "Dashboard", exact: true }],
  },
  {
    label: "Recruiting",
    items: [
      { href: "/workforce/jobs", label: "Jobs" },
      { href: "/app/recruiting/applications", label: "Applications" },
      { href: "/workforce/candidates", label: "Candidates" },
      { href: "/workforce/interviews", label: "Interviews" },
      { href: "/app/recruiting/job-match", label: "Candidate Match" },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/workforce/people", label: "Employees" },
      { href: "/workforce/organization", label: "Organization" },
    ],
  },
  {
    label: "Workforce",
    items: [
      { href: "/employee/time", label: "Time" },
      { href: "/employee/leave", label: "Leave" },
      { href: "/manager/approvals", label: "Approvals" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/workforce/payroll", label: "Payroll" },
      { href: "/workforce/notifications", label: "Notifications" },
      { href: "/workforce/audit", label: "Audit" },
      { href: "/workforce/system-health", label: "System Health" },
      { href: "/workforce/users", label: "Users" },
      { href: "/workforce/settings", label: "Settings" },
    ],
  },
];

export default function WorkforceShell({
  children,
  userName,
  userInitials,
}: {
  children: React.ReactNode;
  userName?: string;
  userInitials?: string;
}) {
  return (
    <PlatformShell
      workspace="workforce"
      session={{
        displayName: userName ?? "Workforce User",
        initials: userInitials,
        roleLabel: "Workforce",
      }}
      navGroups={LEGACY_WORKFORCE_NAV}
      showSearch
      searchPlaceholder="Search people, jobs, candidates…"
      logoHref="/workforce"
    >
      {children}
    </PlatformShell>
  );
}
