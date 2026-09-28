/**
 * QA persona + realistic lineage provisioning, additive to scripts/seed-supabase.ts.
 *
 * Why a separate script: scripts/seed-supabase.ts already provisions 3 real
 * Supabase Auth + role-linked personas (Michael Brown — SYSTEM_ADMIN +
 * HR_ADMIN + PAYROLL_ADMIN + MANAGER; Jennifer Lee — EMPLOYEE, reports to
 * Michael Brown; Alex Rivera — RECRUITER), and scripts/browser-qa.ts +
 * scripts/hire-lineage-regression.ts already depend on that bundled-role
 * shape for their own cross-role testing. Changing those 3 would risk
 * breaking existing scripts. This script only ADDS what's missing: clean,
 * single-role personas for HR, Payroll, Manager, Administrator, and
 * CRM/Sales — used to prove authorization *boundaries* (each can reach only
 * their own module), distinct from the existing 3 "data-rich" personas used
 * to prove workspaces render real content.
 *
 * It also seeds one authentic cross-domain lineage each for ATS and CRM,
 * driven through real app logic (the Postgres hire-conversion function, the
 * real application-status-transition function, and the real
 * submitTalkToExpert() action) rather than hand-inserted rows, per the
 * "prove continuous data lineage, don't fake it" requirement:
 *   Requisition REQ-2026-0142 -> Application -> Interview -> Offer -> Hire
 *   -> Employee (Aisha Rahman, reporting to the new Manager persona)
 *   Talk to Expert (Robert Williams / BluePeak Manufacturing) -> Contact
 *   -> Inquiry -> Workflow -> Activity
 *
 * Safe to re-run: every insert is an upsert keyed on `id`, and the ATS/CRM
 * lineage functions are themselves idempotent (dedupe by application id /
 * normalized email) per their own design.
 *
 * Usage: npx tsx --env-file=.env.local scripts/seed-qa-personas.ts
 */
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import WebSocket from "ws";

import { submitTalkToExpert } from "@/lib/clientflow/submit";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local.",
  );
  process.exit(1);
}
if (!databaseUrl) {
  console.error("Missing DATABASE_URL (or SUPABASE_DB_URL) in .env.local.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: WebSocket as unknown as typeof globalThis.WebSocket },
});

const now = new Date().toISOString();
const QA_PASSWORD = process.env.SEED_QA_PASSWORD ?? "ConsultAmerica!QA1";

async function upsert(table: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`Upsert into ${table} failed: ${error.message}`);
  console.log(`  ${table}: ${rows.length} row(s)`);
}

async function findAuthUserByEmail(email: string) {
  let page = 1;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(`listUsers failed: ${error.message}`);
    const match = data.users.find((u) => u.email === email);
    if (match) return match;
    if (data.users.length < 200) return undefined;
    page += 1;
  }
}

/** Create-or-find the Supabase Auth user + profiles row for one QA identity. */
async function provisionAuthProfile(
  userId: string,
  email: string,
  displayName: string,
  password: string,
): Promise<string> {
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let authUserId = created?.user?.id;
  if (createError || !authUserId) {
    const existing = await findAuthUserByEmail(email);
    if (!existing) {
      throw new Error(`Could not create or find auth user for ${email}: ${createError?.message}`);
    }
    authUserId = existing.id;
  }

  await upsert("profiles", [
    {
      id: userId,
      email,
      display_name: displayName,
      status: "ACTIVE",
      auth_user_id: authUserId,
      created_at: now,
      updated_at: now,
    },
  ]);

  return authUserId;
}

// ---------------------------------------------------------------------------
// Part 1 — clean, single-role QA personas (boundary testing)
// ---------------------------------------------------------------------------

type QaPersona = {
  userId: string;
  employeeId?: string; // omit for a persona that should have NO employee record (CRM)
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  roles: string[];
  employeeNumber?: string;
  purpose: string;
};

