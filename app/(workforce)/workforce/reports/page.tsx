import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import ReportFiltersBar from "@/components/workforce/reports/report-filters";
import {
  CountBars,
  LinkedRows,
  MetricCard,
  ReportEmpty,
} from "@/components/workforce/reports/report-widgets";
import {
  loadReportWorkspace,
  reportSectionsForWorkforce,
  recruitingScopeForWorkforce,
  type ReportFilters,
  type ReportSection,
} from "@/lib/reports";
import { getWorkforceSession } from "@/lib/workforce/session";

export const metadata: Metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  section?: string;
  from?: string;
  to?: string;
  department?: string;
  location?: string;
  job?: string;
  recruiter?: string;
}>;

function parseFilters(params: Awaited<SearchParams>): ReportFilters {
  return {
    from: params.from || undefined,
    to: params.to || undefined,
    departmentId: params.department || undefined,
    locationId: params.location || undefined,
    jobRequisitionId: params.job || undefined,
    recruiterUserId: params.recruiter || undefined,
  };
}

function exportHref(report: string, filters: ReportFilters) {
  const params = new URLSearchParams();
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.departmentId) params.set("department", filters.departmentId);
  if (filters.locationId) params.set("location", filters.locationId);
  if (filters.jobRequisitionId) params.set("job", filters.jobRequisitionId);
  if (filters.recruiterUserId) params.set("recruiter", filters.recruiterUserId);
  const qs = params.toString();
  return `/api/exports/${report}${qs ? `?${qs}` : ""}`;
}

export default async function WorkforceReportsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getWorkforceSession();
  const allowed = reportSectionsForWorkforce(session);
  if (allowed.length === 0) redirect("/workforce");

  const params = await searchParams;
  const requested = (params.section as ReportSection | undefined) ?? allowed[0];
  const section = allowed.includes(requested as ReportSection)
    ? (requested as ReportSection)
    : allowed[0];
  const filters = parseFilters(params);
  const scope = recruitingScopeForWorkforce(session);
  const data = await loadReportWorkspace(filters, [section], scope);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
          Workforce
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
          Reports
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
          Operational reporting from persisted ATS and workforce data. Empty
          periods stay empty — no demo metrics.
        </p>
      </div>

      <div className="mt-6">
        <ReportFiltersBar
          section={section}
          allowedSections={allowed}
          filters={filters}
          departments={data.departments}
          locations={data.locations}
          jobs={data.jobs}
          recruiters={data.recruiters}
        />
      </div>

      <div className="mt-8 space-y-6">
        {section === "recruiting" && data.recruiting ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Link
                href={exportHref("application-pipeline", filters)}
                className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
              >
                Export Application Pipeline CSV
              </Link>
              <Link
                href={exportHref("hiring-report", filters)}
                className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
              >
                Export Hiring Report CSV
              </Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <CountBars title="Applications by Stage" rows={data.recruiting.byStage} />
              <CountBars title="Applications by Job" rows={data.recruiting.byJob} />
              <CountBars title="Applications Over Time" rows={data.recruiting.overTime} />
              <CountBars title="Interview Pipeline" rows={data.recruiting.interviewPipeline} />
              <CountBars title="Offer Outcomes" rows={data.recruiting.offerOutcomes} />
              <CountBars title="Hires" rows={data.recruiting.hires} />
            </div>
            <h2 className="font-serif text-xl font-semibold tracking-[-0.02em]">Hiring</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Avg days to hire"
                value={
                  data.recruiting.timeToHireDays == null
                    ? "—"
                    : data.recruiting.timeToHireDays
                }
                hint={
                  data.recruiting.timeToHireSampleSize > 0
                    ? `Based on ${data.recruiting.timeToHireSampleSize} hire(s) with dates`
                    : "Not enough dated hire records"
                }
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <CountBars title="Hires by Month" rows={data.recruiting.hiringByMonth} />
              <CountBars title="Hires by Department" rows={data.recruiting.hiringByDepartment} />
              <CountBars title="Hires by Location" rows={data.recruiting.hiringByLocation} />
              <CountBars title="Source Application" rows={data.recruiting.hiringBySource} />
            </div>
          </>
        ) : null}

        {section === "workforce" && data.workforce ? (
          data.workforce.headcount ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <MetricCard label="Total" value={data.workforce.headcount.totalEmployees} />
              <MetricCard label="Active" value={data.workforce.headcount.activeEmployees} />
              <MetricCard label="On leave" value={data.workforce.headcount.onLeaveEmployees} />
              <MetricCard label="Pre-hire" value={data.workforce.headcount.preHireEmployees} />
              <MetricCard
                label="Terminated"
                value={data.workforce.headcount.terminatedEmployees}
              />
            </div>
          ) : (
            <ReportEmpty />
          )
        ) : null}

        {section === "onboarding" && data.onboarding ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Link
                href={exportHref("onboarding-status", filters)}
                className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
              >
                Export Onboarding Status CSV
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="In onboarding" value={data.onboarding.inProgress.length} />
              <MetricCard label="Completed" value={data.onboarding.completedCount} />
              <MetricCard
                label="Overdue tasks"
                value={data.onboarding.overdueTasks}
                tone={data.onboarding.overdueTasks > 0 ? "danger" : "default"}
              />
              <MetricCard
                label="Avg completion days"
                value={
                  data.onboarding.averageCompletionDays == null
                    ? "—"
                    : data.onboarding.averageCompletionDays
                }
                hint={
                  data.onboarding.averageSampleSize > 0
                    ? `Based on ${data.onboarding.averageSampleSize} completed record(s)`
                    : "Not enough completed records"
                }
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <CountBars title="Onboarding by Status" rows={data.onboarding.byStatus} />
              <LinkedRows title="Employees in Onboarding" rows={data.onboarding.inProgress} />
            </div>
          </>
        ) : null}

        {section === "time-leave" && data.timeLeave ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Link
                href={exportHref("time-approval-status", filters)}
                className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
              >
                Export Time Approval CSV
              </Link>
              <Link
                href={exportHref("leave-report", filters)}
                className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
              >
                Export Leave Report CSV
              </Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <CountBars title="Time by Status" rows={data.timeLeave.timeByStatus} />
              <CountBars title="Leave by Status" rows={data.timeLeave.leaveByStatus} />
            </div>
            <LinkedRows title="Upcoming Leave" rows={data.timeLeave.upcomingLeave} />
          </>
        ) : null}

        {section === "hr" && data.hr ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Link
                href={exportHref("hr-request-summary", filters)}
                className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
              >
                Export HR Request Summary CSV
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard label="Open requests" value={data.hr.openCount} />
              <MetricCard label="Resolved requests" value={data.hr.resolvedCount} />
              <MetricCard
                label="Avg resolution hours"
                value={
                  data.hr.averageResolutionHours == null
                    ? "—"
                    : data.hr.averageResolutionHours
                }
                hint={
                  data.hr.resolutionSampleSize > 0
                    ? `Based on ${data.hr.resolutionSampleSize} resolved request(s)`
                    : "Not enough resolved requests"
                }
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <CountBars title="Requests by Category" rows={data.hr.byCategory} />
              <CountBars title="Requests by Status" rows={data.hr.byStatus} />
            </div>
            <p className="text-xs text-black/45">
              Aggregate only — confidential request details are not shown in reports.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
