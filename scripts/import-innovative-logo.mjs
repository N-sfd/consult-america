/**
 * Import Innovative logo → transparent public/brand assets.
 * Prefers the highest-resolution logo_innovative_* source (never fake-upscale
 * a tiny file to 2400px — that causes the soft/blurry header look).
 *
 * Run: node scripts/import-innovative-logo.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const assetsDir =
  "C:/Users/nazia/.cursor/projects/e-projects-AI-Projects-consultamerica/assets";
const brandDir = path.join(process.cwd(), "public", "brand");

const candidates = [];
for (const f of fs.readdirSync(assetsDir)) {
  if (!/logo_innovative/i.test(f)) continue;
  const full = path.join(assetsDir, f);
  const meta = await sharp(full).metadata();
  candidates.push({ f, full, width: meta.width ?? 0, height: meta.height ?? 0 });
}
candidates.sort((a, b) => b.width * b.height - a.width * a.height);

if (candidates.length === 0) {
  console.error("No logo_innovative_* sources found");
  process.exit(1);
}

const best = candidates[0];
const SOURCE = best.full;
console.log(
  `Using ${best.f.replace(/^.*?images_/, "")} (${best.width}×${best.height})`,
);

function isForegroundOnBlack(r, g, b) {
  if (Math.max(r, g, b) < 28) return false;
  if (r > 248 && g > 248 && b > 248) return false;
  return true;
}

async function blackBgToTransparent(inputPath) {
  // Work at native resolution; mild sharpen after optional 2× for retina exports.
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    data[i + 3] = isForegroundOnBlack(data[i], data[i + 1], data[i + 2])
      ? 255
      : 0;
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 6 })
    .extend({
      top: 16,
      bottom: 16,
      left: 14,
      right: 20,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function write(buf, name, width) {
  const srcMeta = await sharp(buf).metadata();
  const target = width
    ? Math.min(width, Math.max(srcMeta.width ?? width, width))
    : undefined;

  // Only upscale when needed for retina (≤2× native). Prefer native sharpness.
  const nativeW = srcMeta.width ?? 0;
  let outW = target;
  if (outW && nativeW > 0) {
    outW = Math.min(outW, nativeW * 2);
  }

  let pipeline = sharp(buf);
  if (outW && outW !== nativeW) {
    pipeline = pipeline.resize({
      width: outW,
      kernel: outW > nativeW ? sharp.kernel.lanczos3 : sharp.kernel.lanczos3,
    });
    if (outW > nativeW) {
      pipeline = pipeline.sharpen({ sigma: 0.6 });
    }
  }

  const out = path.join(brandDir, name);
  await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(out);
  const meta = await sharp(out).metadata();
  console.log(`  ${name} → ${meta.width}×${meta.height}`);
  return meta;
}

const transparent = await blackBgToTransparent(SOURCE);
await fs.promises.writeFile(
  path.join(brandDir, "ca-logo-master.png"),
  transparent,
);
const masterMeta = await sharp(transparent).metadata();
console.log(`  ca-logo-master.png → ${masterMeta.width}×${masterMeta.height}`);

// Horizontal / header: ~2× typical display width (340–360 CSS px)
await write(transparent, "ca-logo-horizontal.png", 1360);
await write(transparent, "ca-logo-header.png", 1200);

// Compact: same full lockup, retina-sized for narrow headers (layout scales to fit)
await write(transparent, "ca-logo-compact.png", 1100);

const markBuf = await sharp(transparent)
  .resize({
    width: Math.round(masterMeta.height ?? 120),
    height: masterMeta.height,
    fit: "cover",
    position: "left",
  })
  .trim({ threshold: 4 })
  .extend({
    top: 8,
    bottom: 8,
    left: 8,
    right: 8,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();
await write(markBuf, "ca-logo-mark.png", 256);

await fs.promises.copyFile(
  SOURCE,
  path.join(brandDir, "ca-logo-innovative-source.png"),
);

console.log("Done — bump brandAssets ?v= after import.");
