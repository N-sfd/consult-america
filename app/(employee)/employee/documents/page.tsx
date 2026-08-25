import type { Metadata } from "next";

import EmployeeDocumentList from "@/components/documents/employee-document-list";
import { getEmployeeDocuments } from "@/lib/self-service";
import {
  requireEmployeeActor,
  requirePermission,
} from "@/lib/self-service/security";

export const metadata: Metadata = {
  title: "My Documents | ConsultAmerica",
};

export default function EmployeeDocumentsPage() {
  const actor = requireEmployeeActor();
  requirePermission(actor, "self.documents.read");
  const documents = getEmployeeDocuments(actor.session.employeeId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          My Documents
        </h1>
        <p className="mt-2 text-black/55">
          Only documents marked for employee visibility. Open uses a server
          authorization check.
        </p>
      </div>

      <EmployeeDocumentList documents={documents} />
    </div>
  );
}
