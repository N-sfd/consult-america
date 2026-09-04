import type { Metadata } from "next";
import Link from "next/link";

import { hrRepository } from "@/lib/hr";
import { listHrRequestsForQueue } from "@/lib/self-service/hr-request-store";
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
  const session = await getHrSession();
  const params = await searchParams;
  const filter = parseFilter(params.filter);
  const requests = listHrRequestsForQueue(filter, session.employeeId);

  const summary = {
    OPEN: listHrRequestsForQueue("OPEN", session.employeeId).length,
    ASSIGNED: listHrRequestsForQueue("ASSIGNED", session.employeeId).length,
    WAITING: listHrRequestsForQueue("WAITING", session.employeeId).length,
    RESOLVED: listHrRequestsForQueue("RESOLVED", session.employeeId).length,
  };

  const filters = [
    { value: "OPEN" as const, label: "Open", count: summary.OPEN },
    { value: "ASSIGNED" as const, label: "Assigned to Me", count: summary.ASSIGNED },
    { value: "WAITING" as const, label: "Waiting", count: summary.WAITING },
    { value: "RESOLVED" as const, label: "Resolved", count: summary.RESOLVED },
    { value: "ALL" as const, label: "All", count: null as number | null },
  ];

  const names = new Map<string, string>();
  for (const request of requests) {
    if (names.has(request.employeeId)) continue;
    const employee = await hrRepository.getEmployeeById(request.employeeId);
    names.set(
      request.employeeId,
      employee ? `${employee.firstName} ${employee.lastName}` : request.employeeId,
    );
  }

  const assigneeNames = new Map<string, string>();
  for (const request of requests) {
    if (!request.assignedToEmployeeId || assigneeNames.has(request.assignedToEmployeeId)) continue;
    const assignee = await hrRepository.getEmployeeById(request.assignedToEmployeeId);
    assigneeNames.set(
      request.assignedToEmployeeId,
      assignee ? `${assignee.firstName} ${assignee.lastName}` : request.assignedToEmployeeId,
    );
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[clamp(1.75rem,2.4vw,2.25rem)] font-semibold tracking-[-0.03em]">
          HR Requests
        </h1>
        <p className="mt-1.5 text-[0.95rem] text-[var(--ca-platform-muted)]">
          Service-desk queue for open, assigned, waiting, and resolved employee requests.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(
          [
            ["Open", summary.OPEN],
            ["Assigned to Me", summary.ASSIGNED],
            ["Waiting", summary.WAITING],
            ["Resolved", summary.RESOLVED],
          ] as const
        ).map(([label, count]) => (
          <div key={label} className="ca-platform-card ca-platform-kpi">
            <p className="ca-platform-kpi-label">{label}</p>
            <p className="ca-platform-kpi-value">{count}</p>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => {
          const active = filter === item.value;
          return (
            <Link
              key={item.label}
              href={`/hr/requests?filter=${item.value}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-[var(--ca-platform-deep)] text-white"
                  : "border border-[var(--ca-platform-border)] bg-white text-[var(--ca-platform-muted)] hover:text-[var(--ca-platform-ink)]"
              }`}
            >
              {item.label}
              {item.count != null ? ` · ${item.count}` : ""}
            </Link>
          );
        })}
      </div>

      <div className="ca-platform-card overflow-hidden">
        <div className="hidden grid-cols-[110px_1.1fr_1fr_1fr_100px_90px_80px] gap-3 border-b border-[var(--ca-platform-border)] px-5 py-3 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[var(--ca-platform-muted)] lg:grid">
          <span>Request #</span>
          <span>Employee</span>
          <span>Type</span>
          <span>Assigned To</span>
          <span>Created</span>
          <span>Status</span>
          <span>Priority</span>
        </div>
        <ul className="divide-y divide-[var(--ca-platform-border)]">
          {requests.map((request) => (
            <li key={request.id}>
              <Link
                href={`/hr/requests/${request.id}`}
                className="block px-5 py-4 transition-colors hover:bg-[var(--ca-platform-sage-light)]"
              >
                <div className="grid gap-2 lg:grid-cols-[110px_1.1fr_1fr_1fr_100px_90px_80px] lg:items-center lg:gap-3">
                  <p className="text-xs text-[var(--ca-platform-muted)] lg:text-sm lg:font-medium lg:text-[var(--ca-platform-ink)]">
                    {request.requestNumber}
                  </p>
                  <div>
                    <p className="font-medium lg:hidden">{request.subject}</p>
                    <p className="text-sm font-medium">{names.get(request.employeeId)}</p>
                    <p className="mt-0.5 text-xs text-[var(--ca-platform-muted)] lg:hidden">
                      {hrRequestCategoryLabels[request.category]}
                    </p>
                  </div>
                  <p className="hidden text-sm text-[var(--ca-platform-muted)] lg:block">
                    {hrRequestCategoryLabels[request.category]}
                  </p>
                  <p className="hidden text-sm text-[var(--ca-platform-muted)] lg:block">
                    {request.assignedToEmployeeId
                      ? assigneeNames.get(request.assignedToEmployeeId)
                      : "Unassigned"}
                  </p>
                  <p className="hidden text-sm text-[var(--ca-platform-muted)] lg:block">
                    {request.createdAt.slice(0, 10)}
                  </p>
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[var(--ca-platform-mid)]">
                    {hrRequestStatusLabels[request.status]}
                  </p>
                  <p
                    className={`hidden text-[0.7rem] font-bold uppercase tracking-[0.08em] lg:block ${
                      request.priority === "HIGH"
                        ? "text-[var(--ca-platform-red)]"
                        : "text-[var(--ca-platform-muted)]"
                    }`}
                  >
                    {request.priority}
                  </p>
                </div>
              </Link>
            </li>
          ))}
          {requests.length === 0 && (
            <li className="px-5 py-8 text-sm text-[var(--ca-platform-muted)]">
              No requests in this queue.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
