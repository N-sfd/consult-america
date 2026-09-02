/**
 * Generate transparent production logo assets from the approved Executive Teal master.
 * Run: npm run brand:assets
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BRAND_DIR = path.join(process.cwd(), "public", "brand");
const MASTER = path.join(BRAND_DIR, "ca-logo-master.png");

// Vertical lockup — derived from consult-america-executive-teal-master.png (1024×512)
const REGIONS = {
  mark: { left: 372, top: 32, width: 285, height: 248 },
  wordmark: { left: 177, top: 287, width: 671, height: 82 },
  tagline: { left: 184, top: 384, width: 664, height: 80 },
};

function isForeground(r, g, b) {
  if (r >= 250 && g >= 250 && b >= 250) return false;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  const luminance = (r + g + b) / 3;

  if (luminance > 235 && saturation < 0.05) return false;

  return true;
}

async function backgroundToTransparentPng(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    data[i + 3] = isForeground(r, g, b) ? 255 : 0;
  }

  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim()
    .png()
    .toBuffer();
}

async function exportCrop(extract, outPath, targetWidth) {
  const raw = await sharp(MASTER).extract(extract).png().toBuffer();
  const transparent = await backgroundToTransparentPng(raw);
  let pipeline = sharp(transparent);
  if (targetWidth) {
    pipeline = pipeline.resize({ width: targetWidth });
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
    })
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
    pipeline = pipeline.resize({ width: targetWidth });
  }
  await pipeline.png().toFile(outPath);
  const meta = await sharp(outPath).metadata();
  console.log(`  ${path.basename(outPath)} → ${meta.width}×${meta.height}`);
  return { width: meta.width, height: meta.height };
}

async function compositeVertical(layerPaths, outPath, targetWidth, gap = 10) {
  const layers = await Promise.all(
    layerPaths.map(async (p) => {
      const buf = await sharp(p).png().toBuffer();
      const meta = await sharp(buf).metadata();
      return { buf, meta };
    })
  );

  const maxWidth = Math.max(...layers.map((l) => l.meta.width));
  const totalHeight = layers.reduce((sum, l) => sum + l.meta.height, 0) + gap * (layers.length - 1);

  const composites = [];
  let y = 0;
  for (const layer of layers) {
    composites.push({
      input: layer.buf,
      left: Math.round((maxWidth - layer.meta.width) / 2),
      top: y,
    });
    y += layer.meta.height + gap;
  }

  const canvas = await sharp({
    create: {
      width: maxWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();

  let pipeline = sharp(canvas);
  if (targetWidth) {
    pipeline = pipeline.resize({ width: targetWidth });
  }
  await pipeline.png().toFile(outPath);
  const meta = await sharp(outPath).metadata();
  console.log(`  ${path.basename(outPath)} → ${meta.width}×${meta.height}`);
  return { width: meta.width, height: meta.height };
}

async function main() {
  if (!fs.existsSync(MASTER)) {
    throw new Error(`Master logo not found: ${MASTER}`);
  }

  const tmpDir = path.join(BRAND_DIR, ".tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  const markTmp = path.join(tmpDir, "mark.png");
  const wordmarkTmp = path.join(tmpDir, "wordmark.png");
  const taglineTmp = path.join(tmpDir, "tagline.png");

  console.log("Exporting production assets:");
  await exportCrop(REGIONS.mark, markTmp);
  await exportCrop(REGIONS.wordmark, wordmarkTmp);
  await exportCrop(REGIONS.tagline, taglineTmp);

  const dimensions = {};

  dimensions.mark = await exportCrop(
    REGIONS.mark,
    path.join(BRAND_DIR, "ca-logo-mark.png"),
    400
  );

  dimensions.compact = await compositeHorizontal(
    [markTmp, wordmarkTmp],
    path.join(BRAND_DIR, "ca-logo-compact.png"),
    1000,
    20
  );

  dimensions.full = await compositeVertical(
    [markTmp, wordmarkTmp, taglineTmp],
    path.join(BRAND_DIR, "ca-logo-full.png"),
    800,
    10
  );

  const textStackTmp = path.join(tmpDir, "text-stack.png");
  await compositeVertical([wordmarkTmp, taglineTmp], textStackTmp, null, 8);

  dimensions.horizontal = await compositeHorizontal(
    [markTmp, textStackTmp],
    path.join(BRAND_DIR, "ca-logo-horizontal.png"),
    1600,
    24
  );

  fs.rmSync(tmpDir, { recursive: true, force: true });

  console.log("\nUpdate brandDimensions in lib/brandAssets.ts:");
  console.log(JSON.stringify(dimensions, null, 2));
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
