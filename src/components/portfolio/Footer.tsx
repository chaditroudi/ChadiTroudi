import { Github, Linkedin, Mail, ArrowUpRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "@/hooks/use-lang";

const Footer = () => {
  const { t } = useLang();

  const footerLinks = [
    {
      title: t.footer.explore,
      links: [
        { label: t.nav.projects, href: "/projects" },
        { label: t.nav.skills, href: "/skills" },
        { label: t.nav.blog, href: "/blog" },
      ],
    },
    {
      title: t.footer.learn,
      links: [
        { label: t.nav.tutoring, href: "/tutoring" },
        { label: t.nav.pricing, href: "/pricing" },
        { label: t.footer.howItWorks, href: "/docs" },
      ],
    },
    {
      title: t.footer.connect,
      links: [
        { label: t.nav.contact, href: "/contact" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/chaditroudi", external: true },
        { label: "GitHub", href: "https://github.com/chaditroudi", external: true },
      ],
    },
  ];

  return (
  <footer className="relative border-t border-border/50">
    {/* Gradient accent */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

    <div className="container mx-auto px-6 py-16 max-w-6xl">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="col-span-2">
          <Link to="/" className="inline-block text-2xl font-bold tracking-tight mb-4">
            <span className="text-gradient">CT</span>
            <span className="text-primary">.</span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
            {t.footer.desc}
          </p>
          <div className="flex items-center gap-2">
            {[
              { href: "https://github.com/chaditroudi", icon: <Github size={15} />, label: "GitHub" },
              { href: "https://www.linkedin.com/in/chaditroudi", icon: <Linkedin size={15} />, label: "LinkedIn" },
              { href: "mailto:chadi.troudi@example.com", icon: <Mail size={15} />, label: "Email" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {footerLinks.map((group) => (
          <div key={group.title}>
            <h4 className="text-foreground font-semibold text-sm mb-4 uppercase tracking-wider">
              {group.title}
            </h4>
            <ul className="space-y-2.5">
              {group.links.map((link) =>
                link.external ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary text-sm transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mt-14 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground text-xs font-mono flex items-center gap-1">
          © {new Date().getFullYear()} Chadi Troudi. {t.footer.builtWith}{" "}
          <Heart size={10} className="text-primary fill-primary" /> {t.footer.inTunisia}
        </p>
        <div className="flex items-center gap-4">
          <a
            href="/ChadiTroudiCv.pdf"
            download
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Download CV
          </a>
          <span className="text-border">·</span>
          <Link to="/pricing" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Start Learning
          </Link>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
