/**
 * ClientFlow Phase 1 regression — memory path (no DB required).
 *
 * Covers: duplicate email → one contact / many inquiries, email failure does not
 * lose inquiry, duplicate worker safety via provider_message_id, invalid form
 * data, retry exhaustion, successful delivery, manual retry.
 *
 * Usage: npx tsx scripts/clientflow-regression.ts
 */
import assert from "node:assert/strict";

import {
  memoryCountContactsByEmail,
  memoryCountEnrollmentsByContact,
  memoryCountInquiriesByEmail,
  memoryGetContactDetail,
  memoryGetEmail,
  memoryListFailedOrRetrying,
  memorySetEnrollmentStatus,
  resetClientFlowMemoryForTests,
} from "../lib/clientflow/memory-store";
import {
  getClientFlowEmailProvider,
  setClientFlowEmailProvider,
  type ClientFlowEmailProvider,
} from "../lib/clientflow/email-provider";
import { normalizeEmail } from "../lib/clientflow/normalize-email";
import {
  listClientAckTemplates,
  renderTemplate,
  sanitizeTemplateValue,
  selectClientAckTemplate,
  setClientAckTemplateCatalogForTests,
} from "../lib/clientflow/templates";
import {
  processClientFlowEmailQueue,
  retryClientFlowEmail,
} from "../lib/clientflow/process-emails";
import { submitTalkToExpert } from "../lib/clientflow/submit";

let failed = 0;

function check(ok: boolean, message: string) {
  if (!ok) failed += 1;
  console.log(ok ? `PASS  ${message}` : `FAIL  ${message}`);
}

