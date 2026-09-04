"use client";

import Link from "next/link";

import PlatformShell from "@/components/platform/platform-shell";
import type { CandidateSession } from "@/lib/candidate/session";

interface CandidateShellProps {
  session: CandidateSession;
  children: React.ReactNode;
}

export default function CandidateShell({ session, children }: CandidateShellProps) {
  return (
    <PlatformShell
      workspace="candidate"
      session={{
        displayName: session.displayName,
        email: session.email,
        roleLabel: "Candidate",
      }}
      headerAction={
        <Link
          href="/careers"
          className="hidden text-sm font-semibold text-[var(--ca-platform-mid)] hover:text-[var(--ca-platform-deep)] sm:inline"
        >
          Browse jobs
        </Link>
      }
    >
      {children}
    </PlatformShell>
  );
}
