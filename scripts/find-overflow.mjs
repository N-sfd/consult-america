import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 430, height: 900 });
await page.goto("http://localhost:3001", { waitUntil: "domcontentloaded" });
await page.waitForSelector(".ca-header-inner");

const offenders = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const results = [];
  document.querySelectorAll("*").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.right > vw + 2 && rect.width > 0) {
      const tag = el.tagName.toLowerCase();
      const cls = el.className?.toString?.().slice(0, 80) ?? "";
      results.push({ tag, cls, right: rect.right, width: rect.width, left: rect.left });
    }
  });
  return results.sort((a, b) => b.right - a.right).slice(0, 15);
});

console.log(JSON.stringify(offenders, null, 2));
  const actions = document.querySelector(".ca-header-actions");
  const inner = document.querySelector(".ca-header-inner");
  const ctas = [...document.querySelectorAll(".ca-header-cta")].map((el) => ({
    cls: el.className,
    display: getComputedStyle(el).display,
    rect: el.getBoundingClientRect(),
  }));
  return {
    gridTemplate: inner ? getComputedStyle(inner).gridTemplateColumns : null,
    actionsGridCol: actions ? getComputedStyle(actions).gridColumn : null,
    actionsRect: actions?.getBoundingClientRect(),
    ctas,
  };
});
console.log(JSON.stringify(meta, null, 2));
await browser.close();