// Reused org placement for the 4 new internal-staff personas — an existing,
// valid FK combo (Enterprise Transformation / Virginia); the specific
// department doesn't matter for auth testing, only that it's real.
const QA_ORG_PLACEMENT = {
  legalEntityId: "le-ca-us",
  businessUnitId: "bu-consulting",
  departmentId: "dept-transformation",
  positionId: "pos-transform-consultant",
  locationId: "loc-va",
};

const qaPersonas: QaPersona[] = [
  {
    userId: "user-qa-hr-001",
    employeeId: "emp-qa-hr-001",
    email: "priya.sharma.qa@consultamerica.demo",
    displayName: "Priya Sharma",
    firstName: "Priya",
    lastName: "Sharma",
    employeeNumber: "CA-QA-HR01",
    roles: ["HR_SPECIALIST"],
    purpose: "Clean HR-only persona — proves HR boundary without Admin/Payroll bundled in.",
  },
  {
    userId: "user-qa-payroll-001",
    employeeId: "emp-qa-payroll-001",
    email: "david.chen.qa@consultamerica.demo",
    displayName: "David Chen",
    firstName: "David",
    lastName: "Chen",
    employeeNumber: "CA-QA-PAY01",
    roles: ["PAYROLL_ADMIN"],
    purpose: "Clean Payroll-only persona.",
  },
  {
    userId: "user-qa-manager-001",
    employeeId: "emp-qa-manager-001",
    email: "sofia.martinez.qa@consultamerica.demo",
    displayName: "Sofia Martinez",
    firstName: "Sofia",
    lastName: "Martinez",
    employeeNumber: "CA-QA-MGR01",
    roles: ["MANAGER"],
    purpose:
      "Clean Manager-only persona. Aisha Rahman (hired via the ATS lineage below) reports to her.",
  },
  {
    userId: "user-qa-admin-001",
    employeeId: "emp-qa-admin-001",
    email: "devon.carter.qa@consultamerica.demo",
    displayName: "Devon Carter",
    firstName: "Devon",
    lastName: "Carter",
    employeeNumber: "CA-QA-ADM01",
    roles: ["SYSTEM_ADMIN"],
    purpose:
      "Clean Administrator persona (SYSTEM_ADMIN only — Michael Brown's admin access is bundled with HR/Payroll/Manager, which existing scripts rely on, so this proves Admin's boundary in isolation).",
  },
  {
    userId: "user-qa-crm-001",
    // no employeeId — CRM's session model doesn't require one (getCrmSession
    // only checks profiles + user_roles), and this deliberately proves that
    // a CRM/Sales identity is denied Employee/HR/Payroll self-service (which
    // all require an employee_profiles link) without needing a separate test.
    email: "morgan.ellis.qa@consultamerica.demo",
    displayName: "Morgan Ellis",
    firstName: "Morgan",
    lastName: "Ellis",
    roles: ["SALES_MANAGER"],
    purpose: "Clean CRM/Sales persona with no employee record at all.",
  },
];

