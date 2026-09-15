"use client";

import { usePathname } from "next/navigation";

import PlatformShell from "@/components/platform/platform-shell";

const ADMIN_PREFIXES = [
  "/workforce/administration",
  "/workforce/admin",
  "/workforce/users",
  "/workforce/system-health",
  "/workforce/audit",
  "/workforce/settings",
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

  return (
    <PlatformShell
      workspace="workforce"
      workspaceLabel={isAdmin ? "Admin" : "ATS"}
      session={{
        displayName: userName ?? (isAdmin ? "Admin User" : "ATS User"),
        initials: userInitials,
        roleLabel: isAdmin ? "Admin" : "ATS",
      }}
      showSearch
      searchPlaceholder="Search people, jobs, candidates…"
      logoHref={isAdmin ? "/workforce/administration" : "/app/recruiting"}
    >
      {children}
    </PlatformShell>
  );
}
