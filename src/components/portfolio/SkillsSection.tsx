import { SectionHeading } from "./AboutSection";

const skillCategories = [
  {
    category: "Frontend",
    skills: [
      { name: "React & TypeScript", level: 95 },
      { name: "Angular", level: 80 },
      { name: "Tailwind CSS", level: 90 },
      { name: "HTML / CSS / JS", level: 95 },
      { name: "Redux / Zustand", level: 82 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Java Spring Boot", level: 92 },
      { name: "Node.js / NestJS", level: 85 },
      { name: "PostgreSQL", level: 88 },
      { name: "MongoDB", level: 82 },
      { name: "REST & GraphQL APIs", level: 90 },
    ],
  },
  {
    category: "DevOps & Tools",
    skills: [
      { name: "Git / GitHub Actions", level: 93 },
      { name: "Docker", level: 85 },
      { name: "AWS (S3, EC2, Lambda)", level: 78 },
      { name: "CI/CD (Jenkins, SonarQube)", level: 85 },
      { name: "Odoo ERP", level: 75 },
    ],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 bg-card/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <SectionHeading number="03" title="Skills & Expertise" />

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-primary font-mono text-sm mb-6 uppercase tracking-wider">{cat.category}</h3>
              <div className="space-y-4">
                {cat.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{skill.name}</span>
                      <span className="text-muted-foreground font-mono text-xs">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
