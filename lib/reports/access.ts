import type { PortalActor } from "@/lib/self-service/security";
import type { WorkforceSession } from "@/lib/workforce/session";
import type { ReportSection } from "@/lib/reports/types";

/** Sections visible for a portal actor — RLS remains authoritative on the data. */
export function reportSectionsForActor(actor: PortalActor): ReportSection[] {
  if (actor.role === "HR") {
    return ["recruiting", "workforce", "onboarding", "time-leave", "hr"];
  }
  if (actor.role === "PAYROLL") {
    return ["time-leave"];
  }
  if (actor.role === "MANAGER") {
    return ["time-leave", "onboarding"];
  }
  return [];
}

export function reportSectionsForWorkforce(
  session: WorkforceSession,
): ReportSection[] {
  if (session.roles.includes("ADMIN") || session.roles.includes("HR")) {
    return ["recruiting", "workforce", "onboarding", "time-leave", "hr"];
  }
  if (session.roles.includes("RECRUITER")) {
    return ["recruiting"];
  }
  if (session.roles.includes("HIRING_MANAGER")) {
    return ["recruiting"];
  }
  return [];
}

/** Narrow recruiting data to assigned requisitions for HM-only actors. */
export function recruitingScopeForWorkforce(
  session: WorkforceSession,
): { hiringManagerUserId?: string } | undefined {
  const elevated =
    session.roles.includes("ADMIN") ||
    session.roles.includes("HR") ||
    session.roles.includes("RECRUITER");
  if (elevated) return undefined;
  if (session.roles.includes("HIRING_MANAGER") && session.profileId) {
    return { hiringManagerUserId: session.profileId };
  }
  return undefined;
}

export function canAccessReportSection(
  actor: PortalActor,
  section: ReportSection,
): boolean {
  return reportSectionsForActor(actor).includes(section);
}

export function canAccessWorkforceReports(actor: PortalActor): boolean {
  return reportSectionsForActor(actor).length > 0;
}
