import { beforeEach, describe, expect, it } from "vitest";

import {
  assertSelfAccess,
  assertTeamAccess,
  requireNotSelfApproval,
  SecurityError,
  toActionErrorMessage,
  type PortalActor,
} from "@/lib/self-service/security";
import { DEMO_MANAGER_SESSION } from "@/lib/self-service/session";
import { resetSelfServiceStoresForTests } from "@/lib/self-service/test-reset";

describe("access control", () => {
  beforeEach(() => {
    resetSelfServiceStoresForTests();
  });

  it("allows an employee to access their own record", async () => {
    await expect(
      assertSelfAccess("emp-demo-002", "emp-demo-002"),
    ).resolves.toBeUndefined();
  });

  it("blocks cross-employee self access (IDOR)", async () => {
    await expect(
      assertSelfAccess("emp-demo-002", "emp-demo-001"),
    ).rejects.toBeInstanceOf(SecurityError);
  });

  it("allows a manager to access a direct report", async () => {
    await expect(
      assertTeamAccess("emp-demo-001", "emp-demo-002"),
    ).resolves.toBeUndefined();
  });

  it("blocks a manager from accessing a non-report", async () => {
    await expect(
      assertTeamAccess("emp-demo-002", "emp-demo-001"),
    ).rejects.toBeInstanceOf(SecurityError);
  });

  it("blocks a manager from approving their own request, even though assertTeamAccess treats actor === resource as authorized", () => {
    const managerActor: PortalActor = { session: DEMO_MANAGER_SESSION, role: "MANAGER" };
    expect(() =>
      requireNotSelfApproval(managerActor, DEMO_MANAGER_SESSION.employeeId),
    ).toThrow(SecurityError);
  });

  it("allows a manager to approve a different employee's request", () => {
    const managerActor: PortalActor = { session: DEMO_MANAGER_SESSION, role: "MANAGER" };
    expect(() =>
      requireNotSelfApproval(managerActor, "emp-demo-002"),
    ).not.toThrow();
  });

  it("never leaks a raw/unexpected error message to the end user", () => {
    const rawDbError = new Error('relation "timesheets" column "foo" does not exist');
    expect(toActionErrorMessage(rawDbError, "Unable to complete request.")).toBe(
      "Unable to complete request.",
    );
  });

  it("still returns an intentional SecurityError message verbatim", () => {
    expect(
      toActionErrorMessage(new SecurityError("Manager role required"), "fallback"),
    ).toBe("Manager role required");
  });
});
