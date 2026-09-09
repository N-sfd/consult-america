import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ApplicationStatusPill from "@/components/candidate/application-status-pill";
import CandidateOfferActions from "@/components/candidate/candidate-offer-actions";
import SubmittedDocumentLink from "@/components/candidate/submitted-document-link";
import { formatDate, formatDateTime, formatDateTimeWithZone } from "@/lib/recruiting/format";
import { recruitingRepository } from "@/lib/recruiting";
import { requireCandidateActor } from "@/lib/candidate/security";
import { employmentTypeLabels } from "@/types/organization";
import {
  candidateApplicationStatusLabels,
  candidateInterviewStatusLabels,
  offerStatusLabels,
  type ApplicationStatus,
} from "@/types/recruiting";

export const metadata: Metadata = {
  title: "Application",
};

export const dynamic = "force-dynamic";

/**
 * Each stage is "reached" if the application's current status OR any status
 * it has ever transitioned to (application_status_history) falls in the
 * stage's set — not just the current status. Otherwise a candidate who
 * reached OFFER and was later moved to REJECTED would show Offer as never
 * reached, since REJECTED alone doesn't match the Offer stage.
 */
const TIMELINE: { label: string; alwaysReached?: boolean; statuses: ApplicationStatus[] }[] = [
  {
    label: "Application Received",
    alwaysReached: true,
    statuses: [],
  },
  {
    label: "Under Review",
    statuses: [
      "REVIEW",
      "RECRUITER_SCREEN",
      "HIRING_MANAGER_REVIEW",
      "INTERVIEW",
      "FINAL_INTERVIEW",
      "OFFER",
      "HIRED",
      "REJECTED",
      "CLOSED",
    ],
  },
  {
    label: "Interview",
    statuses: ["INTERVIEW", "FINAL_INTERVIEW", "OFFER", "HIRED", "REJECTED", "CLOSED"],
  },
  {
    label: "Offer",
    statuses: ["OFFER", "HIRED"],
  },
  {
    label: "Decision",
    statuses: ["HIRED", "REJECTED", "CLOSED", "WITHDRAWN"],
  },
];

