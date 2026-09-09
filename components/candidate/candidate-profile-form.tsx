"use client";

import { useState, useTransition } from "react";

import { updateCandidateContactInfoAction } from "@/app/actions/candidate-actions";
import type { CandidateProfile } from "@/types/recruiting";

export default function CandidateProfileForm({
  candidate,
}: {
  candidate: CandidateProfile;
}) {
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(candidate.firstName);
  const [lastName, setLastName] = useState(candidate.lastName);
  const [preferredName, setPreferredName] = useState(candidate.preferredName ?? "");
  const [phone, setPhone] = useState(candidate.phone ?? "");
  const [city, setCity] = useState(candidate.city ?? "");
  const [state, setState] = useState(candidate.state ?? "");
  const [professionalSummary, setProfessionalSummary] = useState(
    candidate.professionalSummary ?? "",
  );
  const [linkedinUrl, setLinkedinUrl] = useState(candidate.linkedinUrl ?? "");
  const [portfolioUrl, setPortfolioUrl] = useState(candidate.portfolioUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(candidate.githubUrl ?? "");
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
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        preferredName: preferredName.trim() || undefined,
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        professionalSummary: professionalSummary.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        workAuthorization: workAuthorization.trim() || undefined,
        willingToRelocate,
      });
      if (result.ok) {
        setMessage(result.message);
        setEditing(false);
      } else setError(result.message);
    });
  }

  if (!editing) {
    return (
      <section className="space-y-4 rounded-lg border border-black/10 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Profile
          </h2>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-semibold"
          >
            Edit Profile
          </button>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-black/45">Name</dt>
            <dd className="mt-1 font-medium">
              {candidate.firstName} {candidate.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-black/45">Email</dt>
            <dd className="mt-1 font-medium">{candidate.email}</dd>
          </div>
          <div>
            <dt className="text-black/45">Phone</dt>
            <dd className="mt-1 font-medium">{candidate.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-black/45">Location</dt>
            <dd className="mt-1 font-medium">
              {[candidate.city, candidate.state].filter(Boolean).join(", ") || "—"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-black/45">Professional Summary</dt>
            <dd className="mt-1 whitespace-pre-wrap text-black/75">
              {candidate.professionalSummary || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-black/45">LinkedIn</dt>
            <dd className="mt-1 break-all font-medium">
              {candidate.linkedinUrl || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-black/45">Portfolio</dt>
            <dd className="mt-1 break-all font-medium">
              {candidate.portfolioUrl || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-black/45">GitHub</dt>
            <dd className="mt-1 break-all font-medium">
              {candidate.githubUrl || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-black/45">Work Authorization</dt>
            <dd className="mt-1 font-medium">
              {candidate.workAuthorization || "—"}
            </dd>
          </div>
        </dl>
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-black/10 bg-white p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Edit Profile
        </h2>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-sm text-black/55 hover:underline"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-black/55">First Name</span>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-black/55">Last Name</span>
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-black/55">Preferred Name</span>
          <input
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-black/55">Phone</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-black/55">City</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-black/55">State</span>
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-black/55">Professional Summary</span>
          <textarea
            rows={4}
            value={professionalSummary}
            onChange={(e) => setProfessionalSummary(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-black/55">LinkedIn URL</span>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-black/55">Portfolio URL</span>
          <input
            type="url"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-black/55">GitHub URL</span>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-black/55">Work Authorization</span>
          <input
            value={workAuthorization}
            onChange={(e) => setWorkAuthorization(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={willingToRelocate}
          onChange={(e) => setWillingToRelocate(e.target.checked)}
        />
        Willing to relocate
      </label>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--ca-platform-deep)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Profile"}
      </button>
    </form>
  );
}
