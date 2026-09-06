"use server";

import { revalidatePath } from "next/cache";

import { isSupabaseConfigured } from "@/app/lib/supabase/server";
import {
  assertCandidateSelfAccess,
  requireCandidateActor,
  toCandidateActionErrorMessage,
} from "@/lib/candidate/security";
import {
  deleteCandidateDocument,
  getCandidateDocuments,
  getSignedDocumentUrl,
  linkDocumentToApplication,
  replacePrimaryResume,
  uploadCandidateDocument,
  type CandidateDocumentRow,
} from "@/lib/documents/candidate-documents-service";
import type { DocumentType } from "@/types/recruiting";

export type CandidateDocumentActionResult = {
  ok: boolean;
  message: string;
  documentId?: string;
  signedUrl?: string;
};

const UPLOADABLE_TYPES: DocumentType[] = [
  "RESUME",
  "COVER_LETTER",
  "PORTFOLIO",
  "TRANSCRIPT",
  "CERTIFICATION",
  "OTHER",
];

function revalidateDocumentViews(candidateId: string) {
  revalidatePath("/candidate/documents");
  revalidatePath("/candidate");
  revalidatePath(`/app/recruiting/candidates/${candidateId}`);
}

export async function uploadCandidateDocumentAction(
  formData: FormData,
): Promise<CandidateDocumentActionResult> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        ok: false,
        message:
          "Document uploads require the connected candidate environment.",
      };
    }

    const actor = await requireCandidateActor();
    const file = formData.get("file");
    const documentTypeRaw = String(formData.get("documentType") ?? "RESUME");
    const replaceDocumentId = String(formData.get("replaceDocumentId") ?? "");
    const applicationId = String(formData.get("applicationId") ?? "");
    const setAsPrimaryRaw = String(formData.get("setAsPrimary") ?? "");

    if (!(file instanceof File)) {
      return { ok: false, message: "Choose a file to upload." };
    }

    const documentType = documentTypeRaw.toUpperCase() as DocumentType;
    if (!UPLOADABLE_TYPES.includes(documentType)) {
      return { ok: false, message: "Unsupported document type." };
    }

    const bytes = await file.arrayBuffer();
    const profileId = actor.session.profileId;

    if (replaceDocumentId || (documentType === "RESUME" && formData.get("replacePrimary") === "1")) {
      if (replaceDocumentId) {
        const docs = await getCandidateDocuments(actor.session.candidateId);
        const existing = docs.find((d) => d.id === replaceDocumentId);
        // May already be archived from list race — ownership checked in service.
        if (existing) {
          assertCandidateSelfAccess(
            actor.session.candidateId,
            existing.candidateId,
          );
        }
      }

      const result = await replacePrimaryResume({
        candidateId: actor.session.candidateId,
        profileId,
        previousDocumentId: replaceDocumentId || undefined,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        fileSize: file.size,
        bytes,
        uploadedByUserId: profileId,
      });

      if (!result.ok) return { ok: false, message: result.message };
      revalidateDocumentViews(actor.session.candidateId);
      return {
        ok: true,
        message: "Resume replaced.",
        documentId: result.documentId,
      };
    }

    const setAsPrimary =
      setAsPrimaryRaw === "0"
        ? false
        : setAsPrimaryRaw === "1"
          ? true
          : documentType === "RESUME";

    const result = await uploadCandidateDocument({
      candidateId: actor.session.candidateId,
      profileId,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      fileSize: file.size,
      bytes,
      documentType,
      applicationId: applicationId || undefined,
      setAsPrimary,
      uploadedByUserId: profileId,
    });

    if (!result.ok) return { ok: false, message: result.message };
    revalidateDocumentViews(actor.session.candidateId);
    return {
      ok: true,
      message: documentType === "RESUME" ? "Resume uploaded." : "Document uploaded.",
      documentId: result.documentId,
    };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to upload document."),
    };
  }
}

