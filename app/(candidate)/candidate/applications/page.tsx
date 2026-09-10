import type { Metadata } from "next";
import Link from "next/link";
import { Inbox } from "lucide-react";

import ApplicationStatusPill from "@/components/candidate/application-status-pill";
import { formatDate } from "@/lib/recruiting/format";
import { recruitingRepository } from "@/lib/recruiting";
import { requireCandidateActor } from "@/lib/candidate/security";

export const metadata: Metadata = {
  title: "My Applications",
};

export const dynamic = "force-dynamic";

export default async function CandidateApplicationsPage() {
  const { session } = await requireCandidateActor();
  const profile = await recruitingRepository.getCandidateProfile(
    session.candidateId,
  );
  const applications = [...(profile?.applications ?? [])].sort((a, b) =>
    b.appliedAt.localeCompare(a.appliedAt),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-[-0.04em]">
          My Applications
        </h1>
        <p className="mt-2 text-black/55">
          Every role you&apos;ve applied to, and where it stands.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="ca-platform-card flex items-center gap-3 px-5 py-8 text-sm text-black/50">
          <Inbox className="h-5 w-5 shrink-0 text-black/25" />
          <p>
            No applications yet.{" "}
            <Link href="/candidate/jobs" className="text-[var(--ca-blue)] hover:underline">
              Browse open roles
            </Link>{" "}
            to get started.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {applications.map((application) => (
            <li key={application.applicationId}>
              <Link
                href={`/candidate/applications/${application.applicationId}`}
                className="ca-platform-card ca-platform-card--interactive block px-5 py-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-black/40">
                      {application.applicationNumber}
                    </p>
                    <p className="mt-1 text-base font-semibold text-black">
                      {application.requisitionTitle}
                    </p>
                    <p className="mt-1 text-sm text-black/55">
                      {application.postingLocation} · Applied{" "}
                      {formatDate(application.appliedAt)}
                    </p>
                    <p className="mt-1 text-xs text-black/40">
                      Last activity {formatDate(application.updatedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <ApplicationStatusPill status={application.status} />
                    <p className="mt-2 text-xs font-semibold text-[var(--ca-blue)]">
                      View Application
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
