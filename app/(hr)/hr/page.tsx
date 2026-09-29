import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState, PageHeader } from "@/components/shared";
import { hrRepository } from "@/lib/hr";
import { listHrRequestsForQueue } from "@/lib/self-service/hr-request-store";
import { getHrSession } from "@/lib/self-service/session";
import { hrRequestStatusLabels } from "@/types/self-service";

export const metadata: Metadata = { title: "People Operations" };
export const dynamic = "force-dynamic";

export default async function HrHomePage() {
  const session = await getHrSession();
  const [employees, requests] = await Promise.all([
    hrRepository.listEmployees(),
    Promise.resolve(listHrRequestsForQueue("ALL", session.employeeId)),
  ]);

  const preHire = employees.filter((employee) => employee.employmentStatus === "PRE_HIRE");
  const openRequests = requests.filter(
    (request) => request.status !== "RESOLVED" && request.status !== "CLOSED",
  );

  const cards = [
    { label: "Employees", value: employees.length, href: "/workforce/people" },
    { label: "Onboarding", value: preHire.length, href: "/workforce/people?status=PRE_HIRE" },
    { label: "Open HR requests", value: openRequests.length, href: "/hr/requests" },
  ];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="HR"
        title="People Operations"
        description="Manage employees, onboarding, and workforce lifecycle."
        meta={
          <nav className="ca-workflow-lineage" aria-label="People lineage">
            <span>Accepted offer</span>
            <span className="ca-workflow-sep" aria-hidden>
              →
            </span>
            <span>Hire</span>
            <span className="ca-workflow-sep" aria-hidden>
              →
            </span>
            <span>Employee</span>
            <span className="ca-workflow-sep" aria-hidden>
              →
            </span>
            <span>Onboarding</span>
          </nav>
        }
      />

      <section className="grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="ca-platform-card ca-platform-kpi">
            <p className="ca-platform-kpi-label">{card.label}</p>
            <p className="ca-platform-kpi-value">{card.value}</p>
          </Link>
        ))}
      </section>

      <section className="ca-platform-card p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
            Needs attention
          </h2>
          <Link href="/hr/requests" className="text-sm font-semibold text-[var(--ca-platform-mid)]">
            Request queue
          </Link>
        </div>
        {openRequests.length === 0 ? (
          <EmptyState
            compact
            className="mt-4 border-0 bg-transparent px-0"
            title="No open HR requests"
            description={`Signed in as ${session.displayName}. New employee requests appear here.`}
          />
        ) : (
          <ul className="mt-4 divide-y divide-[var(--ca-platform-border)] text-sm">
            {openRequests.slice(0, 6).map((request) => (
              <li key={request.id}>
                <Link href={`/hr/requests/${request.id}`} className="flex justify-between gap-3 py-3">
                  <span>
                    <span className="font-medium">{request.subject}</span>
                    <span className="mt-1 block text-[var(--ca-platform-muted)]">
                      {request.requestNumber}
                    </span>
                  </span>
                  <span className="text-[var(--ca-platform-muted)]">
                    {hrRequestStatusLabels[request.status]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
