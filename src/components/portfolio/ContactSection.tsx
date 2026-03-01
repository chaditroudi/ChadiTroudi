import { SectionHeading } from "./AboutSection";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <SectionHeading number="04" title="Get In Touch" />

        <p className="text-muted-foreground text-lg leading-relaxed mb-10">
          I'm currently open to new opportunities and always interested in
          challenging full-stack projects. Whether you have a question, a
          potential collaboration, or just want to say hello — my inbox is always open.
        </p>

        <a
          href="mailto:alex@example.com"
          className="inline-flex items-center gap-2 border border-primary text-primary font-mono px-8 py-3 rounded-md hover:bg-primary/10 transition-colors animate-pulse-glow"
        >
          <Mail size={18} />
          Say Hello
        </a>

        <div className="flex items-center justify-center gap-6 mt-12">
          <SocialIcon href="https://github.com" icon={<Github size={20} />} label="GitHub" />
          <SocialIcon href="https://linkedin.com" icon={<Linkedin size={20} />} label="LinkedIn" />
          <SocialIcon href="https://twitter.com" icon={<Twitter size={20} />} label="Twitter" />
          <SocialIcon href="mailto:alex@example.com" icon={<Mail size={20} />} label="Email" />
        </div>
      </div>
    </section>
  );
};

const SocialIcon = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-muted-foreground hover:text-primary hover:-translate-y-1 transition-all"
  >
    {icon}
  </a>
);

export default ContactSection;
