"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";

import { formatDocumentBytes } from "@/components/documents/format";

type Props = {
  title?: string;
  acceptHint?: string;
  pending?: boolean;
  onUpload: (file: File) => void;
  onCancel?: () => void;
  variant?: "portal" | "careers";
};

export default function DocumentUploader({
  title = "Upload documents",
  acceptHint = "Accepted: PDF, DOC, DOCX · Max 10 MB",
  pending = false,
  onUpload,
  onCancel,
  variant = "portal",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPortal = variant === "portal";

  function accept(next?: File) {
    if (!next) return;
    if (next.size > 10 * 1024 * 1024) {
      setError("File is larger than 10MB. Choose a smaller file.");
      return;
    }
    setError(null);
    setFile(next);
  }

  return (
    <div
      className={
        isPortal
          ? "rounded-xl border border-black/10 bg-black/[0.02] p-5"
          : "space-y-3"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          className={
            isPortal
              ? "text-base font-semibold text-black"
              : "text-sm font-semibold text-[var(--cr-navy)]"
          }
        >
          {title}
        </h2>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-black/55"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          accept(e.dataTransfer.files?.[0]);
        }}
        className={`mt-3 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center ${
          isPortal
            ? "border-black/15 bg-white"
            : "border-[var(--cr-border)] bg-white"
        }`}
      >
        <UploadCloud
          className={`h-8 w-8 ${isPortal ? "text-[var(--ca-blue)]" : "text-[var(--cr-blue)]"}`}
        />
        <p className="mt-3 text-sm font-semibold text-black">
          Drag and drop a file here
        </p>
        <p className="mt-1 text-sm text-black/55">or</p>
        <span className="mt-3 inline-flex h-10 items-center rounded-lg border border-black/10 px-4 text-sm font-semibold text-black">
          Choose File
        </span>
        <p className="mt-3 text-xs text-black/40">{acceptHint}</p>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => accept(e.target.files?.[0] ?? undefined)}
      />

      {file ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-black/10 bg-white px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-black">
              {file.name}
            </p>
            <p className="text-xs text-black/55">
              {formatDocumentBytes(file.size)}
            </p>
          </div>
          <button
            type="button"
            disabled={pending}
            onClick={() => onUpload(file)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--ca-platform-deep)] px-4 text-sm font-semibold text-white disabled:opacity-60"
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

      {error ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
