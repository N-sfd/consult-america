"use client";

import { useState, useTransition } from "react";

import { updateCandidateContactInfoAction } from "@/app/actions/candidate-actions";
import type { CandidateProfile } from "@/types/recruiting";

export default function CandidateProfileForm({
  candidate,
}: {
  candidate: CandidateProfile;
}) {
  const [phone, setPhone] = useState(candidate.phone ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(candidate.linkedinUrl ?? "");
  const [portfolioUrl, setPortfolioUrl] = useState(candidate.portfolioUrl ?? "");
  const [workAuthorization, setWorkAuthorization] = useState(
    candidate.workAuthorization ?? "",
  );
  const [willingToRelocate, setWillingToRelocate] = useState(
    Boolean(candidate.willingToRelocate),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await updateCandidateContactInfoAction({
        phone: phone.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        workAuthorization: workAuthorization.trim() || undefined,
        willingToRelocate,
      });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-black/10 bg-white p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-black/55">Phone</span>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm">
          <span className="text-black/55">Work Authorization</span>
          <input
            type="text"
            value={workAuthorization}
            onChange={(event) => setWorkAuthorization(event.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm">
          <span className="text-black/55">LinkedIn URL</span>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(event) => setLinkedinUrl(event.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm">
          <span className="text-black/55">Portfolio URL</span>
          <input
            type="url"
            value={portfolioUrl}
            onChange={(event) => setPortfolioUrl(event.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={willingToRelocate}
          onChange={(event) => setWillingToRelocate(event.target.checked)}
          className="h-4 w-4"
        />
        <span>Willing to relocate</span>
      </label>

      {message && (
        <p className="text-sm text-emerald-700" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        Save Changes
      </button>
    </form>
  );
}
