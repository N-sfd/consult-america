import type { Metadata } from "next";

import TimesheetApprovalList from "@/components/time/timesheet-approval-list";
import { getEmployeeProfile } from "@/lib/self-service";
import { getManagerSession } from "@/lib/self-service/session";
import { listSubmittedTimesheetsForManager } from "@/lib/self-service/time-store";

export const metadata: Metadata = {
  title: "Team Time | ConsultAmerica",
};

export default async function ManagerTimePage() {
  const session = await getManagerSession();
  const pending = listSubmittedTimesheetsForManager(session.employeeId);

  const items = await Promise.all(
    pending.map(async (item) => {
      const profile = await getEmployeeProfile(item.sheet.employeeId);
      return {
        sheet: item.sheet,
        entries: item.entries,
        employeeName: profile
          ? `${profile.person.firstName} ${profile.person.lastName}`
          : item.sheet.employeeId,
      };
    }),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Team Time</h1>
        <p className="mt-2 text-black/55">
          Review submitted timesheets for your direct reports. Reject and return
          actions require a comment.
        </p>
      </div>

      <TimesheetApprovalList items={items} />
    </div>
  );
}
