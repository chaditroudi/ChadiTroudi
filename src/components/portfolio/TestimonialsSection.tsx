import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
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
  },
  {
    name: "Marco Hoffmann",
    role: "Product Manager, Bonial",
    content:
      "Working with Chadi has been a game-changer. His ability to bridge frontend and backend seamlessly, combined with his proactive approach to performance optimization, made him an invaluable team member.",
    rating: 5,
    avatar: "MH",
  },
  {
    name: "Amina Ben Ali",
    role: "CEO, Yanyi",
    content:
      "Chadi represented our team brilliantly at Web Summit Qatar. His technical expertise in AI integration and microservices architecture helped us secure key partnerships and demonstrate our platform's capabilities.",
    rating: 5,
    avatar: "AB",
  },
  {
    name: "Thomas Weber",
    role: "Engineering Lead, TechRetail GmbH",
    content:
      "Chadi's migration of our legacy JS codebase to TypeScript was flawless. He built a reusable component library that our entire team now relies on. His attention to clean architecture is remarkable.",
    rating: 5,
    avatar: "TW",
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + testimonials.length) % testimonials.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 line-pattern pointer-events-none" />
      <div className="section-divider mb-28" />
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <AnimatedSection>
          <SectionHeading number="05" title="Client Reviews" />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="relative">
            {/* Main testimonial card */}
            <div className="glass rounded-3xl p-8 md:p-12 min-h-[320px] flex flex-col justify-between relative overflow-hidden">
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 text-primary/10" size={80} />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-6"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-foreground/90 text-lg md:text-xl leading-relaxed font-light max-w-3xl">
                    "{testimonials[current].content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                      {testimonials[current].avatar}
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">
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
              <div className="flex items-center justify-between mt-8">
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > current ? 1 : -1);
                        setCurrent(i);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === current
                          ? "w-8 bg-primary"
                          : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full glass hover:border-primary/30 transition-colors"
                  >
                    <ChevronLeft size={18} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => navigate(1)}
                    className="p-2 rounded-full glass hover:border-primary/30 transition-colors"
                  >
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TestimonialsSection;
