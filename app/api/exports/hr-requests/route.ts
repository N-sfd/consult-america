import { exportHrRequestsCsv } from "@/lib/exports";
import { csvExportResponse } from "@/lib/exports/route-helpers";

export async function GET() {
  return csvExportResponse("hr-requests.csv", exportHrRequestsCsv);
}
