import { isSupabaseConfigured } from "@/app/lib/supabase/server";
import DashboardOverview, {
  type PipelineRow,
} from "@/components/workforce-app/dashboard-overview";
import { hrRepository } from "@/lib/hr";
import { getOpenJobs } from "@/lib/jobs";
import { recruitingRepository } from "@/lib/recruiting";
import { getPendingApprovals } from "@/lib/self-service";
import { getWorkforceSession } from "@/lib/workforce/session";
import { APPLICATION_PIPELINE, applicationStatusLabels } from "@/types/recruiting";

export default async function WorkforceAppDashboardPage() {
  const session = getWorkforceSession();
  const connected = isSupabaseConfigured();

  const [openJobs, candidateCount, pipelineCounts, employees] =
    await Promise.all([
      getOpenJobs(),
      recruitingRepository.countCandidates(),
      recruitingRepository.getApplicationPipelineCounts(),
      hrRepository.listEmployees(),
    ]);

  const pipeline: PipelineRow[] = APPLICATION_PIPELINE.map((status) => ({
    status,
    label: applicationStatusLabels[status],
    count: pipelineCounts[status] ?? 0,
  }));

  const pendingApprovalsCount = getPendingApprovals(session.employeeId).length;

  return (
    <DashboardOverview
      userFirstName={session.displayName.split(" ")[0]}
      isSupabaseConnected={connected}
      employeeCount={employees.length}
      openJobsCount={openJobs.length}
      candidateCount={candidateCount}
      pendingApprovalsCount={pendingApprovalsCount}
      pipeline={pipeline}
      openJobs={openJobs}
    />
  );
}
