"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { UploadCloud } from "lucide-react";

import {
  deleteCandidateDocumentAction,
  getCandidateDocumentSignedUrlAction,
  uploadCandidateDocumentAction,
} from "@/app/actions/candidate-document-actions";
import DocumentUploader from "@/components/documents/document-uploader";
import DocumentRow, {
  DocumentCard,
  ResumeCard,
} from "@/components/documents/document-row";
import type { Document, DocumentType } from "@/types/recruiting";
import { DOCUMENT_TYPE_LABELS } from "@/lib/storage/candidate-documents";

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
  const activeDocs = useMemo(
    () => initialDocuments.filter((d) => d.status !== "ARCHIVED" && d.status !== "DELETED"),
    [initialDocuments],
  );
  const [documents, setDocuments] = useState(activeDocs);
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

  useEffect(() => {
    setDocuments(activeDocs);
  }, [activeDocs]);

  useEffect(() => {
    if (autoOpenUpload === "resume") {
      setPanel("resume");
      setReplaceId(null);
    }
  }, [autoOpenUpload]);

  const primaryResume = useMemo(
    () =>
      documents.find((d) => d.documentType === "RESUME" && d.isPrimaryResume) ??
      documents.find((d) => d.documentType === "RESUME"),
    [documents],
  );

  const supporting = useMemo(
    () => documents.filter((d) => d.id !== primaryResume?.id),
    [documents, primaryResume],
  );

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
      window.location.assign("/candidate/documents");
    });
  }

  function removeDocument(documentId: string) {
    if (!window.confirm("Remove this document from your portal?")) return;
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
        <p
          className="rounded-lg border border-[#F0D4D4] bg-[#FDF6F6] px-4 py-3 text-sm text-[#992F31]"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div>
        <h2 className="text-lg font-semibold text-[#073B3A]">My Documents</h2>
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
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#B83A3A] px-4 text-sm font-semibold text-white"
          >
            <UploadCloud className="h-4 w-4" />
            Upload Resume
          </button>
        }
      />

      {panel !== "closed" ? (
        <div className="space-y-3">
          {panel === "other" ? (
            <label className="block text-sm font-medium text-[#073B3A]">
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
          <h2 className="text-base font-semibold text-[#073B3A]">
            Supporting Documents
          </h2>
          <button
            type="button"
            onClick={() => {
              setPanel("other");
              setDocumentType("COVER_LETTER");
              setReplaceId(null);
            }}
            className="mt-3 inline-flex h-11 items-center gap-2 rounded-lg border border-[#DDE6E3] bg-white px-4 text-sm font-semibold text-[#073B3A]"
          >
            Upload Document
          </button>
        </div>
      )}

      <section>
        {documents.length === 0 ? null : (
          <>
            <div className="mt-1 hidden overflow-hidden rounded-xl border border-[#DDE6E3] bg-white md:block">
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
                    <DocumentRow
                      key={doc.id}
                      document={doc}
                      pending={pending}
                      onView={() => openSigned(doc.id)}
                      onDownload={() => openSigned(doc.id, true)}
                      onReplace={
                        doc.documentType === "RESUME"
                          ? () => {
                              setReplaceId(doc.id);
                              setPanel("resume");
                            }
                          : undefined
                      }
                      onDelete={() => removeDocument(doc.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 space-y-3 md:hidden">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  pending={pending}
                  onView={() => openSigned(doc.id)}
                  onDownload={() => openSigned(doc.id, true)}
                  onReplace={
                    doc.documentType === "RESUME"
                      ? () => {
                          setReplaceId(doc.id);
                          setPanel("resume");
                        }
                      : undefined
                  }
                  onDelete={() => removeDocument(doc.id)}
                />
              ))}
            </div>
          </>
        )}
        {supporting.length === 0 && primaryResume ? (
          <p className="mt-3 text-sm text-[#8A9A97]">
            Supporting documents will appear here after you upload them.
          </p>
        ) : null}
      </section>
    </div>
  );
}
