import type { Metadata } from "next";

import LeaveApprovalList from "@/components/leave/leave-approval-list";
import { getEmployeeProfile } from "@/lib/self-service";
import { listPendingLeaveForManager } from "@/lib/self-service/leave-store";
import { getManagerSession } from "@/lib/self-service/session";

export const metadata: Metadata = {
  title: "Team Leave | ConsultAmerica",
};

export default async function ManagerLeavePage() {
  const session = getManagerSession();
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
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Team Leave</h1>
        <p className="mt-2 text-black/55">
          Review leave for your direct reports. Approving deducts from the
          employee balance; reject requires a comment.
        </p>
      </div>

      <LeaveApprovalList items={items} />
    </div>
  );
}
