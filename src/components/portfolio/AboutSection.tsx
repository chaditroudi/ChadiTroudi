import AnimatedSection from "./AnimatedSection";
import websummitStage from "@/assets/websummit-stage.jpg";
import workingCafe from "@/assets/working-cafe.jpg";
import { MapPin, Calendar, Zap } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-32 relative">
      <div className="section-divider mb-32" />
      <div className="container mx-auto px-6 max-w-6xl">
        <AnimatedSection>
          <SectionHeading number="01" title="About Me" />
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Photo collage */}
          <AnimatedSection delay={0.1} direction="left">
            <div className="relative h-[460px]">
              <div className="absolute top-0 left-0 w-[65%] h-[75%] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border/30">
                <img
                  src={websummitStage}
                  alt="Chadi at Web Summit Qatar 2025"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                  <p className="text-xs font-mono text-primary flex items-center gap-1.5">
                    <MapPin size={12} /> Web Summit Qatar 2025
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-[55%] h-[55%] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border/30">
                <img
                  src={workingCafe}
                  alt="Chadi working remotely"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-8 right-[18%] w-24 h-24 border border-primary/10 rounded-2xl -z-10" />
              <div className="absolute bottom-8 left-[8%] w-16 h-16 bg-primary/5 rounded-xl -z-10" />
            </div>
          </AnimatedSection>

          {/* Text content */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-semibold leading-snug tracking-tight">
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

              <div className="pt-6 grid grid-cols-2 gap-3">
                {[
                  "React & TypeScript",
                  "Java Spring Boot",
                  "Node.js & NestJS",
                  "PostgreSQL & MongoDB",
                  "Docker & AWS",
                  "CI/CD & DevOps",
                ].map((tech) => (
                  <div key={tech} className="flex items-center gap-2.5 text-sm text-muted-foreground group">
                    <Zap size={12} className="text-primary shrink-0" />
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
  <div className="flex items-center gap-4 mb-16">
    <span className="text-primary font-mono text-sm font-semibold tracking-wider">{number}</span>
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-6" />
  </div>
);

export default AboutSection;
