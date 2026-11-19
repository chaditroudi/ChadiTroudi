import SiteLayout from "@/components/site/SiteLayout";
import ContactCTA from "@/components/site/ContactCTA";
import { CaseStudyCard, ProjectCard } from "@/components/site/ProjectCards";
import { Container, Eyebrow, Reveal, Section } from "@/components/site/primitives";
import { caseStudies, projects } from "@/content/projects";
import { metaFor } from "@/content/seo";
import { usePageMeta } from "@/hooks/use-page-meta";

const Projects = () => {
  usePageMeta(metaFor("/projects"));
  const others = projects.filter((p) => !p.caseStudy);

  return (
    <SiteLayout>
      <Container className="pb-4 pt-14 sm:pt-20">
        <Eyebrow>Work</Eyebrow>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">Products I've built and shipped</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Case studies go deep on the problem, my role, the decisions and the trade-offs. The other projects are summaries of client work I can talk about in
          detail in an interview.
        </p>
      </Container>

      <Section id="case-studies" eyebrow="In depth" title="Case studies">
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <CaseStudyCard project={p} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="more" eyebrow="Client work" title="More projects" className="pt-0 sm:pt-0">
        <div className="grid gap-4 sm:grid-cols-2">
          {others.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </Section>

      <ContactCTA />
    </SiteLayout>
  );
};

export default Projects;
