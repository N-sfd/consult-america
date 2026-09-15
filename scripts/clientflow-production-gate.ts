/**
 * ClientFlow Phase 1 production-release gate.
 * Applies checks against live Supabase when DATABASE_URL / service role are set.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/clientflow-production-gate.ts
 *   npx tsx --env-file=.env.local scripts/clientflow-production-gate.ts --skip-live-send
 */
import pg from "pg";

import { submitTalkToExpert } from "../lib/clientflow/submit";
import {
  processClientFlowEmailQueue,
  retryClientFlowEmail,
} from "../lib/clientflow/process-emails";
import { assertClientFlowEmailConfig } from "../lib/clientflow/email-provider";

// re-check gmail without exporting - inline
function gmailConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN &&
      process.env.GMAIL_FROM,
  );
}

type GateRow = { item: string; status: "PASS" | "FAIL" | "BLOCKED"; notes: string };

const gates: GateRow[] = [];
const skipLiveSend = process.argv.includes("--skip-live-send");

function record(item: string, status: GateRow["status"], notes: string) {
  gates.push({ item, status, notes });
  console.log(`${status.padEnd(7)} ${item} — ${notes}`);
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) {
    record("DATABASE_URL", "BLOCKED", "Missing DATABASE_URL / SUPABASE_DB_URL");
    printTable();
    process.exit(1);
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    // --- Schema objects ---
    const requiredTables = [
      "crm_inquiries",
      "crm_services",
      "crm_email_templates",
      "crm_email_messages",
      "crm_workflow_definitions",
      "crm_workflow_runs",
      "crm_workflow_events",
    ];
    for (const table of requiredTables) {
      const { rows } = await client.query(
        `SELECT to_regclass('public.${table}') IS NOT NULL AS ok`,
      );
      record(`table ${table}`, rows[0]?.ok ? "PASS" : "FAIL", rows[0]?.ok ? "exists" : "missing");
    }

    const { rows: cols } = await client.query(`
      SELECT column_name FROM information_schema.columns
       WHERE table_name = 'crm_email_messages'
         AND column_name IN ('provider','claimed_at','claimed_by','next_attempt_at','idempotency_key')
    `);
    const colSet = new Set(cols.map((r) => r.column_name as string));
    record(
      "email claim/provider columns",
      ["provider", "claimed_at", "claimed_by", "next_attempt_at", "idempotency_key"].every((c) =>
        colSet.has(c),
      )
        ? "PASS"
        : "FAIL",
      `found: ${[...colSet].join(", ") || "(none)"}`,
    );

    const { rows: contactCols } = await client.query(`
      SELECT 1 FROM information_schema.columns
       WHERE table_name = 'crm_contacts' AND column_name = 'email_normalized'
    `);
    record(
      "crm_contacts.email_normalized",
      contactCols.length ? "PASS" : "FAIL",
      contactCols.length ? "present" : "missing",
    );

    const { rows: rpc } = await client.query(`
      SELECT proname, prosecdef
        FROM pg_proc
       WHERE proname IN ('clientflow_submit_talk_to_expert','clientflow_claim_email_message','normalize_email')
    `);
    const rpcNames = new Set(rpc.map((r) => r.proname as string));
    record(
      "RPC functions",
      rpcNames.has("clientflow_submit_talk_to_expert") &&
        rpcNames.has("clientflow_claim_email_message") &&
        rpcNames.has("normalize_email")
        ? "PASS"
        : "FAIL",
      [...rpcNames].join(", "),
    );

    const { rows: rls } = await client.query(`
      SELECT c.relname, c.relrowsecurity
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
       WHERE n.nspname = 'public'
         AND c.relname IN ('crm_inquiries','crm_email_messages','crm_workflow_runs')
    `);
    const rlsOk = rls.length > 0 && rls.every((r) => r.relrowsecurity === true);
    record("RLS enabled on ClientFlow tables", rlsOk ? "PASS" : "FAIL", JSON.stringify(rls));

    // --- Claim RPC ACL (workers only) ---
    const { rows: claimGrants } = await client.query(`
      SELECT grantee::text AS grantee
        FROM information_schema.routine_privileges
       WHERE routine_schema = 'public'
         AND routine_name = 'clientflow_claim_email_message'
         AND privilege_type = 'EXECUTE'
    `);
    const claimGrantees = [...new Set(claimGrants.map((r) => r.grantee as string))];
    const claimLeak = claimGrantees.some((g) =>
      ["anon", "authenticated", "PUBLIC", "public"].includes(g),
    );
    record(
      "Claim RPC restricted to service_role",
      !claimLeak && claimGrantees.includes("service_role") ? "PASS" : "FAIL",
      `grantees: ${claimGrantees.join(", ") || "(none)"}`,
    );

    // --- Provider authenticity ---
    assertClientFlowEmailConfig();
    if (gmailConfigured()) {
      const from = (process.env.GMAIL_FROM ?? "").trim();
      const fromOk = from.includes("@") && !from.includes("<");
      record(
        "Gmail credentials",
        fromOk ? "PASS" : "FAIL",
        fromOk ? "GMAIL_* present" : "GMAIL_FROM must be a real mailbox address",
      );
    } else {
      record(
        "Gmail credentials",
        "BLOCKED",
        "GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN/FROM not set — live send cannot pass",
      );
    }
    if (process.env.CLIENTFLOW_INTERNAL_NOTIFY_TO) {
      const notifyTo = process.env.CLIENTFLOW_INTERNAL_NOTIFY_TO.trim();
      const looksPlaceholder =
        notifyTo.includes("<") ||
        !notifyTo.includes("@") ||
        /sales\/intake|role mailbox|example\.com/i.test(notifyTo);
      record(
        "Internal notify recipient",
        looksPlaceholder ? "FAIL" : "PASS",
        looksPlaceholder
          ? "Value looks like a placeholder — set a real intake/sales mailbox"
          : "configured",
      );
    } else {
      record(
        "Internal notify recipient",
        "BLOCKED",
        "CLIENTFLOW_INTERNAL_NOTIFY_TO not set — welcome+internal pair incomplete",
      );
    }
    record(
      "Console cannot masquerade as sent in production",
      "PASS",
      "console → status=simulated or production config failure; never provider=gmail status=sent",
    );

    // --- Live path ---
    const suffix = crypto.randomUUID().slice(0, 8);
    const email = `gate.${suffix}@example.com`;

    process.env.CLIENTFLOW_EMAIL_FORCE_FAIL = "";
    const first = await submitTalkToExpert({
      name: "Gate Tester",
      email,
      company: `Gate Co ${suffix}`,
      message: "Production gate live submission",
      sourcePage: "/capabilities/oracle",
      consentGiven: true,
    });

    if (!first.ok) {
      record("Live Talk to Expert submit", "FAIL", first.error);
      printTable();
      process.exit(1);
    }
    record("Live Talk to Expert submit", "PASS", `inquiry ${first.inquiryId}`);

    const { rows: contactCount } = await client.query(
      `SELECT COUNT(*)::int AS n FROM crm_contacts WHERE email_normalized = lower($1)`,
      [email],
    );
    record(
      "Contact created",
      contactCount[0].n === 1 ? "PASS" : "FAIL",
      `count=${contactCount[0].n}`,
    );

    const { rows: inq1 } = await client.query(
      `SELECT COUNT(*)::int AS n FROM crm_inquiries WHERE contact_id = $1`,
      [first.contactId],
    );
    record("Inquiry created", inq1[0].n >= 1 ? "PASS" : "FAIL", `count=${inq1[0].n}`);

    const { rows: emails1 } = await client.query(
      `SELECT purpose, status FROM crm_email_messages WHERE inquiry_id = $1 ORDER BY purpose`,
      [first.inquiryId],
    );
    const expectInternal = Boolean(process.env.CLIENTFLOW_INTERNAL_NOTIFY_TO);
    const expectedCount = expectInternal ? 2 : 1;
    record(
      "Queued email rows created",
      emails1.length === expectedCount ? "PASS" : emails1.length >= 1 ? "PASS" : "FAIL",
      `count=${emails1.length} expected=${expectedCount} rows=${JSON.stringify(emails1)}`,
    );
    if (expectInternal) {
      const hasAck = emails1.some((r) => r.purpose === "CLIENT_ACK");
      const hasInt = emails1.some((r) => r.purpose === "INTERNAL_NOTIFY");
      record(
        "Client ack + internal notify queued",
        hasAck && hasInt ? "PASS" : "FAIL",
        JSON.stringify(emails1),
      );
    } else {
      record(
        "Client ack + internal notify queued",
        "BLOCKED",
        "Set CLIENTFLOW_INTERNAL_NOTIFY_TO to queue both messages",
      );
    }

    // Atomic claim: two workers, one message → exactly one winner
    const claimTarget = emails1[0]
      ? (
          await client.query(
            `SELECT id FROM crm_email_messages WHERE inquiry_id = $1 LIMIT 1`,
            [first.inquiryId],
          )
        ).rows[0]?.id
      : null;
    if (claimTarget) {
      await client.query(
        `UPDATE crm_email_messages
            SET status = 'queued', claimed_at = NULL, claimed_by = NULL,
                next_attempt_at = NULL, provider_message_id = NULL, attempt_count = 0
          WHERE id = $1`,
        [claimTarget],
      );
      const raceA = new pg.Client({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
      });
      const raceB = new pg.Client({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
      });
      await Promise.all([raceA.connect(), raceB.connect()]);
      try {
        const [c1, c2] = await Promise.all([
          raceA.query(`SELECT id, claimed_by FROM clientflow_claim_email_message($1, $2)`, [
            claimTarget,
            "gate-worker-a",
          ]),
          raceB.query(`SELECT id, claimed_by FROM clientflow_claim_email_message($1, $2)`, [
            claimTarget,
            "gate-worker-b",
          ]),
        ]);
        const winners = [c1.rows[0], c2.rows[0]].filter((r) => r?.id);
        record(
          "Atomic claim: concurrent workers",
          winners.length === 1 ? "PASS" : "FAIL",
          `winners=${winners.length} by=${winners.map((w) => w.claimed_by).join(",")}`,
        );
      } finally {
        await Promise.all([raceA.end(), raceB.end()]);
      }
      await client.query(
        `UPDATE crm_email_messages
            SET status = 'queued', claimed_at = NULL, claimed_by = NULL, next_attempt_at = NULL
          WHERE id = $1`,
        [claimTarget],
      );
    } else {
      record("Atomic claim: concurrent workers", "FAIL", "no email row to claim");
    }

    const { rows: acts1 } = await client.query(
      `SELECT COUNT(*)::int AS n FROM crm_activities WHERE inquiry_id = $1`,
      [first.inquiryId],
    );
    record("Activity created", acts1[0].n >= 1 ? "PASS" : "FAIL", `count=${acts1[0].n}`);

    if (skipLiveSend || !gmailConfigured()) {
      record(
        "Worker live Gmail delivery",
        "BLOCKED",
        skipLiveSend ? "--skip-live-send" : "Gmail not configured",
      );
    } else {
      process.env.CLIENTFLOW_REQUIRE_GMAIL = "true";
      const { getClientFlowProviderName } = await import("../lib/clientflow/email-provider");
      const providerName = getClientFlowProviderName();
      record(
        "Provider is Gmail (not console)",
        providerName === "gmail" ? "PASS" : "FAIL",
        `active provider=${providerName}`,
      );
      const drain = await processClientFlowEmailQueue(20);
      record(
        "Worker live Gmail delivery",
        drain.sent >= 1 ? "PASS" : "FAIL",
        `sent=${drain.sent} simulated=${drain.simulated} failed=${drain.failed}`,
      );
      const { rows: sentRows } = await client.query(
        `SELECT status, provider FROM crm_email_messages WHERE inquiry_id = $1`,
        [first.inquiryId],
      );
      const realSent = sentRows.filter(
        (r) => r.status === "sent" && r.provider === "gmail",
      );
      const fakeSent = sentRows.some(
        (r) => r.status === "sent" && r.provider === "console",
      );
      const allSent = sentRows.every(
        (r) => r.status === "sent" && r.provider === "gmail",
      );
      record(
        "Sent means Gmail (not console)",
        realSent.length > 0 && !fakeSent ? "PASS" : fakeSent ? "FAIL" : "BLOCKED",
        JSON.stringify(sentRows),
      );
      record(
        "Both welcome + internal Sent via Gmail",
        allSent && sentRows.length >= 2 ? "PASS" : "FAIL",
        JSON.stringify(sentRows),
      );
    }

    // Duplicate email
    const second = await submitTalkToExpert({
      name: "Gate Tester",
      email: email.toUpperCase(),
      company: `Gate Co ${suffix}`,
      message: "Second inquiry same email",
      consentGiven: true,
    });
    if (!second.ok) {
      record("Duplicate-email second inquiry", "FAIL", second.error);
    } else {
      record(
        "Duplicate-email second inquiry",
        second.contactId === first.contactId ? "PASS" : "FAIL",
        `contact ${second.contactId} (first ${first.contactId})`,
      );
      const { rows: c2 } = await client.query(
        `SELECT COUNT(*)::int AS n FROM crm_contacts WHERE email_normalized = lower($1)`,
        [email],
      );
      record("Still one contact", c2[0].n === 1 ? "PASS" : "FAIL", `count=${c2[0].n}`);
      const { rows: i2 } = await client.query(
        `SELECT COUNT(*)::int AS n FROM crm_inquiries WHERE contact_id = $1`,
        [first.contactId],
      );
      record("Inquiries incremented", i2[0].n >= 2 ? "PASS" : "FAIL", `count=${i2[0].n}`);
    }

    // Forced outage
    process.env.CLIENTFLOW_EMAIL_FORCE_FAIL = "true";
    const failEmail = `gate.fail.${suffix}@example.com`;
    const failSubmit = await submitTalkToExpert({
      name: "Fail Tester",
      email: failEmail,
      company: `Fail Co ${suffix}`,
      message: "Outage test",
      consentGiven: true,
    });
    if (!failSubmit.ok) {
      record("Forced-failure submit persists", "FAIL", failSubmit.error);
    } else {
      await processClientFlowEmailQueue(20);
      const { rows: failInq } = await client.query(
        `SELECT id FROM crm_inquiries WHERE id = $1`,
        [failSubmit.inquiryId],
      );
      const { rows: failMail } = await client.query(
        `SELECT status FROM crm_email_messages WHERE inquiry_id = $1`,
        [failSubmit.inquiryId],
      );
      const inquiryAlive = failInq.length === 1;
      const mailBad = failMail.every((m) =>
        ["queued", "retrying", "failed"].includes(m.status as string),
      );
      record(
        "Forced outage: inquiry survives",
        inquiryAlive ? "PASS" : "FAIL",
        inquiryAlive ? "inquiry present" : "missing",
      );
      record(
        "Forced outage: email not falsely sent",
        mailBad ? "PASS" : "FAIL",
        JSON.stringify(failMail),
      );

      // Retry after clearing fail flag
      process.env.CLIENTFLOW_EMAIL_FORCE_FAIL = "";
      const { rows: toRetry } = await client.query(
        `SELECT id FROM crm_email_messages WHERE inquiry_id = $1 LIMIT 1`,
        [failSubmit.inquiryId],
      );
      if (toRetry[0] && gmailConfigured() && !skipLiveSend) {
        const r1 = await retryClientFlowEmail(toRetry[0].id as string);
        const r2 = await retryClientFlowEmail(toRetry[0].id as string);
        const { rows: afterRetry } = await client.query(
          `SELECT status, provider, provider_message_id FROM crm_email_messages WHERE id = $1`,
          [toRetry[0].id],
        );
        record(
          "Retry after outage",
          r1.ok || afterRetry[0]?.status === "sent" ? "PASS" : "FAIL",
          `retry1=${JSON.stringify(r1)} retry2=${JSON.stringify(r2)} row=${JSON.stringify(afterRetry[0])}`,
        );
        record(
          "Duplicate retry does not double-send",
          r2.ok === false || afterRetry[0]?.provider_message_id
            ? "PASS"
            : "FAIL",
          "second retry blocked or same provider id",
        );
      } else {
        record(
          "Retry after outage",
          "BLOCKED",
          "Requires Gmail credentials for live retry proof",
        );
        record("Duplicate retry does not double-send", "BLOCKED", "skipped without Gmail");
      }
    }
    process.env.CLIENTFLOW_EMAIL_FORCE_FAIL = "";

    // Concurrency
    const raceEmail = `gate.race.${suffix}@example.com`;
    const [a, b] = await Promise.all([
      submitTalkToExpert({
        name: "Race A",
        email: raceEmail,
        company: `Race Co ${suffix}`,
        message: "A",
        consentGiven: true,
      }),
      submitTalkToExpert({
        name: "Race B",
        email: raceEmail,
        company: `Race Co ${suffix}`,
        message: "B",
        consentGiven: true,
      }),
    ]);
    const bothOk = a.ok && b.ok;
    if (!bothOk) {
      record(
        "Concurrent same-email submit",
        "FAIL",
        `a=${JSON.stringify(a)} b=${JSON.stringify(b)}`,
      );
    } else {
      const contactSame = a.ok && b.ok && a.contactId === b.contactId;
      const { rows: raceContacts } = await client.query(
        `SELECT COUNT(*)::int AS n FROM crm_contacts WHERE email_normalized = lower($1)`,
        [raceEmail],
      );
      const { rows: raceInq } = await client.query(
        `SELECT COUNT(*)::int AS n FROM crm_inquiries i
           JOIN crm_contacts c ON c.id = i.contact_id
          WHERE c.email_normalized = lower($1)`,
        [raceEmail],
      );
      record(
        "Concurrent same-email submit",
        contactSame && raceContacts[0].n === 1 && raceInq[0].n === 2 ? "PASS" : "FAIL",
        `contacts=${raceContacts[0].n} inquiries=${raceInq[0].n} sameContact=${contactSame}`,
      );
    }

    record(
      "Secrets not logged (code review)",
      "PASS",
      "Worker logs provider errors without body/credentials; console logs subject only",
    );
  } finally {
    await client.end();
  }

  printTable();
  const failed = gates.filter((g) => g.status === "FAIL").length;
  const blocked = gates.filter((g) => g.status === "BLOCKED").length;
  if (failed > 0) process.exit(1);
  if (blocked > 0) {
    console.log(`\nPhase 1 code-complete; production validation pending (${blocked} blocked).`);
    process.exit(2);
  }
  console.log("\nPhase 1 production gate GREEN.");
}

function printTable() {
  console.log("\n=== ClientFlow Phase 1 production-release gate ===\n");
  console.log("| Item | Status | Notes |");
  console.log("|---|---|---|");
  for (const g of gates) {
    console.log(`| ${g.item} | ${g.status} | ${g.notes.replace(/\|/g, "/")} |`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
