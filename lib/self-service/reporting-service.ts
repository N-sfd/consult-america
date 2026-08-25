import { hrRepository } from "@/lib/hr";
import {
  countAuditByEventType,
  listAuditLogs,
  queryAuditLogs,
} from "@/lib/self-service/audit-store";
import {
  listAllHrRequests,
} from "@/lib/self-service/hr-request-store";
import {
  getLeaveStoreSnapshot,
  listLeaveBalances,
  listPendingLeaveForManager,
} from "@/lib/self-service/leave-store";
import {
  getDirectReports,
  getPendingApprovals,
} from "@/lib/self-service";
import {
  getTimeStoreSnapshot,
  listSubmittedTimesheetsForManager,
} from "@/lib/self-service/time-store";
import { listApprovals } from "@/lib/self-service/workflow-store";
import type { AuditEventType } from "@/types/security";

export type MetricCard = {
  label: string;
  value: string;
  hint?: string;
};

export type ReportBreakdownRow = {
  label: string;
  value: number;
};

export async function getHrOperationalReport() {
  const timesheets = getTimeStoreSnapshot().timesheets;
  const leaveRequests = getLeaveStoreSnapshot().leaveRequests;
  const hrRequests = listAllHrRequests();
  const approvals = listApprovals().filter((item) => item.status === "PENDING");
  const employees = await hrRepository.listEmployees();
  const auditCounts = countAuditByEventType();
  const recentAudit = listAuditLogs(8);

  const submittedTimesheets = timesheets.filter(
    (item) => item.status === "SUBMITTED",
  ).length;
  const approvedTimesheets = timesheets.filter(
    (item) => item.status === "APPROVED",
  ).length;
  const pendingLeave = leaveRequests.filter(
    (item) => item.status === "PENDING",
  ).length;
  const approvedLeave = leaveRequests.filter(
    (item) => item.status === "APPROVED",
  ).length;
  const openHr = hrRequests.filter(
    (item) =>
      item.status === "OPEN" ||
      item.status === "IN_PROGRESS" ||
      item.status === "WAITING_FOR_EMPLOYEE",
  ).length;
  const resolvedHr = hrRequests.filter(
    (item) => item.status === "RESOLVED" || item.status === "CLOSED",
  ).length;

  const metrics: MetricCard[] = [
    {
      label: "Active Employees",
      value: String(employees.length),
      hint: "From Core HR",
    },
    {
      label: "Pending Approvals",
      value: String(approvals.length),
      hint: "Time, leave, profile",
    },
    {
      label: "Submitted Timesheets",
      value: String(submittedTimesheets),
      hint: `${approvedTimesheets} approved on file`,
    },
    {
      label: "Pending Leave",
      value: String(pendingLeave),
      hint: `${approvedLeave} approved upcoming/history`,
    },
    {
      label: "Open HR Requests",
      value: String(openHr),
      hint: `${resolvedHr} resolved/closed`,
    },
    {
      label: "Access Denied Events",
      value: String(auditCounts.ACCESS_DENIED ?? 0),
      hint: "From audit log",
    },
  ];

  const auditBreakdown: ReportBreakdownRow[] = Object.entries(auditCounts)
    .map(([label, value]) => ({ label, value: value ?? 0 }))
    .sort((a, b) => b.value - a.value);

  const leaveByStatus: ReportBreakdownRow[] = [
    {
      label: "PENDING",
      value: leaveRequests.filter((r) => r.status === "PENDING").length,
    },
    {
      label: "APPROVED",
      value: leaveRequests.filter((r) => r.status === "APPROVED").length,
    },
    {
      label: "REJECTED",
      value: leaveRequests.filter((r) => r.status === "REJECTED").length,
    },
    {
      label: "CANCELLED",
      value: leaveRequests.filter((r) => r.status === "CANCELLED").length,
    },
  ];

  const hrByStatus: ReportBreakdownRow[] = [
    {
      label: "OPEN",
      value: hrRequests.filter((r) => r.status === "OPEN").length,
    },
    {
      label: "IN_PROGRESS",
      value: hrRequests.filter((r) => r.status === "IN_PROGRESS").length,
    },
    {
      label: "WAITING_FOR_EMPLOYEE",
      value: hrRequests.filter((r) => r.status === "WAITING_FOR_EMPLOYEE")
        .length,
    },
    {
      label: "RESOLVED",
      value: hrRequests.filter((r) => r.status === "RESOLVED").length,
    },
    {
      label: "CLOSED",
      value: hrRequests.filter((r) => r.status === "CLOSED").length,
    },
  ];

  return {
    metrics,
    auditBreakdown,
    leaveByStatus,
    hrByStatus,
    recentAudit,
    generatedAt: new Date().toISOString(),
  };
}

export async function getManagerTeamReport(managerEmployeeId: string) {
  const team = await getDirectReports(managerEmployeeId);
  const pendingApprovals = getPendingApprovals(managerEmployeeId);
  const pendingTimesheets =
    listSubmittedTimesheetsForManager(managerEmployeeId).length;
  const pendingLeave =
    listPendingLeaveForManager(managerEmployeeId).length;

  const teamRows = await Promise.all(
    team.map(async (member) => {
      const balances = listLeaveBalances(member.employee.id);
      const pto = balances.find((item) => item.leaveTypeId === "lt-pto");
      return {
        employeeId: member.employee.id,
        name: `${member.person.firstName} ${member.person.lastName}`,
        position: member.positionTitle ?? "—",
        status: member.statusLabel,
        ptoAvailable: pto?.available ?? 0,
      };
    }),
  );

  const metrics: MetricCard[] = [
    {
      label: "Direct Reports",
      value: String(team.length),
    },
    {
      label: "Pending Approvals",
      value: String(pendingApprovals.length),
    },
    {
      label: "Pending Timesheets",
      value: String(pendingTimesheets),
    },
    {
      label: "Pending Leave",
      value: String(pendingLeave),
    },
  ];

  return {
    metrics,
    teamRows,
    pendingApprovals,
    generatedAt: new Date().toISOString(),
  };
}

export function getFilteredAuditReport(input: {
  eventType?: AuditEventType | "ALL";
  actorRole?: "EMPLOYEE" | "MANAGER" | "HR" | "ALL";
}) {
  return queryAuditLogs({
    eventType: input.eventType ?? "ALL",
    actorRole: input.actorRole ?? "ALL",
    limit: 100,
  });
}
