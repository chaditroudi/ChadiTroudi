import { SectionHeading } from "./AboutSection";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="container mx-auto px-6 max-w-2xl text-center relative z-10">
        <AnimatedSection>
          <SectionHeading number="05" title="Get In Touch" />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            I'm currently open to new opportunities and always interested in challenging 
            full-stack projects. Whether you have a question, a potential collaboration, 
            or just want to say hello — my inbox is always open.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="mailto:chadi.troudi@example.com"
            className="inline-flex items-center gap-2 border border-primary text-primary font-mono px-8 py-3 rounded-lg hover:bg-primary/10 transition-colors glow"
          >
            <Mail size={18} />
            Say Hello
          </motion.a>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="flex items-center justify-center gap-6 mt-12">
            <SocialIcon href="https://github.com/chaditroudi" icon={<Github size={20} />} label="GitHub" />
            <SocialIcon href="https://www.linkedin.com/in/chaditroudi" icon={<Linkedin size={20} />} label="LinkedIn" />
            <SocialIcon href="https://twitter.com" icon={<Twitter size={20} />} label="Twitter" />
            <SocialIcon href="mailto:chadi.troudi@example.com" icon={<Mail size={20} />} label="Email" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

const SocialIcon = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <motion.a
    whileHover={{ y: -3, scale: 1.1 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-muted-foreground hover:text-primary transition-colors p-2"
  >
    {icon}
  </motion.a>
);

export default ContactSection;
