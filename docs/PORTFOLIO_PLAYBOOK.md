# Portfolio playbook

The strategy behind this site, what has shipped, what comes next, and how to use the site in a job search. Status as of November 2026.

---

## 1. Goals

### Target roles (in priority order)
1. **Full-Stack Developer / Engineer — Java (Spring Boot) + Angular or React.** Strongest match with the CV (Bonial, Yanyi Catalog-AI, AlMergab).
2. **Full-Stack Developer with AI/LLM features — NestJS or Python + TypeScript front-end.** Mind Platform and TenderFlow AI are the differentiators here.
3. **Senior front-end (Angular/React + TypeScript)** at product companies that value migrations and component libraries (Bonial).

Remote-first. Keep the time zone (CET, UTC+1) prominent: it's a selling point for European teams.

### What hiring managers look for, and where the site answers it
| They ask | Answered by |
| --- | --- |
| Can this person ship, end to end? | Two case studies with role, decisions, trade-offs, code and outcomes |
| Is the experience real and recent? | Timeline with exact dates and companies; same facts as the CV |
| Is the code good? | This repository: strict TypeScript, tests, CI, a README that explains decisions |
| Will they work well remotely? | 4 years remote for German and Omani teams; written communication shown in the case studies |
| How do I contact them, right now? | Email, copy-email button, LinkedIn and CV on every page |

### ATS considerations
- The CV is generated from `src/content/profile.ts`: one column, real text, standard headings (Profile, Professional Experience, Selected Projects, Technical Skills, Education, Languages), no icons or emoji, dates written as "Mon YYYY – Mon YYYY", full URLs.
- Keywords appear in context: each role ends with a "Technologies:" line, so parsers match the stack to the role.
- `/experience` is the same content in HTML, for parsers that read web pages.
- Before applying, mirror the posting's exact terms where they are true (e.g. "Spring Boot 3", "Angular 17+", "REST APIs", "CI/CD").

### Success criteria (measure monthly)
| Metric | Target | How |
| --- | --- | --- |
| Visit → case-study open | ≥ 35% | Plausible event `case_study_open` |
| Visit → CV download | ≥ 15% | `cv_download` |
| Visit → contact (email, copy or LinkedIn) | ≥ 5% | `email_click`, `email_copy`, `linkedin_click` |
| Applications → first interview | ≥ 10% | Personal tracker |
| Lighthouse (mobile) | Performance ≥ 90, Accessibility 100, SEO 100 | Lighthouse CI (backlog) |
| axe-core violations | 0 on every route | Checked before each release |

---

## 2. UX strategy

### Audiences and their 60-second paths
- **Recruiter / sourcer** (scans for 10 seconds): Home hero (title, stack, availability) → proof metrics → Download CV, or Contact → quick facts.
- **Hiring manager** (2–5 minutes): Home → case study → "Next case study" → Experience → email.
- **Engineer on the interview panel**: Case study (decisions, code) → GitHub repository → README.

### Information architecture
```
Home  ─┬─ Work (/projects) ─┬─ Mind Platform case study
       │                    └─ Cabinet TIJ case study
       ├─ Experience (/experience)   = HTML CV
       ├─ About (/about)
       ├─ Contact (/contact)
       └─ CV (PDF) — in the header on every page
```
The bootcamp, tutoring, pricing and learning-platform pages were removed from the live site (code kept in `legacy/`): a second audience (students) diluted the message for employers.

### Conversion points
Header "CV" button (every page), hero calls to action (case studies, CV, contact), a contact band at the end of every page (email, copy email, LinkedIn, CV), and the Contact page with quick facts for recruiters.

### Responsive layout
Mobile-first. One column under 768 px; the hero photo moves below the text; the case-study table of contents appears from 1024 px. No horizontal scroll on any route at 390 px (checked).

### Accessibility (WCAG 2.1 AA)
Skip link, `header/nav/main/footer` landmarks, one `h1` per page, ordered lists for timelines and diagrams, `aria-live` confirmation on copy actions, visible focus rings, AA contrast in light and dark themes, motion reduced when the OS asks. axe-core: 0 violations.

---

## 3. Visual and interaction design

