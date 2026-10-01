import { NextResponse } from "next/server";

import { runJobMaintenance } from "@/lib/jobs/maintenance";

export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const summary = await runJobMaintenance();
  return NextResponse.json({ ok: !summary.errors, ...summary });
}
