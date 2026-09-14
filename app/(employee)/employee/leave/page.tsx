import type { Metadata } from "next";

import LeaveRequestForm from "@/components/leave/leave-request-form";
import LeaveRequestList from "@/components/leave/leave-request-list";
import { EmptyState, PageHeader } from "@/components/shared";
import {
  getLeaveBalances,
  getLeaveRequests,
  getLeaveTypes,
} from "@/lib/self-service";
import { getEmployeeSession } from "@/lib/self-service/session";
import {
  listPersistedLeaveRequests,
  workforceDataAvailable,
} from "@/lib/workforce/operations";
import { leaveRequestStatusLabels } from "@/types/self-service";

export const metadata: Metadata = {
  title: "Leave | ConsultAmerica",
};

export default async function EmployeeLeavePage() {
  const session = await getEmployeeSession();
  const persisted = workforceDataAvailable();
  const types = getLeaveTypes();
  // Persistence covers leave requests only; balances still come from the leave store.
  const balances = getLeaveBalances(session.employeeId);
  const requests = persisted
    ? await listPersistedLeaveRequests(session.employeeId)
    : getLeaveRequests(session.employeeId);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = requests
    .filter((r) => r.status === "APPROVED" && r.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  const upcomingType = upcoming
    ? types.find((t) => t.id === upcoming.leaveTypeId)
    : undefined;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Leave"
        description="View balances, request leave, and cancel pending or future approved leave."
        actions={
          <div className="flex items-start gap-2">
            <a
              href="/api/exports/leave-requests"
              className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
            >
              Export CSV
            </a>
            <LeaveRequestForm types={types} balances={balances} />
          </div>
        }
      />

      {balances.length === 0 ? (
        <EmptyState
          title="No leave balances on file"
          description="Balances will appear here once leave types are assigned."
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-3">
          {balances.map((balance) => {
            const type = types.find((item) => item.id === balance.leaveTypeId);
            return (
              <div
                key={balance.id}
                className="rounded-lg border border-black/10 bg-white p-5"
              >
                <p className="text-xs uppercase tracking-[0.12em] text-black/40">
                  {type?.name ?? "Leave"}
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  {balance.available}
                </p>
                <p className="mt-2 text-xs text-black/45">Hours available</p>
              </div>
            );
          })}
        </section>
      )}

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Upcoming Leave
        </h2>
        {upcoming ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">
                {upcoming.startDate} – {upcoming.endDate}
              </p>
              <p className="mt-1 text-sm text-black/55">
                {upcomingType?.name ?? "Leave"} · {upcoming.hours} hours
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
              {leaveRequestStatusLabels[upcoming.status]}
            </span>
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              compact
              title="No upcoming leave scheduled"
              description="Approved future leave will show here."
              className="border-0 bg-transparent px-0 py-2"
            />
          </div>
        )}
      </section>

      <LeaveRequestList requests={requests} types={types} />
    </div>
  );
}
