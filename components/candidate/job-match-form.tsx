"use client";

import { useMemo, useState, useTransition } from "react";

import { runJobMatchAction } from "@/app/actions/candidate-actions";
import JobMatchResultCard from "@/components/candidate/job-match-result-card";
import type { JobMatchResult } from "@/lib/candidate/job-match";

type ResumeOption = { id: string; label: string; archived?: boolean };
type JobOption = { requisitionId: string; title: string };

export default function JobMatchForm({
  resumes,
  jobs,
}: {
  resumes: ResumeOption[];
  jobs: JobOption[];
}) {
  const [documentId, setDocumentId] = useState(
    resumes.find((r) => !r.archived)?.id ?? resumes[0]?.id ?? "",
  );
  const [jobRequisitionId, setJobRequisitionId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selectedJob = useMemo(
    () => jobs.find((job) => job.requisitionId === jobRequisitionId),
    [jobs, jobRequisitionId],
  );

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setResult(null);

    startTransition(async () => {
      const response = await runJobMatchAction({
        documentId: documentId || undefined,
        jobRequisitionId: jobRequisitionId || undefined,
        jobDescription: jobDescription || undefined,
      });
      if (response.ok && response.result) {
        setResult(response.result);
        setMessage(response.message);
      } else {
        setError(response.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-black/10 bg-white p-6">
        <p className="text-sm text-black/55">
          Job Match is candidate assistance only. It does not reject, advance,
          or rank applications for hiring decisions.
        </p>

        <label className="block text-sm">
          <span className="text-black/55">Resume source</span>
          <select
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          >
            {resumes.length === 0 ? (
              <option value="">No resume uploaded</option>
            ) : (
              resumes.map((resume) => (
                <option key={resume.id} value={resume.id} disabled={resume.archived}>
                  {resume.label}
                </option>
              ))
            )}
          </select>
        </label>

        <label className="block text-sm">
          <span className="text-black/55">Select a published Consult America job</span>
          <select
            value={jobRequisitionId}
            onChange={(e) => setJobRequisitionId(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          >
            <option value="">Paste a job description instead</option>
            {jobs.map((job) => (
              <option key={job.requisitionId} value={job.requisitionId}>
                {job.title}
              </option>
            ))}
          </select>
        </label>

        {!jobRequisitionId ? (
          <label className="block text-sm">
            <span className="text-black/55">Or paste a job description</span>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
              placeholder="Paste the job description here"
            />
          </label>
        ) : (
          <p className="text-sm text-black/55">
            Matching against <span className="font-medium">{selectedJob?.title}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={pending || resumes.length === 0}
          className="rounded-lg bg-[var(--ca-platform-deep)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Analyzing…" : "Run Job Match"}
        </button>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      </form>

      {result ? <JobMatchResultCard result={result} /> : null}
    </div>
  );
}
