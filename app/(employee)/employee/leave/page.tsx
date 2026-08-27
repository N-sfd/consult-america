import type { Metadata } from "next";

import LeaveRequestForm from "@/components/leave/leave-request-form";
import LeaveRequestList from "@/components/leave/leave-request-list";
import {
  getLeaveBalances,
  getLeaveRequests,
  getLeaveTypes,
} from "@/lib/self-service";
import { getEmployeeSession } from "@/lib/self-service/session";
import { leaveRequestStatusLabels } from "@/types/self-service";

export const metadata: Metadata = {
  title: "Leave | ConsultAmerica",
};

export default function EmployeeLeavePage() {
  const session = getEmployeeSession();
  const types = getLeaveTypes();
  const balances = getLeaveBalances(session.employeeId);
  const requests = getLeaveRequests(session.employeeId);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = requests
    .filter((r) => r.status === "APPROVED" && r.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  const upcomingType = upcoming
    ? types.find((t) => t.id === upcoming.leaveTypeId)
    : undefined;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">Leave</h1>
          <p className="mt-2 text-black/55">
            View balances, request leave, and cancel pending or future
            approved leave.
          </p>
        </div>
        <LeaveRequestForm types={types} balances={balances} />
      </div>

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
          <p className="mt-4 text-sm text-black/50">No upcoming leave scheduled.</p>
        )}
      </section>

      <LeaveRequestList requests={requests} types={types} />
    </div>
  );
}
