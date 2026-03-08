import { ArrowDown, Github, Linkedin, Mail, ArrowRight, GraduationCap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
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
  { src: chadiLounge, alt: "Chadi relaxing in a lounge" },
  { src: chadiLaptop, alt: "Chadi working on his laptop" },
  { src: websummitQatar, alt: "Chadi at Web Summit Qatar" },
  { src: websummitFood, alt: "Chadi at Web Summit Food Summit" },
  { src: bonialPortrait, alt: "Chadi at Bonial office" },
  { src: bonialIncident, alt: "Chadi in an incident call at Bonial" },
];

const useTypewriter = (words: string[], typingSpeed = 70, deletingSpeed = 35, pauseTime = 1800) => {
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
  const { t } = useLang();
  const typedRole = useTypewriter(roles);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center" aria-label="Hero">
      {/* Background image carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentImage].src}
              alt={heroImages[currentImage].alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-background/75 dark:bg-background/80 backdrop-blur-[2px]" />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Ambient glows */}
      <motion.div
        animate={{ opacity: [0.06, 0.15, 0.06], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[10%] w-[600px] h-[600px] rounded-full blur-[180px]"
        style={{ background: "hsl(152 68% 46% / 0.2)" }}
      />
      <motion.div
        animate={{ opacity: [0.04, 0.1, 0.04] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] rounded-full blur-[180px]"
        style={{ background: "hsl(172 66% 50% / 0.15)" }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 dot-pattern opacity-20" />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-primary/20 rounded-full"
          style={{ left: `${15 + i * 14}%`, top: `${10 + (i % 3) * 28}%` }}
          animate={{ y: [0, -40, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 4 + i * 0.8, repeat: Infinity, delay: i * 0.7 }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center max-w-6xl mx-auto">
          {/* Text content */}
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-mono text-xs tracking-wider uppercase">
                {t.availableForHire}
              </span>
            </motion.div>

            <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-6">
              Chadi
              <br />
              <span className="text-gradient">Troudi</span>
              <span className="text-primary">.</span>
            </motion.h1>

            {/* Typewriter role */}
            <motion.div variants={item} className="mb-8">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-primary" />
                <span className="text-lg md:text-xl font-mono text-primary font-semibold">
                  {typedRole}
                  <span className="animate-pulse text-primary">|</span>
                </span>
              </div>
            </motion.div>

            <motion.p variants={item} className="text-muted-foreground max-w-xl text-lg leading-relaxed mb-10">
              {t.heroDesc}{" "}
              <span className="text-foreground font-medium">{t.javaSpring}</span>,{" "}
              <span className="text-foreground font-medium">{t.react}</span>{t.andMicroservices}{" "}
              <span className="text-foreground font-medium">{t.cleanArch}</span>.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap items-center gap-3 mb-6">
              <a
                href="#projects"
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground font-semibold text-sm px-8 py-4 rounded-full hover:shadow-[0_8px_30px_-4px_hsl(152_68%_46%/0.5)] transition-all duration-300"
              >
                {t.viewMyWork}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-border text-foreground font-medium text-sm px-8 py-4 rounded-full hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 backdrop-blur-sm"
              >
                {t.getInTouch}
              </a>
            </motion.div>

            {/* Java Tutorials CTA */}
            <motion.div variants={item}>
              <a
                href="#tutoring"
                className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/15 hover:via-primary/10 hover:border-primary/40 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-colors">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{t.joinBootcamp}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                      {t.newBadge}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{t.bootcampDesc}</span>
                </div>
                <ArrowRight size={14} className="text-primary group-hover:translate-x-1 transition-transform ml-auto" />
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-4 h-4 text-primary/60" />
                </motion.div>
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={item} className="flex items-center gap-8 mt-12">
              {[
                { value: "5+", label: t.years },
                { value: "6", label: t.companies },
                { value: "10+", label: t.projectsCount },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-8">
                  <div>
                    <p className="text-3xl font-bold text-gradient">{stat.value}</p>
                    <p className="text-muted-foreground text-xs font-mono mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                  {i < 2 && <div className="w-px h-10 bg-border/50" />}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Profile photo with carousel thumbnails */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Glow behind photo */}
              <div className="absolute -inset-8 bg-primary/8 rounded-[40px] blur-2xl" />

              {/* Main image carousel */}
              <div className="relative w-[380px] h-[480px] rounded-3xl overflow-hidden ring-1 ring-border/50 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={heroImages[currentImage].src}
                    alt={heroImages[currentImage].alt}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full object-cover object-top"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                {/* Name overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-foreground font-bold text-lg">Chadi Troudi</p>
                  <p className="text-muted-foreground text-sm">{t.seniorEngineer}</p>
                </div>

                {/* Image counter */}
                <div className="absolute top-4 right-4 bg-background/60 backdrop-blur-md rounded-full px-3 py-1 text-xs font-mono text-foreground/80">
                  {currentImage + 1}/{heroImages.length}
                </div>
              </div>

              {/* Thumbnail dots */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === currentImage
                        ? "w-8 h-2 bg-primary"
                        : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>

              {/* Floating accent card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-10 glass rounded-2xl px-5 py-4 shadow-xl border border-border/30"
              >
                <p className="text-xs font-mono text-muted-foreground mb-1">{t.currentlyAt}</p>
                <p className="text-sm font-semibold text-foreground">Bonial Germany 🇩🇪</p>
              </motion.div>

              {/* Floating tutoring card */}
              <motion.a
                href="#tutoring"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -top-4 -right-6 glass rounded-2xl px-4 py-3 shadow-xl border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Java Bootcamp</p>
                    <p className="text-[10px] text-primary font-medium">3 spots left →</p>
                  </div>
                </div>
              </motion.a>

              {/* Decorative borders */}
              <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl border border-primary/10 -z-10" />
              <div className="absolute -top-8 -right-8 w-full h-full rounded-3xl border border-primary/5 -z-20" />
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
