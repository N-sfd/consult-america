import type { Metadata } from "next";

import TimesheetEditor from "@/components/time/timesheet-editor";
import { EmptyState, PageHeader } from "@/components/shared";
import {
  getCurrentTimesheet,
  getTimeEntries,
  getTimesheets,
} from "@/lib/self-service";
import { getEmployeeSession } from "@/lib/self-service/session";
import {
  getPersistedTimesheetForEmployee,
  workforceDataAvailable,
} from "@/lib/workforce/operations";
import { timesheetStatusLabels } from "@/types/self-service";

export const metadata: Metadata = {
  title: "Time | ConsultAmerica",
};

export default async function EmployeeTimePage() {
  const session = await getEmployeeSession();
  const persisted = workforceDataAvailable()
    ? await getPersistedTimesheetForEmployee(session.employeeId)
    : null;
  const current = persisted ? persisted.current : getCurrentTimesheet(session.employeeId);
  const entries = persisted
    ? persisted.entries
    : current
      ? getTimeEntries(current.id)
      : [];
  const history = persisted ? persisted.history : getTimesheets(session.employeeId);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Time"
        description="Enter hours for the current period, save a draft, then submit to your manager for approval."
        actions={
          <a
            href="/api/exports/time-entries"
            className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
          >
            Export CSV
          </a>
        }
      />

      {current ? (
        <TimesheetEditor timesheet={current} entries={entries} />
      ) : (
        <EmptyState
          title="No open timesheet period"
          description="There is no editable timesheet for the current period."
        />
      )}

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          History
        </h2>
        {history.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              compact
              title="No timesheet history"
              description="Submitted periods will appear here."
              className="border-0 bg-transparent px-0 py-2"
            />
          </div>
        ) : (
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
        )}
      </section>
    </div>
  );
}
