import { SectionHeading } from "./AboutSection";
import { Briefcase, GraduationCap } from "lucide-react";

const experiences = [
  {
    role: "Full Stack Engineer",
    company: "Bonial Germany",
    period: "Sep 2025 – Feb 2026",
    location: "Tunis, Tunisia · Hybrid",
    bullets: [
      "Supporting Kaufda and Bonial Console projects as a Full-Stack Engineer",
      "Migrating and rebuilding multiple screens from JavaScript to TypeScript",
      "Designing custom ReactJS components for performance and streamlined workflows",
      "Developing and enhancing backend services with Java Spring Boot",
    ],
  },
  {
    role: "Full Stack Engineer",
    company: "Yanyi",
    period: "Oct 2024 – Aug 2025",
    location: "Berlin, Germany · Remote",
    bullets: [
      "Developed front-end modules using ReactJS and backend services with Java EE and Spring Boot",
      "Integrated ERP solutions with Odoo and built custom features for business needs",
      "Participated in DevOps processes, deployment, automated testing, and CI/CD",
      "Represented team at Web Summit Qatar 2025, showcasing AI innovations",
    ],
  },
  {
    role: "Software Engineer",
    company: "AlMergab",
    period: "Dec 2022 – Sep 2024",
    location: "Doha, Qatar · Remote",
    bullets: [
      "Engineered robust backend services using Java Spring Boot across multiple platforms",
      "Created RESTful APIs for car rental platform and banking system dashboards",
      "Developed secure APIs for banking systems with Spring Security",
      "Managed CI/CD pipelines on AWS using Docker, Jenkins, SonarQube, and GitHub Actions",
    ],
  },
  {
    role: "FullStack Developer (Intern)",
    company: "Dwaya",
    period: "Jun 2022 – Nov 2022",
    location: "Ariana, Tunisia · Hybrid",
    bullets: [
      "Built full-stack features for a medicine home delivery app with ReactJS and NestJS",
      "Integrated third-party APIs and ensured responsive UX across devices",
    ],
  },
  {
    role: "Founder & Training Manager",
    company: "ChadiAcademy",
    period: "Sep 2020 – Jun 2022",
    location: "Tunisia · Remote",
    bullets: [
      "Founded an educational platform for web development and software engineering",
      "Created video content and mentored on ReactJS, Angular, Symfony, and more",
      "Built a developer community and guided students on real-world projects",
    ],
  },
];

const education = [
  {
    degree: "Engineering Degree, Computer Engineering",
    school: "ESPRIT",
    period: "2019 – 2022",
  },
  {
    degree: "B.Sc. Computer Science (Mention Très Bien)",
    school: "ESSTHS – Hammam Sousse",
    period: "2016 – 2019",
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <SectionHeading number="04" title="Experience" />

        <div className="space-y-10">
          {experiences.map((exp) => (
            <div key={exp.company + exp.role} className="relative pl-8 border-l-2 border-border hover:border-primary/50 transition-colors">
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                <Briefcase size={10} className="text-primary" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="text-foreground font-semibold">
                  {exp.role} <span className="text-primary">@ {exp.company}</span>
                </h3>
                <span className="text-muted-foreground font-mono text-xs">{exp.period}</span>
              </div>
              <p className="text-muted-foreground text-xs mb-3 font-mono">{exp.location}</p>
              <ul className="space-y-1.5">
                {exp.bullets.map((b, i) => (
                  <li key={i} className="text-muted-foreground text-sm flex items-start gap-2">
                    <span className="text-primary mt-1.5 shrink-0">▹</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <GraduationCap className="text-primary" size={22} /> Education
          </h3>
          <div className="space-y-6">
            {education.map((ed) => (
              <div key={ed.school} className="pl-8 border-l-2 border-border">
                <h4 className="text-foreground font-semibold">{ed.degree}</h4>
                <p className="text-primary text-sm font-mono">{ed.school}</p>
                <p className="text-muted-foreground text-xs font-mono">{ed.period}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
