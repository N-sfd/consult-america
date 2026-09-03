import { redirect } from "next/navigation";

import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";
import { getAuthenticatedPlatformUser } from "@/lib/auth/current-user";
import { hrRepository } from "@/lib/hr";

/**
 * Portal session — real (Supabase Auth + users/user_roles) when Supabase is
 * configured, otherwise the DEMO_* constants below. Same shape either way so
 * every consumer (security.ts, layouts, page components) is unaffected by
 * which mode is active.
 */

export type PortalSession = {
  employeeId: string;
  personId: string;
  displayName: string;
  workEmail: string;
  isManager: boolean;
  isHr?: boolean;
  isPayroll?: boolean;
};

/** Demo employee portal user: Jennifer Lee (direct report). */
export const DEMO_EMPLOYEE_SESSION: PortalSession = {
  employeeId: "emp-demo-002",
  personId: "person-demo-002",
  displayName: "Jennifer Lee",
  workEmail: "jennifer.lee@consultamerica.demo",
  isManager: false,
};

/** Demo manager portal user: Michael Brown (has direct reports). */
export const DEMO_MANAGER_SESSION: PortalSession = {
  employeeId: "emp-demo-001",
  personId: "person-demo-001",
  displayName: "Michael Brown",
  workEmail: "michael.brown@consultamerica.demo",
  isManager: true,
};

/** Demo HR actor — same person until dedicated HR identity exists. */
export const DEMO_HR_SESSION: PortalSession = {
  employeeId: "emp-demo-001",
  personId: "person-demo-001",
  displayName: "Michael Brown",
  workEmail: "hr@consultamerica.demo",
  isManager: true,
  isHr: true,
};

/** Demo payroll admin — same person as HR until dedicated payroll identity exists. */
export const DEMO_PAYROLL_SESSION: PortalSession = {
  employeeId: "emp-demo-001",
  personId: "person-demo-001",
  displayName: "Michael Brown",
  workEmail: "payroll@consultamerica.demo",
  isManager: true,
  isPayroll: true,
};

async function buildRealPortalSession(): Promise<PortalSession> {
  const platformUser = await getAuthenticatedPlatformUser();
  if (!platformUser || !platformUser.employeeId) {
    redirect("/login");
  }

  const employee = await hrRepository.getEmployeeById(platformUser.employeeId);
  if (!employee) redirect("/login");

  const person = await hrRepository.getPersonById(employee.personId);

  const roles = platformUser.roles;
  return {
    employeeId: employee.id,
    personId: employee.personId,
    displayName: person?.preferredName || `${person?.firstName ?? ""} ${person?.lastName ?? ""}`.trim() || platformUser.displayName,
    workEmail: employee.workEmail || platformUser.email,
    isManager: roles.includes("MANAGER"),
    isHr: roles.includes("HR_ADMIN") || roles.includes("HR_SPECIALIST"),
    isPayroll: roles.includes("PAYROLL_ADMIN"),
  };
}

export async function getEmployeeSession(): Promise<PortalSession> {
  if (!isSupabaseBrowserConfigured()) return DEMO_EMPLOYEE_SESSION;
  return buildRealPortalSession();
}

export async function getManagerSession(): Promise<PortalSession> {
  if (!isSupabaseBrowserConfigured()) return DEMO_MANAGER_SESSION;
  return buildRealPortalSession();
}

export async function getHrSession(): Promise<PortalSession> {
  if (!isSupabaseBrowserConfigured()) return DEMO_HR_SESSION;
  return buildRealPortalSession();
}

export async function getPayrollSession(): Promise<PortalSession> {
  if (!isSupabaseBrowserConfigured()) return DEMO_PAYROLL_SESSION;
  return buildRealPortalSession();
}