async function seedQaPersonas() {
  console.log("Seeding clean QA personas (identity + roles)...\n");

  const employeeRows = qaPersonas
    .filter((p) => p.employeeId)
    .map((p) => ({
      id: p.employeeId!,
      employee_number: p.employeeNumber ?? `CA-QA-${p.employeeId}`,
      first_name: p.firstName,
      last_name: p.lastName,
      preferred_name: p.firstName,
      hire_date: "2026-01-06",
      original_hire_date: "2026-01-06",
      employment_status: "ACTIVE",
      work_email: p.email,
      created_at: now,
      updated_at: now,
    }));
  await upsert("employee_profiles", employeeRows);

  const assignmentRows = qaPersonas
    .filter((p) => p.employeeId)
    .map((p) => ({
      id: `asg-${p.employeeId}`,
      employee_id: p.employeeId!,
      legal_entity_id: QA_ORG_PLACEMENT.legalEntityId,
      business_unit_id: QA_ORG_PLACEMENT.businessUnitId,
      department_id: QA_ORG_PLACEMENT.departmentId,
      position_id: QA_ORG_PLACEMENT.positionId,
      location_id: QA_ORG_PLACEMENT.locationId,
      employment_type: "FULL_TIME",
      workplace_type: "HYBRID",
      start_date: "2026-01-06",
      assignment_status: "ACTIVE",
      primary_assignment: true,
      change_reason: "QA persona provisioning",
      created_at: now,
      updated_at: now,
    }));
  await upsert("job_assignments", assignmentRows);

  for (const persona of qaPersonas) {
    await provisionAuthProfile(persona.userId, persona.email, persona.displayName, QA_PASSWORD);

    if (persona.employeeId) {
      await supabase
        .from("employee_profiles")
        .update({ user_id: persona.userId })
        .eq("id", persona.employeeId);
    }

    await upsert(
      "user_roles",
      persona.roles.map((role) => ({
        id: `${persona.userId}-${role.toLowerCase()}`,
        user_id: persona.userId,
        role,
      })),
    );

    console.log(`  ${persona.displayName} <${persona.email}> — ${persona.roles.join(", ")}`);
    console.log(`    ${persona.purpose}\n`);
  }

  console.log(`QA persona login password (staff personas only; Candidate QA persona retired): ${QA_PASSWORD}\n`);
}

// ---------------------------------------------------------------------------
// Part 1b — retire the disposable Candidate QA login only.
// Candidate product routes, schema, and the ATS hire-lineage candidate
// (Aisha Rahman) stay. Only Jordan Casey's seeded QA identity is removed,
// and only when the email matches this exact fixture.
// ---------------------------------------------------------------------------

const CANDIDATE_QA_USER_ID = "user-qa-candidate-001";
const CANDIDATE_QA_ID = "cand-qa-jordan-casey";
const CANDIDATE_QA_EMAIL = "jordan.casey.qa@consultamerica.demo";

async function retireQaCandidate() {
  console.log("Retiring disposable Candidate QA persona (Jordan Casey) if present...\n");

  const existing = await findAuthUserByEmail(CANDIDATE_QA_EMAIL);
  if (existing && existing.email === CANDIDATE_QA_EMAIL) {
    const { error } = await supabase.auth.admin.deleteUser(existing.id);
    if (error) {
      console.error(`  Auth delete skipped: ${error.message}`);
    } else {
      console.log(`  Deleted auth user ${CANDIDATE_QA_EMAIL}`);
    }
  } else {
    console.log(`  No auth user for ${CANDIDATE_QA_EMAIL}`);
  }

  await supabase.from("user_roles").delete().eq("id", `${CANDIDATE_QA_USER_ID}-candidate`);
  await supabase.from("profiles").delete().eq("id", CANDIDATE_QA_USER_ID).eq("email", CANDIDATE_QA_EMAIL);
  await supabase.from("candidate_profiles").delete().eq("id", CANDIDATE_QA_ID).eq("email", CANDIDATE_QA_EMAIL);
  console.log("  Removed seeded profile/role/candidate rows keyed to Jordan Casey only.\n");
}

// ---------------------------------------------------------------------------
// Part 2 — ATS lineage: Requisition -> Application -> Interview -> Offer ->
// Hire -> Employee, driven through the real Postgres functions the app uses.
// ---------------------------------------------------------------------------

