import { useState, useEffect } from "react";
import { Menu, X, Download, Sun, Moon, Globe, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/hooks/use-lang";
import robotImg from "@/assets/robot-avatar.jpg";

const Navbar = () => {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  const navLinks = [
    { label: t.about, href: "#about" },
    { label: t.projects, href: "#projects" },
    { label: t.skills, href: "#skills" },
    { label: t.experience, href: "#experience" },
    { label: t.tutoring, href: "#tutoring" },
    { label: t.blog, href: "#blog" },
    { label: t.contact, href: "#contact" },
  ];

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const sections = ["about", "projects", "skills", "experience", "tutoring", "blog", "contact"];
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLang = () => setLang(lang === "en" ? "tn" : "en");

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-lg" : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="#" className="text-xl font-bold tracking-tight group">
          <span className="text-gradient">CT</span>
          <span className="text-primary group-hover:opacity-0 transition-opacity">.</span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((l, i) => (
            <motion.li
              key={l.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <a
                href={l.href}
                className={`relative text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeSection === l.href.slice(1)
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
                {activeSection === l.href.slice(1) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            </motion.li>
          ))}

          {/* Language toggle */}
          <motion.li
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.33 }}
          >
            <button
              onClick={toggleLang}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 ml-1 relative group"
              aria-label="Toggle language"
              title={lang === "en" ? "بدّل للدارجة التونسية" : "Switch to English"}
            >
              <Globe size={16} />
              <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
                {lang === "en" ? "🇹🇳" : "🇬🇧"}
              </span>
            </button>
          </motion.li>

          {/* Theme toggle */}
          <motion.li
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 ml-1"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={16} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.li>

          {/* Talk to AI bot */}
          <motion.li
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
          >
            <button
              onClick={() => {
                const btn = document.querySelector('[aria-label="Chat with AI Tutor"]') as HTMLButtonElement;
                btn?.click();
              }}
              className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-300 ml-1 group"
              style={{
                border: "1px solid hsl(152 100% 50% / 0.3)",
                color: "hsl(152 100% 60%)",
                textShadow: "0 0 8px hsl(152 100% 50% / 0.3)",
              }}
            >
              <img src={robotImg} alt="" className="w-5 h-5 rounded-full ring-1 ring-primary/40" />
              <span className="hidden lg:inline">Talk to AI</span>
              <Bot size={14} className="lg:hidden" />
            </button>
          </motion.li>

          <motion.li
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <a
              href="/ChadiTroudiCv.pdf"
              download
              className="inline-flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:shadow-[0_4px_20px_-4px_hsl(152_68%_46%/0.5)] transition-all duration-300 ml-2"
            >
              <Download size={14} />
              {t.resume}
            </a>
          </motion.li>
        </ul>

        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleLang}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground relative"
            aria-label="Toggle language"
          >
            <Globe size={18} />
            <span className="absolute -bottom-1 -right-1 text-[8px]">
              {lang === "en" ? "🇹🇳" : "🇬🇧"}
            </span>
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="text-foreground relative z-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-border overflow-hidden"
          >
            <ul className="flex flex-col items-center gap-6 py-8">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-muted-foreground hover:text-primary transition-colors font-medium"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <a
                  href="/ChadiTroudiCv.pdf"
                  download
                  className="inline-flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground px-6 py-3 rounded-lg"
                >
                  <Download size={14} />
                  {t.resume}
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
