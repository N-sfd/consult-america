import { describe, expect, it } from "vitest";

import {
  calculateLeaveHours,
  countBusinessDays,
} from "@/lib/self-service/leave-store";
import { hasPermission } from "@/lib/self-service/permissions";
import { datesInPeriod } from "@/lib/self-service/time-store";

describe("leave hour calculation", () => {
  it("counts weekdays only", () => {
    // Fri–Mon includes Fri and Mon (2 weekdays)
    expect(countBusinessDays("2026-08-28", "2026-08-31")).toBe(2);
  });

  it("calculates full-day leave hours", () => {
    expect(
      calculateLeaveHours({
        startDate: "2026-09-14",
        endDate: "2026-09-16",
      }),
    ).toBe(24);
  });

  it("supports partial-day hours on a single weekday", () => {
    expect(
      calculateLeaveHours({
        startDate: "2026-09-14",
        endDate: "2026-09-14",
        partialDay: true,
        hours: 4,
      }),
    ).toBe(4);
  });

  it("rejects invalid date order", () => {
    expect(() =>
      calculateLeaveHours({
        startDate: "2026-09-16",
        endDate: "2026-09-14",
      }),
    ).toThrow(/on or after/);
  });

  it("rejects weekend-only ranges", () => {
    expect(() =>
      calculateLeaveHours({
        startDate: "2026-08-29",
        endDate: "2026-08-30",
      }),
    ).toThrow(/weekday/);
  });
});

describe("timesheet period helpers", () => {
  it("lists inclusive dates for a week", () => {
    const dates = datesInPeriod("2026-08-24", "2026-08-30");
    expect(dates).toHaveLength(7);
    expect(dates[0]).toBe("2026-08-24");
    expect(dates[6]).toBe("2026-08-30");
  });
});

describe("role permissions", () => {
  it("grants employee self permissions only", () => {
    expect(hasPermission("EMPLOYEE", "self.leave.submit")).toBe(true);
    expect(hasPermission("EMPLOYEE", "team.leave.approve")).toBe(false);
    expect(hasPermission("EMPLOYEE", "audit.read")).toBe(false);
  });

  it("grants manager team permissions without HR admin rights", () => {
    expect(hasPermission("MANAGER", "team.timesheet.approve")).toBe(true);
    expect(hasPermission("MANAGER", "approval.act")).toBe(true);
    expect(hasPermission("MANAGER", "hr_request.manage")).toBe(false);
    expect(hasPermission("MANAGER", "reports.read")).toBe(false);
    expect(hasPermission("MANAGER", "team.reports.read")).toBe(true);
  });

  it("grants HR service-desk and audit permissions", () => {
    expect(hasPermission("HR", "hr_request.manage")).toBe(true);
    expect(hasPermission("HR", "audit.read")).toBe(true);
    expect(hasPermission("HR", "reports.read")).toBe(true);
  });
});
