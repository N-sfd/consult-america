/**
 * Shared navigation config for Consult America platform shells.
 * Routes and labels only — no business logic.
 */

export type PlatformNavLink = {
  href: string;
  label: string;
  exact?: boolean;
  badgeKey?: "notifications" | "approvals";
  disabled?: boolean;
};

export type PlatformNavGroup = {
  label?: string;
  items: PlatformNavLink[];
};

export type PlatformWorkspaceId =
  | "employee"
  | "manager"
  | "hr"
  | "payroll"
  | "workforce"
  | "candidate"
  | "crm";

export type PlatformShellVariant = "admin" | "self-service" | "candidate" | "crm";

export const WORKSPACE_META: Record<
  PlatformWorkspaceId,
  { name: string; eyebrow: string; homeHref: string; variant: PlatformShellVariant }
> = {
  employee: {
    name: "Employee",
    eyebrow: "Consult America Platform",
    homeHref: "/employee",
    variant: "self-service",
  },
  manager: {
    name: "Manager",
    eyebrow: "Consult America Platform",
    homeHref: "/manager",
    variant: "admin",
  },
  hr: {
    name: "HR",
    eyebrow: "Consult America Platform",
    homeHref: "/hr/requests",
    variant: "admin",
  },
  payroll: {
    name: "Payroll",
    eyebrow: "Consult America Platform",
    homeHref: "/payroll",
    variant: "admin",
  },
  workforce: {
    name: "ATS",
    eyebrow: "Consult America Platform",
    homeHref: "/app/dashboard",
    variant: "admin",
  },
  candidate: {
    name: "Candidate",
    eyebrow: "Consult America Platform",
    homeHref: "/candidate",
    variant: "self-service",
  },
  crm: {
    name: "CRM",
    eyebrow: "Consult America Platform",
    homeHref: "/crm",
    variant: "crm",
  },
};

export const NAV_BY_WORKSPACE: Record<PlatformWorkspaceId, PlatformNavGroup[]> = {
  employee: [
    {
      label: "Overview",
      items: [
        { href: "/employee", label: "Home", exact: true },
        { href: "/employee/profile", label: "My Profile" },
        { href: "/employee/directory", label: "Directory" },
      ],
    },
    {
      label: "My Work",
      items: [
        { href: "/employee/time", label: "Time" },
        { href: "/employee/leave", label: "Leave" },
        { href: "/employee/expenses", label: "Expenses" },
        { href: "/employee/documents", label: "Documents" },
        { href: "/employee/onboarding", label: "Onboarding" },
      ],
    },
    {
      label: "Pay & Benefits",
      items: [
        { href: "/employee/pay", label: "Pay" },
        { href: "/employee/benefits", label: "Benefits" },
      ],
    },
    {
      label: "Growth",
      items: [
        { href: "/employee/goals", label: "Goals" },
        { href: "/employee/performance", label: "Performance" },
      ],
    },
    {
      label: "Support",
      items: [
        { href: "/employee/requests", label: "HR Requests" },
        { href: "/employee/notifications", label: "Notifications", badgeKey: "notifications" },
      ],
    },
  ],
  manager: [
    {
      label: "Overview",
      items: [
        { href: "/manager", label: "Home", exact: true },
        { href: "/manager/team", label: "My Team" },
        { href: "/manager/approvals", label: "Approvals", badgeKey: "approvals" },
      ],
    },
    {
      label: "Team",
      items: [
        { href: "/manager/time", label: "Team Time" },
        { href: "/manager/leave", label: "Team Leave" },
        { href: "/manager/reports", label: "Team Reports" },
        { href: "/manager/notifications", label: "Notifications", badgeKey: "notifications" },
      ],
    },
  ],
  hr: [
    {
      label: "Service Desk",
      items: [
        { href: "/hr/requests", label: "Requests" },
        { href: "/hr/reports", label: "Reports" },
        { href: "/hr/audit", label: "Audit Log" },
        { href: "/hr/notifications", label: "Notifications", badgeKey: "notifications" },
      ],
    },
  ],
  payroll: [
    {
      label: "Overview",
      items: [
        { href: "/payroll", label: "Overview", exact: true },
        { href: "/payroll/runs", label: "Payroll Runs" },
        { href: "/payroll/pay-periods", label: "Pay Periods" },
      ],
    },
    {
      label: "Operations",
      items: [
        { href: "/payroll/employee-pay", label: "Employee Pay" },
        { href: "/payroll/earnings", label: "Earnings" },
        { href: "/payroll/deductions", label: "Deductions" },
        { href: "/payroll/reports", label: "Reports" },
        { href: "/payroll/settings", label: "Settings" },
      ],
    },
  ],
  workforce: [
    {
      label: "Overview",
      items: [{ href: "/app/dashboard", label: "Overview", exact: true }],
    },
    {
      label: "ATS · Recruiting",
      items: [
        { href: "/app/recruiting", label: "Recruiting", exact: true },
        { href: "/app/recruiting/jobs", label: "Jobs" },
        { href: "/app/recruiting/applications", label: "Applications" },
        { href: "/app/recruiting/candidates", label: "Candidates" },
        { href: "/app/recruiting/interviews", label: "Interviews" },
        { href: "/app/recruiting/offers", label: "Offers" },
        { href: "/app/recruiting/job-match", label: "Candidate Match" },
      ],
    },
    {
      label: "People",
      items: [
        { href: "/workforce/people", label: "Employees" },
        {
          href: "/workforce/people?status=PRE_HIRE",
          label: "Onboarding",
        },
      ],
    },
    {
      label: "HR Operations",
      items: [
        { href: "/hr/requests", label: "Requests" },
        { href: "/employee/time", label: "Time & Leave" },
        { href: "/employee/documents", label: "Documents" },
        { href: "/payroll", label: "Payroll" },
      ],
    },
    {
      label: "Reports",
      items: [{ href: "/workforce/reports", label: "Reports" }],
    },
    {
      label: "Admin",
      items: [
        { href: "/workforce/administration", label: "Workforce Administration" },
        { href: "/workforce/users", label: "Users & Access" },
        { href: "/workforce/system-health", label: "System Health" },
        { href: "/workforce/notifications", label: "Notifications" },
        { href: "/workforce/audit", label: "Audit" },
        { href: "/workforce/settings", label: "Configuration" },
      ],
    },
  ],
  candidate: [
    {
      label: "Candidate Portal",
      items: [
        { href: "/candidate", label: "Home", exact: true },
        { href: "/candidate/profile", label: "My Profile" },
        { href: "/candidate/documents", label: "Documents" },
        { href: "/candidate/jobs", label: "Jobs" },
        { href: "/candidate/applications", label: "Applications" },
        { href: "/candidate/interviews", label: "Interviews" },
        { href: "/candidate/job-match", label: "Job Match" },
      ],
    },
  ],
  crm: [
    {
      label: "Pipeline",
      items: [
        { href: "/crm", label: "Dashboard", exact: true },
        { href: "/crm/accounts", label: "Accounts" },
        { href: "/crm/opportunities", label: "Opportunities" },
        { href: "/crm/contacts", label: "Contacts" },
        { href: "/crm/emails", label: "Email delivery" },
        { href: "/crm/templates", label: "Email templates" },
      ],
    },
  ],
};