async function seedAtsLineage(pgClient: pg.Client) {
  console.log("Seeding ATS QA lineage (REQ-2026-0142 / Aisha Rahman)...\n");

  const requisitionId = "req-qa-0142";
  const jobId = "post-req-qa-0142";
  const candidateId = "cand-qa-aisha-rahman";
  const applicationId = "app-qa-aisha-rahman";
  const interviewId = "int-qa-aisha-rahman";
  const offerId = "offer-qa-aisha-rahman";

  await upsert("job_requisitions", [
    {
      id: requisitionId,
      requisition_number: "REQ-2026-0142",
      title: "Senior Oracle Fusion Financials Consultant",
      department_id: "dept-oracle",
      position_id: "pos-oracle-fin-sr",
      location_id: "loc-md",
      employment_type: "FULL_TIME",
      workplace_type: "HYBRID",
      career_area: "technology-oracle",
      openings: 1,
      currency: "USD",
      description:
        "Lead Oracle Fusion Financials implementations for enterprise clients — QA lineage fixture.",
      responsibilities: [
        "Support Oracle Fusion Financials design, configuration, and testing.",
        "Partner with finance and IT stakeholders on solution design.",
      ],
      qualifications: [
        "Experience with Oracle Fusion Cloud Financials.",
        "Strong understanding of enterprise finance processes.",
      ],
      preferred_qualifications: ["Oracle Cloud certification."],
      status: "PUBLISHED",
      created_at: now,
      updated_at: now,
    },
  ]);

  await upsert("jobs", [
    {
      id: jobId,
      requisition_id: requisitionId,
      slug: "senior-oracle-fusion-financials-consultant-qa-0142",
      title: "Senior Oracle Fusion Financials Consultant",
      summary: "Lead Oracle Fusion Financials implementations for enterprise clients.",
      description:
        "Lead Oracle Fusion Financials implementations for enterprise clients — QA lineage fixture.",
      career_area: "technology-oracle",
      department_name: "Oracle Consulting",
      location_name: "Maryland",
      workplace_type: "HYBRID",
      employment_type: "FULL_TIME",
      responsibilities: ["Support Oracle Fusion Financials design, configuration, and testing."],
      qualifications: ["Experience with Oracle Fusion Cloud Financials."],
      preferred_qualifications: ["Oracle Cloud certification."],
      status: "PUBLISHED",
      published_at: now,
      is_demo: true,
      created_at: now,
      updated_at: now,
    },
  ]);

  await upsert("candidate_profiles", [
    {
      id: candidateId,
      first_name: "Aisha",
      last_name: "Rahman",
      email: "aisha.rahman.qa@example.com",
      phone: "555-0142",
      work_authorization: "Authorized",
      source: "Referral",
      created_at: now,
      updated_at: now,
    },
  ]);

  // `applications.status` is guarded by a trigger that only allows changes
  // via application_status_transition() — a plain upsert/update on an
  // existing row throws. Insert only if the row doesn't exist yet; status
  // progression below always resumes from whatever the current status is,
  // so this whole function stays idempotent across re-runs.
  const { rows: currentRows } = await pgClient.query(
    `SELECT status FROM applications WHERE id = $1`,
    [applicationId],
  );
  if (!currentRows[0]) {
    await pgClient.query(
      `INSERT INTO applications (id, application_number, candidate_id, requisition_id, job_id, status, applied_at, updated_at)
       VALUES ($1, 'APP-QA-0142', $2, $3, $4, 'APPLIED', $5, $5)`,
      [applicationId, candidateId, requisitionId, jobId, now],
    );
  }
  const currentStatus = currentRows[0]?.status as string | undefined;
  const path = ["RECRUITER_SCREEN", "INTERVIEW", "OFFER"] as const;
  const pathIndex = currentStatus
    ? path.indexOf(currentStatus as (typeof path)[number])
    : -1;
  // Only walk the path for a brand-new application (no status yet) or one
  // still within RECRUITER_SCREEN/INTERVIEW/OFFER. Anything already past
  // that (e.g. HIRED, from a prior run) is left alone — re-running this
  // must never attempt to move a hired application backward.
  if (!currentStatus || pathIndex >= 0) {
    const startIndex = currentStatus ? pathIndex + 1 : 0;
    for (const status of path.slice(startIndex)) {
      await pgClient.query(
        `SELECT application_status_transition($1, $2, NULL, $3, FALSE)`,
        [applicationId, status, "QA lineage fixture"],
      );
    }
  }

  await pgClient.query(
    `INSERT INTO interviews (id, application_id, interview_type, status, scheduled_at, duration_minutes)
     VALUES ($1, $2, 'VIDEO', 'COMPLETED', $3, 60)
     ON CONFLICT (id) DO NOTHING`,
    [interviewId, applicationId, now],
  );

  const { rows: offerRows } = await pgClient.query(
    `SELECT status FROM offers WHERE id = $1`,
    [offerId],
  );
  if (!offerRows[0]) {
    await pgClient.query(
      `INSERT INTO offers (id, application_id, offer_number, status, currency,
         employment_type, workplace_type, start_date, base_salary)
       VALUES ($1, $2, 'OFR-QA-0142', 'EXTENDED', 'USD', 'FULL_TIME', 'HYBRID', CURRENT_DATE + 21, 145000)`,
      [offerId, applicationId],
    );
  }
  await pgClient.query(`UPDATE offers SET status = 'ACCEPTED' WHERE id = $1`, [offerId]);

  const { rows: existingEmployee } = await pgClient.query(
    `SELECT id FROM employee_profiles WHERE source_application_id = $1`,
    [applicationId],
  );
  if (existingEmployee[0]) {
    console.log(`  Aisha Rahman already hired -> employee ${existingEmployee[0].id}\n`);
    return;
  }

  const { rows } = await pgClient.query(
    `SELECT convert_accepted_offer_to_employee(
       $1, $2, $3, 'Aisha', 'Rahman', $4, NULL, CURRENT_DATE + 21,
       $5, $6, $7, $8, $9, $10, $11, $12
     ) AS result`,
    [
      applicationId,
      offerId,
      candidateId,
      "aisha.rahman.qa.personal@example.com",
      "le-ca-us",
      "bu-technology",
      "dept-oracle",
      "pos-oracle-fin-sr",
      "loc-md",
      "emp-qa-manager-001", // reports to Sofia Martinez, the clean Manager persona
      "FULL_TIME",
      "HYBRID",
    ],
  );
  const result = rows[0].result as { employeeId: string; employeeNumber: string };
  console.log(
    `  Hired Aisha Rahman -> employee ${result.employeeId} (${result.employeeNumber}), reports to Sofia Martinez\n`,
  );
}

