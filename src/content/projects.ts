import tijHome from "@/assets/case-studies/tij-home.webp";
import tijResults from "@/assets/case-studies/tij-results.webp";
import tijJoin from "@/assets/case-studies/tij-join.webp";
import tijMobile from "@/assets/case-studies/tij-mobile.webp";
import tenderflow from "@/assets/case-studies/tenderflow.webp";
import kaufdaShelf from "@/assets/case-studies/bonial-kaufda-shelf.webp";
import kaufdaBrochure from "@/assets/case-studies/bonial-kaufda-brochure.webp";
import kaufdaOffers from "@/assets/case-studies/bonial-kaufda-offers.webp";
import kaufdaMobile from "@/assets/case-studies/bonial-kaufda-mobile.webp";
import bonialCompany from "@/assets/case-studies/bonial-company.webp";
import bonialStandup from "@/assets/bonial-standup.webp";
import bonialOffice from "@/assets/bonial-office.webp";

export interface Shot {
  src: string;
  alt: string;
  caption: string;
  /** "phone" renders in a narrow frame next to desktop shots. */
  frame?: "desktop" | "phone";
}

export interface Decision {
  title: string;
  why: string;
  tradeoff: string;
}

export interface CodeExcerpt {
  filename: string;
  language: string;
  intro: string;
  code: string;
}

export interface CaseSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  decisions?: Decision[];
  code?: CodeExcerpt;
  beforeAfter?: { before: string[]; after: string[] };
  shots?: Shot[];
  /** Name of a diagram component rendered by the page. */
  diagram?: "mind-pipeline" | "tij-architecture";
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  client: string;
  period: string;
  role: string;
  stack: string[];
  /** Strongest verifiable outcome, shown on cards. */
  highlight: string;
  url?: string;
  cover?: Shot;
  caseStudy?: {
    team: string;
    outcomes: { value: string; label: string }[];
    sections: CaseSection[];
  };
}

