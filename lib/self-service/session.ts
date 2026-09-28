import { assertDemoSessionAllowed, isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";
import { getAuthenticatedPlatformUser } from "@/lib/auth/current-user";
import { redirectToAuthorizedLanding } from "@/lib/auth/roles";
import { hrRepository } from "@/lib/hr";

/**
 * Portal session — real (Supabase Auth + users/user_roles) when Supabase is
 * configured, otherwise the DEMO_* constants below. Same shape either way so
 * every consumer (security.ts, layouts, page components) is unaffected by
 * which mode is active.
 */

export type PortalSession = {
  employeeId: string;
  displayName: string;
  workEmail: string;
  isManager: boolean;
  isHr?: boolean;
  isPayroll?: boolean;
};

/** Demo employee portal user: Jennifer Lee (direct report). */
export const DEMO_EMPLOYEE_SESSION: PortalSession = {
  employeeId: "emp-demo-002",
  displayName: "Jennifer Lee",
  workEmail: "jennifer.lee@consultamerica.demo",
  isManager: false,
};

/** Demo manager portal user: Michael Brown (has direct reports). */
export const DEMO_MANAGER_SESSION: PortalSession = {
  employeeId: "emp-demo-001",
  displayName: "Michael Brown",
  workEmail: "michael.brown@consultamerica.demo",
  isManager: true,
};

/** Demo HR actor — same person until dedicated HR identity exists. */
export const DEMO_HR_SESSION: PortalSession = {
  employeeId: "emp-demo-001",
  displayName: "Michael Brown",
  workEmail: "hr@consultamerica.demo",
  isManager: true,
  isHr: true,
};

/** Demo payroll admin — same person as HR until dedicated payroll identity exists. */
export const DEMO_PAYROLL_SESSION: PortalSession = {
  employeeId: "emp-demo-001",
  displayName: "Michael Brown",
  workEmail: "payroll@consultamerica.demo",
  isManager: true,
  isPayroll: true,
};

async function buildRealPortalSession(): Promise<PortalSession> {
  const platformUser = await getAuthenticatedPlatformUser();
  if (!platformUser || !platformUser.employeeId) {
    // Authenticated but no employee record linked (e.g. a candidate-only
    // identity) — send them to their own workspace, not back to /login.
    // Redirecting to /login with ?returnTo=<this same path> would loop
    // forever: proxy.ts bounces a logged-in user hitting /login straight
    // back to a validated returnTo, which immediately fails this same
    // check again.
    redirectToAuthorizedLanding(platformUser?.roles ?? []);
  }

  const roles = platformUser.roles;
  const hasWorkforceRole =
    roles.includes("EMPLOYEE") ||
    roles.includes("MANAGER") ||
    roles.includes("HR_ADMIN") ||
    roles.includes("HR_SPECIALIST") ||
    roles.includes("PAYROLL_ADMIN") ||
    roles.includes("SYSTEM_ADMIN");

  if (!hasWorkforceRole) {
    // Authenticated but lacks this portal's role — send them to a route
    // they actually have access to, for the same reason as above.
    redirectToAuthorizedLanding(roles);
  }

  const employee = await hrRepository.getEmployeeById(platformUser.employeeId);
  if (!employee) {
    redirectToAuthorizedLanding(roles);
  }

  return {
    employeeId: employee.id,
    displayName: employee.preferredName || `${employee.firstName} ${employee.lastName}`.trim() || platformUser.displayName,
    workEmail: employee.workEmail || platformUser.email,
    isManager: roles.includes("MANAGER"),
    isHr:
      roles.includes("HR_ADMIN") ||
      roles.includes("HR_SPECIALIST") ||
      roles.includes("SYSTEM_ADMIN"),
    isPayroll: roles.includes("PAYROLL_ADMIN"),
  };
}

export async function getEmployeeSession(): Promise<PortalSession> {
  if (!isSupabaseBrowserConfigured()) {
    assertDemoSessionAllowed("self-service employee");
    return DEMO_EMPLOYEE_SESSION;
  }
  return buildRealPortalSession();
}

export async function getManagerSession(): Promise<PortalSession> {
  if (!isSupabaseBrowserConfigured()) {
    assertDemoSessionAllowed("self-service manager");
    return DEMO_MANAGER_SESSION;
  }
  return buildRealPortalSession();
}

export async function getHrSession(): Promise<PortalSession> {
  if (!isSupabaseBrowserConfigured()) {
    assertDemoSessionAllowed("self-service hr");
    return DEMO_HR_SESSION;
  }
  return buildRealPortalSession();
}

export async function getPayrollSession(): Promise<PortalSession> {
  if (!isSupabaseBrowserConfigured()) {
    assertDemoSessionAllowed("self-service payroll");
    return DEMO_PAYROLL_SESSION;
  }
  return buildRealPortalSession();
}
