"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";
import {
  assertCandidateSelfAccess,
  requireCandidateActor,
  toCandidateActionErrorMessage,
} from "@/lib/candidate/security";
import {
  buildCandidateDocumentStoragePath,
  createCandidateDocumentSignedUrl,
  removeCandidateDocumentObject,
  uploadCandidateDocumentObject,
  validateCandidateDocumentFile,
} from "@/lib/storage/candidate-documents";
import type { Document, DocumentType } from "@/types/recruiting";

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

async function resolveProfileId(candidateId: string): Promise<string> {
  const client = getSupabaseServiceClient();
  if (!client) throw new Error("Supabase is not configured");

  const { data, error } = await client
    .from("candidate_profiles")
    .select("profile_id")
    .eq("id", candidateId)
    .maybeSingle();

  if (error || !data?.profile_id) {
    throw new Error("Candidate profile link is missing. Sign out and sign in again.");
  }
  return data.profile_id as string;
}

async function clearPrimaryResumeFlags(candidateId: string, exceptId?: string) {
  const client = getSupabaseServiceClient();
  if (!client) return;

  let query = client
    .from("documents")
    .update({ is_primary_resume: false, updated_at: new Date().toISOString() })
    .eq("candidate_id", candidateId)
    .eq("document_type", "RESUME")
    .eq("is_primary_resume", true);

  if (exceptId) query = query.neq("id", exceptId);
  await query;
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

    if (!(file instanceof File)) {
      return { ok: false, message: "Choose a file to upload." };
    }

    const documentType = documentTypeRaw.toUpperCase() as DocumentType;
    if (!UPLOADABLE_TYPES.includes(documentType)) {
      return { ok: false, message: "Unsupported document type." };
    }

    const validation = validateCandidateDocumentFile({
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      fileSize: file.size,
    });
    if (!validation.ok) return { ok: false, message: validation.error };
    const mimeType = validation.mimeType;

    const client = getSupabaseServiceClient();
    if (!client) {
      return {
        ok: false,
        message:
          "Document uploads require the connected candidate environment.",
      };
    }

    const profileId =
      actor.session.profileId ??
      (await resolveProfileId(actor.session.candidateId));
    const now = new Date().toISOString();
    const documentId = replaceDocumentId || `doc-${crypto.randomUUID()}`;
    const storagePath = buildCandidateDocumentStoragePath({
      profileId,
      documentId,
      fileName: file.name,
    });

    if (replaceDocumentId) {
      const { data: existing } = await client
        .from("documents")
        .select("*")
        .eq("id", replaceDocumentId)
        .maybeSingle();
      if (!existing) return { ok: false, message: "Document not found." };
      assertCandidateSelfAccess(
        actor.session.candidateId,
        existing.candidate_id as string,
      );

      const oldPath = existing.storage_path as string;
      const bytes = await file.arrayBuffer();
      await uploadCandidateDocumentObject({
        storagePath,
        bytes,
        mimeType,
      });

      const { error } = await client
        .from("documents")
        .update({
          file_name: file.name,
          storage_path: storagePath,
          mime_type: mimeType,
          file_size: file.size,
          document_type: documentType,
          status: "ACTIVE",
          is_primary_resume:
            documentType === "RESUME"
              ? true
              : Boolean(existing.is_primary_resume),
          updated_at: now,
          user_id: profileId,
        })
        .eq("id", replaceDocumentId);

      if (error) throw new Error(error.message);

      if (documentType === "RESUME") {
        await clearPrimaryResumeFlags(actor.session.candidateId, replaceDocumentId);
        await client
          .from("documents")
          .update({ is_primary_resume: true, updated_at: now })
          .eq("id", replaceDocumentId);
      }

      if (oldPath && oldPath !== storagePath) {
        await removeCandidateDocumentObject(oldPath);
      }

      revalidateDocumentViews(actor.session.candidateId);
      return {
        ok: true,
        message: "Document replaced.",
        documentId: replaceDocumentId,
      };
    }

    const bytes = await file.arrayBuffer();
    await uploadCandidateDocumentObject({
      storagePath,
      bytes,
      mimeType,
    });

    const isPrimaryResume = documentType === "RESUME";
    if (isPrimaryResume) {
      await clearPrimaryResumeFlags(actor.session.candidateId);
    }

    const { error: insertError } = await client.from("documents").insert({
      id: documentId,
      candidate_id: actor.session.candidateId,
      user_id: profileId,
      document_type: documentType,
      file_name: file.name,
      storage_path: storagePath,
      mime_type: mimeType,
      file_size: file.size,
      uploaded_at: now,
      updated_at: now,
      is_primary_resume: isPrimaryResume,
      status: "ACTIVE",
    });

    if (insertError) {
      await removeCandidateDocumentObject(storagePath);
      throw new Error(insertError.message);
    }

    if (applicationId) {
      await client.from("application_documents").upsert(
        {
          id: `appdoc-${crypto.randomUUID()}`,
          application_id: applicationId,
          document_id: documentId,
          created_at: now,
        },
        { onConflict: "application_id,document_id" },
      );
    }

    revalidateDocumentViews(actor.session.candidateId);
    return {
      ok: true,
      message:
        documentType === "RESUME"
          ? "Resume uploaded."
          : "Document uploaded.",
      documentId,
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
    const client = getSupabaseServiceClient();
    if (!client) {
      return {
        ok: false,
        message:
          "Document uploads require the connected candidate environment.",
      };
    }

    const { data: existing } = await client
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .maybeSingle();

    if (!existing) return { ok: false, message: "Document not found." };
    assertCandidateSelfAccess(
      actor.session.candidateId,
      existing.candidate_id as string,
    );

    const now = new Date().toISOString();
    await client
      .from("documents")
      .update({
        status: "DELETED",
        is_primary_resume: false,
        updated_at: now,
      })
      .eq("id", documentId);

    await client
      .from("application_documents")
      .delete()
      .eq("document_id", documentId);

    if (existing.storage_path) {
      await removeCandidateDocumentObject(existing.storage_path as string);
    }

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
    const client = getSupabaseServiceClient();
    if (!client) {
      return {
        ok: false,
        message:
          "Document access requires the connected candidate environment.",
      };
    }

    const { data: existing } = await client
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .maybeSingle();

    if (!existing || existing.status === "DELETED") {
      return { ok: false, message: "Document not found." };
    }
    assertCandidateSelfAccess(
      actor.session.candidateId,
      existing.candidate_id as string,
    );

    const signedUrl = await createCandidateDocumentSignedUrl(
      existing.storage_path as string,
      180,
    );
    return { ok: true, message: "OK", signedUrl, documentId };
  } catch (error) {
    return {
      ok: false,
      message: toCandidateActionErrorMessage(error, "Unable to open document."),
    };
  }
}

