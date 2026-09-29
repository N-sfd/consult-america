"use client";

import { usePathname } from "next/navigation";

import PlatformShell from "@/components/platform/platform-shell";
import { ADMIN_NAV, NAV_BY_WORKSPACE } from "@/components/platform/platform-nav";

const ADMIN_PREFIXES = [
  "/workforce/administration",
  "/workforce/admin",
  "/workforce/users",
  "/workforce/system-health",
  "/workforce/audit",
  "/workforce/settings",
  "/workforce/notifications",
];

export default function WorkforceShell({
  children,
  userName,
  userInitials,
}: {
  children: React.ReactNode;
  userName?: string;
  userInitials?: string;
}) {
  const pathname = usePathname() || "/";
  const isAdmin = ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isPeople = pathname.startsWith("/workforce/people");

  return (
    <PlatformShell
      workspace={isPeople ? "hr" : "workforce"}
      workspaceLabel={isAdmin ? "Admin" : isPeople ? "HR" : "ATS"}
      navGroups={isAdmin ? ADMIN_NAV : isPeople ? NAV_BY_WORKSPACE.hr : NAV_BY_WORKSPACE.workforce}
      session={{
        displayName: userName ?? (isAdmin ? "Admin User" : isPeople ? "HR User" : "ATS User"),
        initials: userInitials,
        roleLabel: isAdmin ? "Admin" : isPeople ? "HR" : "ATS",
      }}
      showSearch
      searchPlaceholder={
        isAdmin
          ? "Search users and configuration…"
          : isPeople
            ? "Search employees…"
            : "Search jobs and candidates…"
      }
      logoHref={
        isAdmin
          ? "/workforce/administration"
          : isPeople
            ? "/hr"
            : "/app/recruiting"
      }
    >
      {children}
    </PlatformShell>
  );
}
