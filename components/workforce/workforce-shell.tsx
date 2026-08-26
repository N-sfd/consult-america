"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  Clock,
  LayoutDashboard,
  Search,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

import BrandLogo from "@/components/brand/brand-logo";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: { label: string; href: string }[];
};

const nav: NavItem[] = [
  {
    label: "Overview",
    href: "/workforce",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "Recruiting",
    icon: <Briefcase className="h-4 w-4" />,
    children: [
      { label: "Jobs", href: "/workforce/jobs" },
      { label: "Candidates", href: "/workforce/candidates" },
      { label: "Interviews", href: "/workforce/interviews" },
    ],
  },
  {
    label: "People",
    icon: <Users className="h-4 w-4" />,
    children: [
      { label: "Employees", href: "/workforce/people" },
      { label: "Organization", href: "/workforce/organization" },
    ],
  },
  {
    label: "Time",
    href: "/employee/time",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    label: "Leave",
    href: "/employee/leave",
    icon: <CalendarDays className="h-4 w-4" />,
  },
  {
    label: "Approvals",
    href: "/manager/approvals",
    icon: <CheckSquare className="h-4 w-4" />,
  },
  {
    label: "Payroll",
    href: "/workforce/payroll",
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    label: "Settings",
    href: "/workforce/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

export default function WorkforceShell({
  children,
  userName = "Nazia Ahmed",
  userInitials = "NA",
}: {
  children: React.ReactNode;
  userName?: string;
  userInitials?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--ca-app-bg)] text-[var(--ca-app-ink)]">
      <header className="sticky top-0 z-40 border-b border-black/8 bg-white">
        <div className="flex h-14 items-center gap-4 px-4 lg:px-5">
          <BrandLogo href="/workforce" tone="dark" markClassName="!h-7 !w-7" />

          <div className="mx-auto hidden max-w-md flex-1 md:block">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/35" />
              <input
                type="search"
                placeholder="Search people, jobs, candidates…"
                className="h-9 w-full border border-black/10 bg-[var(--ca-app-bg)] pl-9 pr-3 text-sm outline-none placeholder:text-black/35 focus:border-[var(--ca-blue)]"
              />
            </label>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center border border-black/10 text-black/55 transition-colors hover:text-[var(--ca-blue)]"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--ca-green)]" />
            </button>
            <div className="flex items-center gap-2 border border-black/10 px-2.5 py-1.5">
              <span className="flex h-7 w-7 items-center justify-center bg-[var(--ca-app-sidebar-bg)] text-[0.65rem] font-semibold text-white">
                {userInitials}
              </span>
              <span className="hidden text-sm font-medium sm:inline">
                {userInitials}
              </span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-black/35 sm:block" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <aside className="hidden w-[240px] shrink-0 border-r border-black/8 bg-[var(--ca-app-sidebar-bg)] text-white lg:block">
          <div className="px-4 py-5">
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-white/40">
              Workforce
            </p>
            <p className="mt-1 text-sm font-medium">{userName}</p>
          </div>

          <nav className="space-y-0.5 px-2 pb-6">
            {nav.map((item) => {
              const active = item.href
                ? pathname === item.href
                : item.children?.some((child) =>
                    pathname.startsWith(child.href),
                  );

              return (
                <div key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ) : (
                    <div
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 text-sm",
                        active ? "text-white" : "text-white/60",
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </div>
                  )}

                  {item.children && (
                    <div className="mb-1 ml-4 border-l border-white/10 pl-3">
                      {item.children.map((child) => {
                        const childActive = pathname.startsWith(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block rounded px-2 py-1.5 text-[0.8125rem] transition-colors",
                              childActive
                                ? "bg-white/10 text-white"
                                : "text-white/50 hover:bg-white/5 hover:text-white",
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/10 px-4 py-4 text-[0.7rem] text-white/35">
            <Link href="/" className="block hover:text-white">
              Public site
            </Link>
            <Link href="/login" className="mt-1 block hover:text-white">
              Switch portal
            </Link>
            <p className="mt-3 flex items-center gap-1.5">
              <Building2 className="h-3 w-3" />
              Demo · auth later
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="border-b border-black/8 bg-white px-4 py-2 lg:hidden">
            <div className="flex gap-2 overflow-x-auto text-sm">
              <Link href="/workforce" className="shrink-0 px-2 py-1 font-medium">
                Overview
              </Link>
              <Link
                href="/workforce/jobs"
                className="shrink-0 px-2 py-1 text-black/55"
              >
                Jobs
              </Link>
              <Link
                href="/workforce/candidates"
                className="shrink-0 px-2 py-1 text-black/55"
              >
                Candidates
              </Link>
              <Link
                href="/workforce/people"
                className="shrink-0 px-2 py-1 text-black/55"
              >
                People
              </Link>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
