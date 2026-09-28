import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";
import Link from "next/link";

import HrRequestCreateForm from "@/components/hr-requests/hr-request-create-form";
import { getHrRequests } from "@/lib/self-service";
import { getEmployeeSession } from "@/lib/self-service/session";
import {
  hrRequestCategoryLabels,
  hrRequestStatusLabels,
} from "@/types/self-service";

export const metadata: Metadata = {
  title: "HR Requests | ConsultAmerica",
};

export default async function EmployeeRequestsPage() {
  const session = await getEmployeeSession();
  const requests = getHrRequests(session.employeeId);

  return (
    <div className="space-y-8">
      <PageHeader
        title="HR Requests"
        description="Create a request, follow the conversation, and reply when HR needs more information."
        actions={
          <Link
            href="/employee/requests#new-request"
            className="rounded-md bg-[var(--ca-platform-mid)] px-4 py-2 text-sm font-medium text-white"
          >
            New HR Request
          </Link>
        }
      />

      <div className="overflow-hidden rounded-lg border border-[var(--ca-platform-border)] bg-white">
        <ul className="divide-y divide-black/5">
          {requests.map((request) => (
            <li key={request.id}>
              <Link
                href={`/employee/requests/${request.id}`}
                className="block px-5 py-4 hover:bg-black/[0.02]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[var(--ca-platform-muted)]">
                      {request.requestNumber}
                    </p>
                    <p className="mt-1 font-medium">{request.subject}</p>
                    <p className="mt-1 text-sm text-[var(--ca-platform-muted)]">
                      {hrRequestCategoryLabels[request.category]} ·{" "}
                      {request.createdAt.slice(0, 10)}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.1em] text-[var(--ca-platform-muted)]">
                    {hrRequestStatusLabels[request.status]}
                  </span>
                </div>
              </Link>
            </li>
          ))}
          {requests.length === 0 && (
            <li className="px-5 py-8 text-sm text-black/50">
              No HR requests yet.
            </li>
          )}
        </ul>
      </div>

      <div id="new-request">
        <HrRequestCreateForm />
      </div>
    </div>
  );
}
