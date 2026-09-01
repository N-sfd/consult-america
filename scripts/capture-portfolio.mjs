import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const sites = [
  { id: "importnest", url: "https://importnest.vercel.app" },
  { id: "bosiano", url: "https://bosiano.vercel.app" },
  { id: "sarco", url: "https://sarco-appliances.vercel.app" },
  { id: "smart-appliances", url: "https://project-i8icw-ebon.vercel.app" },
];

const outDir = path.join(process.cwd(), "public", "portfolio");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

for (const site of sites) {
  try {
    await page.goto(site.url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(2000);
    const file = path.join(outDir, `${site.id}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log(`OK ${site.id}`);
  } catch (error) {
    console.error(`FAIL ${site.id}`, error.message);
  }
}

await browser.close();
