import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  parallax?: boolean;
}

const AnimatedSection = ({ children, className = "", delay = 0, direction = "up", parallax = false }: AnimatedSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : 0,
      x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={parallax ? { y: yParallax } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
