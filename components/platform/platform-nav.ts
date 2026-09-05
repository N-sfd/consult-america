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
    name: "Employee Portal",
    eyebrow: "Employee Portal",
    homeHref: "/employee",
    variant: "self-service",
  },
  manager: {
    name: "Manager Portal",
    eyebrow: "Manager Portal",
    homeHref: "/manager",
    variant: "admin",
  },
  hr: {
    name: "HR Service Desk",
    eyebrow: "HR Service Desk",
    homeHref: "/hr/requests",
    variant: "admin",
  },
  payroll: {
    name: "Payroll Administration",
    eyebrow: "Payroll Administration",
    homeHref: "/payroll",
    variant: "admin",
  },
  workforce: {
    name: "Workforce",
    eyebrow: "Workforce",
    homeHref: "/app/dashboard",
    variant: "admin",
  },
  candidate: {
    name: "Candidate Portal",
    eyebrow: "Candidate Portal",
    homeHref: "/candidate",
    variant: "self-service",
  },
  crm: {
    name: "CRM Workspace",
    eyebrow: "CRM Workspace",
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
        { href: "/hr/requests", label: "HR Requests" },
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
      items: [{ href: "/app/dashboard", label: "Dashboard", exact: true }],
    },
    {
      label: "Recruiting",
      items: [
        { href: "/app/recruiting/jobs", label: "Jobs" },
        { href: "/app/recruiting/candidates", label: "Candidates" },
        { href: "/workforce/interviews", label: "Interviews" },
        { href: "#", label: "Offers", disabled: true },
      ],
    },
    {
      label: "People",
      items: [
        { href: "/workforce/people", label: "Employees" },
        { href: "#", label: "Onboarding", disabled: true },
        { href: "/workforce/organization", label: "Organization" },
      ],
    },
    {
      label: "Workforce",
      items: [
        { href: "/employee/time", label: "Time" },
        { href: "/employee/leave", label: "Leave" },
        { href: "/manager/approvals", label: "Approvals", badgeKey: "approvals" },
        { href: "/hr/requests", label: "HR Requests" },
      ],
    },
    {
      label: "Operations",
      items: [
        { href: "/workforce/payroll", label: "Payroll" },
        { href: "/hr/reports", label: "Reports" },
      ],
    },
    {
      label: "Administration",
      items: [{ href: "/workforce/settings", label: "Settings" }],
    },
  ],
  candidate: [
    {
      label: "My Journey",
      items: [
        { href: "/candidate", label: "Home", exact: true },
        { href: "/candidate/applications", label: "Applications" },
        { href: "/candidate/interviews", label: "Interviews" },
        { href: "/candidate/documents", label: "Documents" },
        { href: "/candidate/profile", label: "Profile" },
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
    id: "employee",
    href: "/employee",
    label: "Employee",
    description: "Self-service profile, time, leave, and pay.",
  },
  {
    id: "manager",
    href: "/manager",
    label: "Manager",
    description: "Team overview, approvals, and reports.",
  },
  {
    id: "hr",
    href: "/hr/requests",
    label: "HR",
    description: "Service desk requests, reports, and audit.",
  },
  {
    id: "payroll",
    href: "/payroll",
    label: "Payroll",
    description: "Runs, periods, earnings, and deductions.",
  },
  {
    id: "workforce",
    href: "/app/dashboard",
    label: "Recruiting",
    description: "Jobs, candidates, and hiring pipeline.",
  },
  {
    id: "crm",
    href: "/crm",
    label: "CRM",
    description: "Accounts, opportunities, and pipeline.",
  },
  {
    id: "candidate",
    href: "/candidate",
    label: "Candidate",
    description: "Applications, interviews, and documents.",
  },
];
