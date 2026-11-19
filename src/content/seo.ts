import { experience, profile, SITE_URL, yearsOfExperience } from "./profile";
import { caseStudies } from "./projects";

export interface PageMeta {
  path: string;
  title: string;
  description: string;
}

const brand = `${profile.name} — ${profile.headline}`;

export const staticPages: PageMeta[] = [
  {
    path: "/",
    title: `${brand} (${profile.focus})`,
    description: `${profile.headline} in ${profile.location}. ${profile.pitch}`,
  },
  {
    path: "/projects",
    title: `Work & case studies — ${profile.name}`,
    description: "Case studies and projects: an AI analytics agent on MongoDB, a live directory of sworn translators, RAG pipelines and retail-tech platforms.",
  },
  {
    path: "/experience",
    title: `Experience & skills — ${profile.name}`,
    description: `${yearsOfExperience()} years of remote full-stack work for ${experience.map((r) => r.company).join(", ")}: Java/Spring Boot, Angular, React, NestJS and generative AI.`,
  },
  {
    path: "/about",
    title: `About — ${profile.name}`,
    description: `How I work, what I care about, and what I'm looking for next. ${profile.availability}.`,
  },
  {
    path: "/contact",
    title: `Contact — ${profile.name}`,
    description: `Hiring a ${profile.headline.toLowerCase()}? Email ${profile.email} or download my CV.`,
  },
];

export const caseStudyPages: PageMeta[] = caseStudies.map((p) => ({
  path: `/projects/${p.slug}`,
  title: `${p.title} | Case study — ${profile.name}`,
  description: p.tagline,
}));

export const allPages = [...staticPages, ...caseStudyPages];

export const metaFor = (path: string): PageMeta =>
  allPages.find((p) => p.path === path) ?? staticPages[0];

/** GitHub Pages serves /route/index.html at /route/ — use the trailing slash to avoid a redirect. */
export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : `${path}/`}`;
