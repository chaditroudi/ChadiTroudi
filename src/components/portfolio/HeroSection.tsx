import { ArrowRight, Github, Linkedin, Mail, GraduationCap, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/hooks/use-lang";
import chadiLounge from "@/assets/chadi-lounge.jpeg";
import websummitQatar from "@/assets/websummit-qatar.jpg";
import chadiLaptop from "@/assets/chadi-laptop.jpg";
import websummitFood from "@/assets/websummit-food.jpeg";
import bonialPortrait from "@/assets/bonial-portrait.jpeg";
import bonialIncident from "@/assets/bonial-incident.jpeg";

const heroImages = [
  { src: bonialPortrait, alt: "Chadi at Bonial office" },
  { src: chadiLaptop, alt: "Chadi working on his laptop" },
  { src: websummitQatar, alt: "Chadi at Web Summit Qatar" },
  { src: chadiLounge, alt: "Chadi relaxing" },
  { src: websummitFood, alt: "Chadi at Web Summit" },
  { src: bonialIncident, alt: "Chadi in incident call" },
];

const roles = [
  "Full-Stack Engineer",
  "Java & Spring Boot Expert",
  "React & TypeScript Specialist",
  "AWS Cloud Architect",
  "API & Microservices Designer",
  "Java Tutor & Mentor",
];

const useTypewriter = (words: string[], typingSpeed = 70, deletingSpeed = 35, pauseTime = 2000) => {
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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const HeroSection = () => {
  const { t } = useLang();
  const typedRole = useTypewriter(roles);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen relative flex items-center overflow-hidden" aria-label="Hero">
      {/* Simple clean background */}
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px]"
        style={{ background: "hsl(var(--primary))" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03] blur-[100px]"
        style={{ background: "hsl(152 68% 46%)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20 max-w-6xl mx-auto py-20">
          {/* Left — Text content */}
          <div className="flex-1 max-w-xl">
            {/* Status */}
            <motion.div {...fadeUp(0.1)} className="flex items-center gap-2.5 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-primary font-mono text-xs tracking-widest uppercase">
                {t.availableForHire}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1 {...fadeUp(0.2)} className="text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight mb-6">
              Chadi
              <br />
              <span className="text-gradient">Troudi</span>
              <span className="text-primary">.</span>
            </motion.h1>

            {/* Role */}
            <motion.div {...fadeUp(0.35)} className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-primary/50" />
              <span className="text-lg font-mono text-primary font-medium">
                {typedRole}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="text-primary ml-0.5"
                >|</motion.span>
              </span>
            </motion.div>

            {/* Description */}
            <motion.p {...fadeUp(0.45)} className="text-muted-foreground text-base leading-relaxed mb-10">
              {t.heroDesc}{" "}
              <span className="text-foreground font-medium">{t.javaSpring}</span>,{" "}
              <span className="text-foreground font-medium">{t.react}</span>{t.andMicroservices}{" "}
              <span className="text-foreground font-medium">{t.cleanArch}</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.55)} className="flex flex-wrap items-center gap-3 mb-8">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
              >
                {t.viewMyWork}
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-border text-foreground font-medium text-sm px-7 py-3.5 rounded-full hover:border-primary/30 hover:bg-accent/50 transition-all"
              >
                {t.getInTouch}
              </a>
              <a
                href="/ChadiTroudiCv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                <Download size={14} />
                Resume
              </a>
            </motion.div>

            {/* Bootcamp link */}
            <motion.div {...fadeUp(0.65)}>
              <a
                href="#tutoring"
                className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-accent/30 transition-all"
              >
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground font-medium">{t.joinBootcamp}</span>
                <span className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase">
                  {t.newBadge}
                </span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(0.75)} className="flex items-center gap-8 mt-12">
              {[
                { value: "5+", label: t.years },
                { value: "6", label: t.companies },
                { value: "10+", label: t.projectsCount },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-8">
                  <div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-muted-foreground text-xs font-mono mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                  {i < 2 && <div className="w-px h-8 bg-border" />}
                </div>
              ))}
            </motion.div>

            {/* Socials — inline */}
            <motion.div {...fadeUp(0.85)} className="flex items-center gap-2 mt-8">
              {[
                { href: "https://www.linkedin.com/in/chaditroudi", icon: <Linkedin size={16} />, label: "LinkedIn" },
                { href: "https://github.com/chaditroudi", icon: <Github size={16} />, label: "GitHub" },
                { href: "mailto:chadi.troudi@example.com", icon: <Mail size={16} />, label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right — Single clean profile photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block shrink-0"
          >
            <div className="relative">
              <div className="w-[360px] h-[440px] rounded-3xl overflow-hidden ring-1 ring-border/50">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={heroImages[currentImage].src}
                    alt={heroImages[currentImage].alt}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

                {/* Name + counter */}
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <p className="text-foreground font-semibold">Chadi Troudi</p>
                    <p className="text-muted-foreground text-sm">{t.seniorEngineer}</p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground bg-background/40 backdrop-blur-sm px-2 py-1 rounded-full">
                    {currentImage + 1}/{heroImages.length}
                  </span>
                </div>

                {/* Progress dots */}
                <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-5 pb-2">
                  {heroImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i === currentImage ? "bg-primary" : "bg-white/20"}`}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Single floating card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-6 px-4 py-3 rounded-xl bg-card border border-border/60 shadow-lg"
              >
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{t.currentlyAt}</p>
                <p className="text-sm font-semibold text-foreground">Bonial Germany 🇩🇪</p>
              </motion.div>

              {/* Subtle decorative ring */}
              <div className="absolute -top-3 -right-3 w-full h-full rounded-3xl border border-primary/8 -z-10" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
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
