import { ExternalLink, Github, Folder } from "lucide-react";
import { SectionHeading } from "./AboutSection";

interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  featured: boolean;
}

const projects: Project[] = [
  {
    title: "Kaufda & Bonial Console",
    description:
      "Migrated and rebuilt multiple screens from JavaScript to TypeScript across two major retail-tech projects. Designed custom ReactJS components for performance and streamlined workflows, with Java Spring Boot backend services.",
    tech: ["React", "TypeScript", "Java Spring Boot", "CI/CD"],
    featured: true,
  },
  {
    title: "Banking System Dashboard",
    description:
      "Developed secure, high-performance RESTful APIs for banking systems with strong attention to data integrity and authentication using Spring Security. Integrated with ReactJS/Angular frontends for real-time dashboard views.",
    tech: ["Java Spring Boot", "Spring Security", "React", "Angular", "PostgreSQL", "AWS"],
    featured: true,
  },
  {
    title: "Go Rent Car – Car Rental Platform",
    description:
      "Created RESTful APIs and integrated them with modern React/Angular frontends for a full-featured car rental platform. Managed CI/CD pipelines on AWS using Docker, Jenkins, SonarQube, and GitHub Actions.",
    tech: ["React", "Angular", "Java Spring Boot", "Docker", "Jenkins", "AWS"],
    featured: true,
  },
];

const otherProjects = [
  {
    title: "Dwaya – Medicine Delivery",
    description: "Full-stack medicine home delivery app with ReactJS frontend and Node.js/NestJS backend, third-party API integrations, and responsive UX.",
    tech: ["React", "NestJS", "MongoDB"],
  },
  {
    title: "ChadiAcademy",
    description: "Educational platform for web dev mentorship. Created video content on ReactJS, Angular, Symfony, PHP and built a developer community.",
    tech: ["React", "Angular", "PHP", "YouTube"],
  },
  {
    title: "Yanyi ERP Integration",
    description: "Integrated ERP solutions with Odoo and built custom features tailored to business needs, with DevOps and CI/CD pipeline implementation.",
    tech: ["Odoo", "Java EE", "Spring Boot", "CI/CD"],
  },
  {
    title: "E-Commerce Backend",
    description: "Designed and deployed scalable backend modules for e-commerce platforms using Java, replacing legacy systems with modern microservices.",
    tech: ["Java", "Microservices", "Docker", "AWS"],
  },
  {
    title: "PetroServCatering Platform",
    description: "Full-stack platform with Spring Boot RESTful services (JPA, Batch, MVC) and Angular frontend, built during SSET internship.",
    tech: ["Spring Boot", "Angular", "PostgreSQL"],
  },
  {
    title: "Android Mobile App (ITGate)",
    description: "Android app in Java with RxJS for reactive data flows, Material Design UI, and Firebase/GraphQL backend integration.",
    tech: ["Android", "Java", "Kotlin", "Firebase"],
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <SectionHeading number="02" title="Featured Projects" />

        <div className="space-y-24 mb-24">
          {projects.map((project, i) => (
            <FeaturedProject key={project.title} project={project} index={i} />
          ))}
        </div>

        <h3 className="text-center text-xl font-bold mb-8">Other Noteworthy Projects</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProjects.map((p) => (
            <OtherProject key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedProject = ({ project, index }: { project: Project; index: number }) => {
  const isEven = index % 2 === 0;
  return (
    <div className="relative grid md:grid-cols-12 items-center gap-4">
      <div
        className={`md:col-span-7 ${isEven ? "md:col-start-1" : "md:col-start-6"} row-start-1 rounded-lg overflow-hidden bg-secondary h-64 md:h-80 relative group`}
      >
        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-xs">
          <div className="text-center space-y-2 p-4">
            <Folder className="mx-auto text-primary" size={40} />
            <p className="text-foreground font-display font-semibold">{project.title}</p>
            <p className="text-muted-foreground text-xs max-w-xs">{project.tech.join(" · ")}</p>
          </div>
        </div>
      </div>

      <div
        className={`md:col-span-6 ${isEven ? "md:col-start-7 md:text-right" : "md:col-start-1 md:text-left"} row-start-1 relative z-20`}
      >
        <p className="text-primary font-mono text-xs mb-1">Featured Project</p>
        <h3 className="text-xl font-bold mb-4">{project.title}</h3>
        <div className="bg-card p-6 rounded-lg shadow-lg mb-4">
          <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
        </div>
        <ul className={`flex flex-wrap gap-3 text-xs font-mono text-muted-foreground mb-4 ${isEven ? "md:justify-end" : ""}`}>
          {project.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className={`flex items-center gap-4 ${isEven ? "md:justify-end" : ""}`}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
              <Github size={20} />
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const OtherProject = ({ title, description, tech }: { title: string; description: string; tech: string[] }) => (
  <div className="card-gradient border border-border rounded-lg p-6 flex flex-col hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <Folder className="text-primary" size={28} />
    </div>
    <h4 className="text-foreground font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h4>
    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{description}</p>
    <ul className="flex flex-wrap gap-2 mt-4 text-xs font-mono text-muted-foreground">
      {tech.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  </div>
);

export default ProjectsSection;
