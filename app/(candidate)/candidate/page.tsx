import type { Metadata } from "next";
import Link from "next/link";

import { formatDate } from "@/lib/recruiting/format";
import { recruitingRepository } from "@/lib/recruiting";
import { requireCandidateActor } from "@/lib/candidate/security";
import { applicationStatusLabels } from "@/types/recruiting";

export const metadata: Metadata = {
  title: "Candidate Portal | ConsultAmerica",
};

export const dynamic = "force-dynamic";

export default async function CandidatePortalHomePage() {
  const { session } = await requireCandidateActor();
  const profile = await recruitingRepository.getCandidateProfile(
    session.candidateId,
  );

  const applications = profile?.applications ?? [];
  const activeApplications = applications.filter(
    (application) =>
      application.status !== "REJECTED" &&
      application.status !== "WITHDRAWN" &&
      application.status !== "CLOSED",
  );
  const upcomingInterviews = (profile?.interviews ?? []).filter(
    (interview) => interview.status === "SCHEDULED",
  );
  const latest = [...applications].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Welcome back, {session.displayName.split(" ")[0]}
        </h1>
        <p className="mt-2 text-black/55">
          Track your application status, upcoming interviews, and profile in
          one place.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Active Applications
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            {activeApplications.length}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Upcoming Interviews
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            {upcomingInterviews.length}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Documents on File
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            {profile?.documents.length ?? 0}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Latest Application
          </h2>
          <Link
            href="/candidate/applications"
            className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
          >
            View all
          </Link>
        </div>
        {latest ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{latest.requisitionTitle}</p>
              <p className="mt-1 text-sm text-black/55">
                {latest.postingLocation} · Applied {formatDate(latest.appliedAt)}
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
              {applicationStatusLabels[latest.status]}
            </span>
          </div>
        ) : (
          <p className="mt-4 text-sm text-black/50">
            No applications yet. Explore{" "}
            <Link href="/careers" className="text-[var(--ca-blue)] hover:underline">
              open roles
            </Link>{" "}
            to get started.
          </p>
        )}
      </section>
    </div>
  );
}
