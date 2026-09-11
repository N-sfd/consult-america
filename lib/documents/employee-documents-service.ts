/**
 * Single source of truth for employee HR document metadata + private storage.
 *
 * Canonical table: `employee_documents` (db/schema/005_self_service.sql).
 * Backs both the HR-side Workforce -> People -> Employee Detail -> Documents
 * tab and the self-service `/employee/documents` page.
 */

import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";
import { writeAuditEvent, type AuditActorRole } from "@/lib/audit/audit-log";
import {
  buildEmployeeDocumentStoragePath,
  createEmployeeDocumentSignedUrl,
  removeEmployeeDocumentObject,
  uploadEmployeeDocumentObject,
  validateEmployeeDocumentFile,
} from "@/lib/storage/employee-documents";
import type { DocumentCategory } from "@/types/self-service";

export type EmployeeDocumentType =
  | "RESUME"
  | "OFFER_LETTER"
  | "EMPLOYMENT_AGREEMENT"
  | "WORK_AUTHORIZATION"
  | "CERTIFICATION"
  | "POLICY_ACKNOWLEDGEMENT"
  | "OTHER";

export type EmployeeDocumentVisibility =
  | "HR_ONLY"
  | "EMPLOYEE"
  | "MANAGER_AND_HR"
  | "PAYROLL_ONLY";

export type EmployeeDocumentRow = {
  id: string;
  employeeId: string;
  documentType: EmployeeDocumentType;
  fileName: string;
  storagePath: string;
  visibility: EmployeeDocumentVisibility;
  uploadedBy?: string;
  uploadedAt: string;
  effectiveDate?: string;
  expirationDate?: string;
  status: "ACTIVE" | "ARCHIVED";
  requiresAcknowledgement: boolean;
  acknowledgedAt?: string;
};

/** Display labels — single source of truth for HR upload UI + self-service view. */
export const employeeDocumentTypeLabels: Record<EmployeeDocumentType, string> = {
  RESUME: "Resume",
  OFFER_LETTER: "Offer Letter",
  EMPLOYMENT_AGREEMENT: "Employment Agreement",
  WORK_AUTHORIZATION: "Work Authorization",
  CERTIFICATION: "Certification",
  POLICY_ACKNOWLEDGEMENT: "Policy Acknowledgement",
  OTHER: "Other",
};

/** Self-service tab grouping for each document type. */
export const employeeDocumentCategories: Record<EmployeeDocumentType, DocumentCategory> = {
  RESUME: "EMPLOYMENT",
  OFFER_LETTER: "EMPLOYMENT",
  EMPLOYMENT_AGREEMENT: "EMPLOYMENT",
  WORK_AUTHORIZATION: "PERSONAL",
  CERTIFICATION: "CERTIFICATION",
  POLICY_ACKNOWLEDGEMENT: "POLICY",
  OTHER: "PERSONAL",
};

export const documentVisibilityLabels: Record<EmployeeDocumentVisibility, string> = {
  HR_ONLY: "HR Only",
  EMPLOYEE: "Employee",
  MANAGER_AND_HR: "Employee + Manager",
  PAYROLL_ONLY: "Payroll Only",
};

function mapRow(row: Record<string, unknown>): EmployeeDocumentRow {
  return {
    id: row.id as string,
    employeeId: row.employee_id as string,
    documentType: row.document_type as EmployeeDocumentType,
    fileName: row.file_name as string,
    storagePath: row.storage_path as string,
    visibility: row.visibility as EmployeeDocumentVisibility,
    uploadedBy: (row.uploaded_by as string) ?? undefined,
    uploadedAt: row.uploaded_at as string,
    effectiveDate: (row.effective_date as string) ?? undefined,
    expirationDate: (row.expiration_date as string) ?? undefined,
    status: (row.status as EmployeeDocumentRow["status"]) ?? "ACTIVE",
    requiresAcknowledgement: Boolean(row.requires_acknowledgement),
    acknowledgedAt: (row.acknowledged_at as string) ?? undefined,
  };
}

export async function getEmployeeDocuments(
  employeeId: string,
  options?: { includeArchived?: boolean },
): Promise<EmployeeDocumentRow[]> {
  const client = getSupabaseServiceClient();
  if (!client) return [];

  let query = client
    .from("employee_documents")
    .select("*")
    .eq("employee_id", employeeId)
    .order("uploaded_at", { ascending: false });

  if (!options?.includeArchived) {
    query = query.eq("status", "ACTIVE");
  }

  const { data } = await query;
  return (data ?? []).map(mapRow);
}

