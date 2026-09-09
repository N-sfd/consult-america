import type { Metadata } from "next";
import Link from "next/link";

import { calculateProfileCompletion } from "@/lib/candidate/profile-completion";
import { formatDate, formatDateTime } from "@/lib/recruiting/format";
import { recruitingRepository } from "@/lib/recruiting";
import { requireCandidateActor } from "@/lib/candidate/security";
import {
  candidateApplicationStatusLabels,
  offerStatusLabels,
  type ApplicationStatus,
} from "@/types/recruiting";

export const metadata: Metadata = {
  title: "Candidate Portal",
};

export const dynamic = "force-dynamic";

const CANDIDATE_JOURNEY: { key: ApplicationStatus | "DECISION"; label: string }[] = [
  { key: "APPLIED", label: "Application Received" },
  { key: "RECRUITER_SCREEN", label: "Under Review" },
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
  const documents = profile?.documents ?? [];
  const activeApplications = applications.filter(
    (application) =>
      application.status !== "REJECTED" &&
      application.status !== "WITHDRAWN" &&
      application.status !== "CLOSED",
  );
  const upcomingInterviews = (profile?.interviews ?? []).filter(
    (interview) => interview.status === "SCHEDULED",
  );
  const activeOffer = (profile?.offers ?? []).find(
    (offer) =>
      offer.status === "EXTENDED" ||
      offer.status === "ACCEPTED" ||
      offer.status === "DECLINED",
  );
  const latest = [...applications].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )[0];
  const activeStep = latest ? journeyIndex(latest.status) : -1;
  const nextInterview = [...upcomingInterviews].sort((a, b) =>
    a.scheduledAt.localeCompare(b.scheduledAt),
  )[0];

  const hasActiveResume = documents.some(
    (doc) =>
      doc.documentType === "RESUME" &&
      (doc.isPrimaryResume || doc.status === "ACTIVE" || !doc.status),
  );
  const completion = profile
    ? calculateProfileCompletion({
        candidate: profile.candidate,
        experience: profile.experience,
        education: profile.education,
        skills: profile.skills,
        hasActiveResume,
      })
    : null;

  return (
    <div className="space-y-7">
      <section className="ca-platform-hero">
        <div className="relative z-[1]">
          <h1 className="text-[clamp(1.75rem,2.4vw,2.25rem)] font-semibold tracking-[-0.03em]">
            Welcome back, {session.displayName.split(" ")[0]}
          </h1>
          <p className="mt-1.5 text-[0.95rem] text-[var(--ca-platform-muted)]">
            Track your applications, documents, and job match guidance in one place.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/candidate/jobs"
              className="rounded-lg bg-[var(--ca-platform-deep)] px-3.5 py-2 text-sm font-semibold text-white"
            >
              Browse Jobs
            </Link>
            <Link
              href="/candidate/documents?upload=resume"
              className="rounded-lg border border-[var(--ca-platform-border)] bg-white/90 px-3.5 py-2 text-sm font-medium"
            >
              Upload Resume
            </Link>
            <Link
              href="/candidate/profile"
              className="rounded-lg border border-[var(--ca-platform-border)] bg-white/90 px-3.5 py-2 text-sm font-medium"
            >
              Complete Profile
            </Link>
            <Link
              href="/candidate/applications"
              className="rounded-lg border border-[var(--ca-platform-border)] bg-white/90 px-3.5 py-2 text-sm font-medium"
            >
              View Applications
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="ca-platform-card ca-platform-kpi">
          <p className="ca-platform-kpi-label">Active Applications</p>
          <p className="ca-platform-kpi-value">{activeApplications.length}</p>
        </div>
        <div className="ca-platform-card ca-platform-kpi">
          <p className="ca-platform-kpi-label">Upcoming Interviews</p>
          <p className="ca-platform-kpi-value">{upcomingInterviews.length}</p>
          {upcomingInterviews.length === 0 ? (
            <p className="mt-1 text-xs text-[var(--ca-platform-muted)]">
              No upcoming interviews.
            </p>
          ) : null}
        </div>
        <div className="ca-platform-card ca-platform-kpi">
          <p className="ca-platform-kpi-label">Documents</p>
          <p className="ca-platform-kpi-value">
            {documents.filter((d) => d.status === "ACTIVE" || !d.status).length}
          </p>
        </div>
        <div className="ca-platform-card ca-platform-kpi">
          <p className="ca-platform-kpi-label">Profile Completion</p>
          <p className="ca-platform-kpi-value">{completion?.percent ?? 0}%</p>
          {(completion?.percent ?? 0) < 100 ? (
            <Link
              href="/candidate/profile"
              className="mt-1 inline-block text-xs font-semibold text-[var(--ca-platform-mid)] hover:underline"
            >
              Complete Profile
            </Link>
          ) : null}
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
                {candidateApplicationStatusLabels[latest.status]}
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
            No applications yet. Browse{" "}
            <Link
              href="/candidate/jobs"
              className="font-semibold text-[var(--ca-platform-mid)] hover:underline"
            >
              open roles
            </Link>{" "}
            to get started.
          </p>
        )}
      </section>

      {(nextInterview || activeOffer) && (
        <section className="grid gap-4 md:grid-cols-2">
          {nextInterview ? (
            <div className="ca-platform-card p-6">
              <h2 className="ca-platform-kpi-label">Upcoming Interview</h2>
              <p className="mt-3 font-medium">{nextInterview.requisitionTitle}</p>
              <p className="mt-1 text-sm text-[var(--ca-platform-muted)]">
                {formatDateTime(nextInterview.scheduledAt)}
                {nextInterview.locationOrLink
                  ? ` · ${nextInterview.locationOrLink}`
                  : ""}
              </p>
              <Link
                href={`/candidate/applications/${nextInterview.applicationId}`}
                className="mt-4 inline-block text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
              >
                View application
              </Link>
            </div>
          ) : null}
          {activeOffer ? (
            <div className="ca-platform-card p-6">
              <h2 className="ca-platform-kpi-label">Offer</h2>
              <p className="mt-3 font-medium">
                {offerStatusLabels[activeOffer.status]}
              </p>
              <p className="mt-1 text-sm text-[var(--ca-platform-muted)]">
                Review the details on your application.
              </p>
              <Link
                href={`/candidate/applications/${activeOffer.applicationId}`}
                className="mt-4 inline-block text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
              >
                View offer
              </Link>
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
}
