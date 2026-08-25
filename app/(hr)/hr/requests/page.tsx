import type { Metadata } from "next";
import Link from "next/link";

import { hrRepository } from "@/lib/hr";
import {
  listHrRequestsForQueue,
} from "@/lib/self-service/hr-request-store";
import { getHrSession } from "@/lib/self-service/session";
import {
  hrRequestCategoryLabels,
  hrRequestStatusLabels,
} from "@/types/self-service";

export const metadata: Metadata = {
  title: "HR Request Queue | ConsultAmerica",
};

type SearchParams = Promise<{ filter?: string }>;

function parseFilter(
  value?: string,
): "OPEN" | "ASSIGNED" | "WAITING" | "RESOLVED" | "ALL" {
  if (
    value === "OPEN" ||
    value === "ASSIGNED" ||
    value === "WAITING" ||
    value === "RESOLVED" ||
    value === "ALL"
  ) {
    return value;
  }
  return "OPEN";
}

export default async function HrRequestsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = getHrSession();
  const params = await searchParams;
  const filter = parseFilter(params.filter);
  const requests = listHrRequestsForQueue(filter, session.employeeId);

  const filters = [
    { value: "OPEN", label: "Open" },
    { value: "ASSIGNED", label: "Assigned to Me" },
    { value: "WAITING", label: "Waiting" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "ALL", label: "All" },
  ] as const;

  const names = new Map<string, string>();
  for (const request of requests) {
    if (names.has(request.employeeId)) continue;
    const employee = await hrRepository.getEmployeeById(request.employeeId);
    if (!employee) {
      names.set(request.employeeId, request.employeeId);
      continue;
    }
    const person = await hrRepository.getPersonById(employee.personId);
    names.set(
      request.employeeId,
      person ? `${person.firstName} ${person.lastName}` : request.employeeId,
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          HR Requests
        </h1>
        <p className="mt-2 text-black/55">
          Service-desk queue for open, assigned, waiting, and resolved
          employee requests.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => {
          const active = filter === item.value;
          return (
            <Link
              key={item.value}
              href={`/hr/requests?filter=${item.value}`}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                active
                  ? "bg-[var(--ca-blue)] text-white"
                  : "border border-black/15 text-black/70 hover:bg-black/[0.03]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <ul className="divide-y divide-black/5">
          {requests.map((request) => (
            <li key={request.id}>
              <Link
                href={`/hr/requests/${request.id}`}
                className="block px-5 py-4 hover:bg-black/[0.02]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-black/40">
                      {request.requestNumber}
                    </p>
                    <p className="mt-1 font-medium">{request.subject}</p>
                    <p className="mt-1 text-sm text-black/55">
                      {names.get(request.employeeId)} ·{" "}
                      {hrRequestCategoryLabels[request.category]} ·{" "}
                      {request.createdAt.slice(0, 10)}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.1em] text-black/45">
                    {hrRequestStatusLabels[request.status]}
                  </span>
                </div>
              </Link>
            </li>
          ))}
          {requests.length === 0 && (
            <li className="px-5 py-8 text-sm text-black/50">
              No requests in this queue.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
