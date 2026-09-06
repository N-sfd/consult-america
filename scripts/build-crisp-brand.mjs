/**
 * Build crisp brand assets: hi-res mark + SVG wordmark composite for OG/PNG fallbacks.
 * UI uses CSS wordmark (BrandLogo) for sharp text; PNGs remain for meta/favicon.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const brandDir = path.join(process.cwd(), "public", "brand");
const hiresCandidates = [
  path.join(
    "C:/Users/nazia/.cursor/projects/e-projects-AI-Projects-consultamerica/assets",
    "ca-logo-mark-hires.png",
  ),
];

function isPlate(r, g, b) {
  if (r > 248 && g > 248 && b > 248) return true;
  if (r < 18 && g < 18 && b < 18) return true;
  return false;
}

async function toTransparent(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    if (isPlate(data[i], data[i + 1], data[i + 2])) data[i + 3] = 0;
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 8 })
    .extend({
      top: 28,
      bottom: 28,
      left: 28,
      right: 28,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

const src = hiresCandidates.find((p) => fs.existsSync(p));
if (!src) {
  console.error("Missing ca-logo-mark-hires.png");
  process.exit(1);
}

const transparent = await toTransparent(src);
await sharp(transparent)
  .resize(512, 512, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(path.join(brandDir, "ca-logo-mark.png"));

const markMeta = await sharp(path.join(brandDir, "ca-logo-mark.png")).metadata();
console.log(`mark → ${markMeta.width}×${markMeta.height}`);

const mark280 = await sharp(path.join(brandDir, "ca-logo-mark.png"))
  .resize(280, 280)
  .png()
  .toBuffer();

const wordSvg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="320" xmlns="http://www.w3.org/2000/svg">
  <text x="320" y="145" fill="#0A1F5C" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="78" font-weight="800">Consult America</text>
  <text x="320" y="208" fill="#0A1F5C" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="500">Innovative Technology Consulting Services</text>
</svg>`);

const base = await sharp({
  create: {
    width: 1600,
    height: 320,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .png()
  .toBuffer();

const composed = await sharp(base)
  .composite([
    { input: mark280, left: 24, top: 20 },
    { input: wordSvg, left: 0, top: 0 },
  ])
  .png()
  .toBuffer();

const horizontal = await sharp(composed)
  .trim({ threshold: 1 })
  .extend({
    top: 24,
    bottom: 24,
    left: 16,
    right: 32,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await fs.promises.writeFile(
  path.join(brandDir, "ca-logo-horizontal.png"),
  horizontal,
);
await sharp(horizontal)
  .resize({ width: 1400 })
  .png()
  .toFile(path.join(brandDir, "ca-logo-header.png"));
await sharp(horizontal)
  .resize({ width: 1100 })
  .png()
  .toFile(path.join(brandDir, "ca-logo-compact.png"));
await sharp(transparent)
  .png()
  .toFile(path.join(brandDir, "ca-logo-master.png"));

await sharp(path.join(brandDir, "ca-logo-mark.png"))
  .resize(32, 32, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(path.join(process.cwd(), "public", "favicon.png"));

for (const f of [
  "ca-logo-mark.png",
  "ca-logo-horizontal.png",
  "ca-logo-header.png",
  "ca-logo-compact.png",
]) {
  const mm = await sharp(path.join(brandDir, f)).metadata();
  console.log(`${f} → ${mm.width}×${mm.height}`);
}
