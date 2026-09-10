/**
 * Real authenticated browser QA across HR_ADMIN/SYSTEM_ADMIN, RECRUITER, and
 * EMPLOYEE roles against a running app instance — People, Add Employee,
 * Employee Detail tabs, Work Authorization, Employee Documents, Applications
 * queue, search/filter/sort, Schedule Interview, Candidate Match (existing
 * job / pasted JD / uploaded PDF/DOCX/TXT), CSV export, audit log entries,
 * and cross-role denial. Also doubles as the Cloudflare Workers runtime
 * check for unpdf/mammoth when pointed at `npm run preview`.
 *
 * Usage (Node runtime, full QA pass):
 *   npm run dev                                   # terminal 1
 *   npm run test:browser-qa                       # terminal 2
 *
 * Usage (real Workers runtime, Candidate Match upload extraction only):
 *   npm run preview                               # terminal 1 (prints its local URL)
 *   QA_BASE_URL=http://localhost:8771 npm run test:browser-qa -- --uploads-only
 *
 * Requires the seeded demo accounts (`npm run seed:supabase`):
 *   michael.brown@consultamerica.demo  (SYSTEM_ADMIN, HR_ADMIN, PAYROLL_ADMIN, MANAGER)
 *   alex.rivera@consultamerica.demo    (RECRUITER)
 *   jennifer.lee@consultamerica.demo   (EMPLOYEE)
 */

import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import JSZip from "jszip";
import { chromium, type Browser, type ConsoleMessage, type Page } from "playwright";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD ?? "ConsultAmerica!Demo1";
const OUT_DIR = process.env.QA_OUT_DIR ?? path.join(os.tmpdir(), "consultamerica-browser-qa");
const UPLOADS_ONLY = process.argv.includes("--uploads-only");
const HEADED = process.argv.includes("--headed");

let failed = 0;
const consoleErrors: { role: string; url: string; text: string }[] = [];

function check(ok: boolean, message: string) {
  if (!ok) failed += 1;
  console.log(ok ? `PASS  ${message}` : `FAIL  ${message}`);
  return ok;
}

function attachConsoleCapture(page: Page, role: string) {
  page.on("console", (msg: ConsoleMessage) => {
    if (msg.type() === "error") {
      consoleErrors.push({ role, url: page.url(), text: msg.text() });
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push({ role, url: page.url(), text: String(err) });
  });
}

async function screenshot(page: Page, name: string) {
  await mkdir(OUT_DIR, { recursive: true });
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true }).catch(() => {});
  return file;
}

async function login(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "load" });
  await page.fill("#login-email", email);
  await page.fill("#login-password", password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20000 });
  await page.waitForLoadState("load").catch(() => {});
}

// ---------------------------------------------------------------------------
// Fixture generation (in-memory — no files on disk needed for Playwright's
// setInputFiles, which accepts a { name, mimeType, buffer } payload).
// ---------------------------------------------------------------------------

