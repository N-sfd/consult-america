"use server";

import { revalidatePath } from "next/cache";

import {
  archiveEmployeeDocument,
  getEmployeeDocumentSignedUrl,
  uploadEmployeeDocument,
  type EmployeeDocumentType,
} from "@/lib/documents/employee-documents-service";
import { requireHrActor, toActionErrorMessage } from "@/lib/self-service/security";

export type EmployeeDocumentActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function uploadEmployeeDocumentAction(
  formData: FormData,
): Promise<EmployeeDocumentActionResult> {
  try {
    const actor = await requireHrActor();
    const employeeId = String(formData.get("employeeId") ?? "");
    const documentType = String(formData.get("documentType") ?? "OTHER") as EmployeeDocumentType;
    const file = formData.get("file") as File | null;

    if (!employeeId || !file) {
      return { ok: false, error: "Select a file to upload." };
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const result = await uploadEmployeeDocument({
      employeeId,
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      bytes,
      documentType,
      uploadedByUserId: actor.session.employeeId,
      actorEmployeeId: actor.session.employeeId,
      actorRole: actor.role,
    });

    if (!result.ok) return { ok: false, error: result.message };

    revalidatePath(`/workforce/people/${employeeId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toActionErrorMessage(error, "Unable to upload document.") };
  }
}

export async function archiveEmployeeDocumentAction(
  employeeId: string,
  documentId: string,
): Promise<EmployeeDocumentActionResult> {
  try {
    const actor = await requireHrActor();
    const result = await archiveEmployeeDocument({
      employeeId,
      documentId,
      actorEmployeeId: actor.session.employeeId,
      actorRole: actor.role,
    });
    if (!result.ok) return { ok: false, error: result.message };

    revalidatePath(`/workforce/people/${employeeId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toActionErrorMessage(error, "Unable to archive document.") };
  }
}

export async function getEmployeeDocumentUrlAction(
  documentId: string,
): Promise<{ ok: true; signedUrl: string } | { ok: false; error: string }> {
  try {
    await requireHrActor();
    const result = await getEmployeeDocumentSignedUrl(documentId);
    if (!result.ok) return { ok: false, error: result.message };
    return { ok: true, signedUrl: result.signedUrl };
  } catch (error) {
    return { ok: false, error: toActionErrorMessage(error, "Unable to open document.") };
  }
}
