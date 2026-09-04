"use client";

import { useState, useTransition } from "react";

import { logActivityAction } from "@/lib/crm/actions";
import { activityTypeLabels } from "@/types/crm";
import type { ActivityType } from "@/types/crm";

const TYPES = Object.keys(activityTypeLabels) as ActivityType[];

export default function ActivityLogForm({ accountId }: { accountId: string }) {
  const [type, setType] = useState<ActivityType>("NOTE");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await logActivityAction({ accountId, type, subject, body });
      if (result.ok) {
        setMessage(result.message);
        setSubject("");
        setBody("");
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <select
          value={type}
          onChange={(event) => setType(event.target.value as ActivityType)}
          className="rounded-md border border-black/15 px-2 py-1.5 text-sm"
        >
          {TYPES.map((value) => (
            <option key={value} value={value}>
              {activityTypeLabels[value]}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="Subject"
          className="min-w-0 flex-1 rounded-md border border-black/15 px-3 py-1.5 text-sm"
          required
        />
      </div>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={2}
        placeholder="Notes (optional)"
        className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || !subject.trim()}
          className="rounded-md bg-[var(--ca-blue)] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          Log Activity
        </button>
        {message && (
          <p className="text-xs text-emerald-700" role="status">
            {message}
          </p>
        )}
        {error && (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
