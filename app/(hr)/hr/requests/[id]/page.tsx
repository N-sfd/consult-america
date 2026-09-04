import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import HrRequestThread from "@/components/hr-requests/hr-request-thread";
import { hrRepository } from "@/lib/hr";
import {
  getHrRequestById,
  listHrRequestMessages,
} from "@/lib/self-service/hr-request-store";
import {
  requireHrActor,
  requirePermission,
} from "@/lib/self-service/security";

type Params = Promise<{ id: string }>;

export const metadata: Metadata = {
  title: "HR Request Detail | ConsultAmerica",
};

export default async function HrRequestDetailPage({
  params,
}: {
  params: Params;
}) {
  const actor = await requireHrActor();
  requirePermission(actor, "hr_request.read");

  const { id } = await params;
  const request = getHrRequestById(id);
  if (!request) notFound();

  const messages = listHrRequestMessages(request.id);
  const employee = await hrRepository.getEmployeeById(request.employeeId);
  const employeeName = employee
    ? `${employee.firstName} ${employee.lastName}`
    : request.employeeId;

  return (
    <div className="space-y-6">
      <Link
        href="/hr/requests"
        className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
      >
        ← Back to queue
      </Link>
      <HrRequestThread
        request={request}
        messages={messages}
        mode="hr"
        employeeName={employeeName}
      />
    </div>
  );
}
