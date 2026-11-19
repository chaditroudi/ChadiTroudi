import { FileText, Linkedin, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { track } from "@/lib/analytics";
import { CV_URL } from "@/lib/links";
import CopyEmail from "./CopyEmail";
import { ButtonAnchor, Container, Eyebrow, Reveal } from "./primitives";

const ContactCTA = ({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) => {
  const H = headingLevel;
  return (
    <section aria-labelledby="contact-cta-title" className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-10 sm:px-12 sm:py-14">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="relative max-w-2xl space-y-5">
              <Eyebrow>{profile.availability}</Eyebrow>
              <H id="contact-cta-title" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Hiring a full-stack developer? Let's talk.
              </H>
              <p className="text-base leading-relaxed text-muted-foreground">
                I'm looking for a full-time or freelance role on a product team: Java/Spring Boot or NestJS back-ends, Angular or React front-ends,
                and AI features that need to be reliable. I usually reply within a day.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <ButtonAnchor href={`mailto:${profile.email}?subject=Opportunity%20for%20Chadi%20Troudi`} onClick={() => track("email_click", { from: "cta" })}>
                  <Mail size={16} aria-hidden /> {profile.email}
                </ButtonAnchor>
                <CopyEmail />
                <ButtonAnchor
                  variant="secondary"
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("linkedin_click", { from: "cta" })}
                >
                  <Linkedin size={16} aria-hidden /> LinkedIn
                </ButtonAnchor>
                <ButtonAnchor variant="ghost" href={CV_URL} target="_blank" rel="noopener" onClick={() => track("cv_download", { from: "cta" })}>
                  <FileText size={16} aria-hidden /> CV (PDF)
                </ButtonAnchor>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};

export default ContactCTA;
