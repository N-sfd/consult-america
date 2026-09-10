import { exportApplicationPipelineCsv } from "@/lib/exports";
import { csvExportResponse } from "@/lib/exports/route-helpers";

export async function GET() {
  return csvExportResponse("application-pipeline.csv", exportApplicationPipelineCsv);
}
