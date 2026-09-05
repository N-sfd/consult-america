import type { PlatformRole } from "@/types/identity";

/**
 * Where a user lands after login, by role priority (a user can hold
 * multiple roles — e.g. the demo admin holds four).
 */
const LANDING_PRIORITY: { roles: PlatformRole[]; path: string }[] = [
  { roles: ["SYSTEM_ADMIN", "RECRUITER", "HIRING_MANAGER"], path: "/app/dashboard" },
  { roles: ["HR_ADMIN", "HR_SPECIALIST"], path: "/hr/requests" },
  { roles: ["PAYROLL_ADMIN"], path: "/payroll" },
  { roles: ["MANAGER"], path: "/manager" },
  { roles: ["EMPLOYEE"], path: "/employee" },
  { roles: ["SALES_REP", "SALES_MANAGER"], path: "/crm" },
  { roles: ["CANDIDATE"], path: "/candidate" },
];

/** Returns the landing path for a user's roles, or `null` if none apply. */
export function landingPathForRoles(roles: PlatformRole[]): string | null {
  for (const { roles: candidateRoles, path } of LANDING_PRIORITY) {
    if (candidateRoles.some((role) => roles.includes(role))) return path;
  }
  return null;
}

const PORTAL_ROLES: Record<
  "EMPLOYEE" | "MANAGER" | "HR" | "PAYROLL" | "CANDIDATE",
  PlatformRole[]
> = {
  EMPLOYEE: ["EMPLOYEE"],
  MANAGER: ["MANAGER"],
  HR: ["HR_ADMIN", "HR_SPECIALIST"],
  PAYROLL: ["PAYROLL_ADMIN"],
  CANDIDATE: ["CANDIDATE"],
};

/** Does this user hold a platform role that grants the given portal? */
export function hasPortalRole(
  roles: PlatformRole[],
  portal: "EMPLOYEE" | "MANAGER" | "HR" | "PAYROLL" | "CANDIDATE",
): boolean {
  return PORTAL_ROLES[portal].some((role) => roles.includes(role));
}
