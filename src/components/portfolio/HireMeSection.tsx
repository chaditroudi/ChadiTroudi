import { ArrowRight, CalendarClock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const HireMeSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <AnimatedSection>
          <div className="rounded-3xl p-7 md:p-10 border border-primary/30 bg-card relative overflow-hidden">
            <div className="absolute -top-24 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Available for hire</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                  Looking for a Full-Stack Engineer who ships fast and clean?
                </h2>
                <p className="text-muted-foreground mt-4 text-sm md:text-base leading-relaxed">
                  I build production-grade React and Spring Boot products with strong architecture, reliable delivery, and clear communication.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-5 text-xs sm:text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2"><CalendarClock size={14} className="text-primary" /> Open to interviews</span>
                  <span className="inline-flex items-center gap-2"><Mail size={14} className="text-primary" /> Replies within 24h</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Start a Conversation
                  <ArrowRight size={15} />
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-primary/30 hover:bg-accent/40 transition-all"
                >
                  See Case Studies
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HireMeSection;