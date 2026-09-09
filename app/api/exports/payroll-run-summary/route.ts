import { exportPayrollRunSummaryCsv } from "@/lib/exports";
import { csvExportResponse } from "@/lib/exports/route-helpers";

export async function GET() {
  return csvExportResponse("payroll-run-summary.csv", exportPayrollRunSummaryCsv);
}
