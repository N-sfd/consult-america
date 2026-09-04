import type { Metadata } from "next";

import { formatDate } from "@/lib/recruiting/format";
import { recruitingRepository } from "@/lib/recruiting";
import { requireCandidateActor } from "@/lib/candidate/security";

export const metadata: Metadata = {
  title: "Documents | ConsultAmerica",
};

export const dynamic = "force-dynamic";

export default async function CandidateDocumentsPage() {
  const { session } = await requireCandidateActor();
  const profile = await recruitingRepository.getCandidateProfile(
    session.candidateId,
  );
  const documents = profile?.documents ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Documents
        </h1>
        <p className="mt-2 text-black/55">
          Resumes and files you&apos;ve shared with our recruiting team.
          Uploading new documents is coming soon.
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-lg border border-black/10 bg-white px-5 py-8 text-sm text-black/50">
          No documents on file yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
          <ul className="divide-y divide-black/5">
            {documents.map((document) => (
              <li
                key={document.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <p className="font-medium">{document.fileName}</p>
                  <p className="mt-1 text-sm text-black/55">
                    {document.documentType} · Uploaded{" "}
                    {formatDate(document.uploadedAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
