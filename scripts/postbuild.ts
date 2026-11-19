/**
 * Runs after `vite build` (via vite-node, so it can import the same TypeScript content as the app).
 *
 * GitHub Pages serves static files only. For every known route this writes
 * dist/<route>/index.html with that page's own <title>, description, canonical
 * and Open Graph tags, so links shared on LinkedIn/Slack preview correctly and
 * crawlers get a 200 with the right metadata. It also writes:
 *   - dist/404.html   SPA fallback for unknown URLs
 *   - dist/sitemap.xml
 *   - the Person JSON-LD block, generated from src/content/profile.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { education, experience, profile, skills, SITE_URL } from "../src/content/profile";
import { absoluteUrl, allPages, type PageMeta } from "../src/content/seo";

const dist = resolve(import.meta.dirname ?? __dirname, "../dist");
const template = readFileSync(join(dist, "index.html"), "utf8");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.headline,
  description: profile.summary,
  email: `mailto:${profile.email}`,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og.png`,
  address: { "@type": "PostalAddress", addressLocality: "Tunis", addressCountry: "TN" },
  sameAs: [profile.links.linkedin, profile.links.github],
  alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school.split(" — ")[0] })),
  knowsAbout: skills.flatMap((g) => g.items).slice(0, 30),
  hasOccupation: experience.map((r) => ({ "@type": "Occupation", name: r.title, description: `${r.company}: ${r.summary}` })),
};

function render(meta: PageMeta): string {
  const url = absoluteUrl(meta.path);
  const replacements: [RegExp, string][] = [
    [/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`],
    [/(<meta name="description" content=")[^"]*(")/, `$1${esc(meta.description)}$2`],
    [/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`],
    [/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`],
    [/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(meta.title)}$2`],
    [/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(meta.description)}$2`],
    [/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(meta.title)}$2`],
    [/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(meta.description)}$2`],
    [/(<script type="application\/ld\+json" id="person-jsonld">)[\s\S]*?(<\/script>)/, `$1${JSON.stringify(personJsonLd)}$2`],
  ];
  return replacements.reduce((html, [pattern, value]) => {
    if (!pattern.test(html)) throw new Error(`postbuild: pattern not found in index.html: ${pattern}`);
    return html.replace(pattern, value);
  }, template);
}

for (const page of allPages) {
  const file = page.path === "/" ? join(dist, "index.html") : join(dist, page.path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(page));
}

writeFileSync(
  join(dist, "404.html"),
  render({ path: "/404", title: `Page not found — ${profile.name}`, description: "This page doesn't exist." }).replace(
    /<link rel="canonical"[^>]*>\n?/,
    '<meta name="robots" content="noindex" />\n',
  ),
);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((p) => `  <url><loc>${absoluteUrl(p.path)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`,
);

console.log(`postbuild: wrote ${allPages.length} route pages, 404.html and sitemap.xml`);
