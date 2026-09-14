import type { Metadata } from "next";

import { EmptyState, PageHeader } from "@/components/shared";
import { formatDateTime } from "@/lib/recruiting/format";
import { recruitingRepository } from "@/lib/recruiting";
import { requireCandidateActor } from "@/lib/candidate/security";

export const metadata: Metadata = {
  title: "Interviews",
};

export const dynamic = "force-dynamic";

const INTERVIEW_TYPE_LABELS: Record<string, string> = {
  PHONE_SCREEN: "Phone Screen",
  VIDEO: "Video Interview",
  ONSITE: "Onsite Interview",
  PANEL: "Panel Interview",
  TECHNICAL: "Technical Interview",
};

export default async function CandidateInterviewsPage() {
  const { session } = await requireCandidateActor();
  const profile = await recruitingRepository.getCandidateProfile(
    session.candidateId,
  );
  const interviews = [...(profile?.interviews ?? [])].sort((a, b) =>
    a.scheduledAt.localeCompare(b.scheduledAt),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Interviews"
        description="Scheduled and past interviews across your applications."
      />

      {interviews.length === 0 ? (
        <EmptyState
          title="No interviews scheduled yet"
          description="We will notify you here once one is set up."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
          <ul className="divide-y divide-black/5">
            {interviews.map((interview) => (
              <li key={interview.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{interview.requisitionTitle}</p>
                    <p className="mt-1 text-sm text-black/55">
                      {INTERVIEW_TYPE_LABELS[interview.interviewType] ??
                        interview.interviewType}{" "}
                      · {formatDateTime(interview.scheduledAt)}
                    </p>
                    {interview.locationOrLink && (
                      <p className="mt-1 text-sm text-black/45">
                        {interview.locationOrLink}
                      </p>
                    )}
                  </div>
                  <span className="text-xs uppercase tracking-[0.1em] text-black/45">
                    {interview.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
