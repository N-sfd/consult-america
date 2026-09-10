import type { Metadata } from "next";

import CandidateDocumentsPanel from "@/components/candidate/candidate-documents-panel";
import { requireCandidateActor } from "@/lib/candidate/security";
import { recruitingRepository } from "@/lib/recruiting";
import { isSupabaseConfigured } from "@/app/lib/supabase/server";

export const metadata: Metadata = {
  title: "Documents",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ upload?: string }>;
};

export default async function CandidateDocumentsPage({ searchParams }: PageProps) {
  const { session } = await requireCandidateActor();
  const params = await searchParams;
  const profile = await recruitingRepository.getCandidateProfile(
    session.candidateId,
  );

  // Include ACTIVE + ARCHIVED so previous resume versions remain visible.
  const documents = (profile?.documents ?? []).filter(
    (doc) => doc.status !== "DELETED",
  );

  const applicationUsageByDocumentId: Record<string, number> = {};
  for (const link of profile?.applicationDocumentLinks ?? []) {
    applicationUsageByDocumentId[link.documentId] =
      (applicationUsageByDocumentId[link.documentId] ?? 0) + 1;
  }

  const autoOpenUpload =
    params.upload === "resume"
      ? "resume"
      : params.upload === "other"
        ? "other"
        : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-[-0.04em]">
          Documents
        </h1>
        <p className="mt-2 max-w-2xl text-black/55">
          Upload your resume and supporting documents to share with the Consult
          America recruiting team.
        </p>
      </div>

      <CandidateDocumentsPanel
        initialDocuments={documents}
        applicationUsageByDocumentId={applicationUsageByDocumentId}
        supabaseConnected={isSupabaseConfigured()}
        autoOpenUpload={autoOpenUpload}
      />
    </div>
  );
}