export async function deleteCandidateDocumentAction(
  documentId: string,
): Promise<CandidateDocumentActionResult> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        ok: false,
        message:
          "Document uploads require the connected candidate environment.",
      };
    }

    const actor = await requireCandidateActor();
    const result = await deleteCandidateDocument({
      candidateId: actor.session.candidateId,
      documentId,
    });
    if (!result.ok) return { ok: false, message: result.message };
    revalidateDocumentViews(actor.session.candidateId);
    return { ok: true, message: "Document deleted." };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to delete document."),
    };
  }
}

export async function getCandidateDocumentSignedUrlAction(
  documentId: string,
): Promise<CandidateDocumentActionResult> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        ok: false,
        message:
          "Document access requires the connected candidate environment.",
      };
    }

    const actor = await requireCandidateActor();
    const docs = await getCandidateDocuments(actor.session.candidateId, {
      includeArchived: true,
    });
    const existing = docs.find((d) => d.id === documentId);
    if (!existing) {
      // Still allow lookup via signed URL helper ownership check
      const { getSupabaseServiceClient } = await import(
        "@/app/lib/supabase/server"
      );
      const client = getSupabaseServiceClient();
      const { data } = await client!
        .from("documents")
        .select("candidate_id, status")
        .eq("id", documentId)
        .maybeSingle();
      if (!data || data.status === "DELETED") {
        return { ok: false, message: "Document not found." };
      }
      assertCandidateSelfAccess(
        actor.session.candidateId,
        data.candidate_id as string,
      );
    } else {
      assertCandidateSelfAccess(actor.session.candidateId, existing.candidateId);
    }

    const result = await getSignedDocumentUrl(documentId);
    if (!result.ok) return { ok: false, message: result.message };
    return { ok: true, message: "OK", signedUrl: result.signedUrl, documentId };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to open document."),
    };
  }
}

export async function getStaffCandidateDocumentSignedUrlAction(
  documentId: string,
): Promise<CandidateDocumentActionResult> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        ok: false,
        message: "Document access requires the connected environment.",
      };
    }

    const { getAuthenticatedPlatformUser } = await import(
      "@/lib/auth/current-user"
    );
    const user = await getAuthenticatedPlatformUser();
    const allowed = new Set([
      "RECRUITER",
      "HIRING_MANAGER",
      "HR_ADMIN",
      "HR_SPECIALIST",
      "SYSTEM_ADMIN",
    ]);
    if (!user || !user.roles.some((role) => allowed.has(role))) {
      return { ok: false, message: "Forbidden." };
    }

    const result = await getSignedDocumentUrl(documentId);
    if (!result.ok) return { ok: false, message: result.message };
    return { ok: true, message: "OK", signedUrl: result.signedUrl, documentId };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to open document.",
    };
  }
}

/** @deprecated Prefer lib/documents/candidate-documents-service */
export async function persistResumeForApplication(input: {
  candidateId: string;
  applicationId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  bytes: ArrayBuffer;
  setAsPrimary?: boolean;
}): Promise<{ ok: true; documentId: string } | { ok: false; message: string }> {
  const result = await uploadCandidateDocument({
    candidateId: input.candidateId,
    fileName: input.fileName,
    mimeType: input.mimeType,
    fileSize: input.fileSize,
    bytes: input.bytes,
    documentType: "RESUME",
    applicationId: input.applicationId,
    purpose: "RESUME",
    setAsPrimary: input.setAsPrimary,
  });
  if (result.ok) revalidateDocumentViews(input.candidateId);
  return result;
}

export async function linkExistingDocumentToApplication(input: {
  candidateId: string;
  applicationId: string;
  documentId: string;
}): Promise<CandidateDocumentActionResult> {
  const result = await linkDocumentToApplication({
    ...input,
    purpose: "RESUME",
  });
  if (!result.ok) return { ok: false, message: result.message };
  revalidateDocumentViews(input.candidateId);
  return {
    ok: true,
    message: "Document linked to application.",
    documentId: result.documentId,
  };
}

export type ListedCandidateDocument = CandidateDocumentRow;

export async function listActiveCandidateDocuments(
  candidateId: string,
): Promise<ListedCandidateDocument[]> {
  return getCandidateDocuments(candidateId);
}
