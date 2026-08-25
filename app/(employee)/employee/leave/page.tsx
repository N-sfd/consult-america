import type { Metadata } from "next";

import LeaveRequestForm from "@/components/leave/leave-request-form";
import LeaveRequestList from "@/components/leave/leave-request-list";
import {
  getLeaveBalances,
  getLeaveRequests,
  getLeaveTypes,
} from "@/lib/self-service";
import { getEmployeeSession } from "@/lib/self-service/session";

export const metadata: Metadata = {
  title: "Leave | ConsultAmerica",
};

export default function EmployeeLeavePage() {
  const session = getEmployeeSession();
  const types = getLeaveTypes();
  const balances = getLeaveBalances(session.employeeId);
  const requests = getLeaveRequests(session.employeeId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Leave</h1>
        <p className="mt-2 text-black/55">
          View balances, submit a leave request, and cancel pending or future
          approved leave.
        </p>
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

      <LeaveRequestForm types={types} balances={balances} />
      <LeaveRequestList requests={requests} types={types} />
    </div>
  );
}
