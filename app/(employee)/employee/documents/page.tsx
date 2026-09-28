import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";

import EmployeeDocumentList from "@/components/documents/employee-document-list";
import { getEmployeeDocuments } from "@/lib/self-service";
import {
  requireEmployeeActor,
  requirePermission,
} from "@/lib/self-service/security";

export const metadata: Metadata = {
  title: "My Documents | ConsultAmerica",
};

export default async function EmployeeDocumentsPage() {
  const actor = await requireEmployeeActor();
  requirePermission(actor, "self.documents.read");
  const documents = await getEmployeeDocuments(actor.session.employeeId);

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Documents"
        description="Only documents marked for employee visibility. Open uses a server authorization check."
      />

      <EmployeeDocumentList documents={documents} />
    </div>
  );
}
