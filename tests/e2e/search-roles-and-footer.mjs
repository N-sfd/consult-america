import { chromium } from "playwright";

const base = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3010";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("#home-role-search").fill("Oracle");
await page.getByRole("button", { name: "Search Roles" }).click();
await page.waitForURL(/\/jobs\?q=Oracle/);
await page.getByRole("heading", { name: "Find work that moves technology forward." }).waitFor();

await page.reload();
assert(/\/jobs\?q=Oracle/.test(page.url()), `refresh lost query: ${page.url()}`);
assert((await page.locator("input[name='q']").inputValue()) === "Oracle", "search input did not keep Oracle");

await page.locator("input[name='q']").fill("zzzz-no-such-role");
await page.getByRole("button", { name: "Search roles" }).click();
await page.waitForURL(/q=zzzz-no-such-role/);
const empty = page.getByText(/No openings match your current filters|don't have an opening/i);
await empty.waitFor();

await page.getByRole("link", { name: "Clear filters" }).click();
await page.waitForURL(/\/jobs$/);

await page.getByText(/Headquarters/i).waitFor();
await page.getByText("20130 Lakeview Center Plaza, Suite 400").waitFor();
await page.getByText("Ashburn, VA 20147").waitFor();
await page.getByText(/Branch Office/i).waitFor();
await page.getByText("1101 Opal Court Suite 211").waitFor();
await page.getByText("Hagerstown, MD 21740").waitFor();
assert(
  (await page.getByRole("link", { name: "info@consultamerica.com" }).getAttribute("href")) ===
    "mailto:info@consultamerica.com",
  "email link",
);
assert(
  (await page.getByRole("link", { name: "703-496-7858" }).getAttribute("href")) === "tel:+17034967858",
  "phone link",
);
assert(errors.length === 0, `console errors: ${errors.join(" | ")}`);

await browser.close();
console.log("search-roles-and-footer: PASS");
