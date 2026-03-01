import { SectionHeading } from "./AboutSection";

const skillCategories = [
  {
    category: "Frontend",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 92 },
      { name: "HTML / CSS", level: 95 },
      { name: "Redux / Zustand", level: 85 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js / Express", level: 90 },
      { name: "PostgreSQL", level: 85 },
      { name: "MongoDB", level: 80 },
      { name: "GraphQL", level: 78 },
      { name: "REST API Design", level: 92 },
    ],
  },
  {
    category: "DevOps & Tools",
    skills: [
      { name: "Git / GitHub", level: 95 },
      { name: "Docker", level: 82 },
      { name: "AWS (S3, EC2, Lambda)", level: 75 },
      { name: "CI/CD Pipelines", level: 80 },
      { name: "Linux / Bash", level: 78 },
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
