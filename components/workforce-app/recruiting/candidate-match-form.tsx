"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import {
  extractJobDescriptionAction,
  runCandidateMatch,
  type CandidateMatchResultRow,
} from "@/lib/recruiting/candidate-match-actions";
import { applicationStatusLabels } from "@/types/recruiting";

type JobOption = {
  requisitionId: string;
  title: string;
  departmentName: string;
  locationName: string;
};

type InputMode = "existing" | "paste" | "upload";

const fieldClass =
  "mt-1.5 h-9 w-full border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--ca-blue)]";

function scoreTone(score: number) {
  if (score >= 70) return { ring: "#059669", track: "rgba(5,150,105,0.15)" };
  if (score >= 40) return { ring: "#d97706", track: "rgba(217,119,6,0.15)" };
  return { ring: "#b83a3a", track: "rgba(184,58,58,0.15)" };
}

function MatchGauge({ score }: { score: number }) {
  const tone = scoreTone(score);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, score)) / 100);

  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
        <circle cx="40" cy="40" r={radius} fill="none" stroke={tone.track} strokeWidth="8" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={tone.ring}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-base font-semibold text-[var(--ca-app-ink)]">{score}%</span>
    </div>
  );
}

export default function CandidateMatchForm({
  jobs,
  initialRequisitionId,
  /** When set, lock analysis to this requisition and hide paste/upload (ATS-embedded). */
  lockedRequisitionId,
  variant = "adhoc",
}: {
  jobs: JobOption[];
  initialRequisitionId?: string;
  lockedRequisitionId?: string;
  variant?: "adhoc" | "embedded";
}) {
  const embedded = variant === "embedded" && Boolean(lockedRequisitionId);
  const lockedId = lockedRequisitionId ?? "";
  const hasInitialJob = Boolean(
    (embedded ? lockedId : initialRequisitionId) &&
      jobs.some(
        (job) =>
          job.requisitionId === (embedded ? lockedId : initialRequisitionId),
      ),
  );
  const [mode, setMode] = useState<InputMode>(
    embedded || hasInitialJob || jobs.length > 0 ? "existing" : "paste",
  );
  const [requisitionId, setRequisitionId] = useState(
    embedded
      ? lockedId
      : hasInitialJob
        ? initialRequisitionId!
        : (jobs[0]?.requisitionId ?? ""),
  );
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"match" | "name" | "status">("match");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [results, setResults] = useState<{
    jobTitle: string;
    runId: string;
    candidates: CandidateMatchResultRow[];
  } | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setFileName(null);
      return;
    }
    setFileName(file.name);
    setExtracting(true);
    setError(null);

    const formData = new FormData();
    formData.set("file", file);
    const result = await extractJobDescriptionAction(formData);
    setExtracting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setJobDescription(result.text);
  }

  async function handleAnalyze() {
    setError(null);
    setAnalyzing(true);
    setResults(null);

    const result =
      embedded || mode === "existing"
        ? await runCandidateMatch({
            mode: "existing",
            requisitionId: embedded ? lockedId || requisitionId : requisitionId,
          })
        : await runCandidateMatch({
            mode: "text",
            jobTitle: jobTitle || undefined,
            jobDescription,
          });

    setAnalyzing(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setResults({ jobTitle: result.jobTitle, runId: result.runId, candidates: result.candidates });
  }

  const autoRan = useRef(false);
  useEffect(() => {
    if (autoRan.current) return;
    if (embedded && lockedId) {
      autoRan.current = true;
      handleAnalyze();
      return;
    }
    if (!hasInitialJob) return;
    autoRan.current = true;
    handleAnalyze();
    // Only run once on mount for a deep-linked / embedded requisition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (embedded && lockedId) setRequisitionId(lockedId);
  }, [embedded, lockedId]);

  const sortedCandidates = useMemo(() => {
    if (!results) return [];
    const copy = [...results.candidates];
    if (sortBy === "name") copy.sort((a, b) => a.candidateName.localeCompare(b.candidateName));
    else if (sortBy === "status") {
      copy.sort((a, b) => (a.applicationStatus ?? "").localeCompare(b.applicationStatus ?? ""));
    } else {
      copy.sort((a, b) => b.result.overallMatch - a.result.overallMatch);
    }
    return copy;
  }, [results, sortBy]);

  const compared = useMemo(
    () => sortedCandidates.filter((c) => compareIds.includes(c.candidateId)),
    [sortedCandidates, compareIds],
  );

  function toggleCompare(candidateId: string) {
    setCompareIds((prev) => {
      if (prev.includes(candidateId)) return prev.filter((id) => id !== candidateId);
      if (prev.length >= 4) return prev;
      return [...prev, candidateId];
    });
  }

  const canAnalyze =
    (mode === "existing" && requisitionId) || (mode !== "existing" && jobDescription.trim().length > 0);

  return (
    <div className={embedded ? "space-y-6" : "mt-6 space-y-6"}>
      <div className="rounded-lg border border-amber-200/80 bg-amber-50/70 px-4 py-3 text-sm text-amber-950">
        <p className="font-semibold">AI-assisted relevance analysis</p>
        <p className="mt-1 text-amber-900/80">
          Decision-support only. Candidate evaluation should include human review.
          Scores do not use protected characteristics and never auto-reject, hide, or
          advance candidates.
        </p>
      </div>

      {embedded ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-black/8 bg-white px-4 py-3">
          <div>
            <p className="text-sm font-medium text-[var(--ca-app-ink)]">
              Matching applicants to this requisition&apos;s job description
            </p>
            <p className="mt-0.5 text-xs text-black/45">
              Analysis uses the JD and resumes already on the application records.
              Paste/upload JD remains available for{" "}
              <Link
                href="/app/recruiting/job-match"
                className="text-[var(--ca-blue)] hover:underline"
              >
                ad-hoc analysis
              </Link>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing || !requisitionId}
            className="h-9 shrink-0 rounded-md bg-[var(--ca-navy)] px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {analyzing ? "Analyzing…" : results ? "Refresh analysis" : "Run Candidate Match"}
          </button>
        </div>
      ) : (
      <div className="border border-black/8 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-black/50">
          Job Input
        </h2>
        <p className="mt-2 text-sm text-black/50">
          Prefer analyzing from a job record. Paste or upload is for ad-hoc JDs
          outside an open requisition.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {jobs.length > 0 && (
            <button
              type="button"
              onClick={() => setMode("existing")}
              className={`h-8 border px-3 text-sm ${mode === "existing" ? "border-[var(--ca-blue)] text-[var(--ca-blue)]" : "border-black/10 text-black/60"}`}
            >
              Select Existing Job
            </button>
          )}
          <button
            type="button"
            onClick={() => setMode("paste")}
            className={`h-8 border px-3 text-sm ${mode === "paste" ? "border-[var(--ca-blue)] text-[var(--ca-blue)]" : "border-black/10 text-black/60"}`}
          >
            Paste Job Description
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`h-8 border px-3 text-sm ${mode === "upload" ? "border-[var(--ca-blue)] text-[var(--ca-blue)]" : "border-black/10 text-black/60"}`}
          >
            Upload Job Description
          </button>
        </div>

        {mode === "existing" ? (
          <label className="mt-4 block max-w-md">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">
              Job
            </span>
            <select
              value={requisitionId}
              onChange={(e) => setRequisitionId(e.target.value)}
              className={fieldClass}
            >
              {jobs.map((job) => (
                <option key={job.requisitionId} value={job.requisitionId}>
                  {job.title} · {job.departmentName} · {job.locationName}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {mode === "paste" ? (
          <div className="mt-4 space-y-3">
            <label className="block max-w-md">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">
                Job Title (optional)
              </span>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">
                Job Description
              </span>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="mt-1.5 w-full border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--ca-blue)]"
              />
            </label>
          </div>
        ) : null}

        {mode === "upload" ? (
          <div className="mt-4 space-y-3">
            <label className="block max-w-md">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">
                Job Title (optional)
              </span>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={fieldClass}
              />
            </label>
            <div>
              <input
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={handleFileChange}
                className="block text-sm"
              />
              <p className="mt-1 text-xs text-black/45">
                {extracting ? "Reading file…" : fileName ? fileName : "No file selected"}
              </p>
            </div>
            {jobDescription ? (
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                className="w-full border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--ca-blue)]"
              />
            ) : null}
          </div>
        ) : null}

        {error ? <p className="mt-3 text-sm text-[var(--ca-error)]">{error}</p> : null}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!canAnalyze || analyzing}
          className="mt-4 h-9 rounded-md bg-[var(--ca-navy)] px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {analyzing ? "Analyzing…" : "Analyze Candidates"}
        </button>
      </div>
      )}

      {embedded && error ? (
        <p className="text-sm text-[var(--ca-error)]">{error}</p>
      ) : null}

      {embedded && analyzing && !results ? (
        <p className="border border-dashed border-black/10 bg-white px-5 py-8 text-center text-sm text-black/45">
          Analyzing applicants against this requisition…
        </p>
      ) : null}

      {results ? (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-medium text-[var(--ca-app-ink)]">
                Results for {results.jobTitle}
              </h2>
              <p className="text-xs uppercase tracking-[0.1em] text-black/40">
                AI-assisted relevance analysis · decision support only
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-black/55">
                Sort by{" "}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="ml-1 h-8 border border-black/10 bg-white px-2 text-sm outline-none focus:border-[var(--ca-blue)]"
                >
                  <option value="match">Match Score</option>
                  <option value="name">Candidate Name</option>
                  <option value="status">Application Status</option>
                </select>
              </label>
              {results.candidates.length > 0 ? (
                <a
                  href={`/api/exports/candidate-match-results?runId=${results.runId}`}
                  className="h-8 rounded-md border border-black/15 px-3 text-sm font-medium leading-8 text-black/70 hover:bg-black/[0.03]"
                >
                  Export CSV
                </a>
              ) : null}
            </div>
          </div>

          {sortedCandidates.length === 0 ? (
            <p className="mt-4 border border-dashed border-black/10 bg-white px-5 py-8 text-center text-sm text-black/45">
              No authorized candidates found for this job.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {compared.length >= 2 ? (
                <div className="overflow-x-auto rounded-lg border border-black/10 bg-[#F8FAFC] p-4">
                  <h3 className="text-sm font-semibold">Compare selected ({compared.length})</h3>
                  <table className="mt-3 w-full min-w-[700px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.08em] text-black/40">
                      <tr>
                        <th className="py-2 pr-3">Candidate</th>
                        <th className="py-2 pr-3">Score</th>
                        <th className="py-2 pr-3">Matched</th>
                        <th className="py-2 pr-3">Gaps</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compared.map((c) => (
                        <tr key={c.candidateId} className="border-t border-black/5">
                          <td className="py-2 pr-3 font-medium">{c.candidateName}</td>
                          <td className="py-2 pr-3">{c.result.overallMatch}%</td>
                          <td className="py-2 pr-3 text-black/70">
                            {c.result.skillsFound.join(", ") || "—"}
                          </td>
                          <td className="py-2 pr-3 text-black/70">
                            {c.result.skillsMissing.join(", ") || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-black/45">
                  Select 2–4 candidates below to compare using the same scoring model.
                </p>
              )}
              {sortedCandidates.map((candidate) => (
                <div key={candidate.candidateId} className="border border-black/8 bg-white p-5">
                  <div className="flex flex-wrap items-start gap-5">
                    <MatchGauge score={candidate.result.overallMatch} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={compareIds.includes(candidate.candidateId)}
                            onChange={() => toggleCompare(candidate.candidateId)}
                            aria-label={`Compare ${candidate.candidateName}`}
                          />
                          <Link
                            href={`/app/recruiting/candidates/${candidate.candidateId}`}
                            className="font-medium text-[var(--ca-app-ink)] hover:underline"
                          >
                            {candidate.candidateName}
                          </Link>
                          {candidate.applicationId ? (
                            <Link
                              href={`/app/recruiting/applications/${candidate.applicationId}`}
                              className="text-xs font-medium text-[var(--ca-blue)] hover:underline"
                            >
                              Open application
                            </Link>
                          ) : null}
                        </div>
                        <span className="text-sm font-semibold text-black/70">
                          {candidate.result.overallMatch}%{" "}
                          {candidate.result.overallMatch >= 70
                            ? "Strong Alignment"
                            : candidate.result.overallMatch >= 40
                              ? "Moderate Alignment"
                              : "Limited Alignment"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-black/60">
                        {candidate.resumeFileName ?? "No resume on file"}
                      </p>
                      <p className="mt-2 text-sm text-black/70">{candidate.result.experienceAlignment}</p>

                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-black/40">
                            Matching Skills
                          </p>
                          <p className="mt-1 text-sm text-black/70">
                            {candidate.result.skillsFound.join(", ") || "None found"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-black/40">
                            Potential Gaps
                          </p>
                          <p className="mt-1 text-sm text-black/70">
                            {candidate.result.skillsMissing.join(", ") || "None identified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-black/40">
                            Relevant Keywords
                          </p>
                          <p className="mt-1 text-sm text-black/70">
                            {candidate.result.keywordsToConsider.join(", ") || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-black/40">
                            Resume Evidence
                          </p>
                          <p className="mt-1 text-sm text-black/70">
                            {candidate.resumeDocumentId ? (
                              <Link
                                href={`/app/recruiting/candidates/${candidate.candidateId}`}
                                className="text-[var(--ca-blue)] hover:underline"
                              >
                                {candidate.resumeFileName}
                              </Link>
                            ) : (
                              "No resume on file"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
