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

function longDateLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function shortDateLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
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

  const initial = useMemo(() => {
    const regular: Record<string, number> = {};
    const project: Record<string, number> = {};
    let projectLabel = "";
    for (const date of periodDates) {
      regular[date] = 0;
      project[date] = 0;
    }
    for (const entry of entries) {
      if (entry.comments) {
        project[entry.workDate] = (project[entry.workDate] ?? 0) + entry.hours;
        if (!projectLabel) projectLabel = entry.comments;
      } else {
        regular[entry.workDate] = (regular[entry.workDate] ?? 0) + entry.hours;
      }
    }
    return { regular, project, projectLabel };
  }, [entries, periodDates]);

  const [regularByDate, setRegularByDate] = useState(initial.regular);
  const [projectByDate, setProjectByDate] = useState(initial.project);
  const [projectLabel, setProjectLabel] = useState(
    initial.projectLabel || "Project",
  );
  const [showProject, setShowProject] = useState(
    Object.values(initial.project).some((h) => h > 0),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const editable =
    timesheet.status === "DRAFT" || timesheet.status === "REOPENED";

  const totalsByDate = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const date of periodDates) {
      totals[date] =
        (regularByDate[date] ?? 0) + (showProject ? (projectByDate[date] ?? 0) : 0);
    }
    return totals;
  }, [periodDates, regularByDate, projectByDate, showProject]);

  const weekTotal = Object.values(totalsByDate).reduce((a, b) => a + b, 0);

  function setHours(
    setter: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    date: string,
    value: string,
  ) {
    const parsed = Number(value);
    setter((current) => ({
      ...current,
      [date]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
    }));
  }

  function buildDays() {
    const days = periodDates.flatMap((workDate) => {
      const rows = [];
      if ((regularByDate[workDate] ?? 0) > 0) {
        rows.push({
          workDate,
          hours: regularByDate[workDate],
          timeType: "REGULAR" as const,
        });
      }
      if (showProject && (projectByDate[workDate] ?? 0) > 0) {
        rows.push({
          workDate,
          hours: projectByDate[workDate],
          timeType: "REGULAR" as const,
          comments: projectLabel.trim() || "Project",
        });
      }
      return rows;
    });
    // Ensure zeroed-out days still clear prior entries.
    for (const date of periodDates) {
      if (!days.some((d) => d.workDate === date)) {
        days.push({ workDate: date, hours: 0, timeType: "REGULAR" as const });
      }
    }
    return days;
  }

  function handleSave() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await saveDraftAction({
        timesheetId: timesheet.id,
        days: buildDays(),
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
        days: buildDays(),
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
          {timesheetStatusLabels[timesheet.status]} · {weekTotal} hours
        </p>
      </div>

      {/* Desktop weekly grid */}
      <div className="mt-6 hidden overflow-x-auto sm:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-xs uppercase tracking-[0.08em] text-black/40">
              <th className="py-2 pr-4 font-medium">&nbsp;</th>
              {periodDates.map((date) => (
                <th key={date} className="px-2 py-2 text-center font-medium">
                  {weekdayLabel(date)}
                  <span className="block font-normal normal-case text-black/35">
                    {shortDateLabel(date)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-black/5">
              <td className="py-3 pr-4 font-medium">Regular</td>
              {periodDates.map((date) => (
                <td key={date} className="px-2 py-3 text-center">
                  {editable ? (
                    <input
                      type="number"
                      min={0}
                      max={24}
                      step={0.5}
                      value={regularByDate[date] ?? 0}
                      onChange={(e) =>
                        setHours(setRegularByDate, date, e.target.value)
                      }
                      className="w-16 rounded-md border border-black/15 bg-white px-2 py-1.5 text-center"
                      aria-label={`Regular hours for ${date}`}
                    />
                  ) : (
                    <span>{regularByDate[date] ?? 0}</span>
                  )}
                </td>
              ))}
            </tr>

            {showProject && (
              <tr className="border-b border-black/5">
                <td className="py-3 pr-4">
                  {editable ? (
                    <input
                      type="text"
                      value={projectLabel}
                      onChange={(e) => setProjectLabel(e.target.value)}
                      placeholder="Project"
                      className="w-32 rounded-md border border-black/15 bg-white px-2 py-1.5 text-sm font-medium"
                    />
                  ) : (
                    <span className="font-medium">{projectLabel}</span>
                  )}
                </td>
                {periodDates.map((date) => (
                  <td key={date} className="px-2 py-3 text-center">
                    {editable ? (
                      <input
                        type="number"
                        min={0}
                        max={24}
                        step={0.5}
                        value={projectByDate[date] ?? 0}
                        onChange={(e) =>
                          setHours(setProjectByDate, date, e.target.value)
                        }
                        className="w-16 rounded-md border border-black/15 bg-white px-2 py-1.5 text-center"
                        aria-label={`${projectLabel} hours for ${date}`}
                      />
                    ) : (
                      <span>{projectByDate[date] ?? 0}</span>
                    )}
                  </td>
                ))}
              </tr>
            )}

            <tr>
              <td className="py-3 pr-4 font-semibold">Total</td>
              {periodDates.map((date) => (
                <td key={date} className="px-2 py-3 text-center font-semibold">
                  {totalsByDate[date]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        {editable && !showProject && (
          <button
            type="button"
            onClick={() => setShowProject(true)}
            className="mt-4 text-sm font-medium text-[var(--ca-blue)] hover:underline"
          >
            + Add project time
          </button>
        )}
      </div>

      {/* Mobile per-day cards */}
      <div className="mt-6 space-y-3 sm:hidden">
        {periodDates.map((date) => (
          <div
            key={date}
            className="rounded-lg border border-black/10 bg-[#F8FAFC] p-4"
          >
            <p className="text-sm font-medium">{longDateLabel(date)}</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-sm text-black/55">Regular</span>
              {editable ? (
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={regularByDate[date] ?? 0}
                  onChange={(e) =>
                    setHours(setRegularByDate, date, e.target.value)
                  }
                  className="w-20 rounded-md border border-black/15 bg-white px-2 py-1.5 text-right"
                  aria-label={`Regular hours for ${date}`}
                />
              ) : (
                <span className="font-medium">
                  {(regularByDate[date] ?? 0).toFixed(1)} hours
                </span>
              )}
            </div>
            {showProject && (
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-sm text-black/55">
                  {projectLabel || "Project"}
                </span>
                {editable ? (
                  <input
                    type="number"
                    min={0}
                    max={24}
                    step={0.5}
                    value={projectByDate[date] ?? 0}
                    onChange={(e) =>
                      setHours(setProjectByDate, date, e.target.value)
                    }
                    className="w-20 rounded-md border border-black/15 bg-white px-2 py-1.5 text-right"
                    aria-label={`${projectLabel} hours for ${date}`}
                  />
                ) : (
                  <span className="font-medium">
                    {(projectByDate[date] ?? 0).toFixed(1)} hours
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {editable && !showProject && (
          <button
            type="button"
            onClick={() => setShowProject(true)}
            className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
          >
            + Add project time
          </button>
        )}

        <div className="rounded-lg border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Weekly Total</span>
            <span className="text-lg font-semibold">{weekTotal} hours</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="hidden text-sm font-medium sm:block">
          Total Hours · {weekTotal}
        </p>
        {editable && (
          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="flex-1 rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/[0.03] disabled:opacity-50 sm:flex-none"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={pending}
              className="flex-1 rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--ca-blue-hover)] disabled:opacity-50 sm:flex-none"
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
