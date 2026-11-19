# Chadi Troudi — portfolio

**Live:** https://chaditroudi.github.io/ChadiTroudi/ · **CV (PDF):** [public/ChadiTroudiCv.pdf](public/ChadiTroudiCv.pdf) · **Contact:** chadi.troudi.dev@gmail.com

Full-Stack Developer (Java/Spring Boot · Angular · React · NestJS · AI). This repository is the source of my portfolio. It's a small site, but it's built like a production front-end, because the code is part of what I'm showing.

## What's inside

| Page | Purpose |
| --- | --- |
| `/` | 10-second pitch: who I am, proof metrics, case studies, experience, contact |
| `/projects/mind-platform` | Case study: an AI agent that turns plain-language questions into validated MongoDB pipelines |
| `/projects/cabinet-tij` | Case study: a live directory of sworn translators (React + Laravel + Docker on a VPS) |
| `/experience` | HTML version of the CV, readable by people, crawlers and ATS parsers |
| `/about`, `/contact` | How I work; quick facts for recruiters |

## Engineering highlights

- **One source of truth for career facts.** [`src/content/profile.ts`](src/content/profile.ts) drives every page and the PDF CV ([`scripts/build-resume.ts`](scripts/build-resume.ts)), so the site and the CV can't disagree. Years of experience are derived from dates, not hard-coded.
- **Static, SEO-ready routes on GitHub Pages.** [`scripts/postbuild.ts`](scripts/postbuild.ts) writes an `index.html` per route with its own title, description, canonical URL, Open Graph tags and `Person` JSON-LD, plus `sitemap.xml` and a `404.html` SPA fallback.
- **Small and fast.** Route-level code splitting; 116 KB gzipped JS and 34 KB CSS, down from 580 KB JS plus 67 MB of video before the redesign. WebP images with explicit dimensions, and the portrait loaded at high priority.
- **Accessible.** Skip link, landmarks, one `h1` per page, visible focus rings, `prefers-reduced-motion` respected, WCAG AA colour contrast in both themes. axe-core reports zero violations on every route.
- **Tested.** Vitest + Testing Library: content-integrity tests (no placeholder emails, roles in order, metrics tied to real employers, unique SEO titles) and page tests (headings, calls to action, case-study table of contents, 404).
- **CI/CD.** One GitHub Actions workflow lints, type-checks (strict), tests and builds every PR, and deploys `main` to GitHub Pages.
- **Analytics.** Privacy-friendly Plausible, off by default. Set the `PLAUSIBLE_DOMAIN` repository variable to enable it. It tracks the hiring funnel: case-study opens, CV downloads, email and LinkedIn clicks.

## Stack

React 18 · TypeScript (strict) · Vite 5 · Tailwind CSS 3 · Framer Motion · React Router 6 · Vitest · Playwright (CV/OG generation) · GitHub Actions · GitHub Pages

## Develop

```bash
npm ci
npm run dev          # http://localhost:5173/ChadiTroudi/
npm test             # unit + page tests
npm run lint && npm run typecheck
npm run build        # vite build + per-route HTML, sitemap, 404
npm run resume       # regenerate public/ChadiTroudiCv.pdf from src/content/profile.ts
npm run og-image     # regenerate public/og.png (link preview)
```

`npm run resume` and `npm run og-image` need Playwright with Chromium (`npm i -D playwright && npx playwright install chromium`).

## Project layout

```
src/
  content/      profile.ts (CV facts) · projects.ts (case studies) · seo.ts (page metadata)
  components/site/  layout, header/footer, cards, timeline, diagrams, primitives
  pages/        Index, Projects, CaseStudy, Experience, About, Contact, NotFound
scripts/        postbuild.ts · build-resume.ts · build-og-image.ts
docs/           portfolio playbook: strategy, design system, backlog, QA, interview prep
legacy/         earlier bootcamp / learning-platform code, kept for reference, not built or deployed
```

## Updating content

1. Edit [`src/content/profile.ts`](src/content/profile.ts) (roles, metrics, skills) or [`src/content/projects.ts`](src/content/projects.ts) (case studies).
2. `npm run resume` if the CV should change too.
3. `npm test && npm run build`, then open a PR. Merging to `main` deploys.