### Design system (tokens in `src/index.css`, Tailwind names in brackets)
| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--primary` (`primary`) | `hsl(155 80% 26%)` | `hsl(152 68% 46%)` | Calls to action, metrics, accents |
| `--background` | `hsl(220 20% 98%)` | `hsl(222 22% 5%)` | Page |
| `--card` | white | `hsl(222 18% 8%)` | Cards, panels |
| `--muted-foreground` | `hsl(220 12% 38%)` | `hsl(220 10% 66%)` | Secondary text (AA on background) |
| `--border` | `hsl(220 13% 87%)` | `hsl(222 15% 14%)` | Hairlines |

- **Type:** Space Grotesk (display: headings, metrics), Inter (body), JetBrains Mono (eyebrows, dates, tags, code). Body 16–17 px, line height ~1.6, headings tight (-0.02em).
- **Shape and space:** 1rem/1.5rem radii (cards `rounded-2xl`, CTA band `rounded-3xl`); a 4 px spacing scale; content width `max-w-5xl`.
- **Components** (`src/components/site`): `Section`, `Eyebrow`, `TagList`, `ButtonLink`/`ButtonAnchor` (primary, secondary, ghost), `CaseStudyCard`, `ProjectCard`, `ExperienceTimeline`, `SkillGroups`, `ContactCTA`, `CopyEmail`, diagrams.

### Microinteractions
- Cards lift 2–4 px with a border tint on hover; the arrow nudges right.
- Nav underline grows from the left on the active route.
- "Copy email" swaps to a check mark for 2 s and announces it to screen readers.
- Sections fade and rise 16 px once on scroll (500 ms, `cubic-bezier(.22,1,.36,1)`); disabled under `prefers-reduced-motion`.
- The header gains a blurred background after 8 px of scroll.

### Mockups
The implemented pages are the high-fidelity reference. To regenerate screenshots: `npm run build && npx vite preview`, then capture `/`, `/projects/mind-platform/`, `/projects/cabinet-tij/` at 1440×900 and 390×844 in both themes.

---

## 4. Technical architecture

- **Kept Vite + React + TypeScript; did not move to Next.js.** The site is static content. Per-route HTML generation (`scripts/postbuild.ts`) gives the SEO benefits of pre-rendering (titles, descriptions, Open Graph, JSON-LD, sitemap) without a framework migration. Revisit Next.js if a blog with many posts is added.
- **No state library.** All content is static TypeScript modules; the only state is UI state (menu, theme, copy confirmation).
- **Hosting:** GitHub Pages via Actions. Moving to Vercel is a 10-minute change if a custom domain plus preview deployments per PR are wanted: import the repo, set `base` to `/`, update `SITE_URL`.
- **Performance budget:** ≤ 130 KB gzipped JS on first load, ≤ 40 KB CSS, every image WebP with explicit width and height. Current: 116 KB / 34 KB.
- **SEO:** unique titles and descriptions (enforced by tests), trailing-slash canonicals, `Person` JSON-LD from the profile, `og.png` 1200×630, sitemap. Submit the sitemap in Google Search Console after the first deploy.

---

## 5. Case-study template

Every case study in `src/content/projects.ts` follows the same structure (tests enforce the required parts):

1. **Header:** title, one-sentence tagline, client, timeline, role, team, stack, live link.
2. **Outcome strip:** 3–4 numbers that can be verified.
3. **Context**
4. **The problem**
5. **My role:** what I did personally, especially when the team had more than one person.
6. **Product / screens:** real screenshots; label sample data.
7. **Architecture:** HTML diagram, accessible and theme-aware.
8. **Key decisions:** decision, why, trade-off.
9. **Code excerpt:** 15–30 lines from the real repository, with its file path.
10. **Results / Before → after**
11. **What I'd do next:** shows judgement.

**Still to add (needs the client's input):** usage numbers for Cabinet TIJ (monthly searches, quote requests, translator applications) and, with permission, Mind Platform product screenshots. Only add numbers you can defend in an interview.

---

## 6. Implementation plan

### Done (this release)
| # | Item |
| --- | --- |
| 1 | Content model (`profile.ts`, `projects.ts`, `seo.ts`) aligned with the CV |
| 2 | New site shell, pages, design tokens, light/dark themes |
| 3 | Case studies: Mind Platform, Cabinet TIJ (with real screenshots) |
| 4 | Removed bootcamp/platform from the live site (`legacy/`); 580 → 116 KB gzipped JS |
| 5 | BrowserRouter with per-route static HTML, sitemap, 404, redirect for old `/#/` links |
| 6 | CV generated from content: ATS-friendly PDF, 2 pages |
| 7 | Tests (content and pages), strict TypeScript, one CI/CD workflow |
| 8 | Plausible analytics wiring (off until configured) |

