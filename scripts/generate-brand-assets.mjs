/**
 * Generate transparent production logo assets from the approved Executive Teal master.
 * Run: npm run brand:assets
 *
 * Layout: CA mark LEFT, original bold title artwork RIGHT. Never recreate type.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BRAND_DIR = path.join(process.cwd(), "public", "brand");
const MASTER = path.join(BRAND_DIR, "ca-logo-master.png");

// Master 900×599 — leave generous crop boxes so bold strokes never clip
const REGIONS = {
  // Mark tip ends ~y342 on master — must include full curve
  mark: { left: 230, top: 0, width: 440, height: 344 },
  wordmark: { left: 8, top: 346, width: 884, height: 118 },
  headerText: { left: 8, top: 346, width: 884, height: 178 },
  fullText: { left: 4, top: 346, width: 892, height: 236 },
};

function isForeground(r, g, b) {
  if (r >= 248 && g >= 248 && b >= 248) return false;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  const luminance = (r + g + b) / 3;
  if (luminance > 242 && saturation < 0.04) return false;
  return true;
}

async function backgroundToTransparentPng(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    data[i + 3] = isForeground(data[i], data[i + 1], data[i + 2]) ? 255 : 0;
  }

  const trimmed = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 4 })
    .png()
    .toBuffer();

  // Generous padding — prevents crop of mark top + bold letter tops after resize
  return sharp(trimmed)
    .extend({
      top: 56,
      bottom: 64,
      left: 40,
      right: 40,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function exportCrop(extract, outPath, targetWidth) {
  const raw = await sharp(MASTER).extract(extract).png().toBuffer();
  const transparent = await backgroundToTransparentPng(raw);
  let pipeline = sharp(transparent);
  if (targetWidth) {
    pipeline = pipeline.resize({ width: targetWidth, kernel: sharp.kernel.lanczos3 });
  }
  await pipeline.png().toFile(outPath);
  const meta = await sharp(outPath).metadata();
  console.log(`  ${path.basename(outPath)} → ${meta.width}×${meta.height}`);
  return { width: meta.width, height: meta.height };
}

async function compositeHorizontal(layerPaths, outPath, targetWidth, gap = 20) {
  const layers = await Promise.all(
    layerPaths.map(async (p) => {
      const buf = await sharp(p).png().toBuffer();
      const meta = await sharp(buf).metadata();
      return { buf, meta };
    }),
  );

  const totalWidth = layers.reduce((sum, l) => sum + l.meta.width, 0) + gap * (layers.length - 1);
  const maxHeight = Math.max(...layers.map((l) => l.meta.height));

  const composites = [];
  let x = 0;
  for (const layer of layers) {
    composites.push({
      input: layer.buf,
      left: x,
      top: Math.round((maxHeight - layer.meta.height) / 2),
    });
    x += layer.meta.width + gap;
  }

  const canvas = await sharp({
    create: {
      width: totalWidth,
      height: maxHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();

  let pipeline = sharp(canvas);
  if (targetWidth) {
    pipeline = pipeline.resize({ width: targetWidth, kernel: sharp.kernel.lanczos3 });
  }
  // Final safety padding so nothing clips at the frame edge in the browser
  const buffered = await pipeline
    .extend({
      top: 32,
      bottom: 40,
      left: 20,
      right: 20,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  await sharp(buffered).png().toFile(outPath);
  const meta = await sharp(outPath).metadata();
  console.log(`  ${path.basename(outPath)} → ${meta.width}×${meta.height}`);
  return { width: meta.width, height: meta.height };
}

/**
 * Mark left of text. Upscale text first so Consult America stays large/bold;
 * mark is sized relative to the upscaled text.
 */
async function markBesideText(markPath, textPath, outPath, opts) {
  const {
    targetWidth,
    gap = 24,
    textScale = 1.35,
    markToTextRatio = 0.92,
  } = opts;

  const textMeta = await sharp(textPath).metadata();
  const scaledTextPath = path.join(path.dirname(markPath), `text-${path.basename(outPath)}`);
  await sharp(textPath)
    .resize({
      width: Math.round((textMeta.width || 800) * textScale),
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toFile(scaledTextPath);

  const scaledTextMeta = await sharp(scaledTextPath).metadata();
  const markHeight = Math.max(1, Math.round((scaledTextMeta.height || 160) * markToTextRatio));
  const scaledMarkPath = path.join(path.dirname(markPath), `mark-${path.basename(outPath)}`);
  await sharp(markPath)
    .resize({ height: markHeight, kernel: sharp.kernel.lanczos3 })
    .png()
    .toFile(scaledMarkPath);

  return compositeHorizontal([scaledMarkPath, scaledTextPath], outPath, targetWidth, gap);
}

async function main() {
  if (!fs.existsSync(MASTER)) {
    throw new Error(`Master logo not found: ${MASTER}`);
  }

  const tmpDir = path.join(BRAND_DIR, ".tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  const markTmp = path.join(tmpDir, "mark.png");
  const wordmarkTmp = path.join(tmpDir, "wordmark.png");
  const headerTextTmp = path.join(tmpDir, "header-text.png");
  const fullTextTmp = path.join(tmpDir, "full-text.png");

  console.log("Exporting production assets from master:");
  await exportCrop(REGIONS.mark, markTmp);
  await exportCrop(REGIONS.wordmark, wordmarkTmp);
  await exportCrop(REGIONS.headerText, headerTextTmp);
  await exportCrop(REGIONS.fullText, fullTextTmp);

  const dimensions = {};

  dimensions.mark = await exportCrop(REGIONS.mark, path.join(BRAND_DIR, "ca-logo-mark.png"), 420);

  dimensions.compact = await markBesideText(markTmp, wordmarkTmp, path.join(BRAND_DIR, "ca-logo-compact.png"), {
    targetWidth: 1800,
    gap: 30,
    textScale: 1.45,
    markToTextRatio: 1.05,
  });

  dimensions.header = await markBesideText(markTmp, headerTextTmp, path.join(BRAND_DIR, "ca-logo-header.png"), {
    targetWidth: 2200,
    gap: 28,
    textScale: 1.5,
    markToTextRatio: 0.95,
  });

  // "full" lockup intentionally reuses this same file (see lib/brandAssets.ts)
  // rather than generating a second, byte-identical ca-logo-full.png.
  dimensions.horizontal = await markBesideText(markTmp, fullTextTmp, path.join(BRAND_DIR, "ca-logo-horizontal.png"), {
    targetWidth: 2400,
    gap: 26,
    textScale: 1.35,
    markToTextRatio: 0.95,
  });

  fs.rmSync(tmpDir, { recursive: true, force: true });

  console.log("\nUpdate brandDimensions in lib/brandAssets.ts:");
  console.log(JSON.stringify(dimensions, null, 2));
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
