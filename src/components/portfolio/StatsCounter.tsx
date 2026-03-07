import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const stats = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 30, suffix: "+", label: "Projects Delivered" },
  { value: 6, suffix: "", label: "Industries Served" },
  { value: 99, suffix: "%", label: "Client Satisfaction" },
];

const CountUp = ({ target, suffix }: { target: number; suffix: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-gradient tabular-nums">
      {count}
      {suffix}
    </span>
  );
};

const StatsCounter = () => (
  <section className="py-20 relative">
    <div className="container mx-auto px-6 max-w-5xl">
      <div className="glass rounded-2xl p-8 md:p-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1}>
              <div className="text-center space-y-2">
                <CountUp target={stat.value} suffix={stat.suffix} />
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default StatsCounter;
