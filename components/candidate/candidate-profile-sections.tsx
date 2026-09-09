"use client";

import { useState, useTransition } from "react";

import {
  saveCandidateEducationAction,
  saveCandidateExperienceAction,
  saveCandidateSkillsAction,
} from "@/app/actions/candidate-actions";

export function CandidateExperienceForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await saveCandidateExperienceAction({
        company: String(form.get("company") ?? ""),
        title: String(form.get("title") ?? ""),
        startDate: String(form.get("startDate") ?? ""),
        endDate: String(form.get("endDate") ?? "") || undefined,
        isCurrent: form.get("isCurrent") === "on",
        description: String(form.get("description") ?? "") || undefined,
      });
      if (result.ok) {
        setMessage(result.message);
        event.currentTarget.reset();
      } else setError(result.message);
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
      <input name="company" required placeholder="Company" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
      <input name="title" required placeholder="Title" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
      <input name="startDate" required type="date" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
      <input name="endDate" type="date" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="isCurrent" /> Current role
      </label>
      <textarea name="description" rows={3} placeholder="Description" className="rounded-md border border-black/15 px-3 py-2 text-sm sm:col-span-2" />
      <button type="submit" disabled={pending} className="rounded-lg border border-black/15 px-3 py-2 text-sm font-semibold sm:col-span-2">
        {pending ? "Saving…" : "Add Experience"}
      </button>
      {error ? <p className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700 sm:col-span-2">{message}</p> : null}
    </form>
  );
}

export function CandidateEducationForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await saveCandidateEducationAction({
        institution: String(form.get("institution") ?? ""),
        degree: String(form.get("degree") ?? "") || undefined,
        fieldOfStudy: String(form.get("fieldOfStudy") ?? "") || undefined,
        startDate: String(form.get("startDate") ?? "") || undefined,
        endDate: String(form.get("endDate") ?? "") || undefined,
      });
      if (result.ok) {
        setMessage(result.message);
        event.currentTarget.reset();
      } else setError(result.message);
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
      <input name="institution" required placeholder="School" className="rounded-md border border-black/15 px-3 py-2 text-sm sm:col-span-2" />
      <input name="degree" placeholder="Degree" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
      <input name="fieldOfStudy" placeholder="Field of study" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
      <input name="startDate" type="date" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
      <input name="endDate" type="date" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
      <button type="submit" disabled={pending} className="rounded-lg border border-black/15 px-3 py-2 text-sm font-semibold sm:col-span-2">
        {pending ? "Saving…" : "Add Education"}
      </button>
      {error ? <p className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700 sm:col-span-2">{message}</p> : null}
    </form>
  );
}

export function CandidateSkillsForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await saveCandidateSkillsAction({
        skillsCsv: String(form.get("skillsCsv") ?? ""),
      });
      if (result.ok) {
        setMessage(result.message);
        event.currentTarget.reset();
      } else setError(result.message);
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <textarea
        name="skillsCsv"
        required
        rows={2}
        placeholder="Python, SQL, Data Engineering"
        className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
      />
      <button type="submit" disabled={pending} className="rounded-lg border border-black/15 px-3 py-2 text-sm font-semibold">
        {pending ? "Saving…" : "Add Skills"}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </form>
  );
}
