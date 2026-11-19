import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { track } from "@/lib/analytics";
import { CV_URL } from "@/lib/links";
import { NAV } from "@/lib/nav";
import { Container } from "./primitives";

const SiteFooter = () => (
  <footer className="border-t border-border">
    <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <p className="font-display text-lg font-semibold">{profile.name}</p>
        <p className="text-sm text-muted-foreground">
          {profile.headline} · {profile.focus}
        </p>
        <p className="text-sm text-muted-foreground">
          {profile.location} · {profile.workPreference}
        </p>
      </div>

      <nav aria-label="Footer">
        <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
          {NAV.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={CV_URL} target="_blank" rel="noopener" onClick={() => track("cv_download", { from: "footer" })} className="text-muted-foreground hover:text-foreground">
              CV (PDF)
            </a>
          </li>
        </ul>
      </nav>

      <ul className="flex gap-2" aria-label="Elsewhere">
        {[
          { href: `mailto:${profile.email}`, label: `Email ${profile.email}`, icon: Mail, event: "email_click" as const },
          { href: profile.links.linkedin, label: "LinkedIn profile", icon: Linkedin, event: "linkedin_click" as const },
          { href: profile.links.github, label: "GitHub profile", icon: Github },
        ].map(({ href, label, icon: Icon, event }) => (
          <li key={href}>
            <a
              href={href}
              aria-label={label}
              title={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              onClick={() => event && track(event, { from: "footer" })}
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon size={17} aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </Container>
    <Container className="border-t border-border py-5 text-xs text-muted-foreground">
      © {new Date().getFullYear()} {profile.name}. Built with React, TypeScript and Tailwind CSS ·{" "}
      <a href="https://github.com/chaditroudi/ChadiTroudi" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-foreground hover:underline">
        source on GitHub
      </a>
    </Container>
  </footer>
);

export default SiteFooter;