export const DEMO_WORKSPACES: {
  id: PlatformWorkspaceId;
  href: string;
  label: string;
  description: string;
}[] = [
  {
    id: "crm",
    href: "/crm",
    label: "CRM",
    description: "Accounts, opportunities, and ClientFlow.",
  },
  {
    id: "workforce",
    href: "/app/recruiting",
    label: "ATS",
    description: "Recruiting through hire lineage.",
  },
  {
    id: "hr",
    href: "/hr/requests",
    label: "HR",
    description: "Requests and people operations from hire onward.",
  },
  {
    id: "employee",
    href: "/employee",
    label: "Employee",
    description: "Self-service profile, time, leave, and pay.",
  },
  {
    id: "payroll",
    href: "/payroll",
    label: "Payroll",
    description: "Runs, periods, earnings, and deductions.",
  },
  {
    id: "workforce",
    href: "/workforce/administration",
    label: "Admin",
    description: "Workforce Administration — users, roles, audit, config.",
  },
  {
    id: "manager",
    href: "/manager",
    label: "Manager",
    description: "Team overview, approvals, and reports.",
  },
  {
    id: "candidate",
    href: "/candidate",
    label: "Candidate",
    description: "Applications, interviews, and documents.",
  },
];

/** Primary suite modules shown in the authenticated platform switcher. */
export const SUITE_SWITCHER: {
  id: PlatformWorkspaceId;
  href: string;
  label: string;
}[] = [
  { id: "crm", href: "/crm", label: "CRM" },
  { id: "workforce", href: "/app/recruiting", label: "ATS" },
  { id: "hr", href: "/hr/requests", label: "HR" },
  { id: "employee", href: "/employee", label: "Employee" },
  { id: "payroll", href: "/payroll", label: "Payroll" },
  { id: "workforce", href: "/workforce/administration", label: "Admin" },
];

/** Primary demo entry for a workspace (used to hide the “current” switcher item). */
export function isPrimaryDemoWorkspace(
  item: (typeof DEMO_WORKSPACES)[number],
  workspace: PlatformWorkspaceId,
): boolean {
  return item.id === workspace && item.label === WORKSPACE_META[workspace].name;
}

export function isCurrentSuiteItem(
  item: { id: PlatformWorkspaceId; href: string; label: string },
  workspace: PlatformWorkspaceId,
  pathname: string,
): boolean {
  if (item.label === "Admin") {
    return (
      pathname.startsWith("/workforce/administration") ||
      pathname.startsWith("/workforce/admin") ||
      pathname.startsWith("/workforce/users") ||
      pathname.startsWith("/workforce/system-health") ||
      pathname.startsWith("/workforce/audit") ||
      pathname.startsWith("/workforce/settings")
    );
  }
  if (item.label === "ATS") {
    return (
      pathname.startsWith("/app/") ||
      (pathname.startsWith("/workforce/") &&
        !pathname.startsWith("/workforce/administration") &&
        !pathname.startsWith("/workforce/admin") &&
        !pathname.startsWith("/workforce/users") &&
        !pathname.startsWith("/workforce/system-health") &&
        !pathname.startsWith("/workforce/audit") &&
        !pathname.startsWith("/workforce/settings"))
    );
  }
  return item.id === workspace && item.label === WORKSPACE_META[workspace].name;
}
