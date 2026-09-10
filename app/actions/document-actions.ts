"use server";

import { revalidatePath } from "next/cache";

import {
  getAuthorizedEmployeeDocument,
  requireEmployeeActor,
  toActionErrorMessage,
} from "@/lib/self-service/security";
import {
  acknowledgeEmployeeDocument,
  employeeDocumentTypeLabels,
  getEmployeeDocumentSignedUrl,
} from "@/lib/documents/employee-documents-service";
import { pushNotification } from "@/lib/self-service/workflow-store";

export type DocumentActionResult = {
  ok: boolean;
  message: string;
  fileName?: string;
  signedUrl?: string;
};

/** Server-side document access check — prevents IDOR by document id alone. */
export async function viewEmployeeDocumentAction(input: {
  documentId: string;
}): Promise<DocumentActionResult> {
  try {
    const actor = await requireEmployeeActor();
    const document = await getAuthorizedEmployeeDocument(actor, input.documentId);
    const signedUrl = await getEmployeeDocumentSignedUrl(document.id);
    if (!signedUrl.ok) {
      return { ok: false, message: signedUrl.message };
    }
    return {
      ok: true,
      message: `Opening ${document.fileName}`,
      fileName: document.fileName,
      signedUrl: signedUrl.signedUrl,
    };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to open document."),
    };
  }
}

export async function acknowledgeDocumentAction(input: {
  documentId: string;
}): Promise<DocumentActionResult> {
  try {
    const actor = await requireEmployeeActor();
    const document = await getAuthorizedEmployeeDocument(actor, input.documentId);
    const result = await acknowledgeEmployeeDocument({
      documentId: document.id,
      employeeId: actor.session.employeeId,
      actorRole: actor.role,
    });
    if (!result.ok) {
      return { ok: false, message: result.message };
    }
    const label = employeeDocumentTypeLabels[document.documentType];
    pushNotification({
      employeeId: actor.session.employeeId,
      type: "DOCUMENT_ACKNOWLEDGED",
      title: "Document acknowledged",
      message: `You acknowledged ${label}.`,
      actionUrl: "/employee/documents",
      createdAt: result.acknowledgedAt,
    });
    revalidatePath("/employee/documents");
    revalidatePath("/employee");
    return { ok: true, message: `Acknowledged ${label}.` };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to acknowledge document."),
    };
  }
}
