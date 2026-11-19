import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import SiteLayout from "@/components/site/SiteLayout";
import ContactCTA from "@/components/site/ContactCTA";
import { MindPipelineDiagram, TijArchitectureDiagram } from "@/components/site/Diagrams";
import { Container, Eyebrow, Reveal, TagList } from "@/components/site/primitives";
import { caseStudies, getProject, type CaseSection, type CodeExcerpt, type Shot } from "@/content/projects";
import { metaFor } from "@/content/seo";
import { usePageMeta } from "@/hooks/use-page-meta";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import NotFound from "./NotFound";

const diagrams = {
  "mind-pipeline": MindPipelineDiagram,
  "tij-architecture": TijArchitectureDiagram,
} as const;

const CodeBlock = ({ code }: { code: CodeExcerpt }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: nothing to do */
    }
  };
  return (
    <figure className="space-y-3">
      <p className="text-base leading-relaxed text-muted-foreground">{code.intro}</p>
      <div className="overflow-hidden rounded-2xl border border-border bg-[hsl(222_22%_7%)] text-[hsl(210_20%_92%)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
          <figcaption className="truncate font-mono text-xs text-white/60">{code.filename}</figcaption>
          <button
            type="button"
            onClick={copy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
        <pre tabIndex={0} aria-label={`Code: ${code.filename}`} className="overflow-x-auto p-4 text-[13px] leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
          <code className="font-mono">{code.code}</code>
        </pre>
      </div>
    </figure>
  );
};

const Screenshot = ({ shot }: { shot: Shot }) => (
  <figure className={cn("space-y-2", shot.frame === "phone" ? "mx-auto w-full max-w-[260px]" : "w-full")}>
    <div className={cn("overflow-hidden border border-border bg-card shadow-md", shot.frame === "phone" ? "rounded-[2rem] border-[6px] border-foreground/80" : "rounded-xl")}>
      {shot.frame !== "phone" && (
        <div aria-hidden className="flex gap-1.5 border-b border-border bg-foreground/[0.04] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        </div>
      )}
      <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" className="w-full" />
    </div>
    <figcaption className="text-center text-xs text-muted-foreground">{shot.caption}</figcaption>
  </figure>
);

const SectionBody = ({ section }: { section: CaseSection }) => {
  const Diagram = section.diagram ? diagrams[section.diagram] : null;
  const desktop = section.shots?.filter((s) => s.frame !== "phone") ?? [];
  const phone = section.shots?.filter((s) => s.frame === "phone") ?? [];

  return (
    <div className="space-y-6">
      {section.paragraphs?.map((p) => (
        <p key={p} className="text-base leading-relaxed text-foreground/90 sm:text-[17px]">
          {p}
        </p>
      ))}

      {section.bullets && (
        <ul className="space-y-2.5">
          {section.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-base leading-relaxed text-foreground/90">
              <Check size={18} aria-hidden className="mt-1 shrink-0 text-primary" />
              {b}
            </li>
          ))}
        </ul>
      )}

      {section.shots && (
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_auto]">
          <div className="space-y-6">
            {desktop.map((s) => (
              <Screenshot key={s.src} shot={s} />
            ))}
          </div>
          {phone.map((s) => (
            <Screenshot key={s.src} shot={s} />
          ))}
        </div>
      )}

      {Diagram && <Diagram />}

      {section.decisions && (
        <ol className="space-y-4">
          {section.decisions.map((d, i) => (
            <li key={d.title} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h3 className="flex gap-3 font-display text-lg font-semibold tracking-tight">
                <span aria-hidden className="font-mono text-sm leading-7 text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {d.title}
              </h3>
              <dl className="mt-3 grid gap-3 text-sm leading-relaxed sm:grid-cols-[7rem_1fr]">
                <dt className="font-medium text-muted-foreground">Why</dt>
                <dd>{d.why}</dd>
                <dt className="font-medium text-muted-foreground">Trade-off</dt>
                <dd className="text-muted-foreground">{d.tradeoff}</dd>
              </dl>
            </li>
          ))}
        </ol>
      )}

      {section.code && <CodeBlock code={section.code} />}

      {section.beforeAfter && (
        <div className="grid gap-4 md:grid-cols-2">
          {(
            [
              ["Before", section.beforeAfter.before, false],
              ["After", section.beforeAfter.after, true],
            ] as const
          ).map(([label, items, isAfter]) => (
            <div key={label} className={cn("rounded-2xl border p-5", isAfter ? "border-primary/40 bg-primary/5" : "border-border bg-card")}>
              <h3 className={cn("font-mono text-xs font-semibold uppercase tracking-[0.16em]", isAfter ? "text-primary" : "text-muted-foreground")}>{label}</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                {items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", isAfter ? "bg-primary" : "bg-muted-foreground/50")} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CaseStudy = () => {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  const meta = metaFor(`/projects/${slug}`);
  usePageMeta(meta);

  if (!project?.caseStudy) return <NotFound />;
  const cs = project.caseStudy;
  const index = caseStudies.findIndex((p) => p.slug === slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <SiteLayout>
      <article>
        <header className="relative overflow-hidden border-b border-border">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_100%_0%,hsl(var(--primary)/0.12),transparent)]" />
          <Container className="relative py-12 sm:py-16">
            <Link to="/projects" className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ArrowLeft size={15} aria-hidden /> All work
            </Link>
            <Eyebrow className="mt-8">Case study</Eyebrow>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{project.tagline}</p>

            <dl className="mt-10 grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Client", project.client],
                ["Timeline", project.period],
                ["Role", project.role],
                ["Team", cs.team],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{k}</dt>
                  <dd className="mt-1.5 leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <TagList items={project.stack} label={`${project.title} tech stack`} />
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("external_project_click", { slug: project.slug })}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Visit {new URL(project.url).hostname.replace(/^www\./, "")} <ArrowUpRight size={15} aria-hidden />
                </a>
              )}
            </div>
          </Container>
        </header>

        <section aria-label="Outcomes" className="border-b border-border bg-card/50">
          <Container>
            <dl className="grid grid-cols-2 lg:grid-cols-4">
              {cs.outcomes.map((o) => (
                <div key={o.label} className="py-7 pr-4">
                  <dt className="sr-only">{o.label}</dt>
                  <dd>
                    <span className="font-display text-3xl font-semibold text-primary">{o.value}</span>
                    <span className="mt-1 block text-sm leading-snug text-muted-foreground">{o.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        <Container className="grid gap-12 py-14 lg:grid-cols-[11rem_1fr]">
          <nav aria-label="On this page" className="hidden lg:block">
            <ol className="sticky top-24 space-y-2 border-l border-border text-sm">
              {cs.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l border-transparent pl-4 text-muted-foreground hover:border-primary hover:text-foreground">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0 space-y-16">
            {cs.sections.map((s) => (
              <Reveal key={s.id}>
                <section id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-24 space-y-5">
                  <h2 id={`${s.id}-h`} className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {s.heading}
                  </h2>
                  <SectionBody section={s} />
                </section>
              </Reveal>
            ))}
          </div>
        </Container>

        {next && next.slug !== slug && (
          <Container>
            <Link
              to={`/projects/${next.slug}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span>
                <span className="block font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">Next case study</span>
                <span className="mt-1 block font-display text-xl font-semibold">{next.title}</span>
              </span>
              <ArrowRight aria-hidden className="shrink-0 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          </Container>
        )}
      </article>
      <ContactCTA />
    </SiteLayout>
  );
};

export default CaseStudy;
