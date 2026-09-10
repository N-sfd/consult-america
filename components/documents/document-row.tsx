"use client";

import type { ReactNode } from "react";
import { Download, Eye, FileText, RefreshCw, Trash2 } from "lucide-react";

import {
  formatDocumentBytes,
  formatDocumentUploaded,
} from "@/components/documents/format";
import { DOCUMENT_TYPE_LABELS } from "@/lib/storage/candidate-documents";
import type { Document } from "@/types/recruiting";

type Props = {
  document: Document;
  pending?: boolean;
  onView: () => void;
  onDownload?: () => void;
  onReplace?: () => void;
  onDelete?: () => void;
  showType?: boolean;
};

export default function DocumentRow({
  document,
  pending,
  onView,
  onDownload,
  onReplace,
  onDelete,
  showType = true,
}: Props) {
  return (
    <>
      {/* Desktop */}
      <tr className="hidden md:table-row">
        <td className="px-4 py-3 font-medium text-black">
          <span className="inline-flex items-center gap-2">
            <FileText className="h-4 w-4 text-[var(--ca-blue)]" />
            {document.fileName}
            {document.isPrimaryResume ? (
              <span className="rounded bg-[rgba(23,106,99,0.12)] px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[var(--ca-platform-deep)]">
                Primary
              </span>
            ) : null}
          </span>
        </td>
        {showType ? (
          <td className="px-4 py-3 text-black/55">
            {DOCUMENT_TYPE_LABELS[document.documentType]}
          </td>
        ) : null}
        <td className="px-4 py-3 text-black/55">
          {formatDocumentUploaded(document.uploadedAt)}
        </td>
        <td className="px-4 py-3 text-black/55">
          {formatDocumentBytes(document.fileSize)}
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={onView}
              className="font-semibold text-[var(--ca-blue)]"
            >
              View
            </button>
            {onDownload ? (
              <button
                type="button"
                disabled={pending}
                onClick={onDownload}
                className="font-semibold text-[var(--ca-blue)]"
              >
                Download
              </button>
            ) : null}
            {onReplace ? (
              <button
                type="button"
                disabled={pending}
                onClick={onReplace}
                className="font-semibold text-[var(--ca-blue)]"
              >
                Replace
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                disabled={pending}
                onClick={onDelete}
                className="inline-flex items-center gap-1 font-semibold text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            ) : null}
          </div>
        </td>
      </tr>

      {/* Mobile card — rendered by parent list for layout; this helper also exports card */}
    </>
  );
}

export function DocumentCard({
  document,
  pending,
  onView,
  onDownload,
  onReplace,
  onDelete,
}: Props) {
  return (
    <div className="ca-platform-card p-4 md:hidden">
      <p className="font-medium text-black">{document.fileName}</p>
      <p className="mt-1 text-sm text-black/55">
        {DOCUMENT_TYPE_LABELS[document.documentType]} ·{" "}
        {formatDocumentUploaded(document.uploadedAt)} ·{" "}
        {formatDocumentBytes(document.fileSize)}
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
        <button type="button" disabled={pending} onClick={onView} className="text-[var(--ca-blue)]">
          View
        </button>
        {onDownload ? (
          <button
            type="button"
            disabled={pending}
            onClick={onDownload}
            className="text-[var(--ca-blue)]"
          >
            Download
          </button>
        ) : null}
        {onReplace ? (
          <button
            type="button"
            disabled={pending}
            onClick={onReplace}
            className="text-[var(--ca-blue)]"
          >
            Replace
          </button>
        ) : null}
        {onDelete ? (
          <button
            type="button"
            disabled={pending}
            onClick={onDelete}
            className="text-red-700"
          >
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function ResumeCard({
  document,
  pending,
  onView,
  onDownload,
  onReplace,
  emptyAction,
}: {
  document?: Document | null;
  pending?: boolean;
  onView?: () => void;
  onDownload?: () => void;
  onReplace?: () => void;
  emptyAction?: ReactNode;
}) {
  if (!document) {
    return (
      <section className="ca-platform-card p-5">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--ca-platform-deep)]">
          Resume
        </p>
        <div className="mt-2 flex items-center gap-3 text-sm text-black/55">
          <FileText className="h-5 w-5 shrink-0 text-black/25" />
          <p>No documents uploaded yet.</p>
        </div>
        {emptyAction ? <div className="mt-4">{emptyAction}</div> : null}
      </section>
    );
  }

  return (
    <section className="ca-platform-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--ca-platform-deep)]">
            Resume
          </p>
          <p className="mt-2 font-medium text-black">{document.fileName}</p>
          <p className="mt-1 text-sm text-black/55">
            Uploaded {formatDocumentUploaded(document.uploadedAt)}
            {document.fileSize
              ? ` · ${formatDocumentBytes(document.fileSize)}`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onView ? (
            <button
              type="button"
              disabled={pending}
              onClick={onView}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-black/10 px-3 text-sm font-semibold text-black"
            >
              <Eye className="h-4 w-4" />
              View
            </button>
          ) : null}
          {onDownload ? (
            <button
              type="button"
              disabled={pending}
              onClick={onDownload}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-black/10 px-3 text-sm font-semibold text-black"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          ) : null}
          {onReplace ? (
            <button
              type="button"
              disabled={pending}
              onClick={onReplace}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[var(--ca-platform-deep)] px-3 text-sm font-semibold text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Replace
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
