import type { Metadata } from "next";

import TimesheetEditor from "@/components/time/timesheet-editor";
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

export default async function EmployeeTimePage() {
  const session = await getEmployeeSession();
  const current = getCurrentTimesheet(session.employeeId);
  const entries = current ? getTimeEntries(current.id) : [];
  const history = getTimesheets(session.employeeId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Time</h1>
        <p className="mt-2 text-black/55">
          Enter hours for the current period, save a draft, then submit to your
          manager for approval.
        </p>
      </div>

      {current ? (
        <TimesheetEditor timesheet={current} entries={entries} />
      ) : (
        <div className="rounded-lg border border-black/10 bg-white px-5 py-8 text-sm text-black/50">
          No open timesheet period.
        </div>
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
