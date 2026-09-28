import { afterEach, describe, expect, it, vi } from "vitest";

import { assertDemoSessionAllowed } from "@/app/lib/supabase/client";

describe("assertDemoSessionAllowed", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("refuses to grant a demo session in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => assertDemoSessionAllowed("test-context")).toThrow(/production/i);
  });

  it("allows a demo session outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(() => assertDemoSessionAllowed("test-context")).not.toThrow();
  });
});
