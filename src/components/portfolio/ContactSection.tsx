import { SectionHeading } from "./AboutSection";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const ContactSection = () => {
  return (
    <section id="contact" className="py-28 relative">
      <div className="section-divider mb-28" />

      {/* Warm glow bg */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-2xl text-center relative z-10">
        <AnimatedSection>
          <SectionHeading number="05" title="Get In Touch" />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <p className="text-3xl md:text-4xl font-bold mb-4">
            Let's build something <span className="text-serif italic text-gradient">together</span>.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            I'm open to new opportunities, challenging full-stack projects, and interesting collaborations. Drop me a line.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="mailto:chadi.troudi@example.com"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-10 py-4 rounded-full hover:shadow-[0_0_40px_-5px_hsl(45_100%_60%/0.5)] transition-all duration-300"
          >
            <Mail size={18} />
            Say Hello
          </motion.a>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="flex items-center justify-center gap-5 mt-12">
            {[
              { href: "https://github.com/chaditroudi", icon: <Github size={20} />, label: "GitHub" },
              { href: "https://www.linkedin.com/in/chaditroudi", icon: <Linkedin size={20} />, label: "LinkedIn" },
              { href: "mailto:chadi.troudi@example.com", icon: <Mail size={20} />, label: "Email" },
            ].map((s) => (
              <motion.a
                key={s.label}
                whileHover={{ y: -3 }}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-11 h-11 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ContactSection;
