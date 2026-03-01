const AboutSection = () => {
  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <SectionHeading number="01" title="About Me" />

        <div className="grid md:grid-cols-[3fr_2fr] gap-12 items-start">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              I'm a full-stack developer with 4+ years of experience building scalable web
              applications. My journey started with tinkering on WordPress themes and evolved
              into architecting complex distributed systems.
            </p>
            <p>
              I specialize in the React ecosystem on the frontend and Node.js on the backend,
              with production experience deploying to AWS, Vercel, and Docker-based
              environments. I care deeply about code quality, testing, and developer experience.
            </p>
            <p>
              When I'm not coding, you'll find me contributing to open-source, writing
              technical blog posts, or mentoring junior developers.
            </p>

            <div className="pt-4">
              <p className="text-foreground font-medium mb-3">Technologies I work with:</p>
              <ul className="grid grid-cols-2 gap-2 text-sm font-mono">
                {[
                  "TypeScript / JavaScript",
                  "React & Next.js",
                  "Node.js & Express",
                  "PostgreSQL & MongoDB",
                  "Docker & AWS",
                  "GraphQL & REST",
                  "Git & CI/CD",
                  "Tailwind CSS",
                ].map((tech) => (
                  <li key={tech} className="flex items-center gap-2">
                    <span className="text-primary">▹</span> {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative group mx-auto md:mx-0">
            <div className="w-64 h-64 rounded-lg overflow-hidden relative z-10 bg-secondary">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                    AC
                  </div>
                  <p>Alex Chen</p>
                </div>
              </div>
            </div>
            <div className="absolute top-4 left-4 w-64 h-64 border-2 border-primary rounded-lg -z-0 group-hover:top-3 group-hover:left-3 transition-all duration-300" />
          </div>
        </div>
      </div>
    </section>
  );
};

export const SectionHeading = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-center gap-4 mb-12">
    <span className="text-primary font-mono text-sm">{number}.</span>
    <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
    <div className="flex-1 h-px bg-border ml-4" />
  </div>
);

export default AboutSection;
