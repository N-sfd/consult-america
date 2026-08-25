import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import HrRequestThread from "@/components/hr-requests/hr-request-thread";
import {
  getHrRequestById,
  listHrRequestMessages,
} from "@/lib/self-service/hr-request-store";
import { getEmployeeSession } from "@/lib/self-service/session";

type Params = Promise<{ id: string }>;

export const metadata: Metadata = {
  title: "HR Request | ConsultAmerica",
};

export default async function EmployeeHrRequestDetailPage({
  params,
}: {
  params: Params;
}) {
  const session = getEmployeeSession();
  const { id } = await params;
  const request = getHrRequestById(id);

  if (!request || request.employeeId !== session.employeeId) {
    notFound();
  }

  const messages = listHrRequestMessages(request.id);

  return (
    <div className="space-y-6">
      <Link
        href="/employee/requests"
        className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
      >
        ← Back to HR Requests
      </Link>
      <HrRequestThread
        request={request}
        messages={messages}
        mode="employee"
        employeeName={session.displayName}
      />
    </div>
  );
}