/** Recruiter/staff signed access — requires authorized recruiting/HR role. */
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

    const client = getSupabaseServiceClient();
    if (!client) {
      return {
        ok: false,
        message: "Document access requires the connected environment.",
      };
    }

    const { data: existing } = await client
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .maybeSingle();

    if (!existing || existing.status === "DELETED") {
      return { ok: false, message: "Document not found." };
    }

    const signedUrl = await createCandidateDocumentSignedUrl(
      existing.storage_path as string,
      180,
    );
    return { ok: true, message: "OK", signedUrl, documentId };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to open document.",
    };
  }
}

/**
 * Service-role helper used by job apply: store a resume for a candidate and
 * link it to an application. Does not require an active candidate session
 * (covers guest apply after portal provisioning).
 */
export async function persistResumeForApplication(input: {
  candidateId: string;
  applicationId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  bytes: ArrayBuffer;
  setAsPrimary?: boolean;
}): Promise<{ ok: true; documentId: string } | { ok: false; message: string }> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Document uploads require the connected candidate environment.",
    };
  }

  const validation = validateCandidateDocumentFile({
    fileName: input.fileName,
    mimeType: input.mimeType,
    fileSize: input.fileSize,
  });
  if (!validation.ok) return { ok: false, message: validation.error };

  const client = getSupabaseServiceClient();
  if (!client) {
    return {
      ok: false,
      message: "Document uploads require the connected candidate environment.",
    };
  }

  const profileId = await resolveProfileId(input.candidateId);
  const now = new Date().toISOString();
  const documentId = `doc-${crypto.randomUUID()}`;
  const storagePath = buildCandidateDocumentStoragePath({
    profileId,
    documentId,
    fileName: input.fileName,
  });

  await uploadCandidateDocumentObject({
    storagePath,
    bytes: input.bytes,
    mimeType: validation.mimeType,
  });

  if (input.setAsPrimary !== false) {
    await clearPrimaryResumeFlags(input.candidateId);
  }

  const { error: insertError } = await client.from("documents").insert({
    id: documentId,
    candidate_id: input.candidateId,
    user_id: profileId,
    document_type: "RESUME",
    file_name: input.fileName,
    storage_path: storagePath,
    mime_type: validation.mimeType,
    file_size: input.fileSize,
    uploaded_at: now,
    updated_at: now,
    is_primary_resume: input.setAsPrimary !== false,
    status: "ACTIVE",
  });

  if (insertError) {
    await removeCandidateDocumentObject(storagePath);
    return { ok: false, message: insertError.message };
  }

  await client.from("application_documents").upsert(
    {
      id: `appdoc-${crypto.randomUUID()}`,
      application_id: input.applicationId,
      document_id: documentId,
      created_at: now,
    },
    { onConflict: "application_id,document_id" },
  );

  revalidateDocumentViews(input.candidateId);
  return { ok: true, documentId };
}

