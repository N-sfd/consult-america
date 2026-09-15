/**
 * ClientFlow Phase 2B automation engine tests (memory path).
 */
import assert from "node:assert/strict";

import { addBusinessDays } from "../lib/clientflow/business-days";
import { setServiceEnrollmentStatus } from "../lib/clientflow/enrollments";
import { resetClientFlowMemoryForTests } from "../lib/clientflow/memory-store";
import { submitTalkToExpert } from "../lib/clientflow/submit";
import { validateWorkflowConfig } from "../lib/clientflow/workflow-config";
import {
  dispatchClientFlowTrigger,
  processClientFlowWorkflowQueue,
} from "../lib/clientflow/workflow-engine";
import {
  memoryForceWorkflowStepDue,
  memoryListWorkflowActivities,
  memoryListWorkflowEmails,
  memoryListWorkflowEvents,
  memoryListWorkflowRuns,
  memoryListWorkflowSteps,
  memorySetDefinitionConfigForTests,
  resetClientFlowWorkflowMemoryForTests,
} from "../lib/clientflow/workflow-memory";

let failed = 0;
function check(ok: boolean, message: string) {
  if (!ok) failed += 1;
  console.log(ok ? `PASS  ${message}` : `FAIL  ${message}`);
}

async function main() {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetClientFlowMemoryForTests();
  resetClientFlowWorkflowMemoryForTests();

  // Business days: Fri + 2 business days → Tuesday
  const fri = new Date(Date.UTC(2026, 8, 11, 15, 0, 0)); // Fri Sep 11 2026
  const after = addBusinessDays(fri, 2);
  check(after.getUTCDay() === 2, "2 business days from Friday lands on Tuesday");
  check(after.toISOString().startsWith("2026-09-15"), "absolute timestamp stored (Tue Sep 15)");

  const invalid = validateWorkflowConfig({
    schemaVersion: 1,
    trigger: "inquiry_created",
    entry: "x",
    steps: {
      x: { type: "action", action: "enqueue_email", templateKey: "t", next: null, evil: true },
    },
  });
  check(!invalid.ok, "config validation rejects unknown keys");

  const scripty = validateWorkflowConfig({
    schemaVersion: 1,
    trigger: "inquiry_created",
    entry: "x",
    steps: {
      x: { type: "action", action: "eval", code: "1+1", next: null },
    },
  });
  check(!scripty.ok, "config validation rejects non-allowlisted actions");

  const oracle = await submitTalkToExpert({
    name: "Ora Cle",
    email: "ora.2b@example.com",
    company: "Oracle Co",
    sourcePage: "/capabilities/oracle",
    consentGiven: true,
  });
  assert(oracle.ok);
  const oracleRuns = memoryListWorkflowRuns().filter((r) => r.inquiryId === oracle.inquiryId);
  check(oracleRuns.length === 1, "inquiry_created starts follow-up workflow run");
  check(oracleRuns[0]?.definitionKey === "inquiry_follow_up", "run uses persisted definition key");
  check(oracleRuns[0]?.configSnapshot?.trigger === "inquiry_created", "run snapshots config");
  const delayEvents = memoryListWorkflowEvents(oracleRuns[0]!.id).filter(
    (e) => e.eventKey === "delay_scheduled",
  );
  check(delayEvents.length === 1, "workflow events include delay_scheduled");
  check(
    delayEvents[0]?.detail?.businessDays === 2,
    "delay is 2 business days (Mon–Fri definition)",
  );
  const branch = memoryListWorkflowEvents(oracleRuns[0]!.id).find((e) => e.eventKey === "branch");
  check(branch?.detail?.matched === true, "Oracle branch taken for oracle service");

  // Worker before due → nothing
  const early = await processClientFlowWorkflowQueue(20);
  check(early.processed === 0, "delay not due yet — worker processes nothing");

  // Duplicate trigger
  const dup = await dispatchClientFlowTrigger({
    type: "inquiry_created",
    contactId: oracle.contactId,
    accountId: oracle.accountId,
    inquiryId: oracle.inquiryId,
    enrollmentId: oracle.enrollmentId,
    context: {
      "service.key": "oracle",
      "service.name": "Oracle Transformation",
      contactEmail: "ora.2b@example.com",
      contactName: "Ora Cle",
      companyName: "Oracle Co",
    },
  });
  check(dup.skippedDuplicate === 1, "duplicate inquiry_created trigger skipped");
  check(
    memoryListWorkflowRuns().filter((r) => r.inquiryId === oracle.inquiryId).length === 1,
    "duplicate trigger does not create second run",
  );

  // Force due + process
  memoryForceWorkflowStepDue(oracleRuns[0]!.id, "delay_oracle");
  const due1 = await processClientFlowWorkflowQueue(20);
  check(due1.completed >= 1, "due delay completes and continues");
  // May need another pass if email then activity scheduled as separate steps — actions are inline after delay
  await processClientFlowWorkflowQueue(20);
  const followUps = memoryListWorkflowEmails().filter(
    (e) => e.contactId === oracle.contactId && e.templateKey === "follow_up_oracle",
  );
  check(followUps.length === 1, "Oracle follow-up enqueued via existing outbox path");
  check(
    memoryListWorkflowActivities(oracle.contactId).some((a) =>
      a.subject.includes("Oracle follow-up"),
    ),
    "Oracle follow-up writes activity",
  );

  // Process again — no duplicate email
  await processClientFlowWorkflowQueue(20);
  check(
    memoryListWorkflowEmails().filter(
      (e) => e.contactId === oracle.contactId && e.templateKey === "follow_up_oracle",
    ).length === 1,
    "exactly-once follow-up email (idempotent)",
  );

  // General branch
  resetClientFlowMemoryForTests();
  resetClientFlowWorkflowMemoryForTests();
  const general = await submitTalkToExpert({
    name: "Gen Eral",
    email: "gen.2b@example.com",
    company: "General Co",
    consentGiven: true,
  });
  assert(general.ok);
  const genRun = memoryListWorkflowRuns().find((r) => r.inquiryId === general.inquiryId);
  assert(genRun);
  const genBranch = memoryListWorkflowEvents(genRun.id).find((e) => e.eventKey === "branch");
  check(genBranch?.detail?.matched === false, "General branch for non-Oracle service");
  memoryForceWorkflowStepDue(genRun.id, "delay_general");
  await processClientFlowWorkflowQueue(20);
  await processClientFlowWorkflowQueue(20);
  check(
    memoryListWorkflowEmails().some((e) => e.templateKey === "follow_up_general"),
    "General follow-up template selected",
  );

  // Enrollment status changed automation
  resetClientFlowMemoryForTests();
  resetClientFlowWorkflowMemoryForTests();
  const enr = await submitTalkToExpert({
    name: "En Roll",
    email: "enr.2b@example.com",
    company: "Enroll Co",
    sourcePage: "/capabilities/oracle",
    consentGiven: true,
  });
  assert(enr.ok && enr.enrollmentId);
  const q = await setServiceEnrollmentStatus({
    enrollmentId: enr.enrollmentId!,
    status: "Qualified",
  });
  check(q.ok, "enrollment advanced to Qualified");
  const enrRuns = memoryListWorkflowRuns().filter(
    (r) => r.triggerType === "enrollment_status_changed" && r.enrollmentId === enr.enrollmentId,
  );
  check(enrRuns.length === 1, "enrollment_status_changed starts automation");
  check(
    memoryListWorkflowActivities(enr.contactId).some((a) =>
      a.subject.includes("Enrollment reached Qualified"),
    ),
    "Qualified enrollment automation writes activity",
  );

  // Config versioning: started run keeps snapshot after definition changes
  const snapVersion = genRun.definitionVersion;
  memorySetDefinitionConfigForTests(
    "inquiry_follow_up",
    {
      schemaVersion: 1,
      trigger: "inquiry_created",
      entry: "noop",
      steps: {
        noop: {
          type: "action",
          action: "write_activity",
          subject: "CHANGED DEFINITION",
          next: null,
        },
      },
    },
    99,
  );
  check(
    genRun.configSnapshot.entry === "branch_service",
    "already-started run keeps original config snapshot entry",
  );
  check(snapVersion === 1, "run retains starting definition version");

  // Concurrent claim: two workers on same due step → one winner
  resetClientFlowMemoryForTests();
  resetClientFlowWorkflowMemoryForTests();
  const race = await submitTalkToExpert({
    name: "Race Wf",
    email: "race.wf@example.com",
    company: "Race Wf Co",
    sourcePage: "/capabilities/oracle",
    consentGiven: true,
  });
  assert(race.ok);
  const raceRun = memoryListWorkflowRuns().find((r) => r.inquiryId === race.inquiryId)!;
  memoryForceWorkflowStepDue(raceRun.id, "delay_oracle");
  const [a, b] = await Promise.all([
    processClientFlowWorkflowQueue(5),
    processClientFlowWorkflowQueue(5),
  ]);
  check(a.processed + b.processed >= 1, "concurrent workers process due steps");
  check(
    memoryListWorkflowSteps(raceRun.id).filter((s) => s.stepId === "delay_oracle" && s.status === "completed")
      .length === 1,
    "concurrent claim completes delay once",
  );

  if (failed > 0) {
    console.error(`\n${failed} Phase 2B check(s) failed`);
    process.exit(1);
  }
  console.log("\nAll ClientFlow Phase 2B automation checks passed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
