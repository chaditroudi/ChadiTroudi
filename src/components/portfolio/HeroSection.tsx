import { ArrowDown, Github, Linkedin, Mail, ArrowRight, GraduationCap, Sparkles, ChevronRight, Download } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useLang } from "@/hooks/use-lang";
import chadiLounge from "@/assets/chadi-lounge.jpeg";
import websummitQatar from "@/assets/websummit-qatar.jpg";
import chadiLaptop from "@/assets/chadi-laptop.jpg";
import websummitFood from "@/assets/websummit-food.jpeg";
import bonialPortrait from "@/assets/bonial-portrait.jpeg";
import bonialIncident from "@/assets/bonial-incident.jpeg";

const roles = [
  "Full-Stack Engineer",
  "Java & Spring Boot Expert",
  "React & TypeScript Specialist",
  "AWS Cloud Architect",
  "API & Microservices Designer",
  "Java Tutor & Mentor",
  "Clean Architecture Advocate",
];

const heroImages = [
  { src: bonialPortrait, alt: "Chadi at Bonial office" },
  { src: chadiLaptop, alt: "Chadi working on his laptop" },
  { src: websummitQatar, alt: "Chadi at Web Summit Qatar" },
  { src: chadiLounge, alt: "Chadi relaxing in a lounge" },
  { src: websummitFood, alt: "Chadi at Web Summit Food Summit" },
  { src: bonialIncident, alt: "Chadi in an incident call at Bonial" },
];

