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
      { href: "/workforce/candidates", label: "Candidates" },
      { href: "/workforce/interviews", label: "Interviews" },
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
      { href: "/workforce/settings", label: "Settings" },
    ],
  },
];

export default function WorkforceShell({
  children,
  userName = "Nazia Ahmed",
  userInitials = "NA",
}: {
  children: React.ReactNode;
  userName?: string;
  userInitials?: string;
}) {
  return (
    <PlatformShell
      workspace="workforce"
      session={{
        displayName: userName,
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
