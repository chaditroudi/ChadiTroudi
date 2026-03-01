import { SectionHeading } from "./AboutSection";
import { Briefcase, GraduationCap } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    role: "Full Stack Engineer",
    company: "Bonial Germany",
    period: "Sep 2025 – Feb 2026",
    location: "Tunis, Tunisia · Hybrid",
    bullets: [
      "Supporting Kaufda and Bonial Console projects as a Full-Stack Engineer",
      "Migrating screens from JavaScript to TypeScript across two major projects",
      "Designing custom ReactJS components for performance and streamlined workflows",
      "Developing backend services with Java Spring Boot",
    ],
  },
  {
    role: "Full Stack Engineer",
    company: "Yanyi",
    period: "Oct 2024 – Aug 2025",
    location: "Berlin, Germany · Remote",
    bullets: [
      "Built CatalogAI — an AI-powered product catalog system with smart categorization, relevance-ranked search, and recommendation engine",
      "Developed TenderFlow AI — KI-driven tender management software automating RFQ analysis, prioritization, and proposal generation for MedTech & industry",
      "Integrated ERP solutions with Odoo and built custom features tailored to business needs",
      "Participated in DevOps processes including CI/CD pipeline implementation",
      "Represented team at Web Summit Qatar 2025, showcasing AI innovations",
    ],
  },
  {
    role: "Software Engineer",
    company: "AlMergab",
    period: "Dec 2022 – Sep 2024",
    location: "Doha, Qatar · Remote",
    bullets: [
      "Built Mind Platform — a risk management system for municipalities in Oman and Doha",
      "Engineered robust backend services using Java Spring Boot across multiple platforms",
      "Created RESTful APIs for car rental platform and banking system dashboards",
      "Managed CI/CD pipelines on AWS using Docker, Jenkins, and GitHub Actions",
    ],
  },
  {
    role: "FullStack Developer",
    company: "Dwaya",
    period: "Jun 2022 – Nov 2022",
    location: "Ariana, Tunisia · Hybrid",
    bullets: [
      "Built full-stack medicine delivery app with ReactJS and NestJS",
      "Integrated third-party APIs and ensured responsive UX",
    ],
  },
  {
    role: "Founder & Training Manager",
    company: "ChadiAcademy",
    period: "Sep 2020 – Jun 2022",
    location: "Tunisia · Remote",
    bullets: [
      "Founded educational platform for web development mentorship",
      "Created video content on ReactJS, Angular, Symfony, and more",
    ],
  },
];

const education = [
  { degree: "Engineering Degree, Computer Engineering", school: "ESPRIT", period: "2019 – 2022" },
  { degree: "B.Sc. Computer Science (Mention Très Bien)", school: "ESSTHS", period: "2016 – 2019" },
];

const TimelineItem = ({ exp, index }: { exp: (typeof experiences)[0]; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-10 pb-10 last:pb-0 border-l border-border group hover:border-primary/40 transition-colors duration-500"
    >
      {/* Dot */}
      <div className="absolute -left-[7px] top-0 w-3.5 h-3.5 rounded-full bg-background border-2 border-muted-foreground/30 group-hover:border-primary group-hover:shadow-[0_0_12px_-2px_hsl(45_100%_60%/0.5)] transition-all duration-300" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
        <h3 className="text-foreground font-semibold">
          {exp.role} <span className="text-primary font-normal">@ {exp.company}</span>
        </h3>
        <span className="text-muted-foreground font-mono text-xs shrink-0">{exp.period}</span>
      </div>
      <p className="text-muted-foreground text-xs font-mono mb-3">{exp.location}</p>
      <ul className="space-y-2">
        {exp.bullets.map((b, i) => (
          <li key={i} className="text-muted-foreground text-sm flex items-start gap-2.5">
            <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-28 relative">
      <div className="section-divider mb-28" />
      <div className="container mx-auto px-6 max-w-4xl">
        <AnimatedSection>
          <SectionHeading number="04" title="Experience" />
        </AnimatedSection>

        <div className="ml-2">
          {experiences.map((exp, i) => (
            <TimelineItem key={exp.company + exp.role} exp={exp} index={i} />
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="mt-20">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <GraduationCap className="text-primary" size={22} />
              Education
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {education.map((ed) => (
                <div key={ed.school} className="glass rounded-xl p-6 hover-lift">
                  <h4 className="text-foreground font-semibold text-sm">{ed.degree}</h4>
                  <p className="text-primary text-sm font-mono mt-1">{ed.school}</p>
                  <p className="text-muted-foreground text-xs font-mono mt-1">{ed.period}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ExperienceSection;
