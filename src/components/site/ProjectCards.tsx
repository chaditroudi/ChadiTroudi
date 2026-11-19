import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { TagList } from "./primitives";
import { MindPipelineMini } from "./Diagrams";

/** Large card for projects that have a full case study. The whole card is one link. */
export const CaseStudyCard = ({ project, headingLevel = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) => {
  const H = headingLevel;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-foreground/[0.03]">
        {project.cover ? (
          <img
            src={project.cover.src}
            alt=""
            loading="lazy"
            decoding="async"
            width={1440}
            height={1000}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <MindPipelineMini />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-1">
          <p className="font-mono text-xs text-muted-foreground">
            {project.client.split(" (")[0]} · {project.period}
          </p>
          <H className="font-display text-xl font-semibold tracking-tight">
            <Link
              to={`/projects/${project.slug}`}
              onClick={() => track("case_study_open", { slug: project.slug })}
              className="after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:rounded-2xl after:focus-visible:ring-2 after:focus-visible:ring-ring"
            >
              {project.title}
            </Link>
          </H>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
        <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-foreground">{project.highlight}</p>
        <TagList items={project.stack.slice(0, 6)} label={`${project.title} tech stack`} className="mt-auto" />
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary" aria-hidden>
          Read the case study <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
};

/** Compact card for projects without a case study. Links out only when there is a public URL. */
export const ProjectCard = ({ project }: { project: Project }) => (
  <article className={cn("group relative flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-all duration-300", project.url && "hover:-translate-y-0.5 hover:border-primary/40")}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-mono text-xs text-muted-foreground">
          {project.client} · {project.period}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("external_project_click", { slug: project.slug })}
              className="after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:rounded-2xl after:focus-visible:ring-2 after:focus-visible:ring-ring"
            >
              {project.title}
              <span className="sr-only"> (opens the live product in a new tab)</span>
            </a>
          ) : (
            project.title
          )}
        </h3>
      </div>
      {project.url && <ArrowUpRight size={18} aria-hidden className="shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />}
    </div>
    <p className="text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
    <p className="text-sm font-medium">{project.highlight}</p>
    <TagList items={project.stack.slice(0, 6)} label={`${project.title} tech stack`} className="mt-auto pt-1" />
  </article>
);
