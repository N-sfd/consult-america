import { toActionErrorMessage } from "@/lib/self-service/security";

/**
 * requireEmployeeActor()/requireHrActor()/etc. call redirect("/login") when
 * there's no session — which Next.js implements by throwing an error with a
 * NEXT_REDIRECT digest. A plain try/catch here would swallow that and turn
 * a real redirect into a 403 response, so it must be detected and rethrown
 * for Next's route handler runtime to actually perform the redirect.
 */
function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function csvExportResponse(
  filename: string,
  run: () => Promise<string>,
): Promise<Response> {
  try {
    const csv = await run();
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    return new Response(toActionErrorMessage(error, "Unable to export data."), {
      status: 403,
    });
  }
}