export async function linkExistingDocumentToApplication(input: {
  candidateId: string;
  applicationId: string;
  documentId: string;
}): Promise<CandidateDocumentActionResult> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        ok: false,
        message: "Document linking requires the connected environment.",
      };
    }

    const client = getSupabaseServiceClient();
    if (!client) {
      return {
        ok: false,
        message: "Document linking requires the connected environment.",
      };
    }

    const { data: existing } = await client
      .from("documents")
      .select("*")
      .eq("id", input.documentId)
      .maybeSingle();

    if (!existing || existing.status === "DELETED") {
      return { ok: false, message: "Document not found." };
    }
    if ((existing.candidate_id as string) !== input.candidateId) {
      return { ok: false, message: "Forbidden." };
    }

    await client.from("application_documents").upsert(
      {
        id: `appdoc-${crypto.randomUUID()}`,
        application_id: input.applicationId,
        document_id: input.documentId,
        created_at: new Date().toISOString(),
      },
      { onConflict: "application_id,document_id" },
    );

    revalidateDocumentViews(input.candidateId);
    return { ok: true, message: "Document linked to application.", documentId: input.documentId };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to link document.",
    };
  }
}

export type ListedCandidateDocument = Document;

export async function listActiveCandidateDocuments(
  candidateId: string,
): Promise<ListedCandidateDocument[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  const { data } = await client
    .from("documents")
    .select("*")
    .eq("candidate_id", candidateId)
    .neq("status", "DELETED")
    .order("uploaded_at", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id as string,
    candidateId: row.candidate_id as string,
    userId: (row.user_id as string) ?? undefined,
    documentType: row.document_type as DocumentType,
    fileName: row.file_name as string,
    storagePath: row.storage_path as string,
    mimeType: (row.mime_type as string) ?? undefined,
    fileSize: (row.file_size as number) ?? undefined,
    uploadedAt: row.uploaded_at as string,
    updatedAt: (row.updated_at as string) ?? undefined,
    isPrimaryResume: Boolean(row.is_primary_resume),
    status: (row.status as Document["status"]) ?? "ACTIVE",
  }));
}
