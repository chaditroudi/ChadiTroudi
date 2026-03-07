import { ArrowDown, Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import profileImg from "@/assets/profile.jpg";

const roles = [
  "Full-Stack Developer",
  "Java & Spring Boot Expert",
  "React Specialist",
  "API Architect",
];

const useTypewriter = (words: string[], typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentWord = words[wordIndex];
    if (!isDeleting) {
      setText(currentWord.slice(0, text.length + 1));
      if (text.length + 1 === currentWord.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
        return;
      }
    } else {
      setText(currentWord.slice(0, text.length - 1));
      if (text.length - 1 === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        return;
      }
    }
  }, [text, wordIndex, isDeleting, words, pauseTime]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  return text;
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const HeroSection = () => {
  const typedRole = useTypewriter(roles);

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center" aria-label="Hero">
      {/* Abstract background shapes */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-background" />
        <motion.div
          animate={{ opacity: [0.03, 0.07, 0.03], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ background: "hsl(152 68% 46% / 0.15)" }}
        />
        <motion.div
          animate={{ opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full blur-[150px]"
          style={{ background: "hsl(172 66% 50% / 0.1)" }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 dot-pattern opacity-40" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-20 items-center max-w-6xl mx-auto">
          {/* Text content */}
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-mono text-xs tracking-wider uppercase">
                {typedRole}
                <span className="animate-pulse ml-0.5">|</span>
              </span>
            </motion.div>

            <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-8">
              Chadi
              <br />
              <span className="text-gradient">Troudi</span>
              <span className="text-primary">.</span>
            </motion.h1>

            <motion.p variants={item} className="text-muted-foreground max-w-xl text-lg leading-relaxed mb-10">
              Full-Stack Developer specializing in scalable web applications using{" "}
              <span className="text-foreground font-medium">Java Spring Boot</span>,{" "}
              <span className="text-foreground font-medium">React</span>, and microservices.
              Building secure APIs and delivering enterprise solutions with{" "}
              <span className="text-foreground font-medium">clean architecture</span>.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap items-center gap-4 mb-14">
              <a
                href="#projects"
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground font-semibold text-sm px-8 py-4 rounded-full hover:shadow-[0_8px_30px_-4px_hsl(152_68%_46%/0.5)] transition-all duration-300"
              >
                View My Work
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-border text-foreground font-medium text-sm px-8 py-4 rounded-full hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
              >
                Get In Touch
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={item} className="flex items-center gap-8">
              {[
                { value: "5+", label: "Years" },
                { value: "6", label: "Companies" },
                { value: "10+", label: "Projects" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-8">
                  <div>
                    <p className="text-3xl font-bold text-gradient">{stat.value}</p>
                    <p className="text-muted-foreground text-xs font-mono mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                  {i < 2 && <div className="w-px h-10 bg-border" />}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Profile photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Main image */}
              <div className="w-[340px] h-[440px] rounded-3xl overflow-hidden relative ring-1 ring-border/50">
                <img
                  src={profileImg}
                  alt="Chadi Troudi"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
              
              {/* Floating accent card */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-8 glass rounded-2xl px-5 py-4 shadow-xl"
              >
                <p className="text-xs font-mono text-muted-foreground mb-1">Currently at</p>
                <p className="text-sm font-semibold text-foreground">Bonial Germany 🇩🇪</p>
              </motion.div>

              {/* Decorative border */}
              <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl border border-primary/15 -z-10" />
            </div>

            {/* Social links */}
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {[
                { href: "https://www.linkedin.com/in/chaditroudi", icon: <Linkedin size={16} /> },
                { href: "https://github.com/chaditroudi", icon: <Github size={16} /> },
                { href: "https://github.com/Chadi7781", icon: <Github size={16} /> },
                { href: "mailto:chadi.troudi@example.com", icon: <Mail size={16} /> },
              ].map((s, i) => (
                <motion.a
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/20 flex justify-center pt-2.5">
          <motion.div
            animate={{ opacity: [1, 0.3, 1], y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
