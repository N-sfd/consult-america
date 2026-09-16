import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Guards the fix in lib/marketing/use-stable-reduced-motion.ts: calling
 * framer-motion's `useReducedMotion()` directly in an SSR-ed client
 * component causes an unpatched hydration mismatch for anyone with
 * `prefers-reduced-motion` enabled (server always resolves `false`; client
 * can resolve `true` before the mismatch is caught), which left whole
 * sections stuck at opacity:0 permanently in production. Every call site
 * must go through the mount-gated `useStableReducedMotion` wrapper instead.
 *
 * This is a static source check (no DOM/render needed) rather than a
 * rendering test, since the project's vitest config runs in a plain "node"
 * environment with no jsdom/testing-library configured.
 */

const ROOT = path.resolve(__dirname, "../..");
const SCAN_DIRS = ["components", "app"];
const ALLOWED_FILE = path.join(ROOT, "lib", "marketing", "use-stable-reduced-motion.ts");

function collectFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      collectFiles(full, out);
    } else if (/\.(tsx|ts)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

describe("reduced-motion hook usage", () => {
  it("only lib/marketing/use-stable-reduced-motion.ts calls framer-motion's useReducedMotion() directly", () => {
    const offenders: string[] = [];

    for (const dir of SCAN_DIRS) {
      const files = collectFiles(path.join(ROOT, dir));
      for (const file of files) {
        if (file === ALLOWED_FILE) continue;
        const content = readFileSync(file, "utf8");
        if (/import\s*\{[^}]*\buseReducedMotion\b[^}]*\}\s*from\s*["']framer-motion["']/.test(content)) {
          offenders.push(path.relative(ROOT, file));
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
