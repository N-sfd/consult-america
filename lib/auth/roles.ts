import { redirect } from "next/navigation";

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

/**
 * Send an authenticated-but-not-authorized-here user to their own correct
 * workspace instead of back to /login. This exists because every
 * `get*Session()` resolver used to redirect to `/login` (bare, or with
 * `?returnTo=<the same path that just failed>`) when the user lacked the
 * role for that portal — and proxy.ts unconditionally bounces an
 * authenticated user hitting /login straight back to a validated
 * `returnTo`, so re-appending the same path created an infinite redirect
 * loop (candidate/employee/manager/hr/payroll all had this bug; only
 * self-service's "wrong role but has an employee record" branch already
 * did this correctly). If no role resolves to any landing page (a fully
 * unprovisioned account), falls back to bare /login, which is safe — it
 * has no returnTo, so proxy.ts won't bounce it anywhere.
 */
export function redirectToAuthorizedLanding(roles: PlatformRole[]): never {
  redirect(landingPathForRoles(roles) ?? "/login");
}