const useTypewriter = (words: string[], typingSpeed = 65, deletingSpeed = 30, pauseTime = 2000) => {
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

const techStack = [
  "Java", "Spring Boot", "React", "TypeScript", "AWS", "Docker", "PostgreSQL", "Kubernetes"
];

const HeroSection = () => {
  const { t } = useLang();
  const typedRole = useTypewriter(roles);
  const [currentImage, setCurrentImage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen relative overflow-hidden flex items-center" aria-label="Hero">
      {/* Parallax background carousel */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentImage].src}
              alt={heroImages[currentImage].alt}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-background/80 dark:bg-background/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        {/* Film grain texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
      </motion.div>

      {/* Dramatic light streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-[30%] -left-[10%] w-[70%] h-[140%] opacity-[0.04]"
          style={{
            background: "conic-gradient(from 200deg at 50% 50%, hsl(var(--primary)) 0deg, transparent 60deg, transparent 300deg, hsl(var(--primary)) 360deg)",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-[40%] -right-[20%] w-[60%] h-[120%] opacity-[0.03]"
          style={{
            background: "conic-gradient(from 20deg at 50% 50%, hsl(152 68% 46%) 0deg, transparent 45deg, transparent 315deg, hsl(152 68% 46%) 360deg)",
          }}
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating orbs */}
      {[
        { size: 500, x: "8%", y: "5%", color: "hsl(var(--primary))", opacity: 0.08, dur: 12 },
        { size: 350, x: "75%", y: "60%", color: "hsl(172 66% 50%)", opacity: 0.06, dur: 15 },
        { size: 200, x: "50%", y: "80%", color: "hsl(var(--primary))", opacity: 0.05, dur: 10 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size, height: orb.size, left: orb.x, top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
          animate={{ opacity: [orb.opacity * 0.5, orb.opacity, orb.opacity * 0.5], scale: [1, 1.1, 1] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}
        />
      ))}

      {/* Content */}
      <motion.div
        className="container mx-auto px-6 relative z-10"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="grid lg:grid-cols-[1fr_440px] gap-16 items-center max-w-7xl mx-auto">
          {/* Left — Text */}
          <div>
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md mb-8"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="text-primary font-mono text-xs tracking-widest uppercase">
                {t.availableForHire}
              </span>
            </motion.div>

            {/* Name — massive display */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold leading-[0.85] tracking-[-0.04em] mb-2">
                <span className="block text-foreground">Chadi</span>
                <span className="block">
                  <span className="text-gradient bg-clip-text">Troudi</span>
                  <span className="text-primary">.</span>
                </span>
              </h1>
            </motion.div>

            {/* Typewriter role */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-6 mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-[2px] bg-gradient-to-r from-primary to-primary/0" />
                <span className="text-lg md:text-xl font-mono text-primary font-semibold tracking-tight">
                  {typedRole}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="text-primary ml-0.5"
                  >
                    |
                  </motion.span>
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-muted-foreground max-w-lg text-base md:text-lg leading-relaxed mb-10"
            >
              {t.heroDesc}{" "}
              <span className="text-foreground font-medium">{t.javaSpring}</span>,{" "}
              <span className="text-foreground font-medium">{t.react}</span>{t.andMicroservices}{" "}
              <span className="text-foreground font-medium">{t.cleanArch}</span>.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-3 bg-primary text-primary-foreground font-semibold text-sm px-8 py-4 rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_-8px_hsl(var(--primary)/0.6)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t.viewMyWork}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-border/60 text-foreground font-medium text-sm px-8 py-4 rounded-full hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 backdrop-blur-sm"
              >
                {t.getInTouch}
              </a>
              <a
                href="/ChadiTroudiCv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
              >
                <Download size={14} />
                Resume
              </a>
            </motion.div>

            {/* Bootcamp CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <a
                href="#tutoring"
                className="group relative inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-primary/20 bg-primary/[0.04] hover:bg-primary/10 hover:border-primary/35 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{t.joinBootcamp}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider animate-pulse">
                      {t.newBadge}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{t.bootcampDesc}</span>
                </div>
                <ChevronRight size={14} className="text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all ml-1" />
              </a>
            </motion.div>

            {/* Tech stack marquee */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-10 flex items-center gap-3 overflow-hidden"
            >
              <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest shrink-0">Stack</span>
              <div className="w-px h-4 bg-border/40" />
              <div className="flex gap-2 overflow-hidden">
                {techStack.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + i * 0.08 }}
                    className="px-3 py-1 rounded-full text-[11px] font-mono text-muted-foreground bg-foreground/[0.04] border border-border/30 whitespace-nowrap"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="flex items-center gap-8 mt-10"
            >
              {[
                { value: "5+", label: t.years },
                { value: "6", label: t.companies },
                { value: "10+", label: t.projectsCount },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-8">
                  <div>
                    <p className="text-3xl md:text-4xl font-bold text-gradient tabular-nums">{stat.value}</p>
                    <p className="text-muted-foreground text-[10px] font-mono mt-1.5 uppercase tracking-[0.15em]">{stat.label}</p>
                  </div>
                  {i < 2 && <div className="w-px h-10 bg-border/30" />}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Photo card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block relative"
          >
            <div className="relative group">
              {/* Glow */}
              <motion.div
                className="absolute -inset-6 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.1), transparent 70%)" }}
              />

              {/* Main image */}
              <div className="relative w-[400px] h-[500px] rounded-[2rem] overflow-hidden ring-1 ring-white/[0.08] shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={heroImages[currentImage].src}
                    alt={heroImages[currentImage].alt}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                  />
                </AnimatePresence>

                {/* Gradient overlays on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />

                {/* Bottom info on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-foreground font-bold text-lg tracking-tight">Chadi Troudi</p>
                      <p className="text-muted-foreground text-sm">{t.seniorEngineer}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-md border border-white/[0.06]">
                      <span className="text-xs font-mono text-muted-foreground tabular-nums">{currentImage + 1}/{heroImages.length}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 flex gap-1.5">
                    {heroImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className="relative h-1 flex-1 rounded-full overflow-hidden bg-white/10"
                        aria-label={`Go to image ${i + 1}`}
                      >
                        {i === currentImage && (
                          <motion.div
                            className="absolute inset-0 bg-primary rounded-full origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 5, ease: "linear" }}
                          />
                        )}
                        {i < currentImage && (
                          <div className="absolute inset-0 bg-primary/50 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scan line effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground) / 0.01) 2px, hsl(var(--foreground) / 0.01) 4px)",
                  }}
                />
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -left-8 px-5 py-3.5 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/40 shadow-xl"
              >
                <p className="text-[10px] font-mono text-muted-foreground mb-0.5 uppercase tracking-widest">{t.currentlyAt}</p>
                <p className="text-sm font-semibold text-foreground">Bonial Germany 🇩🇪</p>
              </motion.div>

              <motion.a
                href="#tutoring"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -top-4 -right-6 px-4 py-3 rounded-2xl bg-card/90 backdrop-blur-xl border border-primary/20 hover:border-primary/40 shadow-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Tech Bootcamps</p>
                    <p className="text-[10px] text-primary font-medium">4 tracks available →</p>
                  </div>
                </div>
              </motion.a>

              {/* Decorative rings */}
              <div className="absolute -top-3 -right-3 w-full h-full rounded-[2rem] border border-primary/8 -z-10" />
              <div className="absolute -top-6 -right-6 w-full h-full rounded-[2rem] border border-primary/4 -z-20" />
            </div>

            {/* Social links — vertical */}
            <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-2.5">
              {[
                { href: "https://www.linkedin.com/in/chaditroudi", icon: <Linkedin size={15} />, label: "LinkedIn" },
                { href: "https://github.com/chaditroudi", icon: <Github size={15} />, label: "GitHub" },
                { href: "https://github.com/Chadi7781", icon: <Github size={15} />, label: "GitHub 2" },
                { href: "mailto:chadi.troudi@example.com", icon: <Mail size={15} />, label: "Email" },
              ].map((s, i) => (
                <motion.a
                  key={i}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-card/60 backdrop-blur-md border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-muted-foreground/20 flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.2, 1], y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1.5 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
