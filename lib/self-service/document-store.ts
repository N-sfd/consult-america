import { seedEmployeeDocuments } from "@/data/self-service/seed";
import type { EmployeeDocumentView } from "@/types/self-service";
import { pushNotification } from "@/lib/self-service/workflow-store";

const documents: EmployeeDocumentView[] = structuredClone(seedEmployeeDocuments);

export function listAllDocuments() {
  return documents;
}

export function listDocumentsForEmployee(employeeId: string) {
  return documents.filter(
    (doc) =>
      doc.employeeId === employeeId &&
      (doc.visibility === "EMPLOYEE" || doc.visibility === "MANAGER_AND_HR"),
  );
}

export function getDocumentById(documentId: string) {
  return documents.find((doc) => doc.id === documentId);
}

function nowIso() {
  return new Date().toISOString();
}

export function acknowledgeDocument(input: {
  documentId: string;
  employeeId: string;
}) {
  const document = getDocumentById(input.documentId);
  if (!document) throw new Error("Document not found");
  if (document.employeeId !== input.employeeId) {
    throw new Error("Forbidden: cannot acknowledge another employee's document");
  }
  if (!document.requiresAcknowledgement) {
    throw new Error("This document does not require acknowledgement");
  }

  document.acknowledgedAt = nowIso();

  pushNotification({
    employeeId: input.employeeId,
    type: "DOCUMENT_ACKNOWLEDGED",
    title: "Document acknowledged",
    message: `You acknowledged ${document.documentType}.`,
    actionUrl: "/employee/documents",
    createdAt: document.acknowledgedAt,
  });

  return document;
}

/** Test-only: restore document store to seed state. */
export function resetDocumentStoreForTests() {
  documents.splice(0, documents.length, ...structuredClone(seedEmployeeDocuments));
}
