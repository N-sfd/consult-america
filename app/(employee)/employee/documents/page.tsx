import type { Metadata } from "next";

import { getEmployeeDocuments } from "@/lib/self-service";
import { getEmployeeSession } from "@/lib/self-service/session";

export const metadata: Metadata = {
  title: "My Documents | ConsultAmerica",
};

export default function EmployeeDocumentsPage() {
  const session = getEmployeeSession();
  const documents = getEmployeeDocuments(session.employeeId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          My Documents
        </h1>
        <p className="mt-2 text-black/55">
          Documents marked for employee visibility. Upload and acknowledgement
          workflows continue in Phase 4D.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-black/45">
            <tr>
              <th className="px-4 py-3 font-medium">Document</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-black/5">
                <td className="px-4 py-4 font-medium">{doc.fileName}</td>
                <td className="px-4 py-4 text-black/55">{doc.documentType}</td>
                <td className="px-4 py-4 text-black/55">
                  {doc.uploadedAt.slice(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
