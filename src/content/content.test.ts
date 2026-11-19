import { describe, expect, it } from "vitest";
import { education, experience, metrics, profile, sideProjects, skills, yearsOfExperience, CAREER_START } from "./profile";
import { caseStudies, getProject, projects } from "./projects";
import { absoluteUrl, allPages, metaFor } from "./seo";

const everyString = (value: unknown): string[] =>
  typeof value === "string" ? [value] : Array.isArray(value) ? value.flatMap(everyString) : value && typeof value === "object" ? Object.values(value).flatMap(everyString) : [];

const allContent = everyString({ profile, experience, metrics, skills, education, sideProjects, projects });

describe("career content", () => {
  it("never ships placeholder contact details", () => {
    expect(profile.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
    for (const s of allContent) {
      expect(s).not.toMatch(/example\.(com|org)|lorem ipsum|TODO|REPLACE_ME/i);
    }
  });

  it("lists roles newest first, with exactly one current role", () => {
    const starts = experience.map((r) => r.start);
    expect([...starts].sort().reverse()).toEqual(starts);
    expect(experience.filter((r) => r.end === "present")).toHaveLength(1);
    expect(experience.at(-1)?.start).toBe(CAREER_START);
  });

  it("derives years of experience from the first role", () => {
    expect(yearsOfExperience(new Date("2026-11-19"))).toBe(4);
    expect(yearsOfExperience(new Date("2023-01-01"))).toBe(1);
    expect(profile.summary).toContain(`${yearsOfExperience()} years`);
  });

  it("ties every headline metric to a real employer", () => {
    const companies = experience.map((r) => r.company);
    for (const m of metrics) {
      expect(companies.some((c) => m.source.startsWith(c))).toBe(true);
    }
  });
});

describe("projects and case studies", () => {
  it("uses unique, URL-safe slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it("gives each case study the sections a reviewer expects", () => {
    expect(caseStudies.map((p) => p.slug)).toEqual(["mind-platform", "cabinet-tij", "bonial"]);
    for (const p of caseStudies) {
      const ids = p.caseStudy!.sections.map((s) => s.id);
      for (const required of ["context", "problem", "role", "decisions", "code", "next"]) expect(ids).toContain(required);
      expect(p.caseStudy!.outcomes.length).toBeGreaterThanOrEqual(3);
      expect(getProject(p.slug)).toBe(p);
    }
  });

  it("only links to https URLs", () => {
    for (const p of projects) if (p.url) expect(p.url).toMatch(/^https:\/\//);
  });
});

describe("SEO metadata", () => {
  it("has a unique title and a useful description for every page", () => {
    const titles = allPages.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const p of allPages) {
      expect(p.title.length).toBeLessThanOrEqual(90);
      expect(p.description.length).toBeGreaterThan(50);
      expect(p.description.length).toBeLessThanOrEqual(220);
    }
  });

  it("covers every case study and uses trailing-slash canonicals", () => {
    for (const p of caseStudies) expect(metaFor(`/projects/${p.slug}`).description).toBe(p.tagline);
    expect(absoluteUrl("/projects")).toMatch(/\/projects\/$/);
  });
});
