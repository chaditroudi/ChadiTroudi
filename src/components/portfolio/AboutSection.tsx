import AnimatedSection from "./AnimatedSection";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="container mx-auto px-6 max-w-4xl">
        <AnimatedSection>
          <SectionHeading number="01" title="About Me" />
        </AnimatedSection>

        <div className="grid md:grid-cols-[3fr_2fr] gap-12 items-start">
          <AnimatedSection delay={0.1}>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm a Full-Stack Engineer at{" "}
                <span className="text-foreground font-medium">Bonial Germany</span>, building retail tech
                with React/TypeScript on the front end and Java Spring Boot on the back end. With{" "}
                <span className="text-foreground font-medium">5+ years</span> of experience, I've shipped
                products across banking, health, mobility, e-commerce, and education.
              </p>
              <p>
                Previously at <span className="text-foreground font-medium">Yanyi</span>, I represented the
                team at{" "}
                <span className="text-foreground font-medium">Web Summit Qatar 2025</span>, showcasing our
                AI work. Across roles I've led migrations from JavaScript to TypeScript, created reusable
                React component libraries, and scaled back-end services on AWS/Docker with CI/CD.
              </p>
              <p>
                I'm also the founder of{" "}
                <span className="text-foreground font-medium">ChadiAcademy</span>, an educational platform
                where I mentor developers and create content on web development and software engineering.
              </p>

              <div className="pt-6">
                <p className="text-foreground font-medium mb-4">Technologies I work with:</p>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm font-mono">
                  {[
                    "React & TypeScript",
                    "Java Spring Boot",
                    "Angular",
                    "Node.js & NestJS",
                    "PostgreSQL & MongoDB",
                    "Docker & AWS",
                    "CI/CD & DevOps",
                    "Odoo ERP",
                  ].map((tech) => (
                    <li key={tech} className="flex items-center gap-2 group">
                      <span className="text-primary group-hover:translate-x-0.5 transition-transform">▹</span>
                      <span className="group-hover:text-foreground transition-colors">{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3} direction="right">
            <div className="relative group mx-auto md:mx-0">
              <div className="w-64 h-64 rounded-lg overflow-hidden relative z-10 bg-secondary">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary text-3xl font-bold group-hover:border-primary/60 transition-colors">
                      CT
                    </div>
                    <p className="text-foreground font-medium">Chadi Troudi</p>
                    <p className="text-muted-foreground text-xs font-mono">Full-Stack Engineer</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 left-4 w-64 h-64 border-2 border-primary/40 rounded-lg -z-0 group-hover:top-2 group-hover:left-2 transition-all duration-500" />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export const SectionHeading = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-center gap-4 mb-12">
    <span className="text-primary font-mono text-sm">{number}.</span>
    <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-4" />
  </div>
);

export default AboutSection;
