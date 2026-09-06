"use client";

type ExistingResume = {
  id: string;
  fileName: string;
  uploadedAt: string;
  fileSize?: number;
};

type Props = {
  resume: ExistingResume;
  selected: boolean;
  onSelect: () => void;
  onChooseUpload: () => void;
  onView?: () => void;
};

export default function UseExistingResume({
  resume,
  selected,
  onSelect,
  onChooseUpload,
  onView,
}: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--cr-text-secondary)]">
        Use your current resume for this application, or upload a different
        version. Once submitted, this application keeps the exact document you
        chose — replacing your primary resume later will not change it.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSelect}
          className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
            selected
              ? "border-[var(--cr-blue)] bg-[var(--cr-bg-soft)] text-[var(--cr-navy)]"
              : "border-[var(--cr-border)] text-[var(--cr-text)]"
          }`}
        >
          Use this resume
        </button>
        <button
          type="button"
          onClick={onChooseUpload}
          className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
            !selected
              ? "border-[var(--cr-blue)] bg-[var(--cr-bg-soft)] text-[var(--cr-navy)]"
              : "border-[var(--cr-border)] text-[var(--cr-text)]"
          }`}
        >
          Upload a different resume
        </button>
      </div>
      {selected ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--cr-border)] bg-white px-4 py-3">
          <div>
            <p className="text-sm font-medium text-[var(--cr-text)]">
              {resume.fileName}
            </p>
            <p className="mt-1 text-xs text-[var(--cr-text-secondary)]">
              Current resume · {new Date(resume.uploadedAt).toLocaleDateString()}
            </p>
          </div>
          {onView ? (
            <button
              type="button"
              onClick={onView}
              className="text-sm font-semibold text-[var(--cr-blue)]"
            >
              View
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