export const projects: Project[] = [
  /* ────────────────────────── Mind Platform ────────────────────────── */
  {
    slug: "mind-platform",
    title: "Mind Platform — AI analytics agent",
    tagline:
      "Business users ask a question in plain language and get a validated MongoDB query back as a chart, a written report or a one-line answer, in seconds.",
    client: "Mind Hands (2026 – present) · core platform with AlMergab (2022 – 2024)",
    period: "Dec 2022 – present",
    role: "Full-stack developer — designed and built the AI analytics service (NestJS) and its Angular client",
    stack: ["Angular", "NestJS 11", "TypeScript", "MongoDB", "Mastra AI", "Vercel AI SDK", "Zod", "ECharts", "Jest"],
    highlight: "Natural-language questions → validated MongoDB pipelines → charts & reports",
    url: "https://www.mind-platform.com",
    caseStudy: {
      team: "Sole developer of the AI analytics service",
      outcomes: [
        { value: "2", label: "LLM calls per question (planner + writer), 0 on a cached repeat" },
        { value: "3", label: "answer types from one endpoint: dashboard, report, inquiry" },
        { value: "7", label: "LLM providers behind one model client, with automatic fallback" },
        { value: "1", label: "bounded retry with a targeted hint — never an open-ended loop" },
      ],
      sections: [
        {
          id: "context",
          heading: "Context",
          paragraphs: [
            "Mind Platform is a SaaS product for workflows, dashboards and business data management. From 2022 to 2024, with AlMergab, I built core platform features on an Angular + NestJS Nx monorepo: authentication (OTP, sessions, email verification, password reset), notifications over Server-Sent Events, reporting, workflows and permissions.",
            "In 2026, as a freelancer for Mind Hands, I added an AI analytics layer on top of that data.",
          ],
        },
        {
          id: "problem",
          heading: "The problem",
          paragraphs: [
            "Every new business question (\"top 5 projects by budget\", \"how many projects are active?\") needed a developer to write an aggregation pipeline and a chart. Fixed report templates did not keep up with new datasets.",
            "The obvious fix, letting an LLM write database queries, brings real risks: invented field names, write or cross-collection stages, unbounded retries and unpredictable cost.",
          ],
        },
        {
          id: "role",
          heading: "My role",
          bullets: [
            "Designed the request pipeline end to end: intent detection, planning, validation, execution, chart and report generation.",
            "Built the NestJS service (modules for analytics, data sources, cache, history, memory, provider settings) and the Angular client.",
            "Wrote the model client that wraps OpenAI, Anthropic, Gemini, Groq, Mistral, Together and Perplexity behind one interface.",
            "Added unit tests for the planner, writer, model client, pipeline and analytics services.",
          ],
        },
        {
          id: "architecture",
          heading: "How a question becomes an answer",
          paragraphs: [
            "Datasets are registered at runtime as data sources: a MongoDB collection plus a field schema. The planner LLM only ever sees registered field names, and its output is a Zod-typed plan that must pass validation before it reaches the database.",
          ],
          diagram: "mind-pipeline",
        },
        {
          id: "decisions",
          heading: "Key decisions",
          decisions: [
            {
              title: "Validate every LLM-written pipeline against a registered schema",
              why: "A made-up field name becomes a validation error that can be caught and retried, instead of a wrong answer or a runtime failure. Write stages and cross-collection escapes are rejected by configuration.",
              tradeoff: "Each new dataset has to be registered before anyone can ask questions about it.",
            },
            {
              title: "Exactly one retry, with a targeted hint",
              why: "When validation or MongoDB fails, the exact violation (unknown field, mixed $project, bad $convert) is sent back to the planner once. This fixes most failures while keeping latency and token cost predictable.",
              tradeoff: "Some hard prompts fail fast with a clear error instead of trying again.",
            },
            {
              title: "Structured output everywhere",
              why: "Plans, dashboards and report sections are generated against Zod schemas, so the Angular client renders typed data, not free text.",
              tradeoff: "Only models that support structured or JSON output can be used.",
            },
            {
              title: "Cache identical questions for 7 days",
              why: "A repeated question costs zero LLM calls. Follow-up questions in the same session can reuse the previous plan.",
              tradeoff: "Answers can be up to a week old unless the cache is invalidated.",
            },
            {
              title: "A provider pool that is health-checked and degrades gracefully",
              why: "Rate limits cool an API key down and move to the next one. Expired keys and retired models are marked and skipped. Requests that would exceed token limits are rejected before any call is made.",
              tradeoff: "More moving parts: a scheduled health check and per-connection token accounting.",
            },
          ],
        },
        {
          id: "code",
          heading: "Code excerpt",
          code: {
            filename: "nest-app/src/analytics/pipeline.validation.ts (trimmed)",
            language: "ts",
            intro:
              "Walks every stage of an LLM-generated pipeline and rejects any field that is not in the registered schema and was not computed by an earlier stage. The error message also serves as the retry hint.",
            code: `export function validatePipelineFields(pipeline: Row[], source: DataSource): void {
  const known = new Set(["_id", ...source.fields.map((f) => f.name)]);
  const computed = new Set<string>();
  const bad: string[] = [];

  const addBad = (name: string) => {
    if (name && !known.has(name) && !computed.has(name)) bad.push(name);
  };

  // Recursively collect "$field.path" references ("$$variables" are skipped).
  const walkRefs = (v: unknown): void => {
    if (typeof v === "string" && v.startsWith("$") && !v.startsWith("$$")) {
      addBad(v.slice(1).split(".")[0]);
    } else if (Array.isArray(v)) v.forEach(walkRefs);
    else if (v && typeof v === "object") Object.values(v).forEach(walkRefs);
  };

  for (const stage of pipeline) {
    const op = Object.keys(stage)[0];
    const behavior = STAGE_BEHAVIORS[op]; // per-operator rules live in config
    // ...validate keys, walk values, register fields this stage creates
  }

  if (bad.length) {
    throw new Error(
      \`Unknown field(s): \${[...new Set(bad)].join(", ")}. Registered: \${[...known].join(", ")}\`,
    );
  }
}`,
          },
        },
        {
          id: "results",
          heading: "Results",
          bullets: [
            "One endpoint (POST /api/analytics) returns three kinds of answer: ECharts dashboards, 1–5 section reports, or short factual answers.",
            "Questions can be asked in English or Arabic.",
            "LLM failures surface as classified errors (INVALID_API_KEY, LLM_RATE_LIMIT, TOKEN_LIMIT_TOO_LOW…) with a human-readable next step, instead of stack traces.",
            "Token usage is tracked per user and per connection, so AI cost can be attributed.",
          ],
        },
        {
          id: "next",
          heading: "What I'd do next",
          bullets: [
            "Production-grade multi-tenant access control and per-tenant cost caps.",
            "Extend unit tests to the chart, cache and history services.",
            "An evaluation set of real business questions to catch prompt regressions in CI.",
          ],
        },
      ],
    },
  },

  /* ────────────────────────── Cabinet TIJ ────────────────────────── */
  {
    slug: "cabinet-tij",
    title: "Cabinet TIJ — directory of sworn translators",
    tagline:
      "A live directory where courts, administrations and individuals in France find a sworn translator or interpreter by language, region and credential, and where translators apply to join the network.",
    client: "Cabinet TIJ (France)",
    period: "May 2025 – present",
    role: "Full-stack developer & DevOps — Laravel API, React architecture, Docker/Nginx hosting, CI/CD",
    stack: ["React 18", "TypeScript", "Redux Toolkit / RTK Query", "Tailwind CSS", "PrimeReact", "Laravel 10", "Sanctum", "MySQL 8", "Docker Compose", "Nginx", "GitHub Actions"],
    highlight: "Live in production · auto-deployed on every push to main",
    url: "https://www.cabinettij.fr",
    cover: { src: tijHome, alt: "Cabinet TIJ home page: search and join calls to action around the 24/7 phone line", caption: "Home page", frame: "desktop" },
    caseStudy: {
      team: "Two developers: me (API, architecture, infrastructure, deployment) and one front-end developer",
      outcomes: [
        { value: "Live", label: "in production at cabinettij.fr since 2025" },
        { value: "155", label: "commits over 18 months of iterative delivery" },
        { value: "4", label: "containerised services: React/Nginx, Laravel API, MySQL, TLS proxy" },
        { value: "1 push", label: "to main deploys to the VPS through GitHub Actions" },
      ],
      sections: [
        {
          id: "context",
          heading: "Context",
          paragraphs: [
            "Cabinet TIJ is a French translation and interpreting firm that runs a network of sworn translators and interpreters for judicial, administrative and technical work.",
            "Its directory serves two audiences. Administrations and individuals need the right professional quickly. Translators want to join the network.",
          ],
        },
        {
          id: "problem",
          heading: "The problem",
          paragraphs: [
            "The first version opened on a generic video landing page, and the credentials that matter (sworn expert, CESEDA, 24/7 on-call) were not shown in search results.",
            "The firm also needed to update its list without a developer, and to ship changes without anyone logging into a server.",
          ],
        },
        {
          id: "role",
          heading: "My role",
          bullets: [
            "Built the Laravel 10 REST API: translators, languages, filtering, statistics, and authentication with Sanctum, two-factor login, email verification and password reset.",
            "Set up the React + TypeScript front-end: Redux Toolkit store, RTK Query API layer with token refresh, and route guards for the back-office.",
            "Delivered the redesigned search-first home page, credential badges, quote request and the dedicated join page.",
            "Containerised the stack and own production: Docker Compose, Nginx with Let's Encrypt TLS, VPS hosting and the GitHub Actions deployment.",
          ],
        },
        {
          id: "product",
          heading: "The product",
          paragraphs: [
            "The 24/7 phone line sits at the centre of the home page, between the two audiences: \"find a translator\" on the left and \"offer my services\" on the right. Filters work by language, name, region and credential. Credentials appear as badges in every result row.",
          ],
          shots: [
            { src: tijResults, alt: "Directory results filtered by language, with CESEDA, sworn expert and PERM badges", caption: "Search results with credential badges (shown with sample data)", frame: "desktop" },
            { src: tijMobile, alt: "Cabinet TIJ home page on a phone, with the 24/7 phone number above the fold", caption: "Mobile: phone line and both calls to action above the fold", frame: "phone" },
            { src: tijJoin, alt: "Join the network page offering a partnership agreement or an annual membership", caption: "Dedicated join page: two ways to collaborate", frame: "desktop" },
          ],
        },
        {
          id: "architecture",
          heading: "Architecture",
          paragraphs: [
            "One VPS runs four containers behind Nginx. The browser calls the API on the same origin (/api), so there is no cross-origin configuration to get wrong between www and apex domains.",
          ],
          diagram: "tij-architecture",
        },
        {
          id: "decisions",
          heading: "Key decisions",
          decisions: [
            {
              title: "Serve the API on the same origin",
              why: "Requests from www.cabinettij.fr were blocked by CORS. Routing /api through the same Nginx removed that whole class of errors, with no CORS rules to maintain.",
              tradeoff: "Front-end and API now share one domain and one TLS proxy.",
            },
            {
              title: "Deploy by resetting to main and restarting only what changed",
              why: "A build on the server would bake the wrong API URL into the bundle. The workflow now resets the VPS to origin/main and restarts only the affected containers; Laravel restarts only when ctij-api/ changed.",
              tradeoff: "The front-end build is committed to the repository. Next step: build it in CI and ship it as an artifact.",
            },
            {
              title: "Combinable credential filters that stay backward compatible",
              why: "A translator can hold several credentials. They are stored as a normalised list (\"0,1,2\") and matched with parameterised FIND_IN_SET, so older single-value records keep working without a data migration.",
              tradeoff: "A pivot table would be cleaner long-term; this shipped without downtime.",
            },
            {
              title: "An editorial visual language",
              why: "Spectral display type with Inter for text, and a navy, gold and paper palette, signal a legal, trustworthy service rather than a generic SaaS look.",
              tradeoff: "Custom tokens on top of PrimeReact components meant overriding some library styles.",
            },
          ],
        },
        {
          id: "code",
          heading: "Code excerpt",
          code: {
            filename: "ctij-api/app/Http/Controllers/API/InterpreteController.php (simplified)",
            language: "php",
            intro: "Combinable credential filters. Values are bound as parameters, never concatenated into SQL.",
            code: `// Combine level filters: CESEDA (0), Expert assermenté (1), Permanence (2)
$levels = [];
if ($request->assermente === "true") $levels[] = '0';
if ($request->expert === "true")     $levels[] = '1';
if ($request->permanence === "true") $levels[] = '2';

if (! empty($levels)) {
    $query->where(function ($q) use ($levels) {
        foreach ($levels as $level) {
            $q->orWhereRaw(
                'FIND_IN_SET(?, REPLACE(COALESCE(level, ""), " ", ""))',
                [$level]
            );
        }
    });
}`,
          },
        },
        {
          id: "before-after",
          heading: "Before → after",
          beforeAfter: {
            before: [
              "Full-screen video hero with a generic welcome message",
              "Credentials hidden; the phone line was not prominent",
              "Translator recruitment mixed into the home page",
              "Deploys rebuilt the front-end on the VPS",
              "API on a separate origin, with CORS failures on www",
            ],
            after: [
              "Search-first home page built around the 24/7 phone line",
              "CESEDA, sworn-expert and PERM badges on every result row",
              "Dedicated /rejoignez-nous page with two collaboration models",
              "Push to main → GitHub Actions → reset and restart only what changed",
              "Same-origin /api through Nginx; no CORS configuration",
            ],
          },
        },
        {
          id: "next",
          heading: "What I'd do next",
          bullets: [
            "Build the front-end in CI and deploy it as an artifact, with no build output in git.",
            "Add API feature tests (PHPUnit) and Playwright smoke tests to the pipeline.",
            "Server-side pagination for the public search, and structured data (LocalBusiness) for local SEO.",
          ],
        },
      ],
    },
  },

  /* ────────────────────────── Bonial ────────────────────────── */
  {
    slug: "bonial",
    title: "Bonial — brochures & offers at scale",
    tagline:
      "In Bonial's Planet Express team I worked on Bonial Console and the APIs behind the brochures and local offers that millions of shoppers browse on kaufDA, and moved the front-end to TypeScript.",
    client: "Bonial (Germany) · Planet Express team",
    period: "Sep 2025 – Feb 2026",
    role: "Full-stack developer (freelance) — React/TypeScript front-end, Spring Boot APIs, Camunda workflows",
    stack: ["React", "TypeScript 5", "Material UI 5", "Tailwind CSS 3", "Java", "Spring Boot", "OpenAPI", "Camunda 7 (BPMN)", "Docker", "GitHub Actions"],
    highlight: "15+ modules migrated to TypeScript · ~30% fewer production bugs",
    url: "https://bonial.com/de/",
    cover: { src: kaufdaShelf, alt: "kaufDA home page: a grid of current retailer brochures near Berlin", caption: "kaufDA brochure shelf", frame: "desktop" },
    caseStudy: {
      team: "Planet Express team, Bonial (Berlin) — remote from Tunis, with in-person sprint planning at the Berlin office",
      outcomes: [
        { value: "15+", label: "front-end modules migrated from JavaScript to TypeScript 5" },
        { value: "~30%", label: "fewer production bugs after the migration" },
        { value: "1", label: "shared component library: buttons, forms, tables, modals" },
        { value: "BPMN", label: "Camunda 7 workflows automating data-driven campaigns" },
      ],
      sections: [
        {
          id: "context",
          heading: "Context",
          paragraphs: [
            "Bonial is the retail-marketing company behind kaufDA in Germany (and bonial.fr in France). Retailers and brands publish their weekly brochures and offers; shoppers browse them by location, store and product.",
            "Bonial Console is the platform side of that: where brochures, offers and campaigns are managed. I joined the Planet Express team for six months to work across its React front-end and Spring Boot services.",
          ],
          shots: [
            { src: bonialCompany, alt: "bonial.com home page: the retail marketing hub for retailers and brands", caption: "bonial.com — company context (public site, not built by me)", frame: "desktop" },
          ],
        },
        {
          id: "problem",
          heading: "The challenge",
          paragraphs: [
            "A large JavaScript front-end shared by several screens: type errors reached production, and similar UI (forms, tables, dialogs) was rebuilt slightly differently on each screen.",
            "On the back-end, offers and brochures needed precise edits without overwriting other fields, and marketing campaigns built on first-party data needed to run as repeatable, visible workflows instead of manual steps.",
          ],
        },
        {
          id: "role",
          heading: "My role",
          bullets: [
            "Migrated more than 15 front-end modules from JavaScript to TypeScript 5.",
            "Refactored React screens with Material UI 5 and Tailwind CSS 3, and built a reusable component library (buttons, forms, tables, modals).",
            "Developed and maintained Spring Boot REST APIs for offer and brochure management, including PATCH endpoints for partial updates, documented with OpenAPI.",
            "Implemented BPMN workflows in Camunda 7 to automate data-driven marketing campaigns based on first-party customer data.",
            "Wrote unit and integration tests and shipped through GitHub Actions and Docker, in Scrum and Kanban ceremonies with the team.",
          ],
        },
        {
          id: "product",
          heading: "Where the work shows up",
          paragraphs: [
            "Brochures and offers managed on the platform side are what shoppers see on kaufDA: a shelf of current brochures near them, a brochure viewer tied to the nearest store, and offer pages by product.",
          ],
          shots: [
            { src: kaufdaBrochure, alt: "kaufDA brochure viewer: a REWE brochure with the nearest store, opening hours and page count", caption: "Brochure viewer with the nearest store and opening hours", frame: "desktop" },
            { src: kaufdaMobile, alt: "kaufDA on a phone: brochure grid for postcode 10178", caption: "Mobile brochure shelf", frame: "phone" },
            { src: kaufdaOffers, alt: "kaufDA offers page for coffee, listing brochures that contain coffee deals", caption: "Offers by product, linked to the brochures that contain them", frame: "desktop" },
          ],
        },
        {
          id: "decisions",
          heading: "How I approached it",
          decisions: [
            {
              title: "Migrate module by module, not in one big rewrite",
              why: "The team kept shipping features while the migration ran. Each module moved to TypeScript on its own, so every merge left the app working.",
              tradeoff: "For a while JavaScript and TypeScript lived side by side, with typed boundaries between them.",
            },
            {
              title: "One component library instead of per-screen widgets",
              why: "Buttons, forms, tables and modals were built once on Material UI 5 with Tailwind CSS, so screens look and behave the same and fixes land everywhere at once.",
              tradeoff: "Up-front design work and agreeing on component APIs before using them.",
            },
            {
              title: "PATCH for partial updates of offers and brochures",
              why: "Editors change one field (a date, a price, a status) without resending the whole resource, so concurrent edits to other fields aren't overwritten.",
              tradeoff: "Each patchable field needs its own validation and clear null-versus-missing semantics.",
            },
            {
              title: "Campaigns as BPMN workflows in Camunda 7",
              why: "Campaign steps become a diagram that product and marketing can read, with retries and timers handled by the engine rather than custom code.",
              tradeoff: "Another runtime to operate and version alongside the services.",
            },
          ],
        },
        {
          id: "code",
          heading: "Pattern example",
          code: {
            filename: "Illustrative example — not Bonial source code",
            language: "java",
            intro:
              "Bonial's code is private, so this is a minimal example of the PATCH pattern I used for partial updates: only the fields present in the request change.",
            code: `@PatchMapping("/brochures/{id}")
public BrochureResponse patch(@PathVariable UUID id,
                              @Valid @RequestBody BrochurePatch patch) {
    Brochure brochure = brochures.findById(id)
        .orElseThrow(() -> new BrochureNotFoundException(id));

    patch.title().ifPresent(brochure::setTitle);
    patch.validFrom().ifPresent(brochure::setValidFrom);
    patch.validUntil().ifPresent(brochure::setValidUntil);
    patch.status().ifPresent(brochure::changeStatus); // domain rule checks

    return mapper.toResponse(brochures.save(brochure));
}

// Optional<T> distinguishes "not sent" (leave unchanged) from a value to set.
public record BrochurePatch(Optional<String> title,
                            Optional<LocalDate> validFrom,
                            Optional<LocalDate> validUntil,
                            Optional<BrochureStatus> status) {}`,
          },
        },
        {
          id: "team",
          heading: "Working with the team",
          paragraphs: [
            "Remote from Tunis, in the same daily stand-ups, refinements, reviews and retrospectives as the rest of Planet Express, with in-person sprint planning at Bonial's Berlin office.",
          ],
          shots: [
            { src: bonialStandup, alt: "Daily stand-up with the Planet Express team at Bonial", caption: "Daily stand-up with the Planet Express team", frame: "desktop" },
            { src: bonialOffice, alt: "Sprint planning at the Bonial office in Berlin", caption: "Sprint planning at the Berlin office", frame: "desktop" },
          ],
        },
        {
          id: "next",
          heading: "What I took away",
          bullets: [
            "Incremental migrations work when every step ships: small, typed modules merged continuously beat a long-lived rewrite branch.",
            "A component library only sticks if it is easier to use than copy-paste, so documentation and examples matter as much as the code.",
            "Workflow engines make long-running business processes visible to people who don't read code.",
          ],
        },
      ],
    },
  },

  /* ────────────────────────── Project cards (no full case study yet) ────────────────────────── */
  {
    slug: "tenderflow-ai",
    title: "TenderFlow AI",
    tagline: "RAG pipelines and AI agents that analyse tenders, extract data, classify documents and write summaries.",
    client: "Yanyi (Germany)",
    period: "Sep 2024 – Aug 2025",
    role: "Full-stack AI developer",
    stack: ["Python", "Django REST", "LangChain", "LangGraph", "ChromaDB", "Celery", "Redis", "React", "TypeScript"],
    highlight: "~40% better document-search relevance",
    url: "https://www.tender-flow.com/",
    cover: { src: tenderflow, alt: "TenderFlow AI product screenshot", caption: "TenderFlow AI", frame: "desktop" },
  },
  {
    slug: "catalog-ai",
    title: "Catalog-AI",
    tagline: "Spring Boot back-end for product-catalogue management with secure REST APIs and Elasticsearch search.",
    client: "Yanyi (Germany)",
    period: "2024 – 2025",
    role: "Back-end developer",
    stack: ["Java 17", "Spring Boot", "Spring Security OAuth2", "JPA/Hibernate", "PostgreSQL", "Elasticsearch"],
    highlight: "Modular, OpenAPI-documented architecture",
  },
  {
    slug: "car-rental",
    title: "Car Rental System",
    tagline: "Fleet management and booking for a rental company: users, vehicles and reservations.",
    client: "AlMergab (Oman)",
    period: "2022 – 2024",
    role: "Full-stack developer",
    stack: ["React", "Angular", "Node.js", "Express", "MongoDB", "Mongoose"],
    highlight: "40+ secure REST APIs",
  },
];

export const caseStudies = projects.filter((p) => p.caseStudy);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
