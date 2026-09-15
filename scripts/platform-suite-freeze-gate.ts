/**
 * Platform suite freeze gate — naming, canonical routes, nav purpose separation.
 * Run: npx tsx scripts/platform-suite-freeze-gate.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { SUITE_MODULES } from "../lib/platforms/suite";
import {
  DEMO_WORKSPACES,
  SUITE_SWITCHER,
} from "../components/platform/platform-nav";
import { applicationsMegaMenu, companyMegaMenu } from "../lib/site-data";

const root = process.cwd();

function pass(label: string) {
  console.log(`PASS  ${label}`);
}

function fail(label: string, detail: string): never {
  console.error(`FAIL  ${label} — ${detail}`);
  process.exit(1);
}

const expected = [
  { id: "crm", name: "CRM", app: "/crm", marketing: "/platforms/crm" },
  { id: "ats", name: "ATS", app: "/app/recruiting", marketing: "/platforms/ats", module: "Recruiting" },
  { id: "hr", name: "HR", app: "/hr/requests", marketing: "/platforms/hr", module: "Requests" },
  { id: "employee", name: "Employee", app: "/employee", marketing: "/platforms/employee" },
  { id: "payroll", name: "Payroll", app: "/payroll", marketing: "/platforms/payroll" },
  {
    id: "admin",
    name: "Admin",
    app: "/workforce/administration",
    marketing: "/platforms/admin",
    module: "Workforce Administration",
  },
] as const;

console.log("\n=== Platform suite freeze gate ===\n");

assert.equal(SUITE_MODULES.length, 6, "suite must stay at six modules");
pass("Suite frozen at 6 modules");

for (const exp of expected) {
  const mod = SUITE_MODULES.find((m) => m.id === exp.id);
  if (!mod) fail(`Module ${exp.id}`, "missing");
  if (mod.name !== exp.name) fail(`Module ${exp.id} name`, `${mod.name} !== ${exp.name}`);
  if (mod.appHref !== exp.app) fail(`Module ${exp.id} appHref`, `${mod.appHref} !== ${exp.app}`);
  if (mod.marketingHref !== exp.marketing) {
    fail(`Module ${exp.id} marketingHref`, `${mod.marketingHref} !== ${exp.marketing}`);
  }
  if ("module" in exp && exp.module && mod.primaryModule !== exp.module) {
    fail(`Module ${exp.id} primaryModule`, `${mod.primaryModule} !== ${exp.module}`);
  }
}
pass("Canonical names + app/marketing hrefs");

if (SUITE_MODULES.some((m) => m.appHref === "/workforce/admin")) {
  fail("Admin appHref", "/workforce/admin must not be canonical");
}
pass("Admin canonical is /workforce/administration");

const adminRedirect = join(root, "app/(workforce)/workforce/admin/page.tsx");
const redirectSrc = readFileSync(adminRedirect, "utf8");
if (!redirectSrc.includes('redirect("/workforce/administration")')) {
  fail("Admin redirect", "admin/page.tsx must redirect to /workforce/administration");
}
pass("/workforce/admin compatibility redirect present");

const atsRoute = join(root, "app/platforms/ats/route.ts");
try {
  readFileSync(atsRoute);
  fail("ATS 410", "platforms/ats/route.ts must not exist");
} catch {
  pass("ATS 410 route not restored");
}

for (const item of SUITE_SWITCHER) {
  if (item.href.startsWith("/platforms/")) {
    fail("Suite switcher", `${item.label} points at marketing ${item.href}`);
  }
  if (item.href === "/workforce/admin") {
    fail("Suite switcher Admin", "must use canonical /workforce/administration");
  }
}
pass("Platform modules switcher → authenticated destinations only");

for (const item of DEMO_WORKSPACES.filter((d) =>
  ["CRM", "ATS", "HR", "Employee", "Payroll", "Admin"].includes(d.label),
)) {
  if (item.href.startsWith("/platforms/")) {
    fail("Demo workspaces", `${item.label} points at marketing ${item.href}`);
  }
}
pass("Demo suite entries avoid /platforms/*");

for (const link of applicationsMegaMenu.workforce) {
  if (!link.href.startsWith("/platforms/") && !link.href.startsWith("/jobs")) {
    // allow only marketing discovery in Applications workforce column
    fail("Applications mega menu", `${link.label} should be marketing discovery (${link.href})`);
  }
}
pass("Applications mega menu → marketing discovery");

for (const link of companyMegaMenu.portals) {
  if (link.href.startsWith("/platforms/")) {
    fail("Company portals", `${link.label} must not be marketing ${link.href}`);
  }
  if (link.label === "Admin" && link.href !== "/workforce/administration") {
    fail("Company portals Admin", `expected /workforce/administration, got ${link.href}`);
  }
}
pass("Company portals → authenticated operational destinations");

const roadmap = readFileSync(join(root, "docs/CLIENTFLOW_ROADMAP.md"), "utf8");
if (!roadmap.includes("/workforce/administration") || !roadmap.includes("/workforce/admin")) {
  fail("Roadmap QA", "must list both Admin canonical and redirect");
}
if (
  /Admin.*→\s*`\/workforce\/admin`/.test(roadmap) &&
  !roadmap.includes("compatibility only") &&
  !roadmap.includes("Redirect")
) {
  fail("Roadmap QA", "must not present /workforce/admin as sole Admin URL");
}
pass("Roadmap QA lists Admin canonical + redirect separately");

const topLevelWorkforce = SUITE_MODULES.some(
  (m) => m.name === "Workforce" || m.primaryModule === "Workforce",
);
if (topLevelWorkforce) fail("Naming", "Workforce must not be a top-level product name");
pass("Workforce is not a top-level product name");

console.log("\n=== Platform suite freeze gate: ALL PASS ===\n");
