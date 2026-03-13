import { useState, useEffect, useRef } from "react";
import { Menu, X, Download, Sun, Moon, MessageSquare, Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useLang, LANGS, LANG_META } from "@/hooks/use-lang";

const Navbar = () => {
  const { lang, setLang, t } = useLang();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.projects, href: "/projects" },
    { label: t.nav.skills, href: "/skills" },
    { label: t.nav.tutoring, href: "/tutoring" },
    { label: t.nav.pricing, href: "/pricing" },
    { label: t.nav.docs, href: "/docs" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.contact, href: "/contact" },
    { label: t.nav.platform, href: "/platform/login" },
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
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm"
          : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-14 px-6">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold tracking-tight">
          <span className="text-gradient">CT</span>
          <span className="text-primary">.</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-0.5">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                to={l.href}
                className={`relative text-[13px] px-3 py-1.5 rounded-md transition-colors ${
                  isActive(l.href)
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
                {isActive(l.href) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/8 rounded-md -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-1">
          {/* Language dropdown */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="h-8 px-2 rounded-md flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
              aria-label={t.nav.toggleLang}
            >
              <Globe size={14} />
              <span className="text-xs font-semibold">{LANG_META[lang].flag}</span>
              <ChevronDown size={12} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-1 w-44 bg-background/95 backdrop-blur-xl border border-border/60 rounded-lg shadow-lg overflow-hidden z-50"
                >
                  {LANGS.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                        l === lang
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                    >
                      <span className="text-base">{LANG_META[l].flag}</span>
                      <span>{LANG_META[l].label}</span>
                      {l === lang && (
                        <span className="ml-auto text-primary text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            onClick={() => {
              const btn = document.querySelector('[aria-label="Chat with AI Tutor"]') as HTMLButtonElement;
              btn?.click();
            }}
            className="w-8 h-8 rounded-md flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
            aria-label="Talk to AI"
          >
            <MessageSquare size={15} />
          </button>

          <a
            href="/ChadiTroudiCv.pdf"
            download
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity ml-1"
          >
            <Download size={13} />
            {t.nav.resume}
          </a>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground"
              aria-label={t.nav.toggleLang}
            >
              <Globe size={16} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-1 w-44 bg-background/95 backdrop-blur-xl border border-border/60 rounded-lg shadow-lg overflow-hidden z-50"
                >
                  {LANGS.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                        l === lang
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                    >
                      <span className="text-base">{LANG_META[l].flag}</span>
                      <span>{LANG_META[l].label}</span>
                      {l === lang && (
                        <span className="ml-auto text-primary text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/40 overflow-hidden"
          >
            <ul className="flex flex-col items-center gap-4 py-6">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={l.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-sm font-medium transition-colors ${
                      isActive(l.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <a
                  href="/ChadiTroudiCv.pdf"
                  download
                  className="inline-flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-md"
                >
                  <Download size={14} />
                  {t.nav.resume}
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
