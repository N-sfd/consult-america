/**
 * Extracts plain text from an uploaded job description file (PDF/DOCX/TXT)
 * for the recruiter Candidate Match tool. Best-effort: extraction failures
 * degrade to an error message asking the recruiter to paste the description
 * instead of failing the request.
 */

export type JdExtractionResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

const MAX_JD_FILE_BYTES = 8 * 1024 * 1024;

export async function extractJobDescriptionText(input: {
  fileName: string;
  mimeType: string;
  bytes: ArrayBuffer;
}): Promise<JdExtractionResult> {
  if (input.bytes.byteLength === 0) {
    return { ok: false, error: "The selected file is empty." };
  }
  if (input.bytes.byteLength > MAX_JD_FILE_BYTES) {
    return { ok: false, error: "File is larger than 8MB. Choose a smaller file." };
  }

  const lower = input.fileName.toLowerCase();

  try {
    if (input.mimeType === "text/plain" || lower.endsWith(".txt")) {
      return { ok: true, text: Buffer.from(input.bytes).toString("utf-8") };
    }

    if (input.mimeType === "application/pdf" || lower.endsWith(".pdf")) {
      const { extractText } = await import("unpdf");
      const { text } = await extractText(new Uint8Array(input.bytes), { mergePages: true });
      if (!text.trim()) {
        return { ok: false, error: "Couldn't read text from this PDF — paste the description instead." };
      }
      return { ok: true, text };
    }

    if (
      input.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      lower.endsWith(".docx")
    ) {
      const mammoth = await import("mammoth");
      const { value } = await mammoth.extractRawText({ buffer: Buffer.from(input.bytes) });
      if (!value.trim()) {
        return { ok: false, error: "Couldn't read text from this document — paste the description instead." };
      }
      return { ok: true, text: value };
    }

    return {
      ok: false,
      error: "Unsupported file type. Upload a PDF, DOCX, or TXT file, or paste the description instead.",
    };
  } catch {
    return {
      ok: false,
      error: "Couldn't read this file — paste the description instead.",
    };
  }
}
