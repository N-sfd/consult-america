import type { Metadata } from "next";

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
          Balances and request history are available. Submit/cancel workflows
          continue in Phase 4F.
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

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Requests
        </h2>
        <ul className="mt-4 divide-y divide-black/5 text-sm">
          {requests.map((request) => {
            const type = types.find((item) => item.id === request.leaveTypeId);
            return (
              <li
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium">{type?.name}</p>
                  <p className="mt-1 text-black/55">
                    {request.startDate} – {request.endDate} · {request.hours}h
                  </p>
                </div>
                <span className="text-xs uppercase tracking-[0.1em] text-black/45">
                  {request.status}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
