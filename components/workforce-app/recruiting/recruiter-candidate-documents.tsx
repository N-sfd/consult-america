"use client";

import { useTransition } from "react";
import { FileText } from "lucide-react";

import { getStaffCandidateDocumentSignedUrlAction } from "@/app/actions/candidate-document-actions";
import { DOCUMENT_TYPE_LABELS } from "@/lib/storage/candidate-documents";
import { formatDate } from "@/lib/recruiting/format";
import type { Document } from "@/types/recruiting";

function formatBytes(bytes?: number) {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function RecruiterCandidateDocuments({
  documents,
}: {
  documents: Document[];
}) {
  const [pending, startTransition] = useTransition();
  const active = documents.filter((d) => d.status !== "DELETED");
  const primaryResume =
    active.find((d) => d.documentType === "RESUME" && d.isPrimaryResume) ??
    active.find((d) => d.documentType === "RESUME");
  const coverLetters = active.filter((d) => d.documentType === "COVER_LETTER");
  const others = active.filter(
    (d) =>
      d.id !== primaryResume?.id &&
      d.documentType !== "COVER_LETTER",
  );

  function openDocument(documentId: string) {
    startTransition(async () => {
      const result = await getStaffCandidateDocumentSignedUrlAction(documentId);
      if (result.ok && result.signedUrl) {
        window.open(result.signedUrl, "_blank", "noopener,noreferrer");
      } else {
        window.alert(result.message || "Unable to open document.");
      }
    });
  }

  if (active.length === 0) {
    return <p className="text-sm text-black/45">No documents on file.</p>;
  }

  function Section({
    title,
    items,
  }: {
    title: string;
    items: Document[];
  }) {
    if (items.length === 0) return null;
    return (
      <div className="mb-6 last:mb-0">
        <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
          {title}
        </p>
        <ul className="mt-2 divide-y divide-black/6">
          {items.map((doc) => (
            <li key={doc.id}>
              <button
                type="button"
                disabled={pending}
                onClick={() => openDocument(doc.id)}
                className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm hover:text-[var(--ca-blue)] disabled:opacity-60"
              >
                <span className="inline-flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-black/35" />
                  <span className="truncate">
                    {doc.fileName}
                    <span className="text-black/40">
                      {" "}
                      ({DOCUMENT_TYPE_LABELS[doc.documentType]})
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-black/45">
                  {formatDate(doc.uploadedAt)}
                  {doc.fileSize ? ` · ${formatBytes(doc.fileSize)}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <Section
        title="Primary Resume"
        items={primaryResume ? [primaryResume] : []}
      />
      <Section title="Cover Letter" items={coverLetters} />
      <Section title="Other Documents" items={others} />
      <p className="mt-2 text-xs text-black/40">
        Files open via short-lived signed access. Raw storage URLs are not
        exposed.
      </p>
    </div>
  );
}
