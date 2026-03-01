const Footer = () => (
  <footer className="py-10 border-t border-border">
    <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-muted-foreground text-xs font-mono">
        © {new Date().getFullYear()} Chadi Troudi
      </p>
      <a
        href="https://www.linkedin.com/in/chaditroudi"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary text-xs font-mono transition-colors"
      >
        linkedin.com/in/chaditroudi
      </a>
    </div>
  </footer>
);

export default Footer;
