import websummit from "@/assets/websummit-stage.webp";
import bonialOffice from "@/assets/bonial-office.webp";
import bonialStandup from "@/assets/bonial-standup.webp";
import SiteLayout from "@/components/site/SiteLayout";
import ContactCTA from "@/components/site/ContactCTA";
import { Container, Eyebrow, Reveal, Section } from "@/components/site/primitives";
import { profile, yearsOfExperience } from "@/content/profile";
import { metaFor } from "@/content/seo";
import { usePageMeta } from "@/hooks/use-page-meta";

const principles = [
  {
    title: "Types and contracts first",
    body: "I moved 15+ Bonial modules from JavaScript to TypeScript, generate AI output against Zod schemas, and document APIs with OpenAPI. Clear contracts are what let a team change code quickly without breaking it.",
  },
  {
    title: "AI features that behave predictably",
    body: "LLM output is validated before it touches a database, retries are bounded, and token cost is tracked per user. An AI feature has to be as dependable as the rest of the product.",
  },
  {
    title: "Own it in production",
    body: "Docker, CI/CD and deployments are part of the job. For Cabinet TIJ I run the VPS, the Nginx/TLS setup and the GitHub Actions pipeline that ships every push to main.",
  },
  {
    title: "Remote-native",
    body: `${yearsOfExperience()} years working remotely with teams in Germany and Oman, in Scrum and Kanban: clear written updates, small reviewable pull requests and predictable delivery.`,
  },
];

const photos = [
  { src: websummit, alt: "Chadi presenting on stage at Web Summit Qatar 2025", caption: "Presenting our AI products at Web Summit Qatar 2025", w: 720, h: 960, span: "row-span-2" },
  { src: bonialOffice, alt: "Sprint planning meeting at the Bonial office", caption: "Sprint planning at the Bonial office", w: 960, h: 489, span: "" },
  { src: bonialStandup, alt: "Daily stand-up with the Bonial engineering team", caption: "Daily stand-up with the Bonial team", w: 960, h: 590, span: "" },
];

const About = () => {
  usePageMeta(metaFor("/about"));

  return (
    <SiteLayout>
      <Container className="grid gap-12 pb-4 pt-14 sm:pt-20 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div>
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Full-stack developer, remote since 2022.</h1>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              I'm a full-stack developer based in {profile.location}. Since 2022 I've worked remotely for product teams in Germany and Oman: Bonial (retail tech),
              Yanyi (AI for tenders and catalogues), AlMergab (SaaS and fleet management) and, today, Mind Hands, where I build AI analytics for Mind Platform.
            </p>
            <p>
              I hold an engineering degree in computer science from ESPRIT. I'm most useful where correctness matters: typed APIs, migrations, data pipelines,
              and making LLM features predictable enough to ship.
            </p>
            <p className="text-foreground">
              I'm looking for a full-time or long-term freelance role on a product team. {profile.availability}.
            </p>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-3" aria-label="Photos">
          {photos.map((p) => (
            <li key={p.src} className={p.span}>
              <figure className="group relative h-full overflow-hidden rounded-2xl border border-border">
                <img src={p.src} alt={p.alt} width={p.w} height={p.h} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-8 text-xs font-medium text-white">{p.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>

      <Section id="principles" eyebrow="How I work" title="What you can expect from me">
        <ol className="grid gap-4 md:grid-cols-2">
          {principles.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 0.06} className="h-full rounded-2xl border border-border bg-card p-6">
                <span aria-hidden className="font-mono text-sm text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-2 font-display text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <ContactCTA />
    </SiteLayout>
  );
};

export default About;
