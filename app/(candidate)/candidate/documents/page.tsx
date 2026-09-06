import type { Metadata } from "next";

import CandidateDocumentsPanel from "@/components/candidate/candidate-documents-panel";
import { requireCandidateActor } from "@/lib/candidate/security";
import { recruitingRepository } from "@/lib/recruiting";
import { isSupabaseConfigured } from "@/app/lib/supabase/server";

export const metadata: Metadata = {
  title: "Documents | ConsultAmerica",
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
  const documents = (profile?.documents ?? []).filter(
    (doc) => doc.status !== "DELETED",
  );
  const autoOpenUpload =
    params.upload === "resume"
      ? "resume"
      : params.upload === "other"
        ? "other"
        : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#073B3A]">
          Documents
        </h1>
        <p className="mt-2 max-w-2xl text-[#5B6D6B]">
          Upload your resume and supporting documents to share with the Consult
          America recruiting team.
        </p>
      </div>

      <CandidateDocumentsPanel
        initialDocuments={documents}
        supabaseConnected={isSupabaseConfigured()}
        autoOpenUpload={autoOpenUpload}
      />
    </div>
  );
}
