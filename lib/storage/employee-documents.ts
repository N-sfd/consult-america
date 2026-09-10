import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";

export const EMPLOYEE_DOCUMENTS_BUCKET = "employee-documents";
export const MAX_EMPLOYEE_DOCUMENT_BYTES = 10 * 1024 * 1024;

export const ALLOWED_EMPLOYEE_DOCUMENT_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
]);

const EXT_BY_MIME: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
};

export function sanitizeDocumentFileName(name: string): string {
  return name
    .trim()
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 160);
}

function inferMimeFromFileName(fileName: string): string | null {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".doc")) return "application/msword";
  if (lower.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return null;
}

export function resolveEmployeeDocumentMimeType(
  fileName: string,
  mimeType: string,
): string | null {
  if (ALLOWED_EMPLOYEE_DOCUMENT_MIME.has(mimeType)) return mimeType;
  if (
    !mimeType ||
    mimeType === "application/octet-stream" ||
    mimeType === "binary/octet-stream"
  ) {
    return inferMimeFromFileName(fileName);
  }
  return null;
}

export function validateEmployeeDocumentFile(input: {
  fileName: string;
  mimeType: string;
  fileSize: number;
}): { ok: true; mimeType: string } | { ok: false; error: string } {
  if (input.fileSize <= 0) {
    return { ok: false, error: "The selected file is empty." };
  }
  if (input.fileSize > MAX_EMPLOYEE_DOCUMENT_BYTES) {
    return { ok: false, error: "File is larger than 10MB. Choose a smaller file." };
  }
  const mimeType = resolveEmployeeDocumentMimeType(input.fileName, input.mimeType);
  if (!mimeType) {
    return {
      ok: false,
      error: "Only PDF, DOC, DOCX, PNG, and JPG files are accepted.",
    };
  }
  const lower = input.fileName.toLowerCase();
  const allowedExt = EXT_BY_MIME[mimeType] ?? [];
  if (!allowedExt.some((ext) => lower.endsWith(ext))) {
    return { ok: false, error: "File extension does not match the file type." };
  }
  return { ok: true, mimeType };
}

/** Storage path convention for private bucket: `{employee_id}/{document_id}/{sanitized_filename}`. */
export function buildEmployeeDocumentStoragePath(input: {
  employeeId: string;
  documentId: string;
  fileName: string;
}): string {
  const safe = sanitizeDocumentFileName(input.fileName) || "document";
  return `${input.employeeId}/${input.documentId}/${safe}`;
}

export async function uploadEmployeeDocumentObject(input: {
  storagePath: string;
  bytes: ArrayBuffer | Buffer | Uint8Array;
  mimeType: string;
}): Promise<void> {
  const client = getSupabaseServiceClient();
  if (!client) throw new Error("Supabase is not configured");

  const body =
    input.bytes instanceof Buffer ? input.bytes : Buffer.from(input.bytes as ArrayBuffer);

  const { error } = await client.storage
    .from(EMPLOYEE_DOCUMENTS_BUCKET)
    .upload(input.storagePath, body, {
      contentType: input.mimeType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }
}

export async function createEmployeeDocumentSignedUrl(
  storagePath: string,
  expiresInSeconds = 180,
): Promise<string> {
  const client = getSupabaseServiceClient();
  if (!client) throw new Error("Supabase is not configured");

  const { data, error } = await client.storage
    .from(EMPLOYEE_DOCUMENTS_BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? "Unable to create signed URL");
  }
  return data.signedUrl;
}

export async function removeEmployeeDocumentObject(storagePath: string): Promise<void> {
  const client = getSupabaseServiceClient();
  if (!client) return;

  await client.storage.from(EMPLOYEE_DOCUMENTS_BUCKET).remove([storagePath]);
}

export function isEmployeeDocumentsStorageReady(): boolean {
  return isSupabaseConfigured();
}

export const EMPLOYEE_DOCUMENT_TYPE_LABELS: Record<string, string> = {
  RESUME: "Resume",
  OFFER_LETTER: "Offer Letter",
  EMPLOYMENT_AGREEMENT: "Employment Agreement",
  WORK_AUTHORIZATION: "Work Authorization",
  CERTIFICATION: "Certification",
  POLICY_ACKNOWLEDGEMENT: "Policy Acknowledgement",
  OTHER: "Other",
};
