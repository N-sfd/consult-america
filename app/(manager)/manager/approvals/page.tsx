import type { Metadata } from "next";

import ApprovalInbox from "@/components/approvals/approval-inbox";
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
    value === "HR_REQUEST"
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
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Approvals</h1>
        <p className="mt-2 text-black/55">
          Central queue for timesheets, leave, and profile changes. Review
          details and act here without switching apps.
        </p>
        <p className="mt-3 text-sm text-black/45">
          {allPending.length} pending across all types
        </p>
      </div>

      <ApprovalInbox
        items={items}
        allPending={allPending}
        recent={recent}
        activeFilter={filter}
      />
    </div>
  );
}
