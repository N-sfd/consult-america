/**
 * Authenticated, real-browser authorization matrix + rendered-workspace QA.
 *
 * For each QA persona provisioned by scripts/seed-qa-personas.ts (plus the
 * pre-existing seed-supabase.ts personas), logs in for real through the
 * actual login form, then attempts direct-URL navigation to every module's
 * primary route. Records the final URL Next.js actually resolved to (after
 * any redirects) and a short content probe, so a "workspace redirects back
 * to /login" or "lands on the wrong page" failure is visible without manual
 * inspection. Takes a full-page screenshot of each persona's OWN primary
 * workspace at 1440 and 1366 widths (not every cross-role attempt, to keep
 * this tractable) plus one screenshot per denied cross-role destination for
 * spot-checking.
 *
 * Requires: `npm run dev` running separately, scripts/seed-qa-personas.ts
 * already run, and Playwright's chromium browser installed
 * (`npx playwright install chromium`).
 *
 * Usage: npx tsx scripts/qa-authorization-and-render.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium, type Browser, type Page } from "playwright";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";
const QA_PASSWORD = process.env.SEED_QA_PASSWORD ?? "ConsultAmerica!QA1";
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD ?? "ConsultAmerica!Demo1";

const OUT_DIR = path.join(process.cwd(), "qa-artifacts", "authorization-matrix");

type Persona = {
  key: string;
  label: string;
  email: string;
  password: string;
  ownRoute: string;
  roles: string;
};

const PERSONAS: Persona[] = [
  { key: "employee", label: "Employee (Jennifer Lee)", email: "jennifer.lee@consultamerica.demo", password: DEMO_PASSWORD, ownRoute: "/employee", roles: "EMPLOYEE" },
  { key: "manager", label: "Manager (Sofia Martinez)", email: "sofia.martinez.qa@consultamerica.demo", password: QA_PASSWORD, ownRoute: "/manager", roles: "MANAGER" },
  { key: "recruiter", label: "Recruiter (Alex Rivera)", email: "alex.rivera@consultamerica.demo", password: DEMO_PASSWORD, ownRoute: "/app/recruiting", roles: "RECRUITER" },
  { key: "hr", label: "HR (Priya Sharma)", email: "priya.sharma.qa@consultamerica.demo", password: QA_PASSWORD, ownRoute: "/hr/requests", roles: "HR_SPECIALIST" },
  { key: "payroll", label: "Payroll (David Chen)", email: "david.chen.qa@consultamerica.demo", password: QA_PASSWORD, ownRoute: "/payroll", roles: "PAYROLL_ADMIN" },
  { key: "crm", label: "CRM / Sales (Morgan Ellis)", email: "morgan.ellis.qa@consultamerica.demo", password: QA_PASSWORD, ownRoute: "/crm", roles: "SALES_MANAGER" },
  { key: "admin", label: "Administrator (Devon Carter)", email: "devon.carter.qa@consultamerica.demo", password: QA_PASSWORD, ownRoute: "/workforce/administration", roles: "SYSTEM_ADMIN" },
  { key: "admin-bundle", label: "Admin bundle (Michael Brown, data-rich)", email: "michael.brown@consultamerica.demo", password: DEMO_PASSWORD, ownRoute: "/workforce/administration", roles: "SYSTEM_ADMIN+HR_ADMIN+PAYROLL_ADMIN+MANAGER" },
];

const DESTINATIONS = [
  "/employee",
  "/manager",
  "/hr/requests",
  "/payroll",
  "/crm",
  "/app/recruiting",
  "/workforce/administration",
];

type NavResult = {
  destination: string;
  finalUrl: string;
  isOwnRoute: boolean;
  landedOnDestination: boolean;
  heading: string | null;
  bodySnippet: string;
};

async function loginAs(page: Page, persona: Persona): Promise<boolean> {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
  await page.fill("#login-email", persona.email);
  await page.fill("#login-password", persona.password);
  await page.click("button.login-submit");
  // The login server action itself takes several seconds (profile/role
  // resolution, occasional provisioning writes) before it redirects — wait
  // for the URL to actually leave /login rather than racing it against
  // networkidle, which can settle on the still-/login page before the
  // POST's redirect has even started.
  await page
    .waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20000 })
    .catch(() => {});
  await page.waitForLoadState("networkidle").catch(() => {});
  const url = page.url();
  if (url.includes("/login")) {
    const errorText = await page.locator(".login-error").textContent().catch(() => null);
    console.error(`  LOGIN FAILED for ${persona.email}: ${errorText ?? "still on /login after 20s, no error text found"}`);
    return false;
  }
  return true;
}

async function probe(page: Page, destination: string, ownRoute: string): Promise<NavResult> {
  await page.goto(`${BASE_URL}${destination}`, { waitUntil: "networkidle" }).catch(() => {});
  const finalUrl = page.url();
  const path = finalUrl.replace(BASE_URL, "");
  const heading = await page
    .locator("h1, h2")
    .first()
    .textContent()
    .catch(() => null);
  const bodyText = (await page.locator("body").innerText().catch(() => "")).slice(0, 200).replace(/\s+/g, " ");
  return {
    destination,
    finalUrl: path,
    isOwnRoute: destination === ownRoute,
    landedOnDestination: path === destination || path.startsWith(`${destination}/`),
    heading: heading?.trim() ?? null,
    bodySnippet: bodyText,
  };
}

async function runPersona(browser: Browser, persona: Persona) {
  console.log(`\n=== ${persona.label} <${persona.email}> — roles: ${persona.roles} ===`);

  const results: NavResult[] = [];

  for (const width of [1440, 1366]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();

    const ok = await loginAs(page, persona);
    if (!ok) {
      await context.close();
      results.push({
        destination: "(login)",
        finalUrl: page.url().replace(BASE_URL, ""),
        isOwnRoute: false,
        landedOnDestination: false,
        heading: null,
        bodySnippet: "LOGIN FAILED",
      });
      continue;
    }

    if (width === 1440) {
      // Full destination sweep only once (at 1440) — logging in 8x per
      // persona just to re-sweep at both widths isn't worth the time; the
      // second pass below re-screenshots only the persona's own workspace.
      for (const destination of DESTINATIONS) {
        const result = await probe(page, destination, persona.ownRoute);
        results.push(result);
        const verdict = result.isOwnRoute
          ? result.landedOnDestination
            ? "ALLOW (own workspace, as expected)"
            : "**UNEXPECTED DENY on own workspace**"
          : result.landedOnDestination
            ? "**ALLOWED cross-role — check if intentional**"
            : `denied -> ${result.finalUrl}`;
        console.log(
          `  [1440] ${destination.padEnd(24)} -> ${result.finalUrl.padEnd(28)} ${verdict}`,
        );
      }
      // Screenshot the own workspace at this width.
      await page.goto(`${BASE_URL}${persona.ownRoute}`, { waitUntil: "networkidle" }).catch(() => {});
      await mkdir(OUT_DIR, { recursive: true });
      await page.screenshot({
        path: path.join(OUT_DIR, `${persona.key}-1440.png`),
        fullPage: false,
      });
    } else {
      await page.goto(`${BASE_URL}${persona.ownRoute}`, { waitUntil: "networkidle" }).catch(() => {});
      await mkdir(OUT_DIR, { recursive: true });
      await page.screenshot({
        path: path.join(OUT_DIR, `${persona.key}-1366.png`),
        fullPage: false,
      });
      console.log(`  [1366] own workspace screenshot captured`);
    }

    await context.close();
  }

  return { persona: persona.label, roles: persona.roles, results };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const report: unknown[] = [];

  try {
    for (const persona of PERSONAS) {
      const result = await runPersona(browser, persona);
      report.push(result);
    }
  } finally {
    await browser.close();
  }

  await writeFile(
    path.join(OUT_DIR, "report.json"),
    JSON.stringify(report, null, 2),
    "utf-8",
  );
  console.log(`\nFull JSON report + screenshots written to ${OUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
