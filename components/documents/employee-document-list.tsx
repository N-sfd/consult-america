"use client";

import { useState, useTransition } from "react";

import { viewEmployeeDocumentAction } from "@/app/actions/document-actions";
import type { EmployeeDocumentView } from "@/types/self-service";

export default function EmployeeDocumentList({
  documents,
}: {
  documents: EmployeeDocumentView[];
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openDocument(documentId: string) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await viewEmployeeDocumentAction({ documentId });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-black/45">
            <tr>
              <th className="px-4 py-3 font-medium">Document</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Uploaded</th>
              <th className="px-4 py-3 font-medium">Access</th>
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
                <td className="px-4 py-4">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => openDocument(doc.id)}
                    className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium hover:bg-black/[0.03] disabled:opacity-50"
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-black/50">
                  No documents available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {message && (
        <p className="text-sm text-emerald-700" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <p className="text-xs text-black/40">
        Document access is checked server-side. Changing a document id cannot
        reveal another employee&apos;s file.
      </p>
    </div>
  );
}
