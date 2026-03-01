import { ArrowDown, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden" aria-label="Hero">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(160 84% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 50%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated glow blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary rounded-full blur-[160px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent rounded-full blur-[140px] pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-3xl"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={item} className="flex items-center gap-2 mb-6">
            <div className="h-px w-8 bg-primary" />
            <p className="text-primary font-mono text-sm tracking-wider">
              Hello, my name is
            </p>
          </motion.div>

          <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
            Chadi Troudi<span className="text-gradient">.</span>
          </motion.h1>

          <motion.h2 variants={item} className="text-2xl md:text-4xl lg:text-5xl font-bold text-muted-foreground mb-8">
            Full-Stack Engineer
          </motion.h2>

          <motion.p variants={item} className="text-muted-foreground max-w-xl text-lg leading-relaxed mb-4">
            Building retail tech at <span className="text-foreground font-medium">Bonial Germany</span> with 
            React/TypeScript & Java Spring Boot. I've shipped products across{" "}
            <span className="text-foreground">banking, health, mobility, e-commerce & education</span> — 
            focused on clean architecture and measurable impact.
          </motion.p>

          <motion.div variants={item} className="flex items-center gap-2 text-muted-foreground text-sm font-mono mb-10">
            <MapPin size={14} className="text-primary" />
            Tunis, Tunisia · Open to opportunities
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-sm px-6 py-3 rounded-lg hover:shadow-[0_0_30px_-5px_hsl(160_84%_50%/0.5)] transition-all duration-300"
            >
              View Projects
              <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-border text-foreground font-mono text-sm px-6 py-3 rounded-lg hover:border-primary/50 hover:text-primary transition-all duration-200"
            >
              Get In Touch
            </a>
            <div className="flex items-center gap-3 ml-2">
              <SocialLink href="https://www.linkedin.com/in/chaditroudi" icon={<Linkedin size={18} />} label="LinkedIn" />
              <SocialLink href="https://github.com/chaditroudi" icon={<Github size={18} />} label="GitHub" />
              <SocialLink href="mailto:chadi.troudi@example.com" icon={<Mail size={18} />} label="Email" />
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div variants={item} className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-border">
            {[
              { value: "5+", label: "Years Experience" },
              { value: "6+", label: "Companies" },
              { value: "10+", label: "Projects Shipped" },
              { value: "1.3K+", label: "LinkedIn Followers" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                <p className="text-muted-foreground text-xs font-mono mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  );
};

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-muted-foreground hover:text-primary hover:-translate-y-0.5 transition-all duration-200 p-1"
  >
    {icon}
  </a>
);

export default HeroSection;
