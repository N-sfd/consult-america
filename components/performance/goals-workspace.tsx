"use client";

import { useState, useTransition } from "react";

import { createGoalAction, updateGoalProgressAction } from "@/app/actions/performance-actions";
import { goalStatusLabels } from "@/types/self-service";
import type { Goal, GoalStatus } from "@/types/self-service";

const STATUSES = Object.keys(goalStatusLabels) as GoalStatus[];

export default function GoalsWorkspace({ goals }: { goals: Goal[] }) {
  return (
    <div className="space-y-6">
      <NewGoalForm />
      {goals.length === 0 ? (
        <div className="rounded-lg border border-black/10 bg-white px-5 py-8 text-sm text-black/50">
          No goals yet. Add one above to get started.
        </div>
      ) : (
        <ul className="space-y-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </ul>
      )}
    </div>
  );
}

function NewGoalForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createGoalAction({ title, description, targetDate });
      if (result.ok) {
        setTitle("");
        setDescription("");
        setTargetDate("");
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-black/10 bg-white p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
        Add a Goal
      </p>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Goal title"
        className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
        required
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
      />
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="date"
          value={targetDate}
          onChange={(event) => setTargetDate(event.target.value)}
          className="rounded-md border border-black/15 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={pending || !title.trim()}
          className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Add Goal
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  const [status, setStatus] = useState<GoalStatus>(goal.status);
  const [progress, setProgress] = useState(goal.progressPercent);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await updateGoalProgressAction({
        goalId: goal.id,
        status,
        progressPercent: progress,
      });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <li className="rounded-lg border border-black/10 bg-white p-5">
      <p className="font-medium">{goal.title}</p>
      {goal.description && (
        <p className="mt-1 text-sm text-black/55">{goal.description}</p>
      )}
      {goal.targetDate && (
        <p className="mt-1 text-xs text-black/40">Target: {goal.targetDate}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as GoalStatus)}
          className="rounded-md border border-black/15 px-2 py-1.5 text-sm"
        >
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {goalStatusLabels[value]}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          max={100}
          value={progress}
          onChange={(event) => setProgress(Number(event.target.value))}
          className="w-20 rounded-md border border-black/15 px-2 py-1.5 text-sm"
          aria-label="Progress percent"
        />
        <span className="text-sm text-black/45">%</span>
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="rounded-md bg-[var(--ca-blue)] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          Save
        </button>
      </div>

      {message && (
        <p className="mt-2 text-xs text-emerald-700" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </li>
  );
}
