import type { Metadata } from "next";

import { getHrRequests } from "@/lib/self-service";
import { getEmployeeSession } from "@/lib/self-service/session";
import { hrRequestCategoryLabels } from "@/types/self-service";

export const metadata: Metadata = {
  title: "HR Requests | ConsultAmerica",
};

export default function EmployeeRequestsPage() {
  const session = getEmployeeSession();
  const requests = getHrRequests(session.employeeId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          HR Requests
        </h1>
        <p className="mt-2 text-black/55">
          Request list is live from seed data. Create/message flows continue in
          Phase 4I.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <ul className="divide-y divide-black/5">
          {requests.map((request) => (
            <li key={request.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-black/40">{request.requestNumber}</p>
                  <p className="mt-1 font-medium">{request.subject}</p>
                  <p className="mt-1 text-sm text-black/55">
                    {hrRequestCategoryLabels[request.category]}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-[0.1em] text-black/45">
                  {request.status.replaceAll("_", " ")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
