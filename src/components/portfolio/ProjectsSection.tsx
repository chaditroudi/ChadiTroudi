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
  featured: boolean;
  impact?: string;
}

const projects: Project[] = [
  {
    title: "Kaufda & Bonial Console",
    description:
      "Migrated and rebuilt multiple screens from JavaScript to TypeScript across two major retail-tech projects. Designed custom ReactJS components for performance and streamlined workflows, with Java Spring Boot backend services.",
    tech: ["React", "TypeScript", "Java Spring Boot", "CI/CD"],
    impact: "2 major platforms migrated to TypeScript",
    featured: true,
  },
  {
    title: "Banking System Dashboard",
    description:
      "Developed secure, high-performance RESTful APIs for banking systems with strong attention to data integrity and authentication using Spring Security. Integrated with ReactJS/Angular frontends for real-time dashboard views.",
    tech: ["Java Spring Boot", "Spring Security", "React", "Angular", "PostgreSQL", "AWS"],
    impact: "Secure APIs handling financial data at scale",
    featured: true,
  },
  {
    title: "Go Rent Car – Car Rental Platform",
    description:
      "Created RESTful APIs and integrated them with modern React/Angular frontends for a full-featured car rental platform. Managed CI/CD pipelines on AWS using Docker, Jenkins, SonarQube, and GitHub Actions.",
    tech: ["React", "Angular", "Java Spring Boot", "Docker", "Jenkins", "AWS"],
    impact: "End-to-end CI/CD with automated quality gates",
    featured: true,
  },
];

const otherProjects = [
  {
    title: "Dwaya – Medicine Delivery",
    description:
      "Full-stack medicine home delivery app with ReactJS frontend and Node.js/NestJS backend, third-party API integrations, and responsive UX.",
    tech: ["React", "NestJS", "MongoDB"],
  },
  {
    title: "ChadiAcademy",
    description:
      "Educational platform for web dev mentorship. Created video content on ReactJS, Angular, Symfony, PHP and built a developer community.",
    tech: ["React", "Angular", "PHP", "YouTube"],
  },
  {
    title: "Yanyi ERP Integration",
    description:
      "Integrated ERP solutions with Odoo and built custom features tailored to business needs, with DevOps and CI/CD pipeline implementation.",
    tech: ["Odoo", "Java EE", "Spring Boot", "CI/CD"],
  },
  {
    title: "E-Commerce Backend",
    description:
      "Designed and deployed scalable backend modules for e-commerce platforms using Java, replacing legacy systems with modern microservices.",
    tech: ["Java", "Microservices", "Docker", "AWS"],
  },
  {
    title: "PetroServCatering Platform",
    description:
      "Full-stack platform with Spring Boot RESTful services (JPA, Batch, MVC) and Angular frontend, built during SSET internship.",
    tech: ["Spring Boot", "Angular", "PostgreSQL"],
  },
  {
    title: "Android Mobile App (ITGate)",
    description:
      "Android app in Java with RxJS for reactive data flows, Material Design UI, and Firebase/GraphQL backend integration.",
    tech: ["Android", "Java", "Kotlin", "Firebase"],
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="container mx-auto px-6 max-w-5xl">
        <AnimatedSection>
          <SectionHeading number="02" title="Featured Projects" />
        </AnimatedSection>

        <div className="space-y-20 mb-24">
          {projects.map((project, i) => (
            <AnimatedSection key={project.title} delay={i * 0.1}>
              <FeaturedProject project={project} index={i} />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <h3 className="text-center text-xl font-bold mb-8">Other Noteworthy Projects</h3>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProjects.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.05}>
              <OtherProject {...p} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedProject = ({ project, index }: { project: Project; index: number }) => {
  const isEven = index % 2 === 0;
  return (
    <div className="relative grid md:grid-cols-12 items-center gap-4 group">
      <div
        className={`md:col-span-7 ${isEven ? "md:col-start-1" : "md:col-start-6"} row-start-1 rounded-xl overflow-hidden bg-secondary h-64 md:h-80 relative`}
      >
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors duration-500 z-10" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="w-full h-full flex items-center justify-center relative z-20">
          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/40 transition-all duration-500">
              <Folder className="text-primary" size={28} />
            </div>
            <p className="text-foreground font-display font-semibold text-lg">{project.title}</p>
            <p className="text-muted-foreground text-xs max-w-xs font-mono">{project.tech.join(" · ")}</p>
            {project.impact && (
              <div className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-mono px-3 py-1 rounded-full">
                <ArrowUpRight size={12} /> {project.impact}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`md:col-span-6 ${isEven ? "md:col-start-7 md:text-right" : "md:col-start-1 md:text-left"} row-start-1 relative z-20`}
      >
        <p className="text-primary font-mono text-xs mb-1 tracking-wider uppercase">Featured Project</p>
        <h3 className="text-xl font-bold mb-4 group-hover:text-gradient transition-all">{project.title}</h3>
        <div className="glass p-6 rounded-xl mb-4">
          <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
        </div>
        <ul
          className={`flex flex-wrap gap-3 text-xs font-mono text-muted-foreground mb-4 ${isEven ? "md:justify-end" : ""}`}
        >
          {project.tech.map((t) => (
            <li key={t} className="bg-muted px-2 py-0.5 rounded">{t}</li>
          ))}
        </ul>
        <div className={`flex items-center gap-4 ${isEven ? "md:justify-end" : ""}`}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              aria-label={`${project.title} GitHub`}
            >
              <Github size={20} />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              aria-label={`${project.title} live site`}
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const OtherProject = ({ title, description, tech }: { title: string; description: string; tech: string[] }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="glass rounded-xl p-6 flex flex-col hover:border-primary/30 transition-colors duration-300 group h-full"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Folder className="text-primary" size={20} />
      </div>
    </div>
    <h4 className="text-foreground font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h4>
    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{description}</p>
    <ul className="flex flex-wrap gap-2 mt-4 text-xs font-mono text-muted-foreground">
      {tech.map((t) => (
        <li key={t} className="bg-muted/50 px-2 py-0.5 rounded">{t}</li>
      ))}
    </ul>
  </motion.div>
);

export default ProjectsSection;
