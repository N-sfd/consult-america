import { exportLeaveReportCsv } from "@/lib/exports";
import { csvExportResponse } from "@/lib/exports/route-helpers";
import type { ReportFilters } from "@/lib/reports";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters: ReportFilters = {
    from: url.searchParams.get("from") || undefined,
    to: url.searchParams.get("to") || undefined,
  };
  return csvExportResponse("leave-report.csv", () => exportLeaveReportCsv(filters));
}