### Next (prioritised)
| Priority | Item | Estimate |
| --- | --- | --- |
| P0 | Merge to `main`, check the live deploy, submit the sitemap to Search Console | 0.5 h |
| P0 | Confirm the facts flagged in the hand-off (LinkedIn URL, bachelor school name, Arabic level, Chart.js vs ECharts) | 0.5 h |
| P1 | Enable Plausible (`PLAUSIBLE_DOMAIN` repository variable) | 0.5 h |
| P1 | Add Cabinet TIJ usage numbers and a Mind Platform screenshot (with permission) | 2 h |
| P1 | Lighthouse CI on PRs with the budgets above | 2 h |
| P2 | Playwright smoke + axe test in CI (routes render, no a11y violations) | 3 h |
| P2 | Third case study: TenderFlow AI (RAG pipeline, ~40% relevance gain) | 4 h |
| P2 | Custom domain (e.g. chaditroudi.dev) + Vercel previews | 1 h |
| P3 | French version of the site and CV for French-speaking employers | 6 h |

### Milestones
- **M1, week 1:** live on `main`, analytics on, LinkedIn and job profiles point to the new URL and CV.
- **M2, weeks 2–3:** Lighthouse CI and Playwright in CI; third case study.
- **M3, month 2:** review the funnel metrics; rewrite the weakest page.

### Testing
- **Unit / content:** `src/content/content.test.ts`
- **Page:** `src/test/pages.test.tsx` (React Testing Library)
- **Manual before release:** see the QA checklist.

### QA checklist (before each merge to `main`)
- [ ] `npm run lint && npm run typecheck && npm test && npm run build` all pass
- [ ] Every route loads at 390 px and 1440 px with no horizontal scroll
- [ ] Light and dark themes; theme toggle persists across reloads
- [ ] Keyboard only: skip link, header nav, mobile menu, case-study table of contents, copy buttons
- [ ] axe DevTools: 0 violations on `/`, a case study, `/experience`, `/contact`
- [ ] CV link opens the current PDF; the PDF's text copies in reading order
- [ ] Share a case-study URL in LinkedIn's Post Inspector: title, description and image are correct
- [ ] Email links open with the subject prefilled; "Copy email" works
- [ ] No placeholder text, no student or bootcamp content, dates match the CV

---

## 7. Repository and hiring artifacts

### Commit convention
[Conventional Commits](https://www.conventionalcommits.org): `feat(case-study): add TenderFlow AI`, `fix(a11y): list semantics on About`, `content(cv): update Mind Hands role`, `chore(ci): add Lighthouse budget`. Imperative mood, one change per commit.

### Pull requests
Use the template in `.github/pull_request_template.md`: what and why, screenshots for UI changes, and the QA checklist.

### Demo scripts

**30 seconds (recruiter call):**
"I'm a full-stack developer with four years of remote work for teams in Germany and Oman: Java/Spring Boot, Angular and React, and recently AI features. At Bonial I migrated 15+ modules to TypeScript and production bugs dropped by about 30%. Right now I'm building an AI analytics agent for Mind Platform. My portfolio has two case studies if you want to see how I work."

**3 minutes (hiring manager), screen-share the Mind Platform case study:**
1. Problem: every new business question needed a developer to write a query and a chart.
2. Diagram: question → cache → planner LLM → validation → MongoDB → writer/chart LLM.
3. Decision 1: validate LLM output against the registered schema, so hallucinated fields become retryable errors.
4. Code excerpt: `validatePipelineFields`.
5. Trade-offs and what I'd do next.

**10 minutes (technical panel):** Cabinet TIJ architecture and deployment pipeline, then this repository: content model, per-route HTML generation, tests, CI.

### Interview talking points (STAR)
- **TypeScript migration at Bonial.** S: large JS front-end with recurring production bugs. T: migrate without stopping feature work. A: module by module, shared types first, reusable component library (MUI 5 + Tailwind). R: 15+ modules migrated, ~30% fewer production bugs.
- **RAG relevance at Yanyi.** S: tender search returned weak matches. T: improve retrieval. A: LangChain/LangGraph pipeline with ChromaDB, Celery/Redis for async processing, PostgreSQL/MongoDB indexes and aggregations. R: ~40% better search relevance.
- **Making LLM output safe to execute (Mind Platform).** Schema-registered fields, forbidden stages, one bounded retry with a targeted hint, classified errors, 7-day cache.
- **Owning production (Cabinet TIJ).** CORS failures fixed by serving the API on the same origin; deploy pipeline changed from rebuilding on the server to reset-and-restart-what-changed.
- **Working remotely.** Four years with German and Omani teams in Scrum/Kanban: written updates, small PRs, overlapping CET hours.

Prepare one failure story too: something that broke in production, how you found it, and what you changed afterwards.
