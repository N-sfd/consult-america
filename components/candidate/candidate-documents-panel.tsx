"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Download,
  Eye,
  FileText,
  Loader2,
  Trash2,
  UploadCloud,
  RefreshCw,
} from "lucide-react";

import {
  deleteCandidateDocumentAction,
  getCandidateDocumentSignedUrlAction,
  uploadCandidateDocumentAction,
} from "@/app/actions/candidate-document-actions";
import { DOCUMENT_TYPE_LABELS } from "@/lib/storage/candidate-documents";
import type { Document, DocumentType } from "@/types/recruiting";

function formatBytes(bytes?: number) {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatUploaded(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type Props = {
  initialDocuments: Document[];
  supabaseConnected: boolean;
  autoOpenUpload?: "resume" | "other" | null;
};

export default function CandidateDocumentsPanel({
  initialDocuments,
  supabaseConnected,
  autoOpenUpload = null,
}: Props) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [panel, setPanel] = useState<"closed" | "resume" | "other">(
    autoOpenUpload === "resume"
      ? "resume"
      : autoOpenUpload === "other"
        ? "other"
        : "closed",
  );
  const [documentType, setDocumentType] = useState<DocumentType>("OTHER");
  const [file, setFile] = useState<File | null>(null);
  const [replaceId, setReplaceId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  useEffect(() => {
    if (autoOpenUpload === "resume") {
      setPanel("resume");
      setDocumentType("RESUME");
      setReplaceId(null);
    }
  }, [autoOpenUpload]);

  const primaryResume = useMemo(
    () =>
      documents.find(
        (d) => d.documentType === "RESUME" && d.isPrimaryResume,
      ) ?? documents.find((d) => d.documentType === "RESUME"),
    [documents],
  );

  const otherDocs = useMemo(
    () => documents.filter((d) => d.id !== primaryResume?.id),
    [documents, primaryResume],
  );

  function openResumeUpload(replaceDocumentId?: string) {
    setPanel("resume");
    setDocumentType("RESUME");
    setReplaceId(replaceDocumentId ?? null);
    setFile(null);
    setError(null);
    setMessage(null);
  }

  function openOtherUpload() {
    setPanel("other");
    setDocumentType("COVER_LETTER");
    setReplaceId(null);
    setFile(null);
    setError(null);
    setMessage(null);
  }

  function closePanel() {
    setPanel("closed");
    setFile(null);
    setReplaceId(null);
    setError(null);
  }

  function acceptFile(next?: File) {
    if (!next) return;
    setFile(next);
    setError(null);
  }

  function submitUpload() {
    if (!supabaseConnected) {
      setError(
        "Document uploads require the connected candidate environment.",
      );
      return;
    }
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    formData.set("documentType", documentType);
    if (replaceId) formData.set("replaceDocumentId", replaceId);

    startTransition(async () => {
      const result = await uploadCandidateDocumentAction(formData);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage(result.message);
      setFile(null);
      setReplaceId(null);
      setPanel("closed");
      // Server revalidates; optimistic wait for refresh via router isn't needed —
      // parent is a server page. Force soft reload.
      window.location.assign("/candidate/documents");
    });
  }

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

  function removeDocument(documentId: string) {
    if (!window.confirm("Delete this document? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteCandidateDocumentAction(documentId);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setDocuments((prev) => prev.filter((d) => d.id !== documentId));
      setMessage(result.message);
    });
  }

  if (!supabaseConnected) {
    return (
      <div className="rounded-xl border border-[#DDE6E3] bg-[#F7FAF9] px-5 py-6 text-sm text-[#5B6D6B]">
        Document uploads require the connected candidate environment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message ? (
        <p className="rounded-lg border border-[#CFE3E0] bg-[#F1F7F6] px-4 py-3 text-sm text-[#245350]">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-[#F0D4D4] bg-[#FDF6F6] px-4 py-3 text-sm text-[#992F31]" role="alert">
          {error}
        </p>
      ) : null}

      {/* Primary resume */}
      <section className="rounded-xl border border-[#DDE6E3] bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#176A63]">
              Primary Resume
            </p>
            {primaryResume ? (
              <>
                <p className="mt-2 font-medium text-[#073B3A]">
                  {primaryResume.fileName}
                </p>
                <p className="mt-1 text-sm text-[#5B6D6B]">
                  Uploaded {formatUploaded(primaryResume.uploadedAt)}
                  {primaryResume.fileSize
                    ? ` · ${formatBytes(primaryResume.fileSize)}`
                    : ""}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-[#5B6D6B]">
                No resume uploaded yet.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {primaryResume ? (
              <>
                <button
                  type="button"
                  onClick={() => openSigned(primaryResume.id)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#DDE6E3] px-3 text-sm font-semibold text-[#073B3A]"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button
                  type="button"
                  onClick={() => openSigned(primaryResume.id, true)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#DDE6E3] px-3 text-sm font-semibold text-[#073B3A]"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => openResumeUpload(primaryResume.id)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#B83A3A] px-3 text-sm font-semibold text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                  Replace
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => openResumeUpload()}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#B83A3A] px-4 text-sm font-semibold text-white"
              >
                <UploadCloud className="h-4 w-4" />
                Upload Resume
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Upload panel */}
      {panel !== "closed" ? (
        <section className="rounded-xl border border-[#DDE6E3] bg-[#F7FAF9] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-[#073B3A]">
              {replaceId
                ? "Replace resume"
                : panel === "resume"
                  ? "Upload resume"
                  : "Upload document"}
            </h2>
            <button
              type="button"
              onClick={closePanel}
              className="text-sm font-medium text-[#5B6D6B]"
            >
              Cancel
            </button>
          </div>

          {panel === "other" ? (
            <label className="mt-4 block text-sm font-medium text-[#073B3A]">
              Document type
              <select
                value={documentType}
                onChange={(e) =>
                  setDocumentType(e.target.value as DocumentType)
                }
                className="mt-1.5 w-full rounded-lg border border-[#DDE6E3] bg-white px-3 py-2.5 text-sm"
              >
                {(
                  [
                    "COVER_LETTER",
                    "TRANSCRIPT",
                    "CERTIFICATION",
                    "PORTFOLIO",
                    "OTHER",
                    "RESUME",
                  ] as DocumentType[]
                ).map((type) => (
                  <option key={type} value={type}>
                    {DOCUMENT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              acceptFile(e.dataTransfer.files?.[0]);
            }}
            className="mt-4 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#C9DDD7] bg-white px-6 py-10 text-center"
          >
            <UploadCloud className="h-8 w-8 text-[#176A63]" />
            <p className="mt-3 text-sm font-semibold text-[#073B3A]">
              Drag and drop a file here
            </p>
            <p className="mt-1 text-sm text-[#5B6D6B]">or</p>
            <span className="mt-3 inline-flex h-10 items-center rounded-lg border border-[#DDE6E3] px-4 text-sm font-semibold text-[#073B3A]">
              Choose File
            </span>
            <p className="mt-3 text-xs text-[#8A9A97]">
              Accepted: PDF, DOC, DOCX · Max 10 MB
            </p>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => acceptFile(e.target.files?.[0] ?? undefined)}
          />

          {file ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-[#DDE6E3] bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#073B3A]">
                  {file.name}
                </p>
                <p className="text-xs text-[#5B6D6B]">{formatBytes(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={submitUpload}
                disabled={pending}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#B83A3A] px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          ) : null}
        </section>
      ) : (
        <div className="flex flex-wrap gap-3">
          {!primaryResume ? (
            <button
              type="button"
              onClick={() => openResumeUpload()}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#B83A3A] px-4 text-sm font-semibold text-white"
            >
              Upload Resume
            </button>
          ) : null}
          <button
            type="button"
            onClick={openOtherUpload}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#DDE6E3] bg-white px-4 text-sm font-semibold text-[#073B3A]"
          >
            Upload Another Document
          </button>
        </div>
      )}

      {/* Document list */}
      <section>
        <h2 className="text-lg font-semibold text-[#073B3A]">All documents</h2>
        {documents.length === 0 ? (
          <div className="mt-3 rounded-xl border border-[#DDE6E3] bg-white px-5 py-8 text-sm text-[#5B6D6B]">
            No documents uploaded yet.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="mt-3 hidden overflow-hidden rounded-xl border border-[#DDE6E3] bg-white md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#E1ECE8] bg-[#F7FAF9] text-[0.7rem] uppercase tracking-[0.1em] text-[#8A9A97]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Document</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Uploaded</th>
                    <th className="px-4 py-3 font-semibold">Size</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EFEC]">
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-4 py-3 font-medium text-[#073B3A]">
                        <span className="inline-flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#176A63]" />
                          {doc.fileName}
                          {doc.isPrimaryResume ? (
                            <span className="rounded bg-[#EAF3F1] px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#176A63]">
                              Primary
                            </span>
                          ) : null}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#5B6D6B]">
                        {DOCUMENT_TYPE_LABELS[doc.documentType]}
                      </td>
                      <td className="px-4 py-3 text-[#5B6D6B]">
                        {formatUploaded(doc.uploadedAt)}
                      </td>
                      <td className="px-4 py-3 text-[#5B6D6B]">
                        {formatBytes(doc.fileSize)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => openSigned(doc.id)}
                            className="font-semibold text-[#176A63]"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => openSigned(doc.id, true)}
                            className="font-semibold text-[#176A63]"
                          >
                            Download
                          </button>
                          {doc.documentType === "RESUME" ? (
                            <button
                              type="button"
                              onClick={() => openResumeUpload(doc.id)}
                              className="font-semibold text-[#176A63]"
                            >
                              Replace
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => removeDocument(doc.id)}
                            className="inline-flex items-center gap-1 font-semibold text-[#B83A3A]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="mt-3 space-y-3 md:hidden">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-[#DDE6E3] bg-white p-4"
                >
                  <p className="font-medium text-[#073B3A]">{doc.fileName}</p>
                  <p className="mt-1 text-sm text-[#5B6D6B]">
                    {DOCUMENT_TYPE_LABELS[doc.documentType]} ·{" "}
                    {formatUploaded(doc.uploadedAt)} ·{" "}
                    {formatBytes(doc.fileSize)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
                    <button
                      type="button"
                      onClick={() => openSigned(doc.id)}
                      className="text-[#176A63]"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => openSigned(doc.id, true)}
                      className="text-[#176A63]"
                    >
                      Download
                    </button>
                    {doc.documentType === "RESUME" ? (
                      <button
                        type="button"
                        onClick={() => openResumeUpload(doc.id)}
                        className="text-[#176A63]"
                      >
                        Replace
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="text-[#B83A3A]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {otherDocs.length === 0 && primaryResume ? (
          <p className="mt-3 text-sm text-[#8A9A97]">
            Supporting documents will appear here after you upload them.
          </p>
        ) : null}
      </section>
    </div>
  );
}
