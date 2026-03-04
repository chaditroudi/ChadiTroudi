import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import profileImg from "@/assets/profile.jpg";
import bannerImg from "@/assets/banner.jpeg";

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
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const HeroSection = () => {
  const typedRole = useTypewriter(roles);

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center" aria-label="Hero">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={bannerImg}
          alt=""
          className="w-full h-full object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      {/* Warm glow */}
      <motion.div
        animate={{ opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary rounded-full blur-[200px] pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-center max-w-6xl mx-auto">
          {/* Text content */}
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.p variants={item} className="text-primary font-mono text-sm tracking-[0.2em] uppercase mb-6 h-6">
              {typedRole}
              <span className="animate-pulse ml-0.5 text-primary">|</span>
            </motion.p>

            <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.95] tracking-tight mb-6">
              Chadi
              <br />
              <span className="text-gradient">Troudi</span>
              <span className="text-primary">.</span>
            </motion.h1>

            <motion.p variants={item} className="text-muted-foreground max-w-lg text-lg leading-relaxed mb-8">
              Full-Stack Developer specializing in scalable web applications using{" "}
              <span className="text-foreground font-medium">Java (Spring Boot)</span>,{" "}
              <span className="text-foreground font-medium">React</span>, and microservices.
              Experienced in building secure RESTful APIs, optimizing performance, and delivering
              reliable enterprise solutions in Agile environments. Focused on{" "}
              <span className="text-foreground">clean architecture and maintainable code</span>.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap items-center gap-4 mb-12">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-7 py-3.5 rounded-full hover:shadow-[0_0_40px_-5px_hsl(45_100%_60%/0.5)] transition-all duration-300"
              >
                View My Work
                <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-border text-foreground font-medium text-sm px-7 py-3.5 rounded-full hover:border-primary/50 hover:text-primary transition-all duration-300"
              >
                Get In Touch
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="flex flex-wrap gap-10">
              {[
                { value: "5+", label: "Years" },
                { value: "6", label: "Companies" },
                { value: "10+", label: "Projects" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-black text-gradient">{stat.value}</p>
                  <p className="text-muted-foreground text-xs font-mono mt-1 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Profile photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block relative"
          >
            <div className="w-[340px] h-[420px] rounded-2xl overflow-hidden relative">
              <img
                src={profileImg}
                alt="Chadi Troudi"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            {/* Decorative frame */}
            <div className="absolute -top-3 -right-3 w-full h-full border-2 border-primary/20 rounded-2xl -z-10" />
            <div className="absolute -bottom-3 -left-3 w-full h-full border border-primary/10 rounded-2xl -z-10" />
            
            {/* Social links floating */}
            <div className="absolute -left-14 top-1/2 -translate-y-1/2 flex flex-col gap-4">
              {[
                { href: "https://www.linkedin.com/in/chaditroudi", icon: <Linkedin size={18} /> },
                { href: "https://github.com/chaditroudi", icon: <Github size={18} />  },
                Ex-Github Account{ href: "https://github.com/Chadi7781", icon: <Github size={18} />  },
                { href: "mailto:chadi.troudi@example.com", icon: <Mail size={18} /> },
              ].map((s, i) => (
                <motion.a
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-9 rounded-full border-2 border-muted-foreground/20 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
