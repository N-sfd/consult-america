"use client";

import { useMemo, useTransition } from "react";
import { FileText } from "lucide-react";

import { getStaffCandidateDocumentSignedUrlAction } from "@/app/actions/candidate-document-actions";
import {
  formatDocumentBytes,
  formatDocumentUploaded,
} from "@/components/documents/format";
import { DOCUMENT_TYPE_LABELS } from "@/lib/storage/candidate-documents";
import type { Document } from "@/types/recruiting";

type AppLink = {
  id: string;
  applicationId: string;
  documentId: string;
  purpose?: "RESUME" | "COVER_LETTER" | "SUPPORTING" | "OTHER";
  createdAt: string;
  requisitionTitle?: string;
};

export default function RecruiterCandidateDocuments({
  documents,
  applicationDocumentLinks = [],
}: {
  documents: Document[];
  applicationDocumentLinks?: AppLink[];
}) {
  const [pending, startTransition] = useTransition();

  const byId = useMemo(() => {
    const map = new Map(documents.map((d) => [d.id, d]));
    return map;
  }, [documents]);

  const primaryResume =
    documents.find((d) => d.documentType === "RESUME" && d.isPrimaryResume) ??
    documents.find((d) => d.documentType === "RESUME" && d.status === "ACTIVE");

  const linkedIds = new Set(applicationDocumentLinks.map((l) => l.documentId));

  const otherDocs = documents.filter(
    (d) =>
      d.status === "ACTIVE" &&
      d.id !== primaryResume?.id &&
      d.documentType !== "COVER_LETTER" &&
      !linkedIds.has(d.id),
  );

  const coverLetters = documents.filter(
    (d) => d.status === "ACTIVE" && d.documentType === "COVER_LETTER",
  );

  const linksByApplication = useMemo(() => {
    const groups = new Map<
      string,
      { title: string; links: AppLink[] }
    >();
    for (const link of applicationDocumentLinks) {
      const key = link.applicationId;
      const existing = groups.get(key);
      if (existing) existing.links.push(link);
      else {
        groups.set(key, {
          title: link.requisitionTitle ?? "Application",
          links: [link],
        });
      }
    }
    return [...groups.values()];
  }, [applicationDocumentLinks]);

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

  function DocButton({ doc, label }: { doc: Document; label?: string }) {
    return (
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
              ({label ?? DOCUMENT_TYPE_LABELS[doc.documentType]})
            </span>
          </span>
        </span>
        <span className="shrink-0 text-black/45">
          {formatDocumentUploaded(doc.uploadedAt)}
          {doc.fileSize ? ` · ${formatDocumentBytes(doc.fileSize)}` : ""}
        </span>
      </button>
    );
  }

  if (documents.length === 0 && applicationDocumentLinks.length === 0) {
    return <p className="text-sm text-black/45">No documents on file.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
          Primary Resume
        </p>
        {primaryResume ? (
          <div className="mt-2 divide-y divide-black/6">
            <DocButton doc={primaryResume} label="Resume" />
            <button
              type="button"
              disabled={pending}
              onClick={() => openDocument(primaryResume.id)}
              className="py-2 text-sm font-semibold text-[var(--ca-blue)]"
            >
              View Resume
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-black/45">No primary resume on file.</p>
        )}
      </div>

      {linksByApplication.length > 0 ? (
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
            Application Documents
          </p>
          <div className="mt-2 space-y-4">
            {linksByApplication.map((group) => (
              <div key={group.title + group.links[0]?.applicationId}>
                <p className="text-sm font-medium text-[var(--ca-app-ink)]">
                  {group.title}
                </p>
                <ul className="mt-1 divide-y divide-black/6">
                  {group.links.map((link) => {
                    const doc = byId.get(link.documentId);
                    if (!doc) return null;
                    const purposeLabel =
                      link.purpose === "RESUME"
                        ? "Resume used for application"
                        : link.purpose === "COVER_LETTER"
                          ? "Cover Letter"
                          : DOCUMENT_TYPE_LABELS[doc.documentType];
                    return (
                      <li key={link.id}>
                        <DocButton doc={doc} label={purposeLabel} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {(coverLetters.length > 0 || otherDocs.length > 0) && (
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
            Other Documents
          </p>
          <ul className="mt-2 divide-y divide-black/6">
            {[...coverLetters, ...otherDocs].map((doc) => (
              <li key={doc.id}>
                <DocButton doc={doc} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-black/40">
        Same `documents` + `application_documents` records as Candidate Portal.
        Files open via short-lived signed access.
      </p>
    </div>
  );
}
