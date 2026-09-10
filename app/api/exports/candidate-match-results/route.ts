import { NextRequest } from "next/server";

import { exportCandidateMatchResultsCsv } from "@/lib/exports";
import { csvExportResponse } from "@/lib/exports/route-helpers";

export async function GET(request: NextRequest) {
  const runId = request.nextUrl.searchParams.get("runId");
  if (!runId) {
    return new Response("Missing runId", { status: 400 });
  }
  return csvExportResponse("candidate-match-results.csv", () =>
    exportCandidateMatchResultsCsv(runId),
  );
}