function buildMinimalPdf(text: string): Buffer {
  const objects: Record<number, string> = {
    1: `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
    2: `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
    3: `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 320 150] /Contents 5 0 R >>\nendobj\n`,
    4: `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`,
  };
  const stream = `BT /F1 16 Tf 20 80 Td (${text}) Tj ET`;
  objects[5] = `5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`;

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (let i = 1; i <= 5; i++) {
    offsets[i] = Buffer.byteLength(pdf, "latin1");
    pdf += objects[i];
  }
  const xrefStart = Buffer.byteLength(pdf, "latin1");
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (let i = 1; i <= 5; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += xref;
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}

async function buildMinimalDocx(text: string): Promise<Buffer> {
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
  );
  zip.folder("_rels")!.file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
  );
  zip.folder("word")!.file(
    "document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body><w:p><w:r><w:t>${text}</w:t></w:r></w:p></w:body>
</w:document>`,
  );
  return zip.generateAsync({ type: "nodebuffer" });
}

async function fixtures() {
  return {
    pdf: buildMinimalPdf("QA PDF EXTRACTION TEST — Oracle Financials Consultant"),
    docx: await buildMinimalDocx("QA DOCX EXTRACTION TEST — Enterprise Transformation Lead"),
    txt: Buffer.from("QA TXT EXTRACTION TEST — Data Engineer", "utf-8"),
    malformedPdf: Buffer.from("this is not a real pdf, just garbage bytes ".repeat(20), "utf-8"),
    oversized: Buffer.alloc(9 * 1024 * 1024, 0x41), // 9MB, over the 8MB cap
  };
}

// ---------------------------------------------------------------------------
// Candidate Match upload scenarios (shared between full run and --uploads-only,
// which is how this doubles as the Workers-runtime check for unpdf/mammoth).
// ---------------------------------------------------------------------------

async function runCandidateMatchUploadScenarios(page: Page, role: string) {
  const fx = await fixtures();
  await page.goto(`${BASE_URL}/app/recruiting/job-match`, { waitUntil: "load" });
  check(
    await page.getByRole("heading", { name: "Candidate Match Analysis" }).isVisible(),
    `${role}: Candidate Match page loads`,
  );

  async function tryUpload(
    label: string,
    file: { name: string; mimeType: string; buffer: Buffer },
    expect: "text" | "error",
    expectedSubstring?: string,
  ) {
    await page.getByRole("button", { name: "Upload Job Description" }).click();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(file);
    // extraction is async; wait for either the textarea to populate or an error to render
    await page
      .waitForFunction(
        () => {
          const err = document.querySelector('[class*="text-\\[var\\(--ca-error\\)\\]"]');
          const textarea = document.querySelector("textarea");
          return (err && err.textContent && err.textContent.trim().length > 0) || (textarea && (textarea as HTMLTextAreaElement).value.trim().length > 0);
        },
        { timeout: 20000 },
      )
      .catch(() => {});

    const errorText = (await page.locator('p.text-\\[var\\(--ca-error\\)\\]').first().textContent().catch(() => null))?.trim();
    const textareaValue = (await page.locator("textarea").first().inputValue().catch(() => ""))?.trim();

    if (expect === "text") {
      const ok = check(
        Boolean(textareaValue) && !errorText,
        `${role}: ${label} extracts text (Candidate Match upload, ${BASE_URL})`,
      );
      if (ok && expectedSubstring) {
        check(
          textareaValue.includes(expectedSubstring),
          `${role}: ${label} extracted text contains expected content`,
        );
      }
    } else {
      check(
        Boolean(errorText) && (!expectedSubstring || errorText!.includes(expectedSubstring)),
        `${role}: ${label} degrades gracefully with a friendly error ("${errorText ?? "none shown"}")`,
      );
    }
    await screenshot(page, `${role}-candidate-match-${label.replace(/\s+/g, "-").toLowerCase()}`);
  }

  await tryUpload("PDF upload", { name: "jd.pdf", mimeType: "application/pdf", buffer: fx.pdf }, "text", "QA PDF EXTRACTION TEST");
  await tryUpload(
    "DOCX upload",
    {
      name: "jd.docx",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      buffer: fx.docx,
    },
    "text",
    "QA DOCX EXTRACTION TEST",
  );
  await tryUpload("TXT upload", { name: "jd.txt", mimeType: "text/plain", buffer: fx.txt }, "text", "QA TXT EXTRACTION TEST");
  await tryUpload("Malformed PDF upload", { name: "broken.pdf", mimeType: "application/pdf", buffer: fx.malformedPdf }, "error");
  await tryUpload("Oversized upload", { name: "huge.pdf", mimeType: "application/pdf", buffer: fx.oversized }, "error", "8MB");
}

// ---------------------------------------------------------------------------
// HR_ADMIN / SYSTEM_ADMIN flow
// ---------------------------------------------------------------------------

async function runHrAdminFlow(browser: Browser) {
  const role = "HR_ADMIN/SYSTEM_ADMIN";
  const page = await browser.newPage();
  attachConsoleCapture(page, role);

  await login(page, "michael.brown@consultamerica.demo", DEMO_PASSWORD);
  check(!page.url().includes("/login"), `${role}: login succeeds`);

  // People list
  await page.goto(`${BASE_URL}/workforce/people`, { waitUntil: "load" });
  check(await page.getByRole("heading", { name: "People" }).isVisible(), `${role}: People list loads`);
  await screenshot(page, "hr-people-list");

  // Add Employee
  await page.getByRole("link", { name: "+ Add Employee" }).click();
  await page.waitForURL(/\/workforce\/people\/new/);
  await page.waitForLoadState("load");
  // Dev mode (Turbopack) can still be compiling this route's client bundle
  // when the page first paints — give hydration a moment so the click below
  // lands on a bound React handler instead of falling back to a native
  // form GET (which would silently no-op the server action).
  await page.waitForTimeout(1000);
  const stamp = Date.now();
  await page.fill('input[name="firstName"]', "QA");
  await page.fill('input[name="lastName"]', `Tester${stamp}`);
  await page.fill('input[name="email"]', `qa.tester.${stamp}@example.com`);
  await page.fill('input[name="startDate"]', "2026-09-01");
  await screenshot(page, "hr-add-employee-form");
  await page.getByRole("button", { name: "Add Employee" }).click();
  const created = await page
    .waitForURL(/\/workforce\/people\/emp-/, { timeout: 30000 })
    .then(() => true)
    .catch(() => false);
  if (!created) {
    const formError = await page
      .locator('div.text-\\[var\\(--ca-error\\)\\]')
      .first()
      .textContent()
      .catch(() => null);
    console.log(`  Add Employee did not redirect. url=${page.url()} error="${formError ?? "none shown"}"`);
  }
  check(created, `${role}: Add Employee creates a record and redirects to its detail page`);

  if (created) {
    // Employee Detail tabs
    const tabs = [
      "Overview",
      "Employment",
      "Assignments",
      "Documents",
      "Onboarding",
      "Time & Leave",
      "HR Requests",
      "Compensation",
      "Activity",
    ];
    for (const tab of tabs) {
      const tabEl = page.getByRole("tab", { name: tab });
      await tabEl.click();
      const visible = await page.getByRole("tabpanel").isVisible().catch(() => false);
      check(visible, `${role}: Employee Detail "${tab}" tab renders`);
    }
    await screenshot(page, "hr-employee-detail");

    // Work Authorization (lives inside the Employment tab)
    await page.getByRole("tab", { name: "Employment" }).click();
    await page.selectOption('select[name="authorizationType"]', "H-1B");
    await page.fill('input[name="authorizationExpirationDate"]', "2027-06-01");
    await page.selectOption('select[name="verificationStatus"]', "VERIFIED");
    await page.fill('textarea[name="hrNotes"]', "QA regression note — safe to ignore.");
    await page.getByRole("button", { name: "Save Work Authorization" }).click();
    await page.waitForLoadState("load").catch(() => {});
    check(
      (await page.locator('select[name="verificationStatus"]').inputValue()) === "VERIFIED",
      `${role}: Work Authorization save persists Verified status`,
    );
    await screenshot(page, "hr-work-authorization");

    // Employee Documents: upload / view / archive
    await page.getByRole("tab", { name: "Documents" }).click();
    await page.selectOption('select[name="documentType"]', "OTHER");
    // Employee documents only accept PDF/DOC/DOCX/PNG/JPG
    // (lib/storage/employee-documents.ts) — a .txt fixture is correctly
    // rejected with a friendly error, so use a real PDF here.
    const fx = await fixtures();
    await page.locator('input[name="file"]').setInputFiles({
      name: "qa-doc.pdf",
      mimeType: "application/pdf",
      buffer: fx.pdf,
    });
    await page.getByRole("button", { name: "Upload" }).click();
    const docRow = page.locator("tr", { hasText: "qa-doc.pdf" });
    const uploaded = await docRow
      .waitFor({ state: "visible", timeout: 15000 })
      .then(() => true)
      .catch(() => false);
    check(uploaded, `${role}: Employee Documents upload appears in the list`);

    if (uploaded) {
      const [popup] = await Promise.all([
        page.waitForEvent("popup", { timeout: 10000 }).catch(() => null),
        docRow.getByRole("button", { name: "View", exact: true }).click(),
      ]);
      check(Boolean(popup), `${role}: Employee Documents "View" opens a signed URL`);
      await popup?.close().catch(() => {});

      await docRow.getByRole("button", { name: "Archive", exact: true }).click();
      const archivedRow = page.locator("tr", { hasText: "qa-doc.pdf" });
      // Note: getByText("Archive") would also match the "ARCHIVED" status
      // badge text once archived (case-insensitive substring match) — the
      // Archive *button* disappearing is the real signal.
      const archived = await archivedRow
        .getByRole("button", { name: "Archive", exact: true })
        .waitFor({ state: "hidden", timeout: 15000 })
        .then(() => true)
        .catch(() => false);
      check(archived, `${role}: Employee Documents "Archive" removes the Archive action (document archived)`);
    }
    await screenshot(page, "hr-employee-documents");
  }

  // Applications queue
  await page.goto(`${BASE_URL}/app/recruiting/applications`, { waitUntil: "load" });
  check(await page.getByPlaceholder(/Search candidate/).isVisible(), `${role}: Applications queue loads`);
  await screenshot(page, "hr-applications-queue");

  // Search / filter / sort
  await page.getByPlaceholder(/Search candidate/).fill("Patel");
  await page.waitForTimeout(300);
  const rachelVisible = await page.getByText("Rachel Patel", { exact: false }).isVisible().catch(() => false);
  check(rachelVisible, `${role}: Applications search filters to the matching candidate`);

  // Schedule Interview on the APPLIED-stage seeded candidate (validates the
  // APPLIED -> INTERVIEW fix end-to-end against the real Supabase RPC)
  if (rachelVisible) {
    const row = page.locator("tr", { hasText: "Rachel Patel" }).first();
    await row.getByRole("button", { name: "Schedule Interview" }).click();
    await page.getByLabel("Date").fill("2026-10-01");
    await page.getByLabel("Time").fill("10:00");
    await page.getByRole("button", { name: "Schedule" }).click();
    const scheduled = await page
      .getByText("Interview scheduled")
      .waitFor({ timeout: 10000 })
      .then(() => true)
      .catch(() => false);
    check(scheduled, `${role}: Schedule Interview succeeds from an APPLIED application`);

    await page.reload({ waitUntil: "load" });
    await page.getByPlaceholder(/Search candidate/).fill("Patel");
    await page.waitForTimeout(500);
    const rowText = await page
      .locator("tr", { hasText: "Rachel Patel" })
      .first()
      .innerText()
      .catch(() => "");
    check(
      rowText.includes("Interview"),
      `${role}: application stage advances to Interview after scheduling (status-machine fix) — row: "${rowText.replace(/\s+/g, " ").trim()}"`,
    );
  }
  await page.getByPlaceholder(/Search candidate/).fill("");

  // Candidate Match — existing job, pasted JD, uploaded PDF/DOCX/TXT
  await page.goto(`${BASE_URL}/app/recruiting/job-match`, { waitUntil: "load" });
  const jobOption = await page.locator('select').first().locator("option").first().textContent().catch(() => null);
  if (jobOption) {
    await page.getByRole("button", { name: "Analyze Candidates" }).click();
    const resultsShown = await page
      .getByText(/Results for/)
      .waitFor({ timeout: 20000 })
      .then(() => true)
      .catch(() => false);
    check(resultsShown, `${role}: Candidate Match (existing job) returns results`);
    await screenshot(page, "hr-candidate-match-existing-job");
  }

  await page.getByRole("button", { name: "Paste Job Description" }).click();
  await page.locator("textarea").first().fill(
    "Senior Oracle Financials Consultant with GL, AP, AR, and Fixed Assets experience. SQL and PL/SQL required.",
  );
  await page.getByRole("button", { name: "Analyze Candidates" }).click();
  const pastedResults = await page
    .getByText(/Results for/)
    .waitFor({ timeout: 20000 })
    .then(() => true)
    .catch(() => false);
  check(pastedResults, `${role}: Candidate Match (pasted JD) returns results`);

  // CSV export (from the Candidate Match results panel)
  if (pastedResults) {
    const exportLink = page.getByRole("link", { name: "Export CSV" });
    if (await exportLink.isVisible().catch(() => false)) {
      const href = await exportLink.getAttribute("href");
      const resp = href ? await page.request.get(new URL(href, BASE_URL).toString()) : null;
      check(
        Boolean(resp) && resp!.ok() && (resp!.headers()["content-type"] ?? "").includes("csv"),
        `${role}: Candidate Match results CSV export responds with text/csv`,
      );
    }
  }

  await runCandidateMatchUploadScenarios(page, role);

  // Applications pipeline CSV export
  await page.goto(`${BASE_URL}/app/recruiting/applications`, { waitUntil: "load" });
  const pipelineExport = page.getByRole("link", { name: "Export CSV" });
  if (await pipelineExport.isVisible().catch(() => false)) {
    const href = await pipelineExport.getAttribute("href");
    const resp = href ? await page.request.get(new URL(href, BASE_URL).toString()) : null;
    check(
      Boolean(resp) && resp!.ok() && (resp!.headers()["content-type"] ?? "").includes("csv"),
      `${role}: Application pipeline CSV export responds with text/csv`,
    );
  }

  // Audit log entries
  await page.goto(`${BASE_URL}/hr/audit`, { waitUntil: "load" });
  const auditLoaded = await page
    .getByRole("heading", { name: /Audit/i })
    .isVisible()
    .catch(() => false);
  check(auditLoaded, `${role}: Audit log page loads`);
  await screenshot(page, "hr-audit-log");

  await page.close();
}

// ---------------------------------------------------------------------------
// RECRUITER flow — allowed recruiting actions + explicit denial of HR-only
// surfaces.
// ---------------------------------------------------------------------------

async function runRecruiterFlow(browser: Browser) {
  const role = "RECRUITER";
  const page = await browser.newPage();
  attachConsoleCapture(page, role);

  await login(page, "alex.rivera@consultamerica.demo", DEMO_PASSWORD);
  check(!page.url().includes("/login"), `${role}: login succeeds`);

  await page.goto(`${BASE_URL}/app/recruiting/applications`, { waitUntil: "load" });
  check(await page.getByPlaceholder(/Search candidate/).isVisible(), `${role}: Applications queue loads`);

  await page.getByPlaceholder(/Search candidate/).fill("Kim");
  await page.waitForTimeout(300);
  check(
    await page.getByText("David Kim", { exact: false }).isVisible().catch(() => false),
    `${role}: Applications search filters to the matching candidate`,
  );
  await page.getByPlaceholder(/Search candidate/).fill("");

  await runCandidateMatchUploadScenarios(page, role);

  const exportLink = page.getByRole("link", { name: "Export CSV" });
  if (await exportLink.isVisible().catch(() => false)) {
    const href = await exportLink.getAttribute("href");
    const resp = href ? await page.request.get(new URL(href, BASE_URL).toString()) : null;
    check(Boolean(resp) && resp!.ok(), `${role}: can export the application pipeline CSV`);
  }

  // Denial checks: HR/admin-only surfaces must not be silently accessible —
  // either blocked outright (redirect to /login, 4xx/5xx, a "no access"
  // message) or redirected away to a different page the role can reach.
  async function checkDenied(url: string, label: string) {
    const resp = await page.goto(url, { waitUntil: "load" });
    const denied =
      page.url() !== url ||
      (resp?.status() ?? 200) >= 400 ||
      (await page.getByText(/forbidden|not authorized|isn.t available|don.t have access/i).isVisible().catch(() => false));
    check(denied, `${role}: ${label} is denied (redirected to ${page.url()}), not a silent 200`);
  }

  await checkDenied(`${BASE_URL}/workforce/people`, "/workforce/people (HR-only People admin)");
  await screenshot(page, "recruiter-denied-people");

  await checkDenied(`${BASE_URL}/hr/audit`, "/hr/audit (HR-only)");
  await screenshot(page, "recruiter-denied-audit");

  await page.close();
}

// ---------------------------------------------------------------------------
// EMPLOYEE flow — self-service access + denial of workforce/recruiting/HR.
// ---------------------------------------------------------------------------

async function runEmployeeFlow(browser: Browser) {
  const role = "EMPLOYEE";
  const page = await browser.newPage();
  attachConsoleCapture(page, role);

  await login(page, "jennifer.lee@consultamerica.demo", DEMO_PASSWORD);
  check(!page.url().includes("/login"), `${role}: login succeeds`);
  check(page.url().includes("/employee"), `${role}: lands on the employee self-service portal`);

  await page.goto(`${BASE_URL}/employee/documents`, { waitUntil: "load" });
  check(
    !page.url().includes("/login"),
    `${role}: can access own self-service documents`,
  );
  await screenshot(page, "employee-documents");

  await page.goto(`${BASE_URL}/employee/profile`, { waitUntil: "load" });
  check(!page.url().includes("/login"), `${role}: can access own profile`);

  // Denial checks: workforce/recruiting/HR must not be reachable — either
  // blocked outright or redirected away to a different page.
  for (const url of [`${BASE_URL}/workforce/people`, `${BASE_URL}/app/recruiting/applications`, `${BASE_URL}/hr/audit`]) {
    const resp = await page.goto(url, { waitUntil: "load" });
    const denied =
      page.url() !== url ||
      (resp?.status() ?? 200) >= 400 ||
      (await page.getByText(/forbidden|not authorized|isn.t available|don.t have access/i).isVisible().catch(() => false));
    check(denied, `${role}: ${url} is denied (redirected to ${page.url()}), not a silent 200`);
  }
  await screenshot(page, "employee-denied-workforce");

  await page.close();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Running browser QA against ${BASE_URL}${UPLOADS_ONLY ? " (--uploads-only)" : ""}`);
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: !HEADED });
  try {
    if (UPLOADS_ONLY) {
      const page = await browser.newPage();
      attachConsoleCapture(page, "uploads-only");
      await login(page, "michael.brown@consultamerica.demo", DEMO_PASSWORD);
      await runCandidateMatchUploadScenarios(page, "uploads-only");
      await page.close();
    } else {
      await runHrAdminFlow(browser);
      await runRecruiterFlow(browser);
      await runEmployeeFlow(browser);
    }
  } finally {
    await browser.close();
  }

  console.log(`\nScreenshots written to ${OUT_DIR}`);

  if (consoleErrors.length > 0) {
    console.log(`\n${consoleErrors.length} console error(s) captured:`);
    for (const err of consoleErrors) {
      console.log(`  [${err.role}] ${err.url}\n    ${err.text}`);
    }
    failed += consoleErrors.length;
  } else {
    console.log("\nZero console errors captured across all roles.");
  }

  await writeFile(
    path.join(OUT_DIR, "report.json"),
    JSON.stringify({ baseUrl: BASE_URL, failed, consoleErrors }, null, 2),
  );

  if (failed > 0) {
    console.log(`\nFAILED — ${failed} issue(s) found. See ${path.join(OUT_DIR, "report.json")}`);
    process.exit(1);
  }
  console.log("\nPASS  browser QA");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});
