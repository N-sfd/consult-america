"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { PortalSession } from "@/lib/self-service/session";
import { cn } from "@/lib/utils";

const employeeLinks = [
  { href: "/employee", label: "Home", exact: true },
  { href: "/employee/profile", label: "My Profile" },
  { href: "/employee/documents", label: "My Documents" },
  { href: "/employee/time", label: "Time" },
  { href: "/employee/leave", label: "Leave" },
  { href: "/employee/requests", label: "HR Requests" },
  { href: "/employee/notifications", label: "Notifications" },
];

const managerLinks = [
  { href: "/manager", label: "Home", exact: true },
  { href: "/manager/team", label: "My Team" },
  { href: "/manager/approvals", label: "Approvals" },
  { href: "/manager/time", label: "Team Time" },
  { href: "/manager/leave", label: "Team Leave" },
];

interface PortalShellProps {
  session: PortalSession;
  mode: "employee" | "manager";
  children: React.ReactNode;
}

export default function PortalShell({
  session,
  mode,
  children,
}: PortalShellProps) {
  const pathname = usePathname();
  const links = mode === "employee" ? employeeLinks : managerLinks;

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#0B1220]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-black/10 bg-[#071A2F] text-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="px-5 py-6">
            <Link href="/" className="text-xs font-semibold tracking-[0.14em]">
              CONSULTAMERICA
            </Link>
            <p className="mt-4 text-sm text-white/55">
              {mode === "employee" ? "Employee" : "Manager"} Portal
            </p>
            <p className="mt-1 text-sm font-medium">{session.displayName}</p>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
            {links.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {mode === "employee" && (
              <span className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-white/30">
                Pay · Coming soon
              </span>
            )}
          </nav>

          <div className="mt-auto hidden border-t border-white/10 px-5 py-4 text-xs text-white/40 lg:block">
            <Link href={mode === "employee" ? "/manager" : "/employee"} className="hover:text-white">
              Switch to {mode === "employee" ? "Manager" : "Employee"} demo
            </Link>
            <p className="mt-2">Demo session · auth later</p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-black/10 bg-white px-5 py-4 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-black/40">
                  {mode === "employee" ? "Employee Self-Service" : "Manager Self-Service"}
                </p>
                <p className="mt-1 text-sm text-black/55">{session.workEmail}</p>
              </div>
              <Link
                href="/"
                className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
              >
                Public site
              </Link>
            </div>
          </header>

          <main className="px-5 py-8 lg:px-8 lg:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
