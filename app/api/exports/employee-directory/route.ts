import { exportEmployeeDirectoryCsv } from "@/lib/exports";
import { csvExportResponse } from "@/lib/exports/route-helpers";

export async function GET() {
  return csvExportResponse("employee-directory.csv", exportEmployeeDirectoryCsv);
}
