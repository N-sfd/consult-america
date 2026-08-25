import type { Metadata } from "next";

import { getPendingApprovals } from "@/lib/self-service";
import { getManagerSession } from "@/lib/self-service/session";

export const metadata: Metadata = {
  title: "Approvals | ConsultAmerica",
};

export default function ManagerApprovalsPage() {
  const session = getManagerSession();
  const approvals = getPendingApprovals(session.employeeId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Approvals</h1>
        <p className="mt-2 text-black/55">
          Central approval inbox foundation. Act/reject workflows continue in
          Phase 4H.
        </p>
      </div>

      <ul className="divide-y divide-black/5 overflow-hidden rounded-lg border border-black/10 bg-white">
        {approvals.map((item) => (
          <li key={item.id} className="px-5 py-4">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--ca-blue)]">
              {item.requestType}
            </p>
            <p className="mt-1 font-medium">{item.summary}</p>
            <p className="mt-2 text-xs text-black/40">
              Submitted {item.submittedAt.slice(0, 10)}
            </p>
          </li>
        ))}
        {approvals.length === 0 && (
          <li className="px-5 py-8 text-sm text-black/50">
            No pending approvals.
          </li>
        )}
      </ul>
    </div>
  );
}
