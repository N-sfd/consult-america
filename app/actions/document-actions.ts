"use server";

import { revalidatePath } from "next/cache";

import {
  getAuthorizedEmployeeDocument,
  requireEmployeeActor,
  toActionErrorMessage,
} from "@/lib/self-service/security";
import { acknowledgeDocument } from "@/lib/self-service/document-store";

export type DocumentActionResult = {
  ok: boolean;
  message: string;
  fileName?: string;
};

/** Server-side document access check — prevents IDOR by document id alone. */
export async function viewEmployeeDocumentAction(input: {
  documentId: string;
}): Promise<DocumentActionResult> {
  try {
    const actor = await requireEmployeeActor();
    const document = getAuthorizedEmployeeDocument(actor, input.documentId);
    return {
      ok: true,
      message: `Authorized access to ${document.fileName}`,
      fileName: document.fileName,
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
    const document = getAuthorizedEmployeeDocument(actor, input.documentId);
    acknowledgeDocument({
      documentId: document.id,
      employeeId: actor.session.employeeId,
    });
    revalidatePath("/employee/documents");
    revalidatePath("/employee");
    return { ok: true, message: `Acknowledged ${document.documentType}.` };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to acknowledge document."),
    };
  }
}
