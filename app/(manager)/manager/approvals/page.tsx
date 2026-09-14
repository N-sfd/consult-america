import type { Metadata } from "next";

import ApprovalInbox from "@/components/approvals/approval-inbox";
import { PageHeader } from "@/components/shared";
import {
  getApprovalInbox,
  getRecentApprovalDecisions,
} from "@/lib/self-service/approval-service";
import { getManagerSession } from "@/lib/self-service/session";
import type { ApprovalRequestType } from "@/types/self-service";

export const metadata: Metadata = {
  title: "Approvals | ConsultAmerica",
};

type SearchParams = Promise<{ type?: string }>;

function parseFilter(value?: string): ApprovalRequestType | "ALL" {
  if (
    value === "TIMESHEET" ||
    value === "LEAVE" ||
    value === "PROFILE_CHANGE" ||
    value === "HR_REQUEST" ||
    value === "EXPENSE"
  ) {
    return value;
  }
  return "ALL";
}

export default async function ManagerApprovalsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getManagerSession();
  const params = await searchParams;
  const filter = parseFilter(params.type);

  const [allPending, items, recent] = await Promise.all([
    getApprovalInbox(session.employeeId, "ALL"),
    getApprovalInbox(session.employeeId, filter),
    getRecentApprovalDecisions(session.employeeId),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Approvals"
        description="Central queue for timesheets, leave, expenses, and profile changes. Review details and act here without switching apps."
        meta={
          <p className="text-sm text-[var(--ca-app-muted)]">
            {allPending.length} pending across all types
          </p>
        }
      />

      <ApprovalInbox
        items={items}
        allPending={allPending}
        recent={recent}
        activeFilter={filter}
      />
    </div>
  );
}
