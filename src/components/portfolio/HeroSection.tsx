import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(160 84% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 50%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <p className="text-primary font-mono text-sm mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Hello, my name is
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Chadi Troudi.
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-muted-foreground mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            I build things for the web.
          </h2>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            Full-Stack Engineer at Bonial Germany, building retail tech with React/TypeScript and Java Spring Boot. 
            I've shipped products across banking, health, mobility, e-commerce, and education — 
            and I care about clean architecture, developer experience, and measurable impact.
          </p>

          <div className="flex items-center gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-sm px-6 py-3 rounded-md hover:opacity-90 transition-opacity glow"
            >
              View Projects <ArrowDown size={16} />
            </a>
            <div className="flex items-center gap-4">
              <SocialLink href="https://www.linkedin.com/in/chaditroudi" icon={<Linkedin size={20} />} label="LinkedIn" />
              <SocialLink href="https://github.com/chaditroudi" icon={<Github size={20} />} label="GitHub" />
              <SocialLink href="mailto:chadi.troudi@example.com" icon={<Mail size={20} />} label="Email" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-muted-foreground hover:text-primary transition-colors">
    {icon}
  </a>
);

export default HeroSection;
