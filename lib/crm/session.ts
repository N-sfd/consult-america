import { redirect } from "next/navigation";

import { isSupabaseBrowserConfigured } from "@/app/lib/supabase/client";
import { getAuthenticatedPlatformUser } from "@/lib/auth/current-user";

export type CrmRole = "ADMIN" | "SALES_REP" | "SALES_MANAGER";

export type CrmSession = {
  userId: string;
  displayName: string;
  email: string;
  initials: string;
  roles: CrmRole[];
};

export const DEMO_CRM_SESSION: CrmSession = {
  userId: "user-emp-demo-001",
  displayName: "Michael Brown",
  email: "michael.brown@consultamerica.demo",
  initials: "MB",
  roles: ["ADMIN", "SALES_MANAGER"],
};

function initialsFor(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  return (
    (parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")
  ).toUpperCase();
}

export async function getCrmSession(): Promise<CrmSession> {
  if (!isSupabaseBrowserConfigured()) return DEMO_CRM_SESSION;

  const platformUser = await getAuthenticatedPlatformUser();
  if (!platformUser) redirect("/login");

  const roles: CrmRole[] = [];
  if (platformUser.roles.includes("SYSTEM_ADMIN")) roles.push("ADMIN");
  if (platformUser.roles.includes("SALES_REP")) roles.push("SALES_REP");
  if (platformUser.roles.includes("SALES_MANAGER")) roles.push("SALES_MANAGER");

  if (roles.length === 0) redirect("/login");

  return {
    userId: platformUser.userId,
    displayName: platformUser.displayName,
    email: platformUser.email,
    initials: initialsFor(platformUser.displayName),
    roles,
  };
}