export default async function CandidateApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { session } = await requireCandidateActor();
  const profile = await recruitingRepository.getCandidateProfile(
    session.candidateId,
  );

  const application = profile?.applications.find((a) => a.applicationId === id);
  if (!application) notFound();

  const history = (profile?.statusHistory ?? [])
    .filter((h) => h.applicationId === id)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  const reachedStatuses = new Set<ApplicationStatus>([
    application.status,
    ...history.map((h) => h.toStatus),
  ]);

  /** Earliest history date a status in `statuses` was reached, for the
   * per-stage date shown under each reached timeline step. */
  function earliestDateFor(statuses: ApplicationStatus[]): string | undefined {
    const match = history.find((h) => statuses.includes(h.toStatus));
    return match?.createdAt;
  }

  const offer = (profile?.offers ?? []).find((o) => o.applicationId === id);
  const interviews = (profile?.interviews ?? []).filter(
    (i) => i.applicationId === id,
  );
  const upcomingInterview = interviews
    .filter((i) => i.status === "SCHEDULED")
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0];

  const submittedLinks = (profile?.applicationDocumentLinks ?? []).filter(
    (link) => link.applicationId === id,
  );
  const documentById = new Map(
    (profile?.documents ?? []).map((doc) => [doc.id, doc]),
  );

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/candidate/applications"
          className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
        >
          ← All applications
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          {application.requisitionTitle}
        </h1>
        <p className="mt-2 text-black/55">
          {application.applicationNumber} · {application.postingLocation}
          {application.employmentType
            ? ` · ${employmentTypeLabels[application.employmentType]}`
            : ""}
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Status
          </p>
          <p className="mt-3">
            <ApplicationStatusPill status={application.status} />
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Applied
          </p>
          <p className="mt-3 text-lg font-semibold">
            {formatDateTime(application.appliedAt)}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Last Updated
          </p>
          <p className="mt-3 text-lg font-semibold">
            {formatDateTime(application.updatedAt)}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Application Timeline
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-5">
          {TIMELINE.map((step) => {
            const reached =
              step.alwaysReached ||
              step.statuses.some((s) => reachedStatuses.has(s));
            const stageDate = step.alwaysReached
              ? application.appliedAt
              : earliestDateFor(step.statuses);
            return (
              <li
                key={step.label}
                className={`rounded-md border px-3 py-3 text-sm ${
                  reached
                    ? "border-[var(--ca-platform-deep)]/30 bg-[rgba(23,106,99,0.08)] font-medium"
                    : "border-black/10 text-black/40"
                }`}
              >
                <p>{step.label}</p>
                {reached && stageDate ? (
                  <p className="mt-1 text-xs font-normal text-black/45">
                    {formatDate(stageDate)}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Documents submitted with this application
        </h2>
        {submittedLinks.length === 0 ? (
          <p className="mt-4 text-sm text-black/50">
            No documents were attached to this application snapshot.
          </p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {submittedLinks.map((link) => {
              const doc = documentById.get(link.documentId);
              return (
                <li
                  key={link.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {doc?.fileName ?? "Document"}
                      {link.purpose || link.documentRole
                        ? ` · ${(link.documentRole ?? link.purpose)?.replaceAll("_", " ")}`
                        : ""}
                    </p>
                    <p className="text-black/50">
                      Submitted{" "}
                      {formatDate(link.attachedAt ?? link.createdAt)}
                      {doc?.isPrimaryResume ? " · Was primary at submit" : ""}
                      {doc?.status === "ARCHIVED" ? " · Archived since" : ""}
                    </p>
                  </div>
                  {doc ? <SubmittedDocumentLink documentId={doc.id} /> : null}
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-4 text-xs text-black/45">
          This list shows the exact documents submitted with this application,
          even if you later replaced your primary resume.
        </p>
      </section>

      {upcomingInterview ? (
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Upcoming Interview
          </h2>
          <p className="mt-3 text-sm text-black/70">
            {upcomingInterview.interviewType.replaceAll("_", " ")} ·{" "}
            {formatDateTimeWithZone(upcomingInterview.scheduledAt)} ·{" "}
            {candidateInterviewStatusLabels[upcomingInterview.status]}
            {upcomingInterview.locationOrLink
              ? ` · ${upcomingInterview.locationOrLink}`
              : ""}
          </p>
        </section>
      ) : interviews.length === 0 ? (
        <section className="rounded-lg border border-dashed border-black/15 bg-white p-6 text-sm text-black/50">
          No upcoming interviews.
        </section>
      ) : null}

      {offer &&
      (offer.status === "EXTENDED" ||
        offer.status === "ACCEPTED" ||
        offer.status === "DECLINED") ? (
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Offer
          </h2>
          <p className="mt-3 text-sm text-black/70">
            Status:{" "}
            <span className="font-semibold text-[var(--ca-app-ink)]">
              {offerStatusLabels[offer.status]}
            </span>
          </p>
          {offer.startDate ? (
            <p className="mt-1 text-sm text-black/55">
              Proposed start: {offer.startDate}
            </p>
          ) : null}
          {offer.status === "EXTENDED" ? (
            <div className="mt-4">
              <CandidateOfferActions applicationId={id} />
            </div>
          ) : null}
        </section>
      ) : null}

      {interviews.length > 0 ? (
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Interviews
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {interviews.map((interview) => (
              <li key={interview.id} className="flex justify-between gap-3">
                <span className="text-black/70">
                  {interview.interviewType.replaceAll("_", " ")} ·{" "}
                  {candidateInterviewStatusLabels[interview.status]}
                  {interview.locationOrLink
                    ? ` · ${interview.locationOrLink}`
                    : ""}
                </span>
                <span className="shrink-0 text-black/40">
                  {formatDateTimeWithZone(interview.scheduledAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Status History
        </h2>
        {history.length === 0 ? (
          <p className="mt-4 text-sm text-black/50">No status history yet.</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {history.map((entry) => (
              <li key={entry.id} className="flex justify-between gap-3">
                <span className="text-black/70">
                  {entry.fromStatus
                    ? `${candidateApplicationStatusLabels[entry.fromStatus]} → ${candidateApplicationStatusLabels[entry.toStatus]}`
                    : candidateApplicationStatusLabels[entry.toStatus]}
                </span>
                <span className="shrink-0 text-black/40">
                  {formatDateTime(entry.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
