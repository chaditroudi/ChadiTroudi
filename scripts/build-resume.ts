/**
 * Generates the CV from src/content/profile.ts:
 *   resume/resume.html        human-readable, diffable source of the PDF
 *   public/ChadiTroudiCv.pdf  the file linked from the site
 *
 * Usage: npm run resume
 * Needs Playwright with Chromium: npm i -D playwright && npx playwright install chromium
 *
 * ATS rules followed on purpose: one column, real text (no images of text), standard
 * section headings, no icons/emoji, dates in "Mon YYYY – Mon YYYY" form, full URLs.
 */
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { education, experience, formatPeriod, languages, profile, sideProjects, skills } from "../src/content/profile";

const root = resolve(import.meta.dirname ?? __dirname, "..");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const list = (items: readonly string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(profile.name)} — ${esc(profile.headline)} — CV</title>
<style>
  @page { size: A4; margin: 11mm 13mm 11mm 13mm; }
  * { box-sizing: border-box; }
  body { font-family: "Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif; font-size: 9.1pt; line-height: 1.33; color: #111827; margin: 0; }
  h1 { font-size: 21pt; margin: 0; letter-spacing: -0.01em; }
  .headline { font-size: 11.5pt; font-weight: 600; color: #0b6b45; margin: 2px 0 6px; }
  .contact { font-size: 9pt; color: #374151; margin: 0; }
  .contact a { color: inherit; text-decoration: none; }
  h2 { font-size: 10.5pt; text-transform: uppercase; letter-spacing: 0.08em; color: #0b6b45; border-bottom: 1px solid #d1d5db; padding-bottom: 2px; margin: 10px 0 5px; }
  p { margin: 0 0 4px; }
  .role { margin: 0 0 7px; break-inside: avoid-page; }
  .row { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }
  .title { font-weight: 700; font-size: 10pt; }
  .meta { color: #4b5563; font-size: 9pt; white-space: nowrap; }
  .sub { color: #374151; font-style: italic; margin-bottom: 2px; }
  .project { font-weight: 700; margin: 4px 0 1px; }
  ul { margin: 2px 0 3px; padding-left: 15px; }
  li { margin: 0 0 1.5px; }
  .stack { color: #374151; font-size: 8.8pt; }
  .stack b { color: #111827; }
  table { border-collapse: collapse; width: 100%; }
  td { vertical-align: top; padding: 1.5px 0; }
  td.k { width: 30mm; white-space: nowrap; font-weight: 700; }
</style>
</head>
<body>
<header>
  <h1>${esc(profile.name)}</h1>
  <p class="headline">${esc(profile.headline)} | ${esc(profile.focus)}</p>
  <p class="contact">${esc(profile.location)} · ${esc(profile.phone)} · <a href="mailto:${profile.email}">${esc(profile.email)}</a></p>
  <p class="contact"><a href="${profile.links.linkedin}">${bare(profile.links.linkedin)}</a> · <a href="${profile.links.github}">${bare(profile.links.github)}</a> · Portfolio: <a href="https://chaditroudi.github.io/ChadiTroudi/">chaditroudi.github.io/ChadiTroudi</a></p>
  <p class="contact">${esc(profile.availability)} · ${esc(profile.workPreference)}</p>
</header>

<h2>Profile</h2>
<p>${esc(profile.summary)}</p>

<h2>Professional Experience</h2>
${experience
  .map(
    (r) => `<section class="role">
  <div class="row"><span class="title">${esc(r.title)}</span><span class="meta">${formatPeriod(r)}</span></div>
  <div class="row"><span class="sub">${esc(r.company)}${r.companyNote ? ` (${esc(r.companyNote)})` : ""} — ${esc(r.engagement)}</span><span class="meta">${esc(r.location)}</span></div>
  ${r.highlights.length ? list(r.highlights) : ""}
  ${(r.projects ?? [])
    .map((p) => `<p class="project">Project: ${esc(p.name)}${p.url ? ` — ${bare(p.url)}` : ""}</p>${list(p.highlights)}`)
    .join("")}
  <p class="stack"><b>Technologies:</b> ${esc(r.stack.join(", "))}</p>
</section>`,
  )
  .join("\n")}

<h2>Selected Projects</h2>
${sideProjects
  .map(
    (p) => `<section class="role">
  <div class="row"><span class="title">${esc(p.name)}</span><span class="meta">${esc(p.period)}</span></div>
  <p class="sub">${bare(p.url)}</p>
  ${list(p.highlights)}
  <p class="stack"><b>Technologies:</b> ${esc(p.stack.join(", "))}</p>
</section>`,
  )
  .join("\n")}

<h2>Technical Skills</h2>
<table>${skills.map((g) => `<tr><td class="k">${esc(g.name)}</td><td>${esc(g.items.join(", "))}</td></tr>`).join("")}</table>

<h2>Education</h2>
${education
  .map(
    (e) => `<div class="row"><span><b>${esc(e.degree)}</b> — ${esc(e.school)}, ${esc(e.location)}</span><span class="meta">${esc(e.period)}</span></div>`,
  )
  .join("\n")}

<h2>Languages</h2>
<p>${languages.map((l) => `${esc(l.name)}: ${esc(l.level)}`).join(" · ")}</p>
</body>
</html>
`;

mkdirSync(resolve(root, "resume"), { recursive: true });
writeFileSync(resolve(root, "resume/resume.html"), html);

const require = createRequire(import.meta.url);
let chromium: typeof import("playwright").chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.pdf({
  path: resolve(root, "public/ChadiTroudiCv.pdf"),
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  tagged: true,
  outline: true,
});
await browser.close();
console.log("resume: wrote resume/resume.html and public/ChadiTroudiCv.pdf");
