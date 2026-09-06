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
        <td className="px-4 py-3 font-medium text-[#073B3A]">
          <span className="inline-flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#176A63]" />
            {document.fileName}
            {document.isPrimaryResume ? (
              <span className="rounded bg-[#EAF3F1] px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#176A63]">
                Primary
              </span>
            ) : null}
          </span>
        </td>
        {showType ? (
          <td className="px-4 py-3 text-[#5B6D6B]">
            {DOCUMENT_TYPE_LABELS[document.documentType]}
          </td>
        ) : null}
        <td className="px-4 py-3 text-[#5B6D6B]">
          {formatDocumentUploaded(document.uploadedAt)}
        </td>
        <td className="px-4 py-3 text-[#5B6D6B]">
          {formatDocumentBytes(document.fileSize)}
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={onView}
              className="font-semibold text-[#176A63]"
            >
              View
            </button>
            {onDownload ? (
              <button
                type="button"
                disabled={pending}
                onClick={onDownload}
                className="font-semibold text-[#176A63]"
              >
                Download
              </button>
            ) : null}
            {onReplace ? (
              <button
                type="button"
                disabled={pending}
                onClick={onReplace}
                className="font-semibold text-[#176A63]"
              >
                Replace
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                disabled={pending}
                onClick={onDelete}
                className="inline-flex items-center gap-1 font-semibold text-[#B83A3A]"
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
    <div className="rounded-xl border border-[#DDE6E3] bg-white p-4 md:hidden">
      <p className="font-medium text-[#073B3A]">{document.fileName}</p>
      <p className="mt-1 text-sm text-[#5B6D6B]">
        {DOCUMENT_TYPE_LABELS[document.documentType]} ·{" "}
        {formatDocumentUploaded(document.uploadedAt)} ·{" "}
        {formatDocumentBytes(document.fileSize)}
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
        <button type="button" disabled={pending} onClick={onView} className="text-[#176A63]">
          View
        </button>
        {onDownload ? (
          <button
            type="button"
            disabled={pending}
            onClick={onDownload}
            className="text-[#176A63]"
          >
            Download
          </button>
        ) : null}
        {onReplace ? (
          <button
            type="button"
            disabled={pending}
            onClick={onReplace}
            className="text-[#176A63]"
          >
            Replace
          </button>
        ) : null}
        {onDelete ? (
          <button
            type="button"
            disabled={pending}
            onClick={onDelete}
            className="text-[#B83A3A]"
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
      <section className="rounded-xl border border-[#DDE6E3] bg-white p-5">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#176A63]">
          Resume
        </p>
        <p className="mt-2 text-sm text-[#5B6D6B]">No documents uploaded yet.</p>
        {emptyAction ? <div className="mt-4">{emptyAction}</div> : null}
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[#DDE6E3] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#176A63]">
            Resume
          </p>
          <p className="mt-2 font-medium text-[#073B3A]">{document.fileName}</p>
          <p className="mt-1 text-sm text-[#5B6D6B]">
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
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#DDE6E3] px-3 text-sm font-semibold text-[#073B3A]"
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
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#DDE6E3] px-3 text-sm font-semibold text-[#073B3A]"
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
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#B83A3A] px-3 text-sm font-semibold text-white"
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
