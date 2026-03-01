import { ExternalLink, Github, Folder } from "lucide-react";
import { SectionHeading } from "./AboutSection";

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  featured: boolean;
}

const projects: Project[] = [
  {
    title: "TaskFlow – Project Management App",
    description:
      "A full-stack Kanban-style project management tool with real-time collaboration, drag-and-drop boards, user authentication, and team workspaces. Built with WebSocket integration for live updates.",
    tech: ["React", "Node.js", "PostgreSQL", "Socket.io", "Redis", "Docker"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
  },
  {
    title: "ShopVerse – E-Commerce Platform",
    description:
      "Full-featured e-commerce platform with product catalog, shopping cart, Stripe payment integration, order management, and admin dashboard. Includes search, filtering, and responsive design.",
    tech: ["Next.js", "Express", "MongoDB", "Stripe", "AWS S3", "TypeScript"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
  },
  {
    title: "DevConnect – Developer Social Network",
    description:
      "A social platform for developers to share posts, comment, and collaborate. Features GitHub OAuth, markdown editor, notification system, and RESTful API with JWT authentication.",
    tech: ["React", "Node.js", "PostgreSQL", "GraphQL", "JWT", "Tailwind"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
  },
];

const otherProjects = [
  {
    title: "CLI Task Tracker",
    description: "A command-line productivity tool with time tracking, reports, and Pomodoro timer.",
    tech: ["Node.js", "SQLite", "Chalk"],
  },
  {
    title: "Weather Dashboard",
    description: "Real-time weather app with 5-day forecasts, location search, and interactive maps.",
    tech: ["React", "OpenWeather API", "Leaflet"],
  },
  {
    title: "Blog CMS",
    description: "Headless CMS with markdown support, image upload, and SEO optimization tools.",
    tech: ["Next.js", "Prisma", "PostgreSQL"],
  },
  {
    title: "Chat Application",
    description: "Real-time messaging with rooms, file sharing, typing indicators, and read receipts.",
    tech: ["React", "Socket.io", "MongoDB"],
  },
  {
    title: "Expense Tracker API",
    description: "RESTful API with budgeting, recurring transactions, and CSV export features.",
    tech: ["Express", "PostgreSQL", "Jest"],
  },
  {
    title: "Portfolio Generator",
    description: "Open-source tool that generates developer portfolios from GitHub profile data.",
    tech: ["TypeScript", "GitHub API", "Handlebars"],
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
    <div className={`relative grid md:grid-cols-12 items-center gap-4`}>
      {/* Image placeholder */}
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

      {/* Content */}
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
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
            <Github size={20} />
          </a>
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
            <ExternalLink size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

const OtherProject = ({ title, description, tech }: { title: string; description: string; tech: string[] }) => (
  <div className="card-gradient border border-border rounded-lg p-6 flex flex-col hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <Folder className="text-primary" size={28} />
      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
        <Github size={18} />
      </a>
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
