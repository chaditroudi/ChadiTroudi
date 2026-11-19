import { FileText, Github, Linkedin, Mail } from "lucide-react";
import SiteLayout from "@/components/site/SiteLayout";
import CopyEmail from "@/components/site/CopyEmail";
import { ButtonAnchor, Container, Eyebrow } from "@/components/site/primitives";
import { languages, profile } from "@/content/profile";
import { metaFor } from "@/content/seo";
import { usePageMeta } from "@/hooks/use-page-meta";
import { track } from "@/lib/analytics";
import { CV_URL } from "@/lib/links";

const facts = [
  ["Availability", profile.availability],
  ["Looking for", "Full-stack developer roles · full-time or long-term freelance"],
  ["Location", `${profile.location} · remote`],
  ["Time zone", "CET (UTC+1), working hours overlap fully with European teams"],
  ["Languages", languages.map((l) => `${l.name} (${l.level})`).join(" · ")],
];

const Contact = () => {
  usePageMeta(metaFor("/contact"));

  return (
    <SiteLayout>
      <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Let's talk about your team.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            The fastest way to reach me is email. Send the role, the stack and a rough timeline, and I'll reply within a day with my availability for a call.
          </p>

          <a
            href={`mailto:${profile.email}?subject=Opportunity%20for%20Chadi%20Troudi`}
            onClick={() => track("email_click", { from: "contact" })}
            className="mt-8 inline-block break-all font-display text-2xl font-semibold text-primary underline decoration-primary/30 underline-offset-8 transition-colors hover:decoration-primary sm:text-3xl"
          >
            {profile.email}
          </a>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonAnchor href={`mailto:${profile.email}?subject=Opportunity%20for%20Chadi%20Troudi`} onClick={() => track("email_click", { from: "contact" })}>
              <Mail size={16} aria-hidden /> Write an email
            </ButtonAnchor>
            <CopyEmail />
            <ButtonAnchor variant="secondary" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" onClick={() => track("linkedin_click", { from: "contact" })}>
              <Linkedin size={16} aria-hidden /> LinkedIn
            </ButtonAnchor>
            <ButtonAnchor variant="secondary" href={profile.links.github} target="_blank" rel="noopener noreferrer">
              <Github size={16} aria-hidden /> GitHub
            </ButtonAnchor>
            <ButtonAnchor variant="ghost" href={CV_URL} target="_blank" rel="noopener" onClick={() => track("cv_download", { from: "contact" })}>
              <FileText size={16} aria-hidden /> CV (PDF)
            </ButtonAnchor>
          </div>
        </div>

        <aside aria-label="Quick facts" className="h-fit rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold">Quick facts for recruiters</h2>
          <dl className="mt-5 space-y-4">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-sm leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </Container>
    </SiteLayout>
  );
};

export default Contact;
