"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/app/actions/auth";
import ConsultAmericaLogo from "@/components/brand/consult-america-logo";
import DemoModeBanner from "@/components/shared/demo-mode-banner";
import type { CandidateSession } from "@/lib/candidate/session";
import { cn } from "@/lib/utils";

const candidateLinks = [
  { href: "/candidate", label: "Home", exact: true },
  { href: "/candidate/applications", label: "My Applications" },
  { href: "/candidate/interviews", label: "Interviews" },
  { href: "/candidate/documents", label: "Documents" },
  { href: "/candidate/profile", label: "Profile" },
];

interface CandidateShellProps {
  session: CandidateSession;
  children: React.ReactNode;
}

export default function CandidateShell({ session, children }: CandidateShellProps) {
  const pathname = usePathname();

  return (
    <div className="experience-app ca-app-canvas min-h-screen">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="ca-app-sidebar border-b border-[var(--ca-app-border)] text-[var(--ca-app-ink)] lg:shrink-0 lg:border-b-0 lg:border-r lg:w-[var(--ca-app-sidebar)]">
          <div className="px-4 py-5">
            <ConsultAmericaLogo href="/" variant="light" size="compact" showTagline={false} />
            <p className="mt-3 text-xs text-[var(--ca-app-muted)]">
              Candidate Portal
            </p>
            <p className="mt-0.5 text-sm font-medium">{session.displayName}</p>
          </div>

          <nav className="flex gap-0.5 overflow-x-auto px-2 pb-3 lg:flex-col lg:overflow-visible">
            {candidateLinks.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between gap-2 whitespace-nowrap rounded px-3 py-1.5 text-[0.875rem] transition-colors",
                    active
                      ? "bg-[var(--ca-app-selected)] font-medium text-[var(--ca-blue)]"
                      : "text-[var(--ca-app-muted)] hover:bg-[var(--ca-app-bg)] hover:text-[var(--ca-app-ink)]",
                  )}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto hidden border-t border-[var(--ca-app-border)] px-4 py-3 text-[0.7rem] text-[var(--ca-app-muted)] lg:block">
            <form action={logout}>
              <button
                type="submit"
                className="block text-left hover:text-[var(--ca-blue)]"
              >
                Sign out
              </button>
            </form>
          </div>
          <DemoModeBanner />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-black/10 bg-white px-4 py-3 lg:px-6">
            <div className="mx-auto flex max-w-[var(--ca-app-max)] items-center justify-between gap-4">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.12em] text-black/40">
                  Candidate Portal
                </p>
                <p className="mt-0.5 text-sm text-black/55">{session.email}</p>
              </div>
              <Link
                href="/careers"
                className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
              >
                Browse Open Roles
              </Link>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[var(--ca-app-max)] flex-1 px-4 py-6 lg:px-6 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
