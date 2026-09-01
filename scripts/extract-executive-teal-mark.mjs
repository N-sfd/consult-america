import { chromium } from "playwright";
import path from "node:path";

const src = path.join(process.cwd(), "public", "brand", "consult-america-executive-teal.jpg");
const markOut = path.join(process.cwd(), "public", "brand", "executive-teal-mark.png");
const faviconOut = path.join(process.cwd(), "public", "favicon.png");

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setContent(`
<!DOCTYPE html>
<html><body style="margin:0;background:#111">
<img id="src" src="file:///${src.replace(/\\/g, "/")}" style="display:block" />
</body></html>
`);

const dims = await page.evaluate(() => {
  const img = document.getElementById("src");
  return { width: img.naturalWidth, height: img.naturalHeight };
});

const markHeight = Math.round(dims.height * 0.42);
await page.locator("#src").screenshot({
  path: markOut,
  clip: { x: 0, y: 0, width: dims.width, height: markHeight },
});

await page.setViewportSize({ width: 64, height: 64 });
await page.setContent(`
<!DOCTYPE html>
<html><body style="margin:0;background:#073B3A;display:flex;align-items:center;justify-content:center;width:64px;height:64px">
<img src="file:///${markOut.replace(/\\/g, "/")}" style="width:56px;height:auto" />
</body></html>
`);
await page.screenshot({ path: faviconOut });

console.log("Created", markOut, faviconOut);
await browser.close();
