import { ExternalLink, Github, Folder, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./AboutSection";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  impact?: string;
}

const projects: Project[] = [
  {
    title: "Kaufda & Bonial Console",
    description:
      "Migrated and rebuilt multiple screens from JavaScript to TypeScript across two major retail-tech projects. Designed custom ReactJS components for performance and streamlined workflows.",
    tech: ["React", "TypeScript", "Java Spring Boot", "CI/CD"],
    impact: "2 platforms migrated to TS",
  },
  {
    title: "Banking System Dashboard",
    description:
      "Developed secure, high-performance RESTful APIs for banking systems with Spring Security. Integrated with ReactJS/Angular frontends for real-time dashboard views.",
    tech: ["Java Spring Boot", "Spring Security", "React", "PostgreSQL"],
    impact: "Secure financial APIs at scale",
  },
  {
    title: "Go Rent Car Platform",
    description:
      "End-to-end car rental platform with RESTful APIs, React/Angular frontends. Managed CI/CD on AWS using Docker, Jenkins, SonarQube, and GitHub Actions.",
    tech: ["React", "Angular", "Java Spring Boot", "Docker", "AWS"],
    impact: "Full CI/CD pipeline",
  },
];

const otherProjects = [
  { title: "Dwaya – Medicine Delivery", description: "Full-stack medicine delivery app with ReactJS and NestJS backend.", tech: ["React", "NestJS", "MongoDB"] },
  { title: "ChadiAcademy", description: "Educational platform for web dev mentorship with video content.", tech: ["React", "Angular", "YouTube"] },
  { title: "Yanyi ERP Integration", description: "Odoo ERP integration with custom features and DevOps.", tech: ["Odoo", "Spring Boot", "CI/CD"] },
  { title: "E-Commerce Backend", description: "Scalable microservices replacing legacy e-commerce systems.", tech: ["Java", "Microservices", "Docker"] },
  { title: "PetroServCatering", description: "Full-stack platform with Spring Boot services and Angular.", tech: ["Spring Boot", "Angular", "PostgreSQL"] },
  { title: "Android App (ITGate)", description: "Android app with RxJS reactive data flows and Firebase.", tech: ["Android", "Kotlin", "Firebase"] },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-28 relative">
      <div className="section-divider mb-28" />
      <div className="container mx-auto px-6 max-w-6xl">
        <AnimatedSection>
          <SectionHeading number="02" title="Featured Work" />
        </AnimatedSection>

        <div className="space-y-6 mb-24">
          {projects.map((project, i) => (
            <AnimatedSection key={project.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group glass rounded-2xl p-8 md:p-10 hover:border-primary/30 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Folder className="text-primary" size={20} />
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4 max-w-xl">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span key={t} className="text-xs font-mono bg-muted px-2.5 py-1 rounded-full text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                  {project.impact && (
                    <div className="shrink-0 flex items-center gap-2 bg-primary/10 text-primary text-xs font-mono px-4 py-2 rounded-full whitespace-nowrap">
                      <ArrowUpRight size={14} />
                      {project.impact}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <h3 className="text-center text-xl font-bold mb-10">Other Projects</h3>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProjects.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -4 }}
                className="glass rounded-xl p-6 flex flex-col hover:border-primary/20 transition-all duration-300 group h-full"
              >
                <h4 className="text-foreground font-semibold mb-2 group-hover:text-primary transition-colors">{p.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{p.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {p.tech.map((t) => (
                    <span key={t} className="text-xs font-mono bg-muted/50 px-2 py-0.5 rounded-full text-muted-foreground">{t}</span>
                  ))}
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
