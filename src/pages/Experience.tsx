import { FileText } from "lucide-react";
import SiteLayout from "@/components/site/SiteLayout";
import ContactCTA from "@/components/site/ContactCTA";
import { ExperienceTimeline, SkillGroups } from "@/components/site/Experience";
import { ButtonAnchor, Container, Eyebrow, Section } from "@/components/site/primitives";
import { education, languages, profile } from "@/content/profile";
import { metaFor } from "@/content/seo";
import { usePageMeta } from "@/hooks/use-page-meta";
import { track } from "@/lib/analytics";
import { CV_URL } from "@/lib/links";

/** The HTML version of the CV: same facts as the PDF, readable by people, crawlers and ATS parsers. */
const Experience = () => {
  usePageMeta(metaFor("/experience"));

  return (
    <SiteLayout>
      <Container className="pb-2 pt-14 sm:pt-20">
        <Eyebrow>Experience</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Experience & skills</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{profile.summary}</p>
        <ButtonAnchor href={CV_URL} target="_blank" rel="noopener" className="mt-7" onClick={() => track("cv_download", { from: "experience" })}>
          <FileText size={16} aria-hidden /> Download the PDF CV
        </ButtonAnchor>
      </Container>

      <Section id="roles" eyebrow="Roles" title="Professional experience">
        <ExperienceTimeline />
      </Section>

      <Section id="skills" eyebrow="Toolbox" title="Technical skills" className="pt-0 sm:pt-0">
        <SkillGroups />
      </Section>

      <Section id="education" eyebrow="Background" title="Education & languages" className="pt-0 sm:pt-0">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <ul className="space-y-4">
            {education.map((e) => (
              <li key={e.degree} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-semibold">{e.degree}</p>
                <p className="mt-1 text-sm text-muted-foreground">{e.school}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {e.period} · {e.location}
                </p>
              </li>
            ))}
          </ul>
          <dl className="space-y-3 rounded-2xl border border-border bg-card p-5">
            {languages.map((l) => (
              <div key={l.name} className="flex items-baseline justify-between gap-4">
                <dt className="font-medium">{l.name}</dt>
                <dd className="font-mono text-sm text-muted-foreground">{l.level}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <ContactCTA />
    </SiteLayout>
  );
};

export default Experience;