export async function uploadEmployeeDocument(input: {
  employeeId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  bytes: ArrayBuffer | Buffer | Uint8Array;
  documentType: EmployeeDocumentType;
  visibility?: EmployeeDocumentVisibility;
  requiresAcknowledgement?: boolean;
  effectiveDate?: string;
  expirationDate?: string;
  uploadedByUserId: string;
  actorEmployeeId: string;
  actorRole: AuditActorRole;
}): Promise<{ ok: true; documentId: string } | { ok: false; message: string }> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Document uploads require the connected environment.",
    };
  }

  const validation = validateEmployeeDocumentFile({
    fileName: input.fileName,
    mimeType: input.mimeType,
    fileSize: input.fileSize,
  });
  if (!validation.ok) return { ok: false, message: validation.error };

  const client = getSupabaseServiceClient();
  if (!client) {
    return { ok: false, message: "Document uploads require the connected environment." };
  }

  const now = new Date().toISOString();
  const documentId = `empdoc-${crypto.randomUUID()}`;
  const storagePath = buildEmployeeDocumentStoragePath({
    employeeId: input.employeeId,
    documentId,
    fileName: input.fileName,
  });

  await uploadEmployeeDocumentObject({
    storagePath,
    bytes: input.bytes,
    mimeType: validation.mimeType,
  });

  const { error: insertError } = await client.from("employee_documents").insert({
    id: documentId,
    employee_id: input.employeeId,
    document_type: input.documentType,
    file_name: input.fileName,
    storage_path: storagePath,
    visibility: input.visibility ?? "HR_ONLY",
    uploaded_by: input.uploadedByUserId,
    uploaded_at: now,
    effective_date: input.effectiveDate ?? null,
    expiration_date: input.expirationDate ?? null,
    status: "ACTIVE",
    requires_acknowledgement: input.requiresAcknowledgement ?? false,
  });

  if (insertError) {
    await removeEmployeeDocumentObject(storagePath);
    return { ok: false, message: insertError.message };
  }

  await writeAuditEvent({
    eventType: "DOCUMENT_UPLOADED",
    actorEmployeeId: input.actorEmployeeId,
    actorRole: input.actorRole,
    targetEmployeeId: input.employeeId,
    resourceType: "employee_document",
    resourceId: documentId,
    summary: `Uploaded ${input.documentType} document for employee ${input.employeeId}`,
    metadata: { documentType: input.documentType, fileName: input.fileName },
  });

  return { ok: true, documentId };
}

export async function archiveEmployeeDocument(input: {
  employeeId: string;
  documentId: string;
  actorEmployeeId: string;
  actorRole: AuditActorRole;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const client = getSupabaseServiceClient();
  if (!client) {
    return { ok: false, message: "Document access requires the connected environment." };
  }

  const { data: existing } = await client
    .from("employee_documents")
    .select("employee_id, document_type")
    .eq("id", input.documentId)
    .maybeSingle();

  if (!existing) return { ok: false, message: "Document not found." };
  if ((existing.employee_id as string) !== input.employeeId) {
    return { ok: false, message: "Forbidden." };
  }

  const { error } = await client
    .from("employee_documents")
    .update({ status: "ARCHIVED" })
    .eq("id", input.documentId);

  if (error) return { ok: false, message: error.message };

  await writeAuditEvent({
    eventType: "DOCUMENT_ARCHIVED",
    actorEmployeeId: input.actorEmployeeId,
    actorRole: input.actorRole,
    targetEmployeeId: input.employeeId,
    resourceType: "employee_document",
    resourceId: input.documentId,
    summary: `Archived ${existing.document_type as string} document for employee ${input.employeeId}`,
  });

  return { ok: true };
}

/** Fetch a single document by id, regardless of employee — callers must
 * verify ownership themselves (see lib/self-service/security.ts). */
export async function getEmployeeDocumentById(
  documentId: string,
): Promise<EmployeeDocumentRow | null> {
  const client = getSupabaseServiceClient();
  if (!client) return null;

  const { data } = await client
    .from("employee_documents")
    .select("*")
    .eq("id", documentId)
    .maybeSingle();

  return data ? mapRow(data) : null;
}

export async function acknowledgeEmployeeDocument(input: {
  documentId: string;
  employeeId: string;
  actorRole: AuditActorRole;
}): Promise<{ ok: true; acknowledgedAt: string } | { ok: false; message: string }> {
  const client = getSupabaseServiceClient();
  if (!client) {
    return { ok: false, message: "Document access requires the connected environment." };
  }

  const document = await getEmployeeDocumentById(input.documentId);
  if (!document) return { ok: false, message: "Document not found." };
  if (document.employeeId !== input.employeeId) {
    return { ok: false, message: "Forbidden." };
  }
  if (!document.requiresAcknowledgement) {
    return { ok: false, message: "This document does not require acknowledgement." };
  }

  const acknowledgedAt = new Date().toISOString();
  const { error } = await client
    .from("employee_documents")
    .update({ acknowledged_at: acknowledgedAt })
    .eq("id", input.documentId);

  if (error) return { ok: false, message: error.message };

  await writeAuditEvent({
    eventType: "DOCUMENT_ACKNOWLEDGED",
    actorEmployeeId: input.employeeId,
    actorRole: input.actorRole,
    targetEmployeeId: input.employeeId,
    resourceType: "employee_document",
    resourceId: input.documentId,
    summary: `Acknowledged ${document.documentType} document`,
  });

  return { ok: true, acknowledgedAt };
}

export async function getEmployeeDocumentSignedUrl(
  documentId: string,
  expiresInSeconds = 180,
): Promise<{ ok: true; signedUrl: string } | { ok: false; message: string }> {
  const client = getSupabaseServiceClient();
  if (!client) {
    return { ok: false, message: "Document access requires the connected environment." };
  }

  const { data: existing } = await client
    .from("employee_documents")
    .select("storage_path, status")
    .eq("id", documentId)
    .maybeSingle();

  if (!existing) return { ok: false, message: "Document not found." };

  try {
    const signedUrl = await createEmployeeDocumentSignedUrl(
      existing.storage_path as string,
      expiresInSeconds,
    );
    return { ok: true, signedUrl };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to open document.",
    };
  }
}

export function isEmployeeDocumentsReady() {
  return isSupabaseConfigured();
}
