import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { SectionHeading } from "./AboutSection";
import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "CTO, FinTech Solutions",
    content:
      "Chadi delivered an exceptional banking dashboard that exceeded our expectations. His deep understanding of Spring Boot and React allowed us to ship 3 months ahead of schedule. The code quality and architecture were outstanding.",
    rating: 5,
    avatar: "SM",
    project: "Banking Dashboard",
  },
  {
    name: "Marco Hoffmann",
    role: "Product Manager, Bonial",
    content:
      "Working with Chadi has been a game-changer. His ability to bridge frontend and backend seamlessly, combined with his proactive approach to performance optimization, made him an invaluable team member.",
    rating: 5,
    avatar: "MH",
    project: "Retail Platform",
  },
  {
    name: "Amina Ben Ali",
    role: "CEO, Yanyi",
    content:
      "Chadi represented our team brilliantly at Web Summit Qatar. His technical expertise in AI integration and microservices architecture helped us secure key partnerships and demonstrate our platform's capabilities.",
    rating: 5,
    avatar: "AB",
    project: "AI Platform",
  },
  {
    name: "Thomas Weber",
    role: "Engineering Lead, TechRetail GmbH",
    content:
      "Chadi's migration of our legacy JS codebase to TypeScript was flawless. He built a reusable component library that our entire team now relies on. His attention to clean architecture is remarkable.",
    rating: 5,
    avatar: "TW",
    project: "Component Library",
  },
  {
    name: "Leila Gharbi",
    role: "Founder, EduTech Tunisia",
    content:
      "Chadi built our entire e-learning platform from scratch — authentication, real-time chat, video streaming, and a custom admin panel. He moved fast without sacrificing quality. Highly recommended for any startup.",
    rating: 5,
    avatar: "LG",
    project: "E-Learning Platform",
  },
  {
    name: "David Chen",
    role: "VP Engineering, LogiFlow",
    content:
      "We hired Chadi to redesign our supply chain API layer. He introduced event-driven architecture with Kafka and reduced our response times by 60%. His backend skills are truly world-class.",
    rating: 5,
    avatar: "DC",
    project: "Supply Chain API",
  },
];

const ReviewCard = ({
  testimonial,
  isActive,
  onClick,
}: {
  testimonial: (typeof testimonials)[0];
  isActive: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ y: -4 }}
    className={`text-left w-full p-5 rounded-2xl transition-all duration-500 border ${
      isActive
        ? "glass border-primary/30 glow"
        : "bg-card/50 border-border/50 hover:border-primary/20"
    }`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary border border-primary/20"
        }`}
      >
        {testimonial.avatar}
      </div>
      <div className="min-w-0">
        <p className="text-foreground font-semibold text-sm truncate">
          {testimonial.name}
        </p>
        <p className="text-muted-foreground text-xs truncate">
          {testimonial.role}
        </p>
      </div>
    </div>
    <div className="flex gap-0.5 mb-2">
      {Array.from({ length: testimonial.rating }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={`transition-colors duration-300 ${
            isActive
              ? "fill-primary text-primary"
              : "fill-muted-foreground/40 text-muted-foreground/40"
          }`}
        />
      ))}
    </div>
    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
      {testimonial.content}
    </p>
  </motion.button>
);

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  useEffect(() => {
    if (isPaused || !isInView) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, isInView]);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent(
      (prev) => (prev + dir + testimonials.length) % testimonials.length
    );
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const selectTestimonial = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0, scale: 0.95 }),
  };

  return (
    <section ref={sectionRef} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 line-pattern pointer-events-none" />
      <div className="section-divider mb-28" />
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-14">
            <SectionHeading number="05" title="Client Reviews" />
            <div className="hidden md:flex items-center gap-2 text-muted-foreground text-sm">
              <Sparkles size={14} className="text-primary" />
              <span>{testimonials.length} reviews</span>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main featured review */}
          <AnimatedSection delay={0.1}>
            <div
              className="glass rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col justify-between relative overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Decorative elements */}
              <Quote className="absolute top-6 right-6 text-primary/10" size={80} />
              <motion.div
                animate={{ opacity: [0.03, 0.06, 0.03] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-primary rounded-full blur-[120px] pointer-events-none"
              />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-6 relative z-10"
                >
                  {/* Project badge */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {testimonials[current].project}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: testimonials[current].rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="fill-primary text-primary"
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <blockquote className="text-foreground/90 text-lg md:text-xl lg:text-2xl leading-relaxed font-light max-w-3xl">
                    &ldquo;{testimonials[current].content}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-base">
                      {testimonials[current].avatar}
                    </div>
                    <div>
                      <p className="text-foreground font-bold text-lg">
                        {testimonials[current].name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {testimonials[current].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 relative z-10">
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => selectTestimonial(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === current
                          ? "w-10 bg-primary"
                          : "w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(-1)}
                    className="p-2.5 rounded-full glass hover:border-primary/30 transition-all duration-300 hover:glow"
                  >
                    <ChevronLeft size={18} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => navigate(1)}
                    className="p-2.5 rounded-full glass hover:border-primary/30 transition-all duration-300 hover:glow"
                  >
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Side review cards */}
          <AnimatedSection delay={0.2} direction="right">
            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {testimonials.map((t, i) => (
                <div key={i} className="min-w-[260px] lg:min-w-0">
                  <ReviewCard
                    testimonial={t}
                    isActive={i === current}
                    onClick={() => selectTestimonial(i)}
                  />
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Summary stats */}
        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-3 gap-6 mt-12">
            {[
              { value: "100%", label: "Satisfaction Rate" },
              { value: "5.0", label: "Average Rating" },
              { value: "6+", label: "Happy Clients" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center py-6 rounded-2xl glass"
              >
                <p className="text-2xl md:text-3xl font-black text-gradient">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-xs font-mono mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TestimonialsSection;
