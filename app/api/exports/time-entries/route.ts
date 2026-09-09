import { exportTimeEntriesCsv } from "@/lib/exports";
import { csvExportResponse } from "@/lib/exports/route-helpers";

export async function GET() {
  return csvExportResponse("time-entries.csv", exportTimeEntriesCsv);
}
