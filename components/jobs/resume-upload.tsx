"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud } from "lucide-react";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ".pdf,.doc,.docx";

function formatSize(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export default function ResumeUpload({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function acceptFile(candidate: File | undefined) {
    if (!candidate) return;
    if (candidate.size > MAX_BYTES) {
      setError("File is larger than 10MB. Choose a smaller file.");
      return;
    }
    setError(null);
    onChange(candidate);
  }

  return (
    <div>
      <label className="cr-label">
        Resume <span className="text-[var(--cr-error)]">*</span>
      </label>

      {file ? (
        <div className="cr-card flex items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="h-5 w-5 shrink-0 text-[var(--cr-blue)]" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--cr-text)]">
                {file.name}
              </p>
              <p className="text-xs text-[var(--cr-text-secondary)]">
                {formatSize(file.size)}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-sm font-medium text-[var(--cr-blue)] hover:text-[var(--cr-blue-hover)]"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-sm font-medium text-[var(--cr-error)] hover:opacity-80"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            acceptFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragging
              ? "border-[var(--cr-blue)] bg-[var(--cr-bg-soft)]"
              : "border-[var(--cr-border)] bg-white hover:border-[#B8C5D3]"
          }`}
        >
          <UploadCloud className="h-8 w-8 text-[var(--cr-blue)]" />
          <p className="mt-3 text-sm font-medium text-[var(--cr-text)]">
            Upload Resume
          </p>
          <p className="mt-1 text-sm text-[var(--cr-text-secondary)]">
            Drag &amp; drop or choose a file
          </p>
          <p className="mt-3 text-xs text-[#8a98a8]">
            PDF, DOC, DOCX · Max 10MB
          </p>
          <span className="mt-4 inline-flex h-9 items-center rounded-md border border-[var(--cr-border)] px-4 text-xs font-medium text-[var(--cr-text)]">
            Choose File
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => acceptFile(e.target.files?.[0])}
      />

      {error && (
        <p className="mt-2 text-sm text-[var(--cr-error)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
