import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const src = path.join(process.cwd(), "public", "brand", "consult-america-executive-teal-master.jpg");
const markOut = path.join(process.cwd(), "public", "brand", "executive-teal-mark.png");

const meta = await sharp(src).metadata();
const markHeight = Math.round(meta.height * 0.36);

await sharp(src)
  .extract({ left: 0, top: 0, width: meta.width, height: markHeight })
  .png()
  .toFile(markOut);

console.log("Created", markOut, `${meta.width}x${markHeight}`);