// ---------------------------------------------------------------------------
// Part 3 — CRM lineage: Talk to Expert -> Contact -> Inquiry -> Workflow ->
// Activity, driven through the real submitTalkToExpert() action.
// ---------------------------------------------------------------------------

async function seedCrmLineage() {
  console.log("Seeding CRM QA lineage (Robert Williams / BluePeak Manufacturing)...\n");

  const result = await submitTalkToExpert({
    name: "Robert Williams",
    email: "robert.williams.qa@bluepeakmfg.example.com",
    company: "BluePeak Manufacturing",
    message: "We're evaluating an Oracle Transformation engagement for our finance systems.",
    sourcePage: "/oracle",
    serviceKey: "oracle",
    sourceChannel: "talk_to_expert",
    consentGiven: true,
  });

  if (!result.ok) {
    console.error(`  Talk to Expert submission failed: ${result.error}\n`);
    return;
  }
  console.log(
    `  Contact ${result.contactId} / Account ${result.accountId} / Inquiry ${result.inquiryId} / Workflow run ${result.workflowRunId}\n`,
  );
}

async function main() {
  console.log(`Seeding QA personas + lineage at ${url}\n`);

  await seedQaPersonas();
  await retireQaCandidate();

  const pgClient = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();
  try {
    await seedAtsLineage(pgClient);
  } finally {
    await pgClient.end();
  }

  await seedCrmLineage();

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
