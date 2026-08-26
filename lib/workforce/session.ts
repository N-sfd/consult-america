/**
 * Demo Workforce App session until real authentication exists — same
 * pattern as lib/self-service/session.ts. Reuses the existing seeded
 * emp-demo-001 (Michael Brown) id so real in-memory approvals/notification
 * data resolves correctly for this session.
 */

export type WorkforceRole = "ADMIN" | "RECRUITER" | "HR" | "HIRING_MANAGER";

export type WorkforceSession = {
  employeeId: string;
  personId: string;
  displayName: string;
  workEmail: string;
  initials: string;
  roles: WorkforceRole[];
};

export const DEMO_WORKFORCE_SESSION: WorkforceSession = {
  employeeId: "emp-demo-001",
  personId: "person-demo-001",
  displayName: "Michael Brown",
  workEmail: "michael.brown@consultamerica.demo",
  initials: "MB",
  roles: ["ADMIN", "RECRUITER", "HR"],
};

export function getWorkforceSession(): WorkforceSession {
  return DEMO_WORKFORCE_SESSION;
}
