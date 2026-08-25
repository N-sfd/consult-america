"use server";

import {
  getAuthorizedEmployeeDocument,
  requireEmployeeActor,
  toActionErrorMessage,
} from "@/lib/self-service/security";

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
    const actor = requireEmployeeActor();
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
