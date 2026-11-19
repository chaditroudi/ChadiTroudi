import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Diagrams are plain HTML lists, not images: they reflow on phones, follow the
 * light/dark theme and screen readers read them as ordered steps.
 */

const Node = ({ title, detail, tone = "default" }: { title: string; detail?: string; tone?: "default" | "ai" | "data" }) => (
  <div
    className={cn(
      "rounded-xl border px-4 py-3 text-left",
      tone === "ai" && "border-primary/40 bg-primary/10",
      tone === "data" && "border-border bg-foreground/[0.04]",
      tone === "default" && "border-border bg-card",
    )}
  >
    <p className="text-sm font-semibold">{title}</p>
    {detail && <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{detail}</p>}
  </div>
);

const Flow = ({ label, steps }: { label: string; steps: { title: string; detail?: string; tone?: "default" | "ai" | "data" }[] }) => (
  <ol aria-label={label} className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
    {steps.map((s, i) => (
      <Fragment key={s.title}>
        <li className="lg:flex-1">
          <Node {...s} />
        </li>
        {i < steps.length - 1 && (
          <li aria-hidden className="flex justify-center text-muted-foreground">
            <ArrowDown size={16} className="lg:hidden" />
            <ArrowRight size={16} className="hidden lg:block" />
          </li>
        )}
      </Fragment>
    ))}
  </ol>
);

const Figure = ({ caption, children }: { caption: string; children: ReactNode }) => (
  <figure className="rounded-2xl border border-border bg-card p-5 sm:p-6">
    {children}
    <figcaption className="mt-4 text-xs text-muted-foreground">{caption}</figcaption>
  </figure>
);

export const MindPipelineDiagram = () => (
  <Figure caption="Request lifecycle of POST /api/analytics. Green steps call an LLM; everything else is deterministic code.">
    <Flow
      label="Mind Platform analytics pipeline"
      steps={[
        { title: "Question", detail: "Angular client · \"top 5 projects by budget\"" },
        { title: "Cache check", detail: "Identical question in 7 days → answer with 0 LLM calls", tone: "data" },
        { title: "Planner LLM", detail: "Zod-typed plan: source, intent, aggregation pipeline", tone: "ai" },
        { title: "Validate", detail: "Registered fields only · forbidden stages rejected" },
        { title: "MongoDB", detail: "aggregate() on the registered collection", tone: "data" },
        { title: "Writer / chart LLM", detail: "ECharts dashboard, report or short answer", tone: "ai" },
      ]}
    />
    <p className="mt-4 flex items-start gap-2 rounded-lg bg-foreground/[0.04] px-3 py-2 text-xs text-muted-foreground">
      <RotateCcw size={14} className="mt-0.5 shrink-0 text-primary" aria-hidden />
      If validation or MongoDB fails, the exact violation goes back to the planner as a hint, once. A second failure returns a classified error.
    </p>
  </Figure>
);

export const TijArchitectureDiagram = () => (
  <Figure caption="Production topology on a single VPS. Every service runs in Docker Compose; GitHub Actions deploys over SSH on each push to main.">
    <div className="space-y-4">
      <Flow
        label="Request path"
        steps={[
          { title: "Browser", detail: "www.cabinettij.fr" },
          { title: "Nginx", detail: "TLS (Let's Encrypt) · serves the React build · proxies /api", tone: "data" },
          { title: "Laravel 10 API", detail: "Sanctum auth · 2FA · filtering & stats" },
          { title: "MySQL 8", detail: "Translators ↔ languages (many-to-many)", tone: "data" },
        ]}
      />
      <Flow
        label="Deployment path"
        steps={[
          { title: "git push main", detail: "Developer" },
          { title: "GitHub Actions", detail: "SSH into the VPS", tone: "ai" },
          { title: "git reset --hard origin/main", detail: "Diff decides what to restart" },
          { title: "docker compose restart", detail: "Front-end + Nginx; Laravel only if ctij-api/ changed", tone: "data" },
        ]}
      />
    </div>
  </Figure>
);

/** Decorative preview used as the Mind Platform card cover. */
export const MindPipelineMini = () => (
  <div aria-hidden className="flex h-full w-full flex-col justify-center gap-2 overflow-hidden bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.18),transparent_60%)] p-6">
    <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
      Top 5 projects by budget, as a chart
    </div>
    <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-border bg-card px-3 py-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
      {'[{ $group: { _id: "$name", budget: { $sum: "$budget" } } },'}
      <br />
      {' { $sort: { budget: -1 } }, { $limit: 5 }]'}
    </div>
    <div className="flex h-14 max-w-[80%] shrink-0 items-end gap-1.5 rounded-xl border border-border bg-card p-2">
      {[92, 74, 61, 45, 30].map((h) => (
        <div key={h} className="flex-1 rounded-sm bg-primary/70" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);
