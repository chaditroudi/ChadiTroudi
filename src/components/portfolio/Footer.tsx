import { motion } from "framer-motion";

const Footer = () => (
  <footer className="py-8 border-t border-border">
    <div className="container mx-auto px-6 text-center space-y-2">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-muted-foreground text-xs font-mono"
      >
        Designed & Built by Chadi Troudi
      </motion.p>
      <a
        href="https://www.linkedin.com/in/chaditroudi"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary text-xs font-mono transition-colors inline-block"
      >
        linkedin.com/in/chaditroudi
      </a>
    </div>
  </footer>
);

export default Footer;
