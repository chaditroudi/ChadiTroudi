import AnimatedSection from "./AnimatedSection";
import websummitStage from "@/assets/websummit-stage.jpg";
import workingCafe from "@/assets/working-cafe.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-28 relative">
      <div className="section-divider mb-28" />
      <div className="container mx-auto px-6 max-w-6xl">
        <AnimatedSection>
          <SectionHeading number="01" title="About Me" />
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Photo collage */}
          <AnimatedSection delay={0.1} direction="left">
            <div className="relative h-[420px]">
              <div className="absolute top-0 left-0 w-[65%] h-[75%] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={websummitStage}
                  alt="Chadi at Web Summit Qatar 2025"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-[55%] h-[60%] rounded-2xl overflow-hidden shadow-2xl border-4 border-background">
                <img
                  src={workingCafe}
                  alt="Chadi working remotely"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Decorative */}
              <div className="absolute top-8 right-[20%] w-20 h-20 border border-primary/20 rounded-xl -z-10" />
              <div className="absolute bottom-8 left-[10%] w-16 h-16 bg-primary/5 rounded-lg -z-10" />
            </div>
          </AnimatedSection>

          {/* Text content */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-5">
              <p className="text-2xl font-semibold leading-snug">
                I build products that <span className="text-gradient">matter</span> — from banking dashboards to retail platforms.
              </p>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  I'm a Full-Stack Engineer at{" "}
                  <span className="text-foreground font-medium">Bonial Germany</span>, building retail tech
                  with React/TypeScript and Java Spring Boot. With 5+ years of experience, I've shipped
                  products across banking, health, mobility, e-commerce, and education.
                </p>
                <p>
                  At <span className="text-foreground font-medium">Yanyi</span>, I represented the team at{" "}
                  <span className="text-foreground font-medium">Web Summit Qatar 2025</span>, showcasing our
                  AI work. I've led JS→TS migrations, created reusable React component libraries, and scaled
                  backend services on AWS/Docker with CI/CD.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-3">
                {[
                  "React & TypeScript",
                  "Java Spring Boot",
                  "Node.js & NestJS",
                  "PostgreSQL & MongoDB",
                  "Docker & AWS",
                  "CI/CD & DevOps",
                ].map((tech) => (
                  <div key={tech} className="flex items-center gap-2 text-sm font-mono text-muted-foreground group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:shadow-[0_0_8px_hsl(45_100%_60%/0.5)] transition-shadow" />
                    <span className="group-hover:text-foreground transition-colors">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export const SectionHeading = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-center gap-4 mb-14">
    <span className="text-primary font-mono text-sm font-semibold">{number}.</span>
    <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-4" />
  </div>
);

export default AboutSection;
