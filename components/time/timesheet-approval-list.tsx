"use client";

import { useState, useTransition } from "react";

import {
  approveTimesheetAction,
  rejectTimesheetAction,
  returnTimesheetAction,
} from "@/app/actions/time-actions";
import type { TimeEntry, Timesheet } from "@/types/self-service";

interface ManagerTimesheetItem {
  sheet: Timesheet;
  entries: TimeEntry[];
  employeeName: string;
}

interface TimesheetApprovalListProps {
  items: ManagerTimesheetItem[];
}

export default function TimesheetApprovalList({
  items,
}: TimesheetApprovalListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-black/10 bg-white px-5 py-8 text-sm text-black/50">
        No submitted timesheets waiting for approval.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <TimesheetApprovalCard key={item.sheet.id} item={item} />
      ))}
    </div>
  );
}

function TimesheetApprovalCard({ item }: { item: ManagerTimesheetItem }) {
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(
    action: () => Promise<{ ok: boolean; message: string }>,
  ) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <article className="rounded-lg border border-black/10 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-medium">{item.employeeName}</p>
          <p className="mt-1 text-sm text-black/55">
            {item.sheet.periodStart} – {item.sheet.periodEnd}
          </p>
          <p className="mt-1 text-sm text-black/45">
            {item.sheet.totalHours} hours · Submitted{" "}
            {item.sheet.submittedAt?.slice(0, 10) ?? "—"}
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.1em] text-[var(--ca-blue)]">
          Review
        </p>
      </div>

      <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        {item.entries.map((entry) => (
          <li
            key={entry.id}
            className="flex justify-between rounded-md bg-[#F8FAFC] px-3 py-2"
          >
            <span>
              {entry.workDate} · {entry.timeType}
            </span>
            <span className="font-medium">{entry.hours}h</span>
          </li>
        ))}
      </ul>

      <label className="mt-5 block text-xs uppercase tracking-[0.1em] text-black/40">
        Comment (required for reject / return)
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={3}
          className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220]"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(() =>
              approveTimesheetAction({ timesheetId: item.sheet.id }),
            )
          }
          className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(() =>
              returnTimesheetAction({
                timesheetId: item.sheet.id,
                comment,
              }),
            )
          }
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Return for Correction
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(() =>
              rejectTimesheetAction({
                timesheetId: item.sheet.id,
                comment,
              }),
            )
          }
          className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-50"
        >
          Reject
        </button>
      </div>

      {message && (
        <p className="mt-4 text-sm text-emerald-700" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </article>
  );
}
