import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FileText, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { track } from "@/lib/analytics";
import { CV_URL } from "@/lib/links";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/lib/button-styles";
import { Container } from "./primitives";


const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-primary after:transition-transform after:duration-300",
    isActive ? "text-foreground after:scale-x-100" : "text-muted-foreground after:scale-x-0 hover:text-foreground",
  );

const SiteHeader = () => {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const themeLabel = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled || open ? "border-border bg-background/85 backdrop-blur-md" : "border-transparent bg-background",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground transition-transform group-hover:-rotate-6">
            CT
          </span>
          <span className="font-display text-base font-semibold tracking-tight">Chadi Troudi</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={themeLabel}
            title={themeLabel}
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {theme === "dark" ? <Sun size={17} className="transition-transform duration-500 hover:rotate-90" /> : <Moon size={17} />}
          </button>
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener"
            onClick={() => track("cv_download", { from: "header" })}
            className={cn(buttonStyles.primary, "hidden px-4 py-2 sm:inline-flex")}
          >
            <FileText size={15} aria-hidden /> CV
            <span className="sr-only">(PDF, opens in a new tab)</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </Container>

      <nav id="mobile-nav" aria-label="Main" hidden={!open} className="border-t border-border md:hidden">
        <Container className="py-3">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn("block rounded-lg px-3 py-3 text-base font-medium", isActive ? "bg-primary/10 text-foreground" : "text-muted-foreground")
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <a href={CV_URL} target="_blank" rel="noopener" onClick={() => track("cv_download", { from: "mobile-nav" })} className={cn(buttonStyles.primary, "w-full")}>
                <FileText size={15} aria-hidden /> Download CV (PDF)
              </a>
            </li>
          </ul>
        </Container>
      </nav>
    </header>
  );
};

export default SiteHeader;
