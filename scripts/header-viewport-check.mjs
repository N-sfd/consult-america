/**
 * Header viewport regression check — run after `npm run build && npm run start`
 * Usage: node scripts/header-viewport-check.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const WIDTHS = [1920, 1600, 1536, 1440, 1366, 1280, 1279, 1180, 1024, 820, 768, 767, 430, 390, 360];

function rectsIntersect(a, b) {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const failures = [];

for (const width of WIDTHS) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector(".ca-header-inner", { timeout: 15000 });
  await page.waitForSelector(".ca-header-brand .brand-logo", { timeout: 15000 });
  await page.waitForFunction(
    () => {
      const img = document.querySelector(".ca-header-brand .brand-logo");
      return img instanceof HTMLImageElement && img.naturalWidth > 0;
    },
    { timeout: 15000 }
  );

  const result = await page.evaluate((w) => {
    function rectsIntersect(a, b) {
      return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
    }

    const vw = document.documentElement.clientWidth;
    const scrollW = document.documentElement.scrollWidth;
    const brand = document.querySelector(".ca-header-brand");
    const nav = document.querySelector(".ca-header-nav");
    const actions = document.querySelector(".ca-header-actions");
    const cta = document.querySelector(".ca-header-cta:not([class*='hidden'])") ?? document.querySelector(".ca-header-cta");
    const hamburger = document.querySelector('[aria-label="Open navigation menu"]');
    const tagline = document.querySelector(".tagline");
    const mark = document.querySelector(".ca-header-brand .brand-logo");
    const utility = document.querySelector("header .min-\\[1280px\\]\\:block");

    const navStyle = nav ? getComputedStyle(nav) : null;
    const taglineStyle = tagline ? getComputedStyle(tagline) : null;

    const boxes = {
      brand: brand?.getBoundingClientRect(),
      nav: nav && navStyle?.display !== "none" ? nav.getBoundingClientRect() : null,
      actions: actions?.getBoundingClientRect(),
      cta: cta?.getBoundingClientRect(),
      mark: mark?.getBoundingClientRect(),
    };

    const issues = [];

    if (scrollW > vw + 1) {
      issues.push(`horizontal overflow scrollW=${scrollW} clientW=${vw}`);
    }

    for (const [name, rect] of Object.entries(boxes)) {
      if (!rect) continue;
      if (rect.left < -1) issues.push(`${name} left=${rect.left.toFixed(1)}`);
      if (rect.right > vw + 1) issues.push(`${name} right=${rect.right.toFixed(1)} > vw=${vw}`);
    }

    if (boxes.brand && boxes.nav && rectsIntersect(boxes.brand, boxes.nav)) {
      issues.push("brand/nav overlap");
    }
    if (boxes.brand && boxes.cta && rectsIntersect(boxes.brand, boxes.cta)) {
      issues.push("brand/cta overlap");
    }
    if (boxes.nav && boxes.cta && rectsIntersect(boxes.nav, boxes.cta)) {
      issues.push("nav/cta overlap");
    }

    const navVisible = navStyle && navStyle.display !== "none" && navStyle.visibility !== "hidden";
    if (w < 1280 && navVisible) {
      issues.push("desktop nav visible below 1280");
    }
    if (w >= 1280 && navStyle?.display === "none") {
      issues.push("desktop nav hidden at >=1280");
    }

    // Tagline is baked into the horizontal logo image — no separate DOM check.

    const hamburgerVisible = hamburger && getComputedStyle(hamburger).display !== "none";
    if (w < 1280 && !hamburgerVisible) {
      issues.push("hamburger missing below 1280");
    }
    if (w >= 1280 && hamburgerVisible) {
      issues.push("hamburger visible at >=1280");
    }

    if (mark) {
      const markRect = mark.getBoundingClientRect();
      if (markRect.width < 20 || markRect.height < 20) {
        issues.push(`logo may be clipped ${markRect.width.toFixed(0)}x${markRect.height.toFixed(0)}`);
      }
    }

    return { issues, navVisible, hamburgerVisible, scrollW, vw };
  }, width);

  if (result.issues.length) {
    failures.push({ width, issues: result.issues });
    console.log(`FAIL ${width}px: ${result.issues.join("; ")}`);
  } else {
    console.log(`PASS ${width}px`);
  }
}

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} viewport(s) failed`);
  process.exit(1);
}

console.log(`\nAll ${WIDTHS.length} viewports passed.`);
