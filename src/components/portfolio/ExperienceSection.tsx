import { SectionHeading } from "./AboutSection";
import { GraduationCap, Building2 } from "lucide-react";
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
      "Built CatalogAI — an AI-powered product catalog system with smart categorization and recommendation engine",
      "Developed TenderFlow AI — KI-driven tender management automating RFQ analysis and proposal generation",
      "Integrated ERP solutions with Odoo and built custom features tailored to business needs",
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
    role: "FullStack Engineer",
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
      className="relative pl-12 pb-12 last:pb-0 group"
    >
      {/* Timeline line */}
      <div className="absolute left-[17px] top-8 bottom-0 w-px bg-border group-last:hidden group-hover:bg-primary/30 transition-colors duration-500" />
      
      {/* Dot */}
      <div className="absolute left-2 top-1 w-7 h-7 rounded-lg bg-card border-2 border-border group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300 flex items-center justify-center">
        <Building2 size={12} className="text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <div className="glass rounded-2xl p-6 hover:border-primary/15 transition-all duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1">
          <h3 className="text-foreground font-semibold">
            {exp.role}
          </h3>
          <span className="text-muted-foreground font-mono text-xs shrink-0">{exp.period}</span>
        </div>
        <p className="text-primary text-sm font-medium mb-1">{exp.company}</p>
        <p className="text-muted-foreground text-xs font-mono mb-4">{exp.location}</p>
        <ul className="space-y-2">
          {exp.bullets.map((b, i) => (
            <li key={i} className="text-muted-foreground text-sm flex items-start gap-2.5">
              <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-32 relative">
      <div className="section-divider mb-32" />
      <div className="container mx-auto px-6 max-w-4xl">
        <AnimatedSection>
          <SectionHeading number="04" title="Experience" />
        </AnimatedSection>

        <div>
          {experiences.map((exp, i) => (
            <TimelineItem key={exp.company + exp.role} exp={exp} index={i} />
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="mt-20">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap className="text-primary" size={18} />
              </div>
              Education
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {education.map((ed) => (
                <div key={ed.school} className="glass rounded-xl p-6 hover:border-primary/15 hover-lift transition-all">
                  <h4 className="text-foreground font-semibold text-sm">{ed.degree}</h4>
                  <p className="text-primary text-sm font-medium mt-1">{ed.school}</p>
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
