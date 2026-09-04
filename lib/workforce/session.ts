import { redirect } from "next/navigation";

import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";
import { getAuthenticatedPlatformUser } from "@/lib/auth/current-user";
import { hrRepository } from "@/lib/hr";

/**
 * Workforce App session — real (Supabase Auth + users/user_roles) when
 * Supabase is configured, otherwise DEMO_WORKFORCE_SESSION below. Same
 * pattern as lib/self-service/session.ts.
 */

export type WorkforceRole = "ADMIN" | "RECRUITER" | "HR" | "HIRING_MANAGER";

export type WorkforceSession = {
  employeeId: string;
  displayName: string;
  workEmail: string;
  initials: string;
  roles: WorkforceRole[];
};

export const DEMO_WORKFORCE_SESSION: WorkforceSession = {
  employeeId: "emp-demo-001",
  displayName: "Michael Brown",
  workEmail: "michael.brown@consultamerica.demo",
  initials: "MB",
  roles: ["ADMIN", "RECRUITER", "HR"],
};

function initialsFor(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  return (
    (parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")
  ).toUpperCase();
}

export async function getWorkforceSession(): Promise<WorkforceSession> {
  if (!isSupabaseBrowserConfigured()) return DEMO_WORKFORCE_SESSION;

  const platformUser = await getAuthenticatedPlatformUser();
  if (!platformUser || !platformUser.employeeId) {
    redirect("/login");
  }

  const employee = await hrRepository.getEmployeeById(platformUser.employeeId);
  if (!employee) redirect("/login");

  const displayName =
    employee.preferredName ||
    `${employee.firstName} ${employee.lastName}`.trim() ||
    platformUser.displayName;

  const roles: WorkforceRole[] = [];
  if (platformUser.roles.includes("SYSTEM_ADMIN")) roles.push("ADMIN");
  if (platformUser.roles.includes("RECRUITER")) roles.push("RECRUITER");
  if (
    platformUser.roles.includes("HR_ADMIN") ||
    platformUser.roles.includes("HR_SPECIALIST")
  ) {
    roles.push("HR");
  }
  if (platformUser.roles.includes("HIRING_MANAGER")) roles.push("HIRING_MANAGER");

  if (roles.length === 0) redirect("/login");

  return {
    employeeId: employee.id,
    displayName,
    workEmail: employee.workEmail || platformUser.email,
    initials: initialsFor(displayName),
    roles,
  };
}
