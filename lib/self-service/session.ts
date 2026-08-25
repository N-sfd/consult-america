/**
 * Demo portal session until authentication (Phase later).
 * Same person can be employee + manager via assignment hierarchy.
 */

export type PortalSession = {
  employeeId: string;
  personId: string;
  displayName: string;
  workEmail: string;
  isManager: boolean;
  isHr?: boolean;
};

/** Default employee portal user: Jennifer Lee (direct report). */
export const DEMO_EMPLOYEE_SESSION: PortalSession = {
  employeeId: "emp-demo-002",
  personId: "person-demo-002",
  displayName: "Jennifer Lee",
  workEmail: "jennifer.lee@consultamerica.demo",
  isManager: false,
};

/** Default manager portal user: Michael Brown (has direct reports). */
export const DEMO_MANAGER_SESSION: PortalSession = {
  employeeId: "emp-demo-001",
  personId: "person-demo-001",
  displayName: "Michael Brown",
  workEmail: "michael.brown@consultamerica.demo",
  isManager: true,
};

/** Demo HR actor — same person until dedicated HR identity exists. */
export const DEMO_HR_SESSION: PortalSession = {
  employeeId: "emp-demo-001",
  personId: "person-demo-001",
  displayName: "Michael Brown",
  workEmail: "hr@consultamerica.demo",
  isManager: true,
  isHr: true,
};

export function getEmployeeSession(): PortalSession {
  return DEMO_EMPLOYEE_SESSION;
}

export function getManagerSession(): PortalSession {
  return DEMO_MANAGER_SESSION;
}

export function getHrSession(): PortalSession {
  return DEMO_HR_SESSION;
}
