/**
 * Single source of truth for every career fact on the site AND in the CV.
 *
 * - The pages in src/pages read from here.
 * - scripts/build-resume.ts renders the PDF CV (public/ChadiTroudiCv.pdf) from here.
 *
 * Change a fact once, here, then run `npm run resume` to regenerate the PDF.
 */

export type YearMonth = `${number}-${string}`; // "2026-04"

export interface Role {
  id: string;
  title: string;
  company: string;
  companyNote?: string; // e.g. "Germany"
  engagement: string; // e.g. "Remote freelance assignment"
  location: string;
  start: YearMonth;
  end: YearMonth | "present";
  summary: string;
  highlights: string[];
  /** Named projects delivered inside this role (shown as sub-sections in the CV). */
  projects?: { name: string; url?: string; highlights: string[] }[];
  stack: string[];
}

export interface Metric {
  value: string;
  label: string;
  source: string; // which role/project the number comes from
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export const SITE_URL = "https://chaditroudi.github.io/ChadiTroudi";

/** Month of the first professional role in `experience` (drives "years of experience"). */
export const CAREER_START: YearMonth = "2022-12";

export const profile = {
  name: "Chadi Troudi",
  headline: "Full-Stack Developer",
  focus: "Java · Angular · React · AI",
  location: "Tunis, Tunisia",
  availability: "Available immediately",
  workPreference: "Remote · full-time or freelance",
  email: "chadi.troudi.dev@gmail.com",
  phone: "+216 24 406 342",
  links: {
    linkedin: "https://www.linkedin.com/in/chaditroudi",
    github: "https://github.com/chaditroudi",
  },
  /** One sentence for the hero and meta description. */
  pitch:
    "I build scalable web applications and generative-AI features — RAG pipelines, LLM agents and analytics dashboards — for product teams in Germany and Oman.",
  /** CV profile summary (3 lines max). */
  summary:
    `Full-Stack Developer with ${yearsOfExperience()} years of remote experience delivering for product teams in Germany and Oman. I build Java/Spring Boot, NestJS and Django back-ends, Angular and React front-ends, and generative-AI features (RAG pipelines, LLM agents, analytics dashboards), with a focus on code quality, performance and maintainability.`,
  current: {
    company: "Mind Platform",
    what: "Angular front-end for SICAP",
  },
} as const;

export const metrics: Metric[] = [
  { value: "15+", label: "front-end modules migrated from JavaScript to TypeScript", source: "Bonial" },
  { value: "~30%", label: "fewer production bugs after the TypeScript migration", source: "Bonial" },
  { value: "~40%", label: "better document-search relevance in a RAG pipeline", source: "Yanyi · TenderFlow AI" },
  { value: "40+", label: "secure REST APIs for fleet, booking and user management", source: "AlMergab · Car Rental" },
];

export const experience: Role[] = [
  {
    id: "mind-platform",
    title: "Freelance Full-Stack Developer — Angular & NestJS",
    company: "Mind Platform",
    companyNote: "Mind Hands Tec",
    engagement: "Freelance assignment",
    location: "Tunis, Tunisia",
    start: "2026-04",
    end: "present",
    summary: "SICAP (Smart Institutional Coordination & Analytics Platform): records, approval workflows and live dashboards. Mostly Angular front-end, plus NestJS.",
    highlights: [
      "Main contributor to the Angular front-end of SICAP: records, approval workflows and dashboards, in five languages with right-to-left Arabic.",
      "Build NestJS endpoints and MongoDB aggregations behind dashboards and reports, and optimise REST API performance.",
      "Integrate AI agents (Mastra AI, LLMs) that turn plain-language questions into validated MongoDB aggregation pipelines and return dashboards, written reports or direct answers.",
    ],
    stack: ["Angular", "TypeScript", "RxJS", "i18n / RTL", "NestJS", "MongoDB Aggregation Framework", "Mastra AI", "LLMs", "REST API", "ECharts", "Git"],
  },
  {
    id: "bonial",
    title: "Freelance Full-Stack Developer — React & Java",
    company: "Bonial",
    companyNote: "Germany",
    engagement: "Remote freelance assignment",
    location: "Tunis, Tunisia",
    start: "2025-09",
    end: "2026-02",
    summary: "Planet Express team: Bonial Console, brochure and offer APIs, and campaign automation behind kaufDA, Germany's digital-leaflet app.",
    highlights: [
      "Migrated 15+ front-end modules from JavaScript to TypeScript 5, improving maintainability and reducing production bugs by ~30%.",
      "Refactored React interfaces with Material UI 5 and Tailwind CSS 3 and designed a reusable component library (buttons, forms, tables, modals).",
      "Implemented BPMN workflows with Camunda 7 to automate data-driven marketing campaigns based on first-party customer data.",
      "Wrote unit and integration tests and contributed to CI/CD with GitHub Actions and Docker in Scrum and Kanban teams.",
    ],
    projects: [
      {
        name: "Bonial Console",
        highlights: [
          "Built responsive React interfaces for browsing catalogues and geolocated offers.",
          "Developed and maintained secure Spring Boot REST APIs for offer and brochure management, including PATCH endpoints for partial updates.",
        ],
      },
    ],
    stack: ["React", "TypeScript 5", "Material UI 5", "Tailwind CSS 3", "Java", "Spring Boot", "REST", "OpenAPI", "Camunda 7 (BPMN)", "Docker", "GitHub Actions"],
  },
  {
    id: "yanyi",
    title: "Freelance Full-Stack AI Developer",
    company: "Yanyi",
    companyNote: "Germany",
    engagement: "Remote freelance assignment",
    location: "Tunis, Tunisia",
    start: "2024-09",
    end: "2025-08",
    summary: "AI products for tender automation (TenderFlow AI) and product catalogues (Catalog-AI).",
    highlights: [
      "Represented the team at Web Summit Qatar 2025, presenting our AI products.",
    ],
    projects: [
      {
        name: "TenderFlow AI",
        url: "https://www.tender-flow.com/",
        highlights: [
          "Built React and TypeScript front-ends and Django REST APIs for document analysis and visualisation.",
          "Designed RAG pipelines with Python, LangChain, LangGraph and ChromaDB, and AI agents that automate tender analysis, data extraction, document classification and summaries.",
          "Added asynchronous processing with Celery and Redis and tuned PostgreSQL and MongoDB (indexes, aggregations), improving document-search relevance by ~40%.",
        ],
      },
      {
        name: "Catalog-AI",
        highlights: [
          "Built a Java 17 / Spring Boot back-end for product-catalogue management with secure REST APIs (Spring Security OAuth2, JPA/Hibernate, PostgreSQL) and Elasticsearch search.",
          "Kept the architecture modular and documented with OpenAPI/Swagger to ease maintenance.",
        ],
      },
    ],
    stack: ["Python", "Django REST Framework", "LangChain", "LangGraph", "ChromaDB", "OpenAI", "Celery", "Redis", "PostgreSQL", "MongoDB", "React", "TypeScript", "Java 17", "Spring Boot", "Elasticsearch", "Keycloak", "Docker"],
  },
  {
    id: "almergab",
    title: "Freelance Full-Stack Developer — React, Angular & Node.js",
    company: "AlMergab",
    companyNote: "Oman",
    engagement: "Remote freelance assignment",
    location: "Tunis, Tunisia",
    start: "2022-12",
    end: "2024-09",
    summary: "SaaS platforms for workflows, dashboards and fleet management.",
    highlights: [
      "Built full-stack SaaS platforms with React, Angular and Node.js/Express, with server-side validation (Joi) and a centralised Axios HTTP layer.",
      "Designed modular front-end and back-end architectures and automated Docker deployments with CI/CD pipelines (GitHub Actions, Jenkins).",
    ],
    projects: [
      {
        name: "Mind Platform",
        url: "https://www.mind-platform.com",
        highlights: [
          "Built full-stack features for an Angular and NestJS SaaS platform (Nx monorepo) covering workflows, dashboards and business data management.",
          "Implemented secure authentication — OTP, session management, email verification and password reset (JWT, Passport, Argon2/bcrypt).",
          "Integrated core modules: notifications (Server-Sent Events), reporting, workflows and permissions.",
        ],
      },
      {
        name: "Car Rental System",
        highlights: [
          "Built a fleet-management and booking application with React, Angular and Node.js/Express.",
          "Implemented 40+ secure REST APIs for users, vehicles and reservations; optimised MongoDB models with Mongoose (indexes, relations, aggregations).",
        ],
      },
    ],
    stack: ["Angular", "RxJS", "React", "TypeScript", "NestJS", "Node.js", "Express", "MongoDB", "Nx", "JWT", "Passport", "Joi", "ECharts", "PWA", "Jest", "Docker", "Jenkins"],
  },
];

/** Client projects delivered alongside the roles above (shown in the CV under "Selected projects"). */
export const sideProjects = [
  {
    name: "Cabinet TIJ — directory of sworn translators and interpreters (France)",
    url: "https://www.cabinettij.fr",
    period: "May 2025 – Present",
    highlights: [
      "Built the Laravel 10 REST API (Sanctum authentication, two-factor login, combinable credential filters) and the React/TypeScript front-end architecture (Redux Toolkit, RTK Query), with one other developer.",
      "Containerised and host the production stack (Docker Compose, Nginx, Let's Encrypt TLS, MySQL 8) and deploy on every push to main with GitHub Actions.",
    ],
    stack: ["React", "TypeScript", "Redux Toolkit", "Laravel 10", "MySQL 8", "Docker", "Nginx", "GitHub Actions"],
  },
];

export const education = [
  {
    degree: "Engineering Degree in Computer Science",
    school: "ESPRIT — Private Higher School of Engineering and Technology",
    location: "Tunis, Tunisia",
    period: "2019 – 2022",
  },
  {
    degree: "Bachelor's Degree in Computer Science (with highest honours)",
    school: "ESSTHS — Higher School of Sciences and Technology of Hammam Sousse",
    location: "Sousse, Tunisia",
    period: "2016 – 2019",
  },
];

export const languages = [
  { name: "Arabic", level: "Native" },
  { name: "French", level: "B2" },
  { name: "English", level: "B2" },
];

export const skills: SkillGroup[] = [
  { name: "Back-end", items: ["Java 17", "Spring Boot", "Spring Security (OAuth2)", "JPA/Hibernate", "Node.js", "NestJS", "Express", "Python", "Django REST Framework", "PHP / Laravel", "Camunda 7 (BPMN)"] },
  { name: "Front-end", items: ["Angular", "RxJS", "React", "TypeScript", "Next.js", "Redux Toolkit", "Material UI", "Tailwind CSS", "PWA"] },
  { name: "AI & RAG", items: ["OpenAI API", "LangChain", "LangGraph", "Mastra AI", "ChromaDB", "Vector search", "AI agents", "Celery", "Pandas"] },
  { name: "Data", items: ["PostgreSQL", "MongoDB (aggregations, Mongoose)", "MySQL", "Elasticsearch", "Redis"] },
  { name: "DevOps", items: ["Docker", "GitHub Actions", "Jenkins", "Nginx", "Linux", "CI/CD"] },
  { name: "Practices & tools", items: ["REST / OpenAPI", "Unit & integration testing", "Scrum / Kanban", "Git", "Jira", "Bitbucket"] },
];

/* ───────────────────────── helpers ───────────────────────── */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatYearMonth(value: YearMonth | "present"): string {
  if (value === "present") return "Present";
  const [year, month] = value.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

export function formatPeriod(role: Pick<Role, "start" | "end">): string {
  return `${formatYearMonth(role.start)} – ${formatYearMonth(role.end)}`;
}

/** Whole years since the first professional role, rounded to the nearest year. */
export function yearsOfExperience(now: Date = new Date()): number {
  const [y, m] = CAREER_START.split("-").map(Number);
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
  return Math.max(1, Math.round(months / 12));
}
