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
  purpose?: "RESUME" | "COVER_LETTER" | "SUPPORTING" | "OTHER" | "PORTFOLIO";
  documentRole?: "RESUME" | "COVER_LETTER" | "SUPPORTING" | "OTHER" | "PORTFOLIO";
  createdAt: string;
  attachedAt?: string;
  requisitionTitle?: string;
  appliedAt?: string;
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

  const currentResume =
    documents.find(
      (d) =>
        d.documentType === "RESUME" &&
        d.isPrimaryResume &&
        d.status !== "ARCHIVED" &&
        d.status !== "DELETED",
    ) ??
    documents.find(
      (d) => d.documentType === "RESUME" && d.status === "ACTIVE",
    );

  const linksByApplication = useMemo(() => {
    const groups = new Map<
      string,
      {
        applicationId: string;
        title: string;
        appliedAt?: string;
        links: AppLink[];
      }
    >();
    for (const link of applicationDocumentLinks) {
      const key = link.applicationId;
      const existing = groups.get(key);
      if (existing) existing.links.push(link);
      else {
        groups.set(key, {
          applicationId: link.applicationId,
          title: link.requisitionTitle ?? "Application",
          appliedAt: link.appliedAt,
          links: [link],
        });
      }
    }
    return [...groups.values()].sort((a, b) =>
      (b.appliedAt ?? "").localeCompare(a.appliedAt ?? ""),
    );
  }, [applicationDocumentLinks]);

  const otherActive = documents.filter(
    (d) =>
      d.status === "ACTIVE" &&
      d.id !== currentResume?.id &&
      d.documentType !== "RESUME",
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

  if (documents.length === 0 && applicationDocumentLinks.length === 0) {
    return <p className="text-sm text-black/45">No documents on file.</p>;
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
          Current Profile Resume
        </p>
        {currentResume ? (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-b border-black/6 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--ca-app-ink)]">
                {currentResume.fileName}
              </p>
              <p className="mt-1 text-xs text-black/45">
                Uploaded {formatDocumentUploaded(currentResume.uploadedAt)}
                {currentResume.fileSize
                  ? ` · ${formatDocumentBytes(currentResume.fileSize)}`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => openDocument(currentResume.id)}
              className="text-sm font-semibold text-[var(--ca-blue)]"
            >
              View Resume
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-black/45">No current primary resume.</p>
        )}
      </section>

      <section>
        <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
          Application History
        </p>
        <p className="mt-1 text-xs text-black/45">
          Resume attached at submission — not automatically updated when the
          candidate replaces their primary resume.
        </p>
        {linksByApplication.length === 0 ? (
          <p className="mt-3 text-sm text-black/45">
            No application document links yet.
          </p>
        ) : (
          <div className="mt-3 space-y-5">
            {linksByApplication.map((group) => {
              const resumeLink =
                group.links.find((l) => l.purpose === "RESUME") ??
                group.links.find((l) => byId.get(l.documentId)?.documentType === "RESUME");
              const resumeDoc = resumeLink
                ? byId.get(resumeLink.documentId)
                : undefined;
              const otherLinks = group.links.filter(
                (l) => l.id !== resumeLink?.id,
              );

              return (
                <div
                  key={group.applicationId}
                  className="rounded-lg border border-black/8 px-4 py-3"
                >
                  <p className="font-medium text-[var(--ca-app-ink)]">
                    {group.title}
                  </p>
                  {group.appliedAt ? (
                    <p className="mt-0.5 text-xs text-black/45">
                      Applied {formatDocumentUploaded(group.appliedAt)}
                    </p>
                  ) : null}

                  <div className="mt-3 space-y-2 text-sm">
                    {resumeDoc ? (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2 text-black/70">
                          <FileText className="h-4 w-4 text-black/35" />
                          Resume used:{" "}
                          <span className="font-medium text-[var(--ca-app-ink)]">
                            {resumeDoc.fileName}
                          </span>
                        </span>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => openDocument(resumeDoc.id)}
                          className="font-semibold text-[var(--ca-blue)]"
                        >
                          View
                        </button>
                      </div>
                    ) : (
                      <p className="text-black/45">No resume linked.</p>
                    )}

                    {otherLinks.map((link) => {
                      const doc = byId.get(link.documentId);
                      if (!doc) return null;
                      return (
                        <div
                          key={link.id}
                          className="flex flex-wrap items-center justify-between gap-2"
                        >
                          <span className="text-black/70">
                            {DOCUMENT_TYPE_LABELS[doc.documentType]}:{" "}
                            <span className="font-medium text-[var(--ca-app-ink)]">
                              {doc.fileName}
                            </span>
                          </span>
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => openDocument(doc.id)}
                            className="font-semibold text-[var(--ca-blue)]"
                          >
                            View
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {otherActive.length > 0 ? (
        <section>
          <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
            Other Documents
          </p>
          <ul className="mt-2 divide-y divide-black/6">
            {otherActive.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <span>
                  {doc.fileName}{" "}
                  <span className="text-black/40">
                    ({DOCUMENT_TYPE_LABELS[doc.documentType]})
                  </span>
                </span>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => openDocument(doc.id)}
                  className="font-semibold text-[var(--ca-blue)]"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

/** Documents submitted with one application — never substitutes current primary. */
export function ApplicationSubmittedDocuments({
  applicationId,
  documents,
  applicationDocumentLinks = [],
}: {
  applicationId: string;
  documents: Document[];
  applicationDocumentLinks?: AppLink[];
}) {
  const [pending, startTransition] = useTransition();
  const byId = useMemo(
    () => new Map(documents.map((d) => [d.id, d])),
    [documents],
  );
  const links = applicationDocumentLinks.filter(
    (l) => l.applicationId === applicationId,
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

  if (links.length === 0) {
    return (
      <p className="text-sm text-black/45">
        No documents were linked to this application.
      </p>
    );
  }

  return (
    <div>
      <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
        Documents Submitted With This Application
      </p>
      <ul className="mt-2 divide-y divide-black/6">
        {links.map((link) => {
          const doc = byId.get(link.documentId);
          if (!doc) return null;
          const label =
            link.purpose === "RESUME"
              ? "Resume"
              : link.purpose === "COVER_LETTER"
                ? "Cover Letter"
                : DOCUMENT_TYPE_LABELS[doc.documentType];
          return (
            <li
              key={link.id}
              className="flex items-center justify-between gap-3 py-3 text-sm"
            >
              <span>
                <span className="text-black/45">{label}</span>
                <span className="mt-0.5 block font-medium text-[var(--ca-app-ink)]">
                  {doc.fileName}
                </span>
              </span>
              <button
                type="button"
                disabled={pending}
                onClick={() => openDocument(doc.id)}
                className="font-semibold text-[var(--ca-blue)]"
              >
                View
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
