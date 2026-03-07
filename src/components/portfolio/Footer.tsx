import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => (
  <footer className="py-12 border-t border-border">
    <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div>
        <p className="text-foreground font-bold text-lg tracking-tight">
          <span className="text-gradient">CT</span><span className="text-primary">.</span>
        </p>
        <p className="text-muted-foreground text-xs font-mono mt-1">
          © {new Date().getFullYear()} Chadi Troudi. All rights reserved.
        </p>
      </div>
      <div className="flex items-center gap-3">
        {[
          { href: "https://github.com/chaditroudi", icon: <Github size={16} /> },
          { href: "https://www.linkedin.com/in/chaditroudi", icon: <Linkedin size={16} /> },
          { href: "mailto:chadi.troudi@example.com", icon: <Mail size={16} /> },
        ].map((s, i) => (
          <a
            key={i}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
          >
            {s.icon}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
