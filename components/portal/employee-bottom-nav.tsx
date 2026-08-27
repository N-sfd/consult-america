"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardCheck,
  FileText,
  Home,
  MoreHorizontal,
  User,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const PRIMARY_LINKS = [
  { href: "/employee", label: "Home", icon: Home, exact: true },
  { href: "/employee/documents", label: "Documents", icon: FileText },
  { href: "/employee/onboarding", label: "Onboarding", icon: ClipboardCheck },
  { href: "/employee/profile", label: "Profile", icon: User },
];

const MORE_LINKS = [
  { href: "/employee/time", label: "Time" },
  { href: "/employee/leave", label: "Leave" },
  { href: "/employee/requests", label: "HR Requests" },
  { href: "/employee/notifications", label: "Notifications" },
];

export default function EmployeeBottomNav({
  unreadCount = 0,
}: {
  unreadCount?: number;
}) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Employee"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[var(--ca-app-border)] bg-white lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {PRIMARY_LINKS.map((link) => {
          const Icon = link.icon;
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium",
                active
                  ? "text-[var(--ca-blue)]"
                  : "text-[var(--ca-app-muted)]",
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium text-[var(--ca-app-muted)]"
        >
          <MoreHorizontal className="h-5 w-5" />
          More
          {unreadCount > 0 && (
            <span className="absolute right-1/4 top-1.5 h-2 w-2 rounded-full bg-[var(--ca-blue)]" />
          )}
        </button>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>More</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            {MORE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMoreOpen(false)}
                className="flex items-center justify-between border-b border-black/5 py-3.5 text-sm font-medium last:border-b-0"
              >
                {link.label}
                {link.href === "/employee/notifications" &&
                  unreadCount > 0 && (
                    <span className="rounded bg-[var(--ca-blue)] px-1.5 py-0.5 text-xs font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
