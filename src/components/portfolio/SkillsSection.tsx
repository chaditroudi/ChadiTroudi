import { SectionHeading } from "./AboutSection";
import AnimatedSection from "./AnimatedSection";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Monitor, Server, Settings } from "lucide-react";

const skillCategories = [
  {
    category: "Frontend",
    icon: <Monitor size={18} />,
    color: "from-primary to-accent-foreground",
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
    icon: <Server size={18} />,
    color: "from-chart-2 to-chart-3",
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
    icon: <Settings size={18} />,
    color: "from-chart-4 to-chart-1",
    skills: [
      { name: "Git / GitHub Actions", level: 93 },
      { name: "Docker", level: 85 },
      { name: "AWS (S3, EC2, Lambda)", level: 78 },
      { name: "CI/CD (Jenkins)", level: 85 },
      { name: "Odoo ERP", level: 75 },
    ],
  },
];

const SkillBar = ({ name, level, delay }: { name: string; level: number; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="group">
      <div className="flex justify-between text-sm mb-2.5">
        <span className="text-foreground/80 group-hover:text-foreground transition-colors font-medium">{name}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.5 }}
          className="text-muted-foreground font-mono text-xs"
        >
          {level}%
        </motion.span>
      </div>
      <div className="skill-bar">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          className="skill-bar-fill"
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  return (
    <section id="skills" className="py-32 relative">
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-50" />
      <div className="section-divider mb-32" />
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <AnimatedSection>
          <SectionHeading number="03" title="Skills & Expertise" />
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {skillCategories.map((cat, ci) => (
            <AnimatedSection key={cat.category} delay={ci * 0.1}>
              <div className="glass rounded-2xl p-7 h-full hover:border-primary/20 transition-all duration-500 group">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                    {cat.icon}
                  </div>
                  <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider">
                    {cat.category}
                  </h3>
                </div>
                <div className="space-y-5">
                  {cat.skills.map((skill, si) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      delay={ci * 0.1 + si * 0.08}
                    />
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