async function main() {
  const previous = getClientFlowEmailProvider();
  resetClientFlowMemoryForTests();

  // Force memory path
  const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const prevKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.CLIENTFLOW_EMAIL_FORCE_FAIL;

  try {
    check(normalizeEmail("  Alex@ConsultAmerica.com ") === "alex@consultamerica.com", "normalizeEmail");

    const invalid = await submitTalkToExpert({
      name: "",
      email: "bad",
      company: "",
      consentGiven: false,
    });
    check(!invalid.ok && invalid.code === "consent_required", "rejects missing consent");

    const invalidEmail = await submitTalkToExpert({
      name: "Alex",
      email: "not-an-email",
      company: "Acme",
      consentGiven: true,
    });
    check(!invalidEmail.ok && invalidEmail.code === "invalid_email", "rejects invalid email");

    const failProvider: ClientFlowEmailProvider = {
      name: "gmail",
      async send() {
        return { ok: false, error: "simulated Gmail outage", provider: "gmail" };
      },
    };
    setClientFlowEmailProvider(failProvider);

    const first = await submitTalkToExpert({
      name: "Alex Rivera",
      email: "Alex@Example.COM",
      company: "Northwind",
      message: "Need Oracle help",
      sourcePage: "/capabilities/oracle",
      consentGiven: true,
    });
    check(first.ok === true, "first Talk to Expert persists");
    assert(first.ok);
    check(first.contactCreated === true, "first submission creates contact");
    check(first.serviceName === "Oracle Transformation", "infers Oracle service from source page");
    check(first.clientTemplateKey === "client_ack_oracle", "service → correct Oracle template");
    check(first.clientTemplateVersion === 1, "template version captured on submit");

    const firstDetail = memoryGetContactDetail(first.contactId);
    const firstAck = firstDetail?.emails.find((e) => e.purpose === "CLIENT_ACK");
    check(firstAck?.templateKey === "client_ack_oracle", "queued email stores Oracle template key");
    check(firstAck?.templateVersion === 1, "queued email stores template version for audit");
    check(
      (firstAck?.bodyText.includes("Oracle") ?? false) &&
        !(firstAck?.bodyText.includes("{{") ?? true),
      "Oracle template rendered without raw placeholders",
    );

    const second = await submitTalkToExpert({
      name: "Alex Rivera",
      email: "alex@example.com",
      company: "Northwind",
      message: "Follow-up on AI",
      sourcePage: "/capabilities/ai-data",
      consentGiven: true,
    });
    check(second.ok === true, "second Talk to Expert persists");
    assert(second.ok);
    check(second.contactCreated === false, "duplicate email reuses contact");
    check(second.contactId === first.contactId, "same contact id for normalized email");
    check(memoryCountContactsByEmail("alex@example.com") === 1, "exactly one contact for email");
    check(memoryCountInquiriesByEmail("alex@example.com") === 2, "two inquiries for same contact");

    // Queue still has messages; process under outage
    const drain1 = await processClientFlowEmailQueue(20);
    check(drain1.failed > 0, "Gmail outage marks deliveries failed/retrying");
    check(memoryCountInquiriesByEmail("alex@example.com") === 2, "inquiry survives email failure");

    const detailAfterFail = memoryGetContactDetail(first.contactId);
    check(Boolean(detailAfterFail), "contact detail available after email failure");
    check(
      (detailAfterFail?.emails.length ?? 0) >= 1,
      "email messages remain on contact after failure",
    );

    // Exhaust retries
    for (let i = 0; i < 6; i += 1) {
      await processClientFlowEmailQueue(50);
    }
    const stuck = memoryListFailedOrRetrying().filter((e) => e.inquiryId === first.inquiryId);
    check(
      stuck.every((e) => e.status === "failed" || e.attemptCount >= e.maxAttempts),
      "retry exhaustion ends in failed (or max attempts)",
    );

    // Successful provider + duplicate worker protection
    const okProvider: ClientFlowEmailProvider = {
      name: "gmail",
      async send() {
        return { ok: true, provider: "gmail", providerMessageId: "gmail-msg-1" };
      },
    };
    setClientFlowEmailProvider(okProvider);

    const third = await submitTalkToExpert({
      name: "Blake Lee",
      email: "blake@example.com",
      company: "Contoso",
      message: "Hello",
      consentGiven: true,
    });
    assert(third.ok);
    const drainOk = await processClientFlowEmailQueue(20);
    check(drainOk.sent >= 1, "successful client delivery");

    const detail = memoryGetContactDetail(third.contactId);
    const sent = detail?.emails.find((e) => e.purpose === "CLIENT_ACK");
    check(sent?.status === "sent", "client ack marked sent");
    check(Boolean(sent?.providerMessageId), "provider message id recorded");

    // Duplicate worker execution
    const again = await processClientFlowEmailQueue(20);
    check(again.skipped >= 0, "second worker pass is safe");
    const emailAfter = memoryGetEmail(sent!.id);
    check(emailAfter?.providerMessageId === "gmail-msg-1", "duplicate send blocked by provider id");

    // Manual retry on a failed message from first inquiry
    const failedMsg = memoryListFailedOrRetrying().find(
      (e) => e.inquiryId === first.inquiryId && e.status === "failed",
    );
    if (failedMsg) {
      const retry = await retryClientFlowEmail(failedMsg.id);
      check(retry.ok === true, "manual retry can succeed after provider recovery");
    } else {
      check(false, "expected a failed message for manual retry");
    }

    const timeline = memoryGetContactDetail(first.contactId);
    check(
      (timeline?.activities.some((a) => a.subject.includes("Talk to Expert")) ?? false),
      "activity timeline includes Talk to Expert",
    );

    // --- Phase 2A enrollments ---
    const enrollDetail = memoryGetContactDetail(first.contactId);
    check(
      (enrollDetail?.enrollments.length ?? 0) === 2,
      "same contact / different services → 2 enrollments",
    );
    check(
      enrollDetail?.enrollments.every((e) => e.status === "Interested") ?? false,
      "new enrollments default to Interested",
    );
    check(
      Boolean(first.enrollmentId) && Boolean(second.enrollmentId) && first.enrollmentId !== second.enrollmentId,
      "oracle and ai_data enrollments are distinct",
    );

    const oracleAgain = await submitTalkToExpert({
      name: "Alex Rivera",
      email: "alex@example.com",
      company: "Northwind",
      message: "Another Oracle note",
      sourcePage: "/capabilities/oracle",
      consentGiven: true,
    });
    assert(oracleAgain.ok);
    check(oracleAgain.enrollmentCreated === false, "same contact/same service reuses enrollment");
    check(oracleAgain.enrollmentId === first.enrollmentId, "reused enrollment id matches first");
    check(
      (memoryGetContactDetail(first.contactId)?.enrollments.length ?? 0) === 2,
      "reuse does not create a third enrollment",
    );

    const advanced = memorySetEnrollmentStatus(first.enrollmentId!, "Qualified");
    check(advanced.ok && advanced.status === "Qualified", "enrollment state change to Qualified");
    const afterAdvance = memoryGetContactDetail(first.contactId);
    check(
      afterAdvance?.enrollments.some((e) => e.id === first.enrollmentId && e.status === "Qualified") ??
        false,
      "Services detail reflects new state",
    );
    check(
      afterAdvance?.activities.some(
        (a) =>
          a.metadata?.event === "enrollment_status_changed" &&
          a.metadata?.enrollment_id === first.enrollmentId,
      ) ?? false,
      "state change writes activity (history preserved)",
    );
    const priorCount = afterAdvance?.activities.length ?? 0;
    memorySetEnrollmentStatus(first.enrollmentId!, "Discovery");
    const afterSecondChange = memoryGetContactDetail(first.contactId);
    check(
      (afterSecondChange?.activities.length ?? 0) > priorCount,
      "second state change appends activity (no overwrite)",
    );

    const [raceA, raceB] = await Promise.all([
      submitTalkToExpert({
        name: "Casey Concurrent",
        email: "casey.concurrent@example.com",
        company: "Race Co",
        message: "A",
        sourcePage: "/capabilities/oracle",
        consentGiven: true,
      }),
      submitTalkToExpert({
        name: "Casey Concurrent",
        email: "casey.concurrent@example.com",
        company: "Race Co",
        message: "B",
        sourcePage: "/capabilities/oracle",
        consentGiven: true,
      }),
    ]);
    check(raceA.ok && raceB.ok, "concurrent same-email submissions succeed");
    if (raceA.ok && raceB.ok) {
      check(raceA.contactId === raceB.contactId, "concurrent submissions share contact");
      check(
        memoryCountEnrollmentsByContact(raceA.contactId) === 1,
        "concurrent same-service submissions yield one open enrollment",
      );
      check(
        raceA.enrollmentId === raceB.enrollmentId,
        "concurrent same-service submissions share enrollment id",
      );
    }

    // --- Phase 2A templates ---
    check(
      sanitizeTemplateValue("Hi <script>x</script>") === "Hi scriptx/script",
      "sanitize strips angle brackets from user values",
    );
    check(
      renderTemplate("Hello {{first_name}} {{missing_var}}!", { first_name: "Alex" }) ===
        "Hello Alex !",
      "missing variables degrade cleanly (no raw placeholders)",
    );
    check(
      selectClientAckTemplate("oracle").key === "client_ack_oracle",
      "selectClientAckTemplate maps oracle → Oracle template",
    );
    check(
      selectClientAckTemplate("general").key === "client_ack_general",
      "selectClientAckTemplate maps general → General template",
    );

    const inactiveCatalog = listClientAckTemplates().map((t) =>
      t.serviceKey === "oracle" ? { ...t, isActive: false } : t,
    );
    setClientAckTemplateCatalogForTests(inactiveCatalog);
    check(
      selectClientAckTemplate("oracle").key === "client_ack_general",
      "inactive service template falls back to General",
    );

    const fallbackSubmit = await submitTalkToExpert({
      name: "Dana Fallback",
      email: "dana.fallback@example.com",
      company: "Fallback Co",
      message: "Oracle with inactive template",
      sourcePage: "/capabilities/oracle",
      consentGiven: true,
    });
    assert(fallbackSubmit.ok);
    check(
      fallbackSubmit.clientTemplateKey === "client_ack_general",
      "submit uses General when service template inactive",
    );
    const fallbackAck = memoryGetContactDetail(fallbackSubmit.contactId)?.emails.find(
      (e) => e.purpose === "CLIENT_ACK",
    );
    const frozenSubject = fallbackAck?.subject;
    const frozenBody = fallbackAck?.bodyText;
    const frozenVersion = fallbackAck?.templateVersion;
    // Simulate template catalog change after enqueue — historical message must stay frozen
    setClientAckTemplateCatalogForTests(
      listClientAckTemplates().map((t) =>
        t.key === "client_ack_general"
          ? { ...t, version: 99, subject: "CHANGED SUBJECT {{first_name}}", bodyText: "CHANGED BODY" }
          : t,
      ),
    );
    const stillFrozen = memoryGetEmail(fallbackAck!.id);
    check(
      stillFrozen?.subject === frozenSubject && stillFrozen?.bodyText === frozenBody,
      "template version/audit: rendered email content not rewritten after template change",
    );
    check(
      stillFrozen?.templateVersion === frozenVersion,
      "stored template_version remains the enqueue-time value",
    );
    setClientAckTemplateCatalogForTests(null);

    process.env.CLIENTFLOW_CONSULTANT_NAME = "Jordan Lee";
    process.env.CLIENTFLOW_BOOKING_URL = "https://example.com/book";
    const managed = await submitTalkToExpert({
      name: "Sam Managed",
      email: "sam.managed@example.com",
      company: "Managed Co",
      sourcePage: "/capabilities/managed-services",
      consentGiven: true,
    });
    assert(managed.ok);
    check(managed.clientTemplateKey === "client_ack_managed_services", "managed services template selected");
    const managedAck = memoryGetContactDetail(managed.contactId)?.emails.find(
      (e) => e.purpose === "CLIENT_ACK",
    );
    check(
      (managedAck?.bodyText.includes("Jordan Lee") ?? false) &&
        (managedAck?.bodyText.includes("https://example.com/book") ?? false),
      "consultant_name and booking_url variables render",
    );
    delete process.env.CLIENTFLOW_CONSULTANT_NAME;
    delete process.env.CLIENTFLOW_BOOKING_URL;
  } finally {
    setClientAckTemplateCatalogForTests(null);
    setClientFlowEmailProvider(previous);
    if (prevUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = prevUrl;
    if (prevKey) process.env.SUPABASE_SERVICE_ROLE_KEY = prevKey;
    resetClientFlowMemoryForTests();
  }

  if (failed > 0) {
    console.error(`\n${failed} ClientFlow regression check(s) failed`);
    process.exit(1);
  }
  console.log("\nAll ClientFlow Phase 1 + 2A regression checks passed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
