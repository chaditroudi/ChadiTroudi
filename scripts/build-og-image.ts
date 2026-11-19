/**
 * Renders public/og.png (1200×630), the preview image shown when the site is shared
 * on LinkedIn, Slack or X. Usage: npm run og-image (needs Playwright, like the CV script).
 */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { metrics, profile } from "../src/content/profile";

const root = resolve(import.meta.dirname ?? __dirname, "..");
const portrait = readFileSync(resolve(root, "src/assets/portrait.webp")).toString("base64");

// Short captions for the first three entries of `metrics`.
const shortLabels = ["modules migrated to TypeScript", "fewer production bugs", "better RAG search relevance"];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin:0; width:1200px; height:630px; font-family: Inter, "Helvetica Neue", Arial, sans-serif; background:#0b0f14; color:#eef2f6; display:flex; }
  .l { flex:1; padding:64px 56px 56px 72px; display:flex; flex-direction:column; background: radial-gradient(ellipse at top left, rgba(31,191,117,.22), transparent 60%); }
  .tag { color:#2fd38a; font: 600 18px/1 "JetBrains Mono", monospace; letter-spacing:.16em; text-transform:uppercase; }
  h1 { font-size:76px; line-height:1; margin:26px 0 14px; letter-spacing:-.02em; }
  .h { font-size:30px; color:#b6c0cc; }
  .m { margin-top:auto; display:flex; gap:36px; }
  .m b { display:block; font-size:38px; color:#2fd38a; }
  .m span { font-size:16px; color:#93a0ae; max-width:180px; display:block; }
  .r { width:360px; background:url(data:image/webp;base64,${portrait}) center/cover; }
</style></head><body>
  <div class="l">
    <div class="tag">${profile.availability}</div>
    <h1>${profile.name}</h1>
    <div class="h">${profile.headline} · ${profile.focus}</div>
    <div class="m">${metrics.slice(0, 3).map((m, i) => `<div><b>${m.value}</b><span>${shortLabels[i]}</span></div>`).join("")}</div>
  </div>
  <div class="r"></div>
</body></html>`;

const require = createRequire(import.meta.url);
const { chromium } = require("playwright") as typeof import("playwright");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "load" });
await page.screenshot({ path: resolve(root, "public/og.png") });
await browser.close();
console.log("og-image: wrote public/og.png");
