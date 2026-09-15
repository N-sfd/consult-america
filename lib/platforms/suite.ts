/**
 * Consult America Platforms — canonical suite model (FROZEN).
 *
 * Do not rename, merge, split, or add modules without explicit product authorization.
 * User-facing names are locked; routes retain existing technical paths.
 *
 * Admin canonical app route: /workforce/administration
 * /workforce/admin is compatibility redirect only.
 */

export type SuiteModuleId = "crm" | "ats" | "hr" | "employee" | "payroll" | "admin";

export type SuiteModule = {
  id: SuiteModuleId;
  /** User-facing product name */
  name: string;
  /** Short module tagline */
  tagline: string;
  /** One-line suite role */
  role: string;
  /** Marketing page */
  marketingHref: string;
  /** Primary authenticated entry */
  appHref: string;
  /** Primary module under the platform (user-facing) */
  primaryModule: string;
};

export const SUITE_MODULES: SuiteModule[] = [
  {
    id: "crm",
    name: "CRM",
    tagline: "Accounts, opportunities, and ClientFlow",
    role: "Client and opportunity lifecycle — capture through ClientFlow automation.",
    marketingHref: "/platforms/crm",
    appHref: "/crm",
    primaryModule: "Pipeline",
  },
  {
    id: "ats",
    name: "ATS",
    tagline: "Recruiting through hire lineage",
    role: "Requisition to offer — accepted offers create the employee in HR.",
    marketingHref: "/platforms/ats",
    appHref: "/app/recruiting",
    primaryModule: "Recruiting",
  },
  {
    id: "hr",
    name: "HR",
    tagline: "People operations from hire onward",
    role: "Employee records, requests, and onboarding continuity after hire.",
    marketingHref: "/platforms/hr",
    appHref: "/hr/requests",
    primaryModule: "Requests",
  },
  {
    id: "employee",
    name: "Employee",
    tagline: "Self-service profile, time, and leave",
    role: "Day-to-day employee workspace shared with the same people data.",
    marketingHref: "/platforms/employee",
    appHref: "/employee",
    primaryModule: "Self-service",
  },
  {
    id: "payroll",
    name: "Payroll",
    tagline: "Runs, earnings, and deductions",
    role: "Pay operations on the employee record created through ATS → HR.",
    marketingHref: "/platforms/payroll",
    appHref: "/payroll",
    primaryModule: "Runs",
  },
  {
    id: "admin",
    name: "Admin",
    tagline: "Users, roles, security, and configuration",
    role: "Control plane across ATS, HR, CRM, and the rest of the suite.",
    marketingHref: "/platforms/admin",
    appHref: "/workforce/administration",
    primaryModule: "Workforce Administration",
  },
];

/** Connected operating flows — copy/diagrams only; no duplicate master data. */
export const SUITE_FLOWS = [
  {
    id: "hire",
    title: "People continuum",
    steps: ["ATS", "Hire", "HR", "Employee", "Payroll"],
    detail: "An accepted offer creates the employee — no re-entry, no status-only hire.",
  },
  {
    id: "client",
    title: "Client continuum",
    steps: ["CRM", "Opportunity", "ClientFlow"],
    detail: "Inquiry and opportunity context stay on the contact — automation runs inside CRM.",
  },
  {
    id: "govern",
    title: "Governance continuum",
    steps: ["Admin", "Users", "Roles", "Security", "Configuration"],
    detail: "One control plane for the suite — not a separate admin product.",
  },
] as const;

export function suiteModule(id: SuiteModuleId): SuiteModule {
  const found = SUITE_MODULES.find((m) => m.id === id);
  if (!found) throw new Error(`Unknown suite module: ${id}`);
  return found;
}
