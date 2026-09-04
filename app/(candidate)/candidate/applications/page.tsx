import type { Metadata } from "next";
import Link from "next/link";

import { formatDate } from "@/lib/recruiting/format";
import { recruitingRepository } from "@/lib/recruiting";
import { requireCandidateActor } from "@/lib/candidate/security";
import { applicationStatusLabels } from "@/types/recruiting";

export const metadata: Metadata = {
  title: "My Applications | ConsultAmerica",
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
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          My Applications
        </h1>
        <p className="mt-2 text-black/55">
          Every role you&apos;ve applied to, and where it stands.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-lg border border-black/10 bg-white px-5 py-8 text-sm text-black/50">
          No applications yet.{" "}
          <Link href="/careers" className="text-[var(--ca-blue)] hover:underline">
            Browse open roles
          </Link>
          .
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
          <ul className="divide-y divide-black/5">
            {applications.map((application) => (
              <li key={application.applicationId}>
                <Link
                  href={`/candidate/applications/${application.applicationId}`}
                  className="block px-5 py-4 hover:bg-black/[0.02]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-black/40">
                        {application.applicationNumber}
                      </p>
                      <p className="mt-1 font-medium">
                        {application.requisitionTitle}
                      </p>
                      <p className="mt-1 text-sm text-black/55">
                        {application.postingLocation} · Applied{" "}
                        {formatDate(application.appliedAt)}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.1em] text-black/45">
                      {applicationStatusLabels[application.status]}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
