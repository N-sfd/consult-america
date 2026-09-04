import type { Metadata } from "next";
import Link from "next/link";

import { formatDate } from "@/lib/recruiting/format";
import { recruitingRepository } from "@/lib/recruiting";
import { requireCandidateActor } from "@/lib/candidate/security";
import {
  applicationStatusLabels,
  type ApplicationStatus,
} from "@/types/recruiting";

export const metadata: Metadata = {
  title: "Candidate Portal | ConsultAmerica",
};

export const dynamic = "force-dynamic";

const CANDIDATE_JOURNEY: { key: ApplicationStatus | "DECISION"; label: string }[] = [
  { key: "APPLIED", label: "Applied" },
  { key: "RECRUITER_SCREEN", label: "Recruiter Screen" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "OFFER", label: "Offer" },
  { key: "DECISION", label: "Decision" },
];

function journeyIndex(status: ApplicationStatus) {
  if (status === "APPLIED" || status === "REVIEW") return 0;
  if (status === "RECRUITER_SCREEN" || status === "HIRING_MANAGER_REVIEW") return 1;
  if (status === "INTERVIEW" || status === "FINAL_INTERVIEW") return 2;
  if (status === "OFFER") return 3;
  if (status === "HIRED" || status === "REJECTED" || status === "CLOSED" || status === "WITHDRAWN") {
    return 4;
  }
  return 0;
}

export default async function CandidatePortalHomePage() {
  const { session } = await requireCandidateActor();
  const profile = await recruitingRepository.getCandidateProfile(session.candidateId);

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
  const activeStep = latest ? journeyIndex(latest.status) : -1;

  return (
    <div className="space-y-7">
      <section className="ca-platform-hero">
        <div className="relative z-[1]">
          <h1 className="text-[clamp(1.75rem,2.4vw,2.25rem)] font-semibold tracking-[-0.03em]">
            Welcome back, {session.displayName.split(" ")[0]}
          </h1>
          <p className="mt-1.5 text-[0.95rem] text-[var(--ca-platform-muted)]">
            Track your application, interviews, and documents in one place.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/candidate/profile"
              className="rounded-lg border border-[var(--ca-platform-border)] bg-white/90 px-3.5 py-2 text-sm font-medium"
            >
              Complete Profile
            </Link>
            <Link
              href="/candidate/documents"
              className="rounded-lg border border-[var(--ca-platform-border)] bg-white/90 px-3.5 py-2 text-sm font-medium"
            >
              Upload Resume
            </Link>
            <Link
              href="/careers"
              className="rounded-lg bg-[var(--ca-platform-deep)] px-3.5 py-2 text-sm font-semibold text-white"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="ca-platform-card ca-platform-kpi">
          <p className="ca-platform-kpi-label">Active Applications</p>
          <p className="ca-platform-kpi-value">{activeApplications.length}</p>
        </div>
        <div className="ca-platform-card ca-platform-kpi">
          <p className="ca-platform-kpi-label">Upcoming Interviews</p>
          <p className="ca-platform-kpi-value">{upcomingInterviews.length}</p>
        </div>
        <div className="ca-platform-card ca-platform-kpi">
          <p className="ca-platform-kpi-label">Documents on File</p>
          <p className="ca-platform-kpi-value">{profile?.documents.length ?? 0}</p>
        </div>
      </section>

      <section className="ca-platform-card p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="ca-platform-kpi-label">Latest Application</h2>
          <Link
            href="/candidate/applications"
            className="text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
          >
            View all
          </Link>
        </div>

        {latest ? (
          <>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{latest.requisitionTitle}</p>
                <p className="mt-1 text-sm text-[var(--ca-platform-muted)]">
                  {latest.postingLocation} · Applied {formatDate(latest.appliedAt)}
                </p>
              </div>
              <span className="rounded-full bg-[rgba(23,106,99,0.12)] px-2.5 py-1 text-xs font-semibold text-[var(--ca-platform-deep)]">
                {applicationStatusLabels[latest.status]}
              </span>
            </div>

            <div className="ca-platform-pipeline mt-5">
              {CANDIDATE_JOURNEY.map((stage, index) => (
                <div
                  key={stage.label}
                  className={`ca-platform-pipeline-stage ${index <= activeStep ? "is-active" : ""}`}
                >
                  <p className="ca-platform-pipeline-count">{index + 1}</p>
                  <p className="ca-platform-pipeline-label">{stage.label}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-[var(--ca-platform-muted)]">
            No applications yet. Explore{" "}
            <Link href="/careers" className="font-semibold text-[var(--ca-platform-mid)] hover:underline">
              open roles
            </Link>{" "}
            to get started.
          </p>
        )}
      </section>
    </div>
  );
}
