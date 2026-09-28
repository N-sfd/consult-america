import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";

import LeaveApprovalList from "@/components/leave/leave-approval-list";
import { getEmployeeProfile } from "@/lib/self-service";
import { listPendingLeaveForManager } from "@/lib/self-service/leave-store";
import { getManagerSession } from "@/lib/self-service/session";

export const metadata: Metadata = {
  title: "Team Leave | ConsultAmerica",
};

export default async function ManagerLeavePage() {
  const session = await getManagerSession();
  const pending = listPendingLeaveForManager(session.employeeId);

  const items = await Promise.all(
    pending.map(async (item) => {
      const profile = await getEmployeeProfile(item.request.employeeId);
      return {
        request: item.request,
        leaveType: item.leaveType,
        balance: item.balance,
        employeeName: profile
          ? `${profile.person.firstName} ${profile.person.lastName}`
          : item.request.employeeId,
      };
    }),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Team Leave"
        description="Review leave for your direct reports. Approving deducts from the employee balance; reject requires a comment."
      />

      <LeaveApprovalList items={items} />
    </div>
  );
}
