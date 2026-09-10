"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, UploadCloud } from "lucide-react";

import {
  deleteCandidateDocumentAction,
  getCandidateDocumentSignedUrlAction,
  uploadCandidateDocumentAction,
} from "@/app/actions/candidate-document-actions";
import ConfirmDialog from "@/components/candidate/confirm-dialog";
import DocumentUploader from "@/components/documents/document-uploader";
import DocumentRow, {
  DocumentCard,
  ResumeCard,
} from "@/components/documents/document-row";
import {
  formatDocumentBytes,
  formatDocumentUploaded,
} from "@/components/documents/format";
import type { Document, DocumentType } from "@/types/recruiting";
import { DOCUMENT_TYPE_LABELS } from "@/lib/storage/candidate-documents";

type Props = {
  initialDocuments: Document[];
  /** How many submitted applications reference each document id */
  applicationUsageByDocumentId?: Record<string, number>;
  supabaseConnected: boolean;
  autoOpenUpload?: "resume" | "other" | null;
};

export default function CandidateDocumentsPanel({
  initialDocuments,
  applicationUsageByDocumentId = {},
  supabaseConnected,
  autoOpenUpload = null,
}: Props) {
  const router = useRouter();
  const visibleDocs = useMemo(
    () =>
      initialDocuments.filter(
        (d) => d.status === "ACTIVE" || d.status === "ARCHIVED" || !d.status,
      ),
    [initialDocuments],
  );
  const documents = visibleDocs;
  const [panel, setPanel] = useState<"closed" | "resume" | "other">(
    autoOpenUpload === "resume"
      ? "resume"
      : autoOpenUpload === "other"
        ? "other"
        : "closed",
  );
  const [documentType, setDocumentType] = useState<DocumentType>("COVER_LETTER");
  const [replaceId, setReplaceId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Re-open the upload panel if `autoOpenUpload` changes after mount (e.g.
  // navigating from ?upload=resume to itself again isn't a remount in the
  // App Router). Adjusting state during render, not in an effect, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevAutoOpenUpload, setPrevAutoOpenUpload] = useState(autoOpenUpload);
  if (autoOpenUpload !== prevAutoOpenUpload) {
    setPrevAutoOpenUpload(autoOpenUpload);
    if (autoOpenUpload === "resume") {
      setPanel("resume");
      setReplaceId(null);
    }
  }

  const primaryResume = useMemo(
    () =>
      documents.find(
        (d) =>
          d.documentType === "RESUME" &&
          d.isPrimaryResume &&
          d.status !== "ARCHIVED" &&
          d.status !== "DELETED",
      ) ??
      documents.find(
        (d) =>
          d.documentType === "RESUME" &&
          (d.status === "ACTIVE" || !d.status),
      ),
    [documents],
  );

  const previousResumes = useMemo(
    () =>
      documents.filter(
        (d) =>
          d.documentType === "RESUME" &&
          d.id !== primaryResume?.id &&
          d.status !== "DELETED",
      ),
    [documents, primaryResume],
  );

  const supporting = useMemo(
    () =>
      documents.filter(
        (d) =>
          d.documentType !== "RESUME" &&
          (d.status === "ACTIVE" || !d.status),
      ),
    [documents],
  );

  const confirmDeleteUsage = confirmDeleteId
    ? (applicationUsageByDocumentId[confirmDeleteId] ?? 0)
    : 0;

  function openSigned(documentId: string, download = false) {
    startTransition(async () => {
      const result = await getCandidateDocumentSignedUrlAction(documentId);
      if (!result.ok || !result.signedUrl) {
        setError(result.message);
        return;
      }
      if (download) {
        const a = document.createElement("a");
        a.href = result.signedUrl;
        a.download = "";
        a.target = "_blank";
        a.rel = "noreferrer";
        a.click();
      } else {
        window.open(result.signedUrl, "_blank", "noopener,noreferrer");
      }
    });
  }

  function handleUpload(file: File) {
    if (!supabaseConnected) {
      setError(
        "Document uploads require the connected candidate environment.",
      );
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    if (panel === "resume" || replaceId) {
      formData.set("documentType", "RESUME");
      if (replaceId) {
        formData.set("replaceDocumentId", replaceId);
        formData.set("replacePrimary", "1");
      }
    } else {
      formData.set("documentType", documentType);
    }

    startTransition(async () => {
      const result = await uploadCandidateDocumentAction(formData);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage(result.message);
      setPanel("closed");
      setReplaceId(null);
      router.refresh();
    });
  }

  function removeDocument(documentId: string) {
    setError(null);
    startTransition(async () => {
      const result = await deleteCandidateDocumentAction(documentId);
      if (!result.ok) {
        setError(result.message);
        setConfirmDeleteId(null);
        return;
      }
      setMessage(result.message);
      setConfirmDeleteId(null);
      router.refresh();
    });
  }

  if (!supabaseConnected) {
    return (
      <div className="rounded-xl border border-black/10 bg-black/[0.02] px-5 py-6 text-sm text-black/55">
        Document uploads require the connected candidate environment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message ? (
        <p className="text-sm text-emerald-700">{message}</p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div>
        <h2 className="text-lg font-semibold text-black">My Documents</h2>
        <p className="mt-1 text-sm text-black/55">
          Your current resume is separate from resumes already submitted with
          applications. Replacing your primary resume does not change past
          applications.
        </p>
      </div>

      <ResumeCard
        document={primaryResume}
        pending={pending}
        onView={primaryResume ? () => openSigned(primaryResume.id) : undefined}
        onDownload={
          primaryResume ? () => openSigned(primaryResume.id, true) : undefined
        }
        onReplace={
          primaryResume
            ? () => {
                setReplaceId(primaryResume.id);
                setPanel("resume");
                setError(null);
              }
            : undefined
        }
        emptyAction={
          <button
            type="button"
            onClick={() => {
              setReplaceId(null);
              setPanel("resume");
            }}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--ca-platform-deep)] px-4 text-sm font-semibold text-white"
          >
            <UploadCloud className="h-4 w-4" />
            Upload Resume
          </button>
        }
      />
      {primaryResume ? (
        <p className="-mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--ca-platform-deep)]">
          Current
        </p>
      ) : null}

      {previousResumes.length > 0 ? (
        <section className="ca-platform-card p-5">
          <h2 className="text-base font-semibold text-black">
            Previous Resumes
          </h2>
          <p className="mt-1 text-sm text-black/55">
            Earlier versions kept for application history.
          </p>
          <ul className="mt-4 divide-y divide-black/5">
            {previousResumes.map((doc) => {
              const usage = applicationUsageByDocumentId[doc.id] ?? 0;
              return (
                <li
                  key={doc.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-black">{doc.fileName}</p>
                    <p className="mt-1 text-sm text-black/55">
                      Uploaded {formatDocumentUploaded(doc.uploadedAt)}
                      {doc.fileSize
                        ? ` · ${formatDocumentBytes(doc.fileSize)}`
                        : ""}
                      {usage > 0
                        ? ` · Used for ${usage} application${usage === 1 ? "" : "s"}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm font-semibold">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => openSigned(doc.id)}
                      className="text-[var(--ca-blue)]"
                    >
                      View
                    </button>
                    {usage === 0 ? (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => setConfirmDeleteId(doc.id)}
                        className="text-red-700"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {panel !== "closed" ? (
        <div className="space-y-3">
          {panel === "other" ? (
            <label className="block text-sm font-medium text-black">
              Document type
              <select
                value={documentType}
                onChange={(e) =>
                  setDocumentType(e.target.value as DocumentType)
                }
                className="mt-1.5 w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm"
              >
                {(
                  [
                    "COVER_LETTER",
                    "TRANSCRIPT",
                    "CERTIFICATION",
                    "PORTFOLIO",
                    "OTHER",
                  ] as DocumentType[]
                ).map((type) => (
                  <option key={type} value={type}>
                    {DOCUMENT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <DocumentUploader
            title={
              replaceId
                ? "Replace resume"
                : panel === "resume"
                  ? "Upload resume"
                  : "Upload document"
            }
            pending={pending}
            onUpload={handleUpload}
            onCancel={() => {
              setPanel("closed");
              setReplaceId(null);
            }}
          />
        </div>
      ) : (
        <div>
          <h2 className="text-base font-semibold text-black">
            Supporting Documents
          </h2>
          <button
            type="button"
            onClick={() => {
              setPanel("other");
              setDocumentType("COVER_LETTER");
              setReplaceId(null);
            }}
            className="mt-3 inline-flex h-11 items-center gap-2 rounded-lg border border-black/10 bg-white px-4 text-sm font-semibold text-black"
          >
            Upload Document
          </button>
        </div>
      )}

      {supporting.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-black/15 px-5 py-6 text-sm text-black/50">
          <FolderOpen className="h-5 w-5 shrink-0 text-black/25" />
          <p>
            No supporting documents yet. Cover letters, transcripts, and
            certifications you upload will show up here.
          </p>
        </div>
      ) : (
        <section>
          <div className="ca-platform-card mt-1 hidden overflow-hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.02] text-[0.7rem] uppercase tracking-[0.1em] text-black/40">
                <tr>
                  <th className="px-4 py-3 font-semibold">Document</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Uploaded</th>
                  <th className="px-4 py-3 font-semibold">Size</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {supporting.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    document={doc}
                    pending={pending}
                    onView={() => openSigned(doc.id)}
                    onDownload={() => openSigned(doc.id, true)}
                    onDelete={() => setConfirmDeleteId(doc.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 space-y-3 md:hidden">
            {supporting.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                pending={pending}
                onView={() => openSigned(doc.id)}
                onDownload={() => openSigned(doc.id, true)}
                onDelete={() => setConfirmDeleteId(doc.id)}
              />
            ))}
          </div>
        </section>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteId(null);
        }}
        title="Remove this document?"
        description={
          confirmDeleteUsage > 0
            ? "This resume was used on a submitted application. It will be archived and kept for history — not permanently deleted."
            : "This document will be removed from your account."
        }
        confirmLabel="Remove"
        pending={pending}
        onConfirm={() => confirmDeleteId && removeDocument(confirmDeleteId)}
      />
    </div>
  );
}
