import { ArrowUpRight, ExternalLink, Folder, Layers } from "lucide-react";
import { SectionHeading } from "./AboutSection";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import tenderflowImg from "@/assets/tenderflow-screenshot.png";

interface Project {
  title: string;
  description: string;
  tech: string[];
  company: string;
  impact?: string;
  image?: string;
  url?: string;
}

const projects: Project[] = [
  {
    title: "CatalogAI – AI Product Catalog",
    company: "Yanyi",
    description:
      "AI-powered product catalog system with automatic categorization, smart tagging, relevance-ranked search, and a recommendation engine. Secure image storage with AWS S3 and role-based auth.",
    tech: ["React", "Spring Boot", "PostgreSQL", "AWS S3", "AI/ML"],
    impact: "Automated product categorization",
  },
  {
    title: "TenderFlow AI",
    company: "Yanyi",
    description:
      "KI-driven tender management software that automates RFQ analysis, prioritization, and proposal generation for MedTech, industry & technical trade.",
    tech: ["React", "Spring Boot", "AI/NLP", "PostgreSQL", "REST API"],
    impact: "Weeks → minutes for tenders",
  },
  {
    title: "Mind Platform – Risk Management",
    company: "AlMergab",
    description:
      "Municipal risk management system deployed for municipalities in Oman and Doha. Scalable backend services with real-time dashboards.",
    tech: ["Java Spring Boot", "React", "Angular", "PostgreSQL", "AWS"],
    impact: "Deployed across Gulf municipalities",
  },
  {
    title: "Kaufda & Bonial Console",
    company: "Bonial Germany",
    description:
      "Migrated and rebuilt multiple screens from JavaScript to TypeScript across two major retail-tech projects. Custom ReactJS components for performance.",
    tech: ["React", "TypeScript", "Java Spring Boot", "CI/CD"],
    impact: "2 platforms migrated to TS",
  },
];

interface OtherProject {
  title: string;
  description: string;
  tech: string[];
  company: string;
}

const otherProjects: OtherProject[] = [
  { title: "Banking System Dashboard", company: "AlMergab", description: "Secure high-performance APIs for banking with Spring Security and React/Angular dashboards.", tech: ["Spring Boot", "Spring Security", "React"] },
  { title: "Go Rent Car Platform", company: "AlMergab", description: "End-to-end car rental platform with CI/CD on AWS using Docker and Jenkins.", tech: ["React", "Spring Boot", "Docker", "AWS"] },
  { title: "Dwaya – Medicine Delivery", company: "Dwaya", description: "Full-stack medicine delivery app with ReactJS and NestJS backend.", tech: ["React", "NestJS", "MongoDB"] },
  { title: "ChadiAcademy", company: "Self-founded", description: "Educational platform for web dev mentorship with video content.", tech: ["React", "Angular", "YouTube"] },
  { title: "PetroServCatering", company: "SSET", description: "Full-stack platform with Spring Boot services and Angular.", tech: ["Spring Boot", "Angular", "PostgreSQL"] },
  { title: "Android App", company: "ITGate", description: "Android app with RxJS reactive data flows and Firebase.", tech: ["Android", "Kotlin", "Firebase"] },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-32 relative">
      <div className="section-divider mb-32" />
      <div className="container mx-auto px-6 max-w-6xl">
        <AnimatedSection>
          <SectionHeading number="02" title="Featured Work" />
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-5 mb-24">
          {projects.map((project, i) => (
            <AnimatedSection key={project.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group glass rounded-2xl p-8 hover:border-primary/25 transition-all duration-500 h-full flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <Folder className="text-primary" size={22} />
                  </div>
                  {project.impact && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/15">
                      <ArrowUpRight size={12} />
                      {project.impact}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-1">
                  {project.title}
                </h3>
                <p className="text-xs font-mono text-muted-foreground mb-3">@ {project.company}</p>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((t) => (
                    <span key={t} className="text-xs font-mono px-2.5 py-1 rounded-md bg-muted/50 text-muted-foreground border border-border/50">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="flex items-center gap-3 justify-center mb-10">
            <Layers size={18} className="text-primary" />
            <h3 className="text-xl font-bold">Other Projects</h3>
          </div>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProjects.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -3 }}
                className="glass rounded-xl p-6 flex flex-col hover:border-primary/15 transition-all duration-300 group h-full"
              >
                <h4 className="text-foreground font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{p.title}</h4>
                <p className="text-xs font-mono text-primary/60 mb-3">@ {p.company}</p>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {p.tech.map((t) => (
                    <span key={t} className="text-xs font-mono px-2 py-0.5 rounded-md bg-muted/30 text-muted-foreground">{t}</span>
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
