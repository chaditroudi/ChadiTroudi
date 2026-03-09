import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  number: string;
  gradient?: string;
}

const PageHeader = ({ title, subtitle, number, gradient }: PageHeaderProps) => {
  const location = useLocation();

  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 page-header-bg" />
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px] pointer-events-none"
        style={{ background: gradient || "hsl(var(--primary))" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[100px] pointer-events-none"
        style={{ background: "hsl(152 68% 46%)" }}
      />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Home
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground text-sm font-medium">{title}</span>
        </motion.div>

        {/* Title */}
        <div className="flex items-start gap-5">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-primary/20 font-mono text-6xl md:text-8xl font-black leading-none select-none hidden md:block"
          >
            {number}
          </motion.span>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              {title.split(" ").map((word, i) =>
                i === title.split(" ").length - 1 ? (
                  <span key={i} className="text-gradient">{word}</span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-lg mt-4 max-w-2xl leading-relaxed"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-1 w-20 rounded-full bg-gradient-to-r from-primary to-primary/0 mt-6 origin-left"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
