/**
 * Workforce operational reporting — real persisted data only.
 * Job Match / AI scores never feed these reports.
 */

export type ReportSection =
  | "recruiting"
  | "workforce"
  | "onboarding"
  | "time-leave"
  | "hr";

export type ReportFilters = {
  from?: string;
  to?: string;
  departmentId?: string;
  locationId?: string;
  jobRequisitionId?: string;
  recruiterUserId?: string;
};

/** Optional assignment scope for recruiting reports (hiring manager / recruiter). */
export type RecruitingReportScope = {
  hiringManagerUserId?: string;
  recruiterUserId?: string;
};

export type NamedCount = {
  key: string;
  label: string;
  count: number;
};

export type LinkedCountRow = {
  id: string;
  label: string;
  sublabel?: string;
  href?: string;
  count?: number;
  percent?: number;
  status?: string;
};

export type FilterOption = { id: string; label: string };

export type RecruitingReportData = {
  byStage: NamedCount[];
  byJob: NamedCount[];
  overTime: NamedCount[];
  interviewPipeline: NamedCount[];
  offerOutcomes: NamedCount[];
  hires: NamedCount[];
  hiringByMonth: NamedCount[];
  hiringByDepartment: NamedCount[];
  hiringByLocation: NamedCount[];
  hiringBySource: NamedCount[];
  timeToHireDays: number | null;
  timeToHireSampleSize: number;
};

export type WorkforceReportData = {
  headcount: {
    totalEmployees: number;
    activeEmployees: number;
    onLeaveEmployees: number;
    preHireEmployees: number;
    terminatedEmployees: number;
  } | null;
};

export type OnboardingReportData = {
  inProgress: LinkedCountRow[];
  byStatus: NamedCount[];
  overdueTasks: number;
  completedCount: number;
  averageCompletionDays: number | null;
  averageSampleSize: number;
};

export type TimeLeaveReportData = {
  timeByStatus: NamedCount[];
  leaveByStatus: NamedCount[];
  upcomingLeave: LinkedCountRow[];
};

export type HrServiceDeskReportData = {
  openCount: number;
  resolvedCount: number;
  byCategory: NamedCount[];
  byStatus: NamedCount[];
  averageResolutionHours: number | null;
  resolutionSampleSize: number;
};

export type ReportWorkspaceData = {
  filters: ReportFilters;
  departments: FilterOption[];
  locations: FilterOption[];
  jobs: FilterOption[];
  recruiters: FilterOption[];
  recruiting: RecruitingReportData | null;
  workforce: WorkforceReportData | null;
  onboarding: OnboardingReportData | null;
  timeLeave: TimeLeaveReportData | null;
  hr: HrServiceDeskReportData | null;
};
