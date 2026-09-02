import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const previews = {
  convera: `<html><body style="margin:0;font-family:system-ui;background:#073B3A;color:white"><div style="padding:24px"><div style="font-size:11px;letter-spacing:.1em;color:#9BC4B8">CONVERA</div><h1 style="margin:8px 0 20px;font-size:22px">Integration Hub</h1><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px"><div style="background:#0B4A47;padding:16px;border-radius:8px"><div style="font-size:10px;color:#9BC4B8">ORACLE FUSION</div><div style="margin-top:6px;font-size:13px">Event-driven ERP</div></div><div style="background:#176A63;padding:16px;border-radius:8px"><div style="font-size:10px;color:#9BC4B8">CRM PLATFORM</div><div style="margin-top:6px;font-size:13px">Customer sync</div></div><div style="background:#287B72;padding:16px;border-radius:8px"><div style="font-size:10px;color:#9BC4B8">API GATEWAY</div><div style="margin-top:6px;font-size:13px">Schema routing</div></div></div><div style="margin-top:20px;background:#0B4A47;border-radius:8px;padding:16px;height:120px;display:flex;align-items:center;justify-content:center;color:#9BC4B8;font-size:12px">Message flow · Validation · Audit trail</div></div></body></html>`,
  "hr-talent": `<html><body style="margin:0;font-family:system-ui;background:#F0F6F4;color:#073B3A"><div style="padding:24px"><div style="font-size:11px;letter-spacing:.1em;color:#176A63">HR &amp; TALENT SUITE</div><h1 style="margin:8px 0 20px;font-size:22px">Workforce Platform</h1><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px"><div style="background:white;border:1px solid #DCE4E1;padding:14px;border-radius:8px;text-align:center"><div style="font-size:10px;color:#176A63">RECRUITING</div><div style="margin-top:6px;font-size:12px;font-weight:600">Pipeline</div></div><div style="background:white;border:1px solid #DCE4E1;padding:14px;border-radius:8px;text-align:center"><div style="font-size:10px;color:#176A63">CANDIDATES</div><div style="margin-top:6px;font-size:12px;font-weight:600">Evaluation</div></div><div style="background:white;border:1px solid #DCE4E1;padding:14px;border-radius:8px;text-align:center"><div style="font-size:10px;color:#176A63">TIMESHEETS</div><div style="margin-top:6px;font-size:12px;font-weight:600">Approvals</div></div><div style="background:white;border:1px solid #DCE4E1;padding:14px;border-radius:8px;text-align:center"><div style="font-size:10px;color:#176A63">PAYROLL</div><div style="margin-top:6px;font-size:12px;font-weight:600">Ledger sync</div></div></div></div></body></html>`,
};

const outDir = path.join(process.cwd(), "public", "portfolio");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

for (const [id, html] of Object.entries(previews)) {
  await page.setContent(html);
  await page.screenshot({ path: path.join(outDir, `${id}.png`) });
  console.log(`OK ${id}`);
}

await browser.close();
