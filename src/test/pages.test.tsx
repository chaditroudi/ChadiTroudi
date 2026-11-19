import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Index from "@/pages/Index";
import CaseStudy from "@/pages/CaseStudy";
import Contact from "@/pages/Contact";
import Experience from "@/pages/Experience";
import { experience, profile } from "@/content/profile";

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/projects/:slug" element={<CaseStudy />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </MemoryRouter>,
  );

describe("pages", () => {
  it("home: one h1, CV and case-study calls to action, real email", () => {
    renderAt("/");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: /see case studies/i })).toHaveAttribute("href", "/projects");
    expect(screen.getAllByRole("link", { name: /cv/i }).some((a) => a.getAttribute("href")?.endsWith("ChadiTroudiCv.pdf"))).toBe(true);
    expect(screen.getAllByRole("link", { name: new RegExp(profile.email) }).length).toBeGreaterThan(0);
    expect(document.title).toMatch(/Chadi Troudi/);
  });

  it("home: no student, bootcamp or pricing content", () => {
    renderAt("/");
    expect(screen.queryByText(/bootcamp|tutor|pricing|subscription/i)).toBeNull();
  });

  it("case study: renders all sections with an in-page table of contents", () => {
    renderAt("/projects/cabinet-tij");
    expect(screen.getByRole("heading", { level: 1, name: /cabinet tij/i })).toBeInTheDocument();
    const toc = screen.getByRole("navigation", { name: /on this page/i });
    expect(within(toc).getByRole("link", { name: /key decisions/i })).toHaveAttribute("href", "#decisions");
    expect(screen.getByLabelText(/Code: .*InterpreteController.php/)).toHaveTextContent("FIND_IN_SET");
    expect(document.title).toMatch(/Case study/);
  });

  it("case study: unknown slug shows the 404 page", () => {
    renderAt("/projects/does-not-exist");
    expect(screen.getByRole("heading", { level: 1, name: /doesn't exist/i })).toBeInTheDocument();
  });

  it("experience: every role from the CV content is listed", () => {
    renderAt("/experience");
    for (const role of experience) expect(screen.getByRole("heading", { level: 3, name: new RegExp(role.company) })).toBeInTheDocument();
  });

  it("contact: email link and quick facts", () => {
    renderAt("/contact");
    expect(screen.getByRole("link", { name: profile.email })).toHaveAttribute("href", expect.stringContaining(`mailto:${profile.email}`));
    expect(screen.getByRole("complementary", { name: /quick facts/i })).toHaveTextContent(profile.availability);
  });
});
