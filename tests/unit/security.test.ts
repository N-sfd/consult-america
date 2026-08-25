import { beforeEach, describe, expect, it } from "vitest";

import {
  assertSelfAccess,
  assertTeamAccess,
  SecurityError,
} from "@/lib/self-service/security";
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
});
