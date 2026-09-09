"use client";

import { useState, useTransition } from "react";

import {
  deleteCandidateEducationAction,
  deleteCandidateExperienceAction,
  deleteCandidateSkillAction,
  saveCandidateEducationAction,
  saveCandidateExperienceAction,
  saveCandidateSkillsAction,
  updateCandidateEducationAction,
  updateCandidateExperienceAction,
} from "@/app/actions/candidate-actions";
import type { CandidateSkill, Education, Experience } from "@/types/recruiting";

export function CandidateExperienceForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await saveCandidateExperienceAction({
        company: String(form.get("company") ?? ""),
        title: String(form.get("title") ?? ""),
        location: String(form.get("location") ?? "") || undefined,
        startDate: String(form.get("startDate") ?? ""),
        endDate: String(form.get("endDate") ?? "") || undefined,
        isCurrent: form.get("isCurrent") === "on",
        description: String(form.get("description") ?? "") || undefined,
      });
      if (result.ok) {
        setMessage(result.message);
        formEl.reset();
      } else setError(result.message);
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
      <input name="company" required placeholder="Company" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
      <input name="title" required placeholder="Title" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
      <input name="location" placeholder="Location (optional)" className="rounded-md border border-black/15 px-3 py-2 text-sm sm:col-span-2" />
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

export function CandidateExperienceListItem({ item }: { item: Experience }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await updateCandidateExperienceAction({
        id: item.id,
        company: String(form.get("company") ?? ""),
        title: String(form.get("title") ?? ""),
        location: String(form.get("location") ?? "") || undefined,
        startDate: String(form.get("startDate") ?? ""),
        endDate: String(form.get("endDate") ?? "") || undefined,
        isCurrent: form.get("isCurrent") === "on",
        description: String(form.get("description") ?? "") || undefined,
      });
      if (result.ok) setEditing(false);
      else setError(result.message);
    });
  }

  function onDelete() {
    if (!window.confirm("Remove this experience entry?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteCandidateExperienceAction(item.id);
      if (!result.ok) setError(result.message);
    });
  }

  if (editing) {
    return (
      <li className="rounded-md border border-black/10 p-3">
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
          <input name="company" required defaultValue={item.company} placeholder="Company" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
          <input name="title" required defaultValue={item.title} placeholder="Title" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
          <input name="location" defaultValue={item.location ?? ""} placeholder="Location (optional)" className="rounded-md border border-black/15 px-3 py-2 text-sm sm:col-span-2" />
          <input name="startDate" required type="date" defaultValue={item.startDate} className="rounded-md border border-black/15 px-3 py-2 text-sm" />
          <input name="endDate" type="date" defaultValue={item.endDate ?? ""} className="rounded-md border border-black/15 px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" name="isCurrent" defaultChecked={item.isCurrent} /> Current role
          </label>
          <textarea name="description" rows={3} defaultValue={item.description ?? ""} placeholder="Description" className="rounded-md border border-black/15 px-3 py-2 text-sm sm:col-span-2" />
          {error ? <p className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={pending} className="rounded-lg bg-[var(--ca-platform-deep)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {pending ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-black/15 px-3 py-2 text-sm font-semibold">
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-start justify-between gap-3">
      <div>
        <p className="font-medium">
          {item.title} · {item.company}
        </p>
        {item.location ? <p className="text-black/55">{item.location}</p> : null}
        <p className="text-black/55">
          {item.startDate} – {item.isCurrent ? "Present" : item.endDate}
        </p>
        {item.description ? (
          <p className="mt-1 text-black/65">{item.description}</p>
        ) : null}
        {error ? <p className="mt-1 text-sm text-red-700">{error}</p> : null}
      </div>
      <div className="flex shrink-0 gap-3 text-sm font-semibold">
        <button type="button" onClick={() => setEditing(true)} className="text-black/60 hover:underline">
          Edit
        </button>
        <button type="button" disabled={pending} onClick={onDelete} className="text-red-700 hover:underline">
          Delete
        </button>
      </div>
    </li>
  );
}

export function CandidateEducationForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
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
        formEl.reset();
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

export function CandidateEducationListItem({ item }: { item: Education }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await updateCandidateEducationAction({
        id: item.id,
        institution: String(form.get("institution") ?? ""),
        degree: String(form.get("degree") ?? "") || undefined,
        fieldOfStudy: String(form.get("fieldOfStudy") ?? "") || undefined,
        startDate: String(form.get("startDate") ?? "") || undefined,
        endDate: String(form.get("endDate") ?? "") || undefined,
      });
      if (result.ok) setEditing(false);
      else setError(result.message);
    });
  }

  function onDelete() {
    if (!window.confirm("Remove this education entry?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteCandidateEducationAction(item.id);
      if (!result.ok) setError(result.message);
    });
  }

  if (editing) {
    return (
      <li className="rounded-md border border-black/10 p-3">
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
          <input name="institution" required defaultValue={item.institution} placeholder="School" className="rounded-md border border-black/15 px-3 py-2 text-sm sm:col-span-2" />
          <input name="degree" defaultValue={item.degree ?? ""} placeholder="Degree" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
          <input name="fieldOfStudy" defaultValue={item.fieldOfStudy ?? ""} placeholder="Field of study" className="rounded-md border border-black/15 px-3 py-2 text-sm" />
          <input name="startDate" type="date" defaultValue={item.startDate ?? ""} className="rounded-md border border-black/15 px-3 py-2 text-sm" />
          <input name="endDate" type="date" defaultValue={item.endDate ?? ""} className="rounded-md border border-black/15 px-3 py-2 text-sm" />
          {error ? <p className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={pending} className="rounded-lg bg-[var(--ca-platform-deep)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {pending ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-black/15 px-3 py-2 text-sm font-semibold">
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-start justify-between gap-3">
      <div>
        <p className="font-medium">{item.institution}</p>
        <p className="text-black/55">
          {[item.degree, item.fieldOfStudy].filter(Boolean).join(", ")}
        </p>
        {error ? <p className="mt-1 text-sm text-red-700">{error}</p> : null}
      </div>
      <div className="flex shrink-0 gap-3 text-sm font-semibold">
        <button type="button" onClick={() => setEditing(true)} className="text-black/60 hover:underline">
          Edit
        </button>
        <button type="button" disabled={pending} onClick={onDelete} className="text-red-700 hover:underline">
          Delete
        </button>
      </div>
    </li>
  );
}

export function CandidateSkillsForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await saveCandidateSkillsAction({
        skillsCsv: String(form.get("skillsCsv") ?? ""),
      });
      if (result.ok) {
        setMessage(result.message);
        formEl.reset();
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

export function CandidateSkillPill({ item }: { item: CandidateSkill }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onRemove() {
    setError(null);
    startTransition(async () => {
      const result = await deleteCandidateSkillAction(item.id);
      if (!result.ok) setError(result.message);
    });
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.04] px-3 py-1 text-xs font-medium text-black/70">
      {item.skill}
      <button
        type="button"
        disabled={pending}
        onClick={onRemove}
        aria-label={`Remove ${item.skill}`}
        title={error ?? "Remove"}
        className="text-black/40 hover:text-red-700"
      >
        ×
      </button>
    </span>
  );
}
