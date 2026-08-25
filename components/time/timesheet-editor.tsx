"use client";

import { useMemo, useState, useTransition } from "react";

import {
  saveDraftAction,
  submitTimesheetAction,
} from "@/app/actions/time-actions";
import type { TimeEntry, Timesheet } from "@/types/self-service";
import { timesheetStatusLabels } from "@/types/self-service";

function datesInPeriod(periodStart: string, periodEnd: string) {
  const dates: string[] = [];
  const cursor = new Date(`${periodStart}T00:00:00`);
  const end = new Date(`${periodEnd}T00:00:00`);
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function weekdayLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

interface TimesheetEditorProps {
  timesheet: Timesheet;
  entries: TimeEntry[];
}

export default function TimesheetEditor({
  timesheet,
  entries,
}: TimesheetEditorProps) {
  const periodDates = useMemo(
    () => datesInPeriod(timesheet.periodStart, timesheet.periodEnd),
    [timesheet.periodStart, timesheet.periodEnd],
  );

  const initialHours = useMemo(() => {
    const map: Record<string, number> = {};
    for (const date of periodDates) map[date] = 0;
    for (const entry of entries) {
      map[entry.workDate] = (map[entry.workDate] ?? 0) + entry.hours;
    }
    return map;
  }, [entries, periodDates]);

  const [hoursByDate, setHoursByDate] = useState(initialHours);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const editable =
    timesheet.status === "DRAFT" || timesheet.status === "REOPENED";
  const total = Object.values(hoursByDate).reduce((sum, value) => sum + value, 0);

  function updateHours(date: string, value: string) {
    const parsed = Number(value);
    setHoursByDate((current) => ({
      ...current,
      [date]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
    }));
  }

  function handleSave() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await saveDraftAction({
        timesheetId: timesheet.id,
        days: periodDates.map((workDate) => ({
          workDate,
          hours: hoursByDate[workDate] ?? 0,
        })),
      });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  function handleSubmit() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const saveResult = await saveDraftAction({
        timesheetId: timesheet.id,
        days: periodDates.map((workDate) => ({
          workDate,
          hours: hoursByDate[workDate] ?? 0,
        })),
      });
      if (!saveResult.ok) {
        setError(saveResult.message);
        return;
      }

      const submitResult = await submitTimesheetAction({
        timesheetId: timesheet.id,
      });
      if (submitResult.ok) setMessage(submitResult.message);
      else setError(submitResult.message);
    });
  }

  return (
    <section className="rounded-lg border border-black/10 bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Current Period
          </h2>
          <p className="mt-2 text-lg font-medium">
            {timesheet.periodStart} – {timesheet.periodEnd}
          </p>
        </div>
        <p className="text-sm text-black/55">
          {timesheetStatusLabels[timesheet.status]} · {total} hours
        </p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-xs uppercase tracking-[0.08em] text-black/40">
              <th className="py-2 pr-4 font-medium">Day</th>
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 font-medium">Regular Hours</th>
            </tr>
          </thead>
          <tbody>
            {periodDates.map((date) => (
              <tr key={date} className="border-b border-black/5">
                <td className="py-3 pr-4">{weekdayLabel(date)}</td>
                <td className="py-3 pr-4 text-black/55">{date}</td>
                <td className="py-3">
                  {editable ? (
                    <input
                      type="number"
                      min={0}
                      max={24}
                      step={0.5}
                      value={hoursByDate[date] ?? 0}
                      onChange={(event) => updateHours(date, event.target.value)}
                      className="w-24 rounded-md border border-black/15 bg-white px-3 py-2"
                      aria-label={`Hours for ${date}`}
                    />
                  ) : (
                    <span className="font-medium">{hoursByDate[date] ?? 0}h</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium">Total Hours · {total}</p>
        {editable && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/[0.03] disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={pending}
              className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--ca-blue-hover)] disabled:opacity-50"
            >
              Submit Timesheet
            </button>
          </div>
        )}
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
    </section>
  );
}
