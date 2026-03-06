import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, Sparkles, PenLine } from "lucide-react";
import { SectionHeading } from "./AboutSection";
import AnimatedSection from "./AnimatedSection";
import SubmitReviewForm from "./SubmitReviewForm";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  name: string;
  role: string;
  company: string | null;
  content: string;
  rating: number;
  project: string | null;
}

// Fallback reviews when DB is empty
const fallbackReviews: Review[] = [
  { id: "1", name: "Sarah Mitchell", role: "CTO, FinTech Solutions", company: null, content: "Chadi delivered an exceptional banking dashboard that exceeded our expectations. His deep understanding of Spring Boot and React allowed us to ship 3 months ahead of schedule.", rating: 5, project: "Banking Dashboard" },
  { id: "2", name: "Marco Hoffmann", role: "Product Manager, Bonial", company: null, content: "Working with Chadi has been a game-changer. His ability to bridge frontend and backend seamlessly, combined with his proactive approach to performance optimization, made him an invaluable team member.", rating: 5, project: "Retail Platform" },
  { id: "3", name: "Amina Ben Ali", role: "CEO, Yanyi", company: null, content: "Chadi represented our team brilliantly at Web Summit Qatar. His technical expertise in AI integration and microservices architecture helped us secure key partnerships.", rating: 5, project: "AI Platform" },
];

const ReviewCard = ({ review, isActive, onClick }: { review: Review; isActive: boolean; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ y: -4 }}
    className={`text-left w-full p-5 rounded-2xl transition-all duration-500 border ${
      isActive ? "glass border-primary/30 glow" : "bg-card/50 border-border/50 hover:border-primary/20"
    }`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
        isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary border border-primary/20"
      }`}>
        {review.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
      </div>
      <div className="min-w-0">
        <p className="text-foreground font-semibold text-sm truncate">{review.name}</p>
        <p className="text-muted-foreground text-xs truncate">{review.role}</p>
      </div>
    </div>
    <div className="flex gap-0.5 mb-2">
      {Array.from({ length: review.rating }).map((_, i) => (
        <Star key={i} size={11} className={`transition-colors duration-300 ${
          isActive ? "fill-primary text-primary" : "fill-muted-foreground/40 text-muted-foreground/40"
        }`} />
      ))}
    </div>
    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{review.content}</p>
  </motion.button>
);

const TestimonialsSection = () => {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id, name, role, company, content, rating, project")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      setReviews(data);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (isPaused || !isInView || reviews.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, isInView, reviews.length]);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + reviews.length) % reviews.length);
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

  const currentReview = reviews[current];
  if (!currentReview) return null;

  return (
    <section ref={sectionRef} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 line-pattern pointer-events-none" />
      <div className="section-divider mb-28" />
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-14">
            <SectionHeading number="05" title="Client Reviews" />
            <div className="hidden md:flex items-center gap-4">
              <span className="flex items-center gap-2 text-muted-foreground text-sm">
                <Sparkles size={14} className="text-primary" />
                {reviews.length} reviews
              </span>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full glass hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"
              >
                <PenLine size={14} />
                Leave a Review
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Mobile leave review button */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full glass hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"
          >
            <PenLine size={14} />
            Leave a Review
          </button>
        </div>

        {/* Submit form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              <SubmitReviewForm onSuccess={() => { setShowForm(false); fetchReviews(); }} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main featured review */}
          <AnimatedSection delay={0.1}>
            <div
              className="glass rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col justify-between relative overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
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
                  <div className="flex items-center gap-3">
                    {currentReview.project && (
                      <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {currentReview.project}
                      </span>
                    )}
                    <div className="flex gap-0.5">
                      {Array.from({ length: currentReview.rating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-primary text-primary" />
                      ))}
                    </div>
                  </div>

                  <blockquote className="text-foreground/90 text-lg md:text-xl lg:text-2xl leading-relaxed font-light max-w-3xl">
                    &ldquo;{currentReview.content}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-base">
                      {currentReview.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-foreground font-bold text-lg">{currentReview.name}</p>
                      <p className="text-muted-foreground text-sm">{currentReview.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8 relative z-10">
                <div className="flex gap-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => selectTestimonial(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === current ? "w-10 bg-primary" : "w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(-1)} className="p-2.5 rounded-full glass hover:border-primary/30 transition-all duration-300">
                    <ChevronLeft size={18} className="text-muted-foreground" />
                  </button>
                  <button onClick={() => navigate(1)} className="p-2.5 rounded-full glass hover:border-primary/30 transition-all duration-300">
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Side review cards */}
          <AnimatedSection delay={0.2} direction="right">
            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {reviews.map((review, i) => (
                <div key={review.id} className="min-w-[260px] lg:min-w-0">
                  <ReviewCard review={review} isActive={i === current} onClick={() => selectTestimonial(i)} />
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
              { value: `${reviews.length}+`, label: "Happy Clients" },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-6 rounded-2xl glass">
                <p className="text-2xl md:text-3xl font-black text-gradient">{stat.value}</p>
                <p className="text-muted-foreground text-xs font-mono mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TestimonialsSection;
