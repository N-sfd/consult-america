import { exportHiringReportCsv } from "@/lib/exports";
import { csvExportResponse } from "@/lib/exports/route-helpers";
import type { ReportFilters } from "@/lib/reports";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters: ReportFilters = {
    from: url.searchParams.get("from") || undefined,
    to: url.searchParams.get("to") || undefined,
    departmentId: url.searchParams.get("department") || undefined,
    locationId: url.searchParams.get("location") || undefined,
    jobRequisitionId: url.searchParams.get("job") || undefined,
    recruiterUserId: url.searchParams.get("recruiter") || undefined,
  };
  return csvExportResponse("hiring-report.csv", () => exportHiringReportCsv(filters));
}
