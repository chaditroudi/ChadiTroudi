import { ArrowRight, FileText, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import portrait from "@/assets/portrait.webp";
import SiteLayout from "@/components/site/SiteLayout";
import ContactCTA from "@/components/site/ContactCTA";
import { CaseStudyCard, ProjectCard } from "@/components/site/ProjectCards";
import { ExperienceTimeline, SkillGroups } from "@/components/site/Experience";
import { ButtonAnchor, ButtonLink, Container, Reveal, Section } from "@/components/site/primitives";
import { experience, metrics, profile, yearsOfExperience } from "@/content/profile";
import { caseStudies, projects } from "@/content/projects";
import { metaFor } from "@/content/seo";
import { usePageMeta } from "@/hooks/use-page-meta";
import { track } from "@/lib/analytics";
import { CV_URL } from "@/lib/links";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const Hero = () => (
  <section aria-labelledby="hero-title" className="relative overflow-hidden">
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_0%,hsl(var(--primary)/0.12),transparent)]" />
    <Container className="relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="max-w-2xl">
        <motion.p {...rise(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          {profile.availability} · {profile.workPreference}
        </motion.p>

        <motion.h1 {...rise(0.05)} id="hero-title" className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          {profile.name}
          <span className="mt-3 block text-2xl font-medium text-muted-foreground sm:text-3xl">
            {profile.headline} — <span className="text-foreground">{profile.focus}</span>
          </span>
        </motion.h1>

        <motion.p {...rise(0.12)} className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {profile.pitch}
        </motion.p>

        <motion.div {...rise(0.18)} className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink to="/projects">
            See case studies <ArrowRight size={16} aria-hidden />
          </ButtonLink>
          <ButtonAnchor variant="secondary" href={CV_URL} target="_blank" rel="noopener" onClick={() => track("cv_download", { from: "hero" })}>
            <FileText size={16} aria-hidden /> Download CV
          </ButtonAnchor>
          <ButtonLink variant="ghost" to="/contact">
            Contact
          </ButtonLink>
        </motion.div>

        <motion.dl {...rise(0.24)} className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
          {[
            { value: `${yearsOfExperience()}`, label: "years remote" },
            { value: `${experience.length}`, label: "companies" },
            { value: `${projects.length}`, label: "shipped products" },
          ].map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-display text-2xl font-semibold">{s.value}</span>
                <span aria-hidden className="text-xs text-muted-foreground">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <motion.figure {...rise(0.1)} className="relative mx-auto w-full max-w-xs lg:max-w-sm">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          <img src={portrait} alt={`Portrait of ${profile.name}`} width={720} height={720} fetchPriority="high" className="aspect-square w-full object-cover" />
        </div>
        <figcaption className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Currently</p>
          <p className="text-sm font-semibold">
            Freelance at {profile.current.company} — {profile.current.what}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} aria-hidden /> {profile.location}
          </p>
        </figcaption>
      </motion.figure>
    </Container>
  </section>
);

const Proof = () => (
  <section aria-label="Results from recent roles" className="border-y border-border bg-card/50">
    <Container>
      <dl className="grid grid-cols-2 divide-border lg:grid-cols-4 lg:divide-x">
        {metrics.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.06} className="px-1 py-7 lg:px-6 lg:first:pl-0">
            <dt className="sr-only">{m.label}</dt>
            <dd>
              <span className="font-display text-3xl font-semibold text-primary">{m.value}</span>
              <span className="mt-1 block text-sm leading-snug text-foreground/90">{m.label}</span>
              <span className="mt-1 block font-mono text-[11px] text-muted-foreground">{m.source}</span>
            </dd>
          </Reveal>
        ))}
      </dl>
    </Container>
  </section>
);

const Index = () => {
  usePageMeta(metaFor("/"));
  const others = projects.filter((p) => !p.caseStudy);

  return (
    <SiteLayout>
      <Hero />
      <Proof />

      <Section
        id="work"
        eyebrow="Selected work"
        title="Case studies"
        intro="Two products I built and shipped: the problem, the decisions and trade-offs, and what came out of it."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <CaseStudyCard project={p} />
            </Reveal>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {others.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="experience"
        eyebrow="Experience"
        title={`${yearsOfExperience()} years shipping for product teams`}
        action={
          <ButtonLink variant="secondary" to="/experience">
            Full experience <ArrowRight size={15} aria-hidden />
          </ButtonLink>
        }
      >
        <ExperienceTimeline compact />
      </Section>

      <Section id="skills" eyebrow="Toolbox" title="Skills">
        <SkillGroups />
      </Section>

      <ContactCTA />
    </SiteLayout>
  );
};

export default Index;
