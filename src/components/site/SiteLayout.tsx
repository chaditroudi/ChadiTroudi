import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { useLocation } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

const SiteLayout = ({ children }: { children: ReactNode }) => {
  const { pathname, hash } = useLocation();

  // New page → start at the top (unless linking to an anchor).
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </div>
    </MotionConfig>
  );
};

export default SiteLayout;
