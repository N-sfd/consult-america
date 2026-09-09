import { exportLeaveRequestsCsv } from "@/lib/exports";
import { csvExportResponse } from "@/lib/exports/route-helpers";

export async function GET() {
  return csvExportResponse("leave-requests.csv", exportLeaveRequestsCsv);
}
