import type { Metadata } from "next";

import {
  getCurrentTimesheet,
  getTimeEntries,
  getTimesheets,
} from "@/lib/self-service";
import { getEmployeeSession } from "@/lib/self-service/session";
import { timesheetStatusLabels } from "@/types/self-service";

export const metadata: Metadata = {
  title: "Time | ConsultAmerica",
};

export default function EmployeeTimePage() {
  const session = getEmployeeSession();
  const current = getCurrentTimesheet(session.employeeId);
  const entries = current ? getTimeEntries(current.id) : [];
  const history = getTimesheets(session.employeeId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Time</h1>
        <p className="mt-2 text-black/55">
          Timesheet foundation is ready. Full entry editing and submit actions
          continue in Phase 4E.
        </p>
      </div>

      {current && (
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                Current Period
              </h2>
              <p className="mt-2 text-lg font-medium">
                {current.periodStart} – {current.periodEnd}
              </p>
            </div>
            <p className="text-sm text-black/55">
              {timesheetStatusLabels[current.status]} · {current.totalHours} hours
            </p>
          </div>

          <ul className="mt-6 divide-y divide-black/5 text-sm">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between py-3"
              >
                <span>
                  {entry.workDate} · {entry.timeType}
                </span>
                <span className="font-medium">{entry.hours}h</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          History
        </h2>
        <ul className="mt-4 divide-y divide-black/5 text-sm">
          {history.map((sheet) => (
            <li
              key={sheet.id}
              className="flex items-center justify-between py-3"
            >
              <span>
                {sheet.periodStart} – {sheet.periodEnd}
              </span>
              <span className="text-black/55">
                {timesheetStatusLabels[sheet.status]} · {sheet.totalHours}h
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
