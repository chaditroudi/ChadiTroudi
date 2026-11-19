import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";

// Home is eager (it's the landing page); everything else is split into its own chunk.
const Projects = lazy(() => import("./pages/Projects"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const Experience = lazy(() => import("./pages/Experience"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

/** Old links used HashRouter (/#/projects). Send them to the real URL. */
const LegacyHashRedirect = () => {
  const { hash } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (hash.startsWith("#/")) navigate(hash.slice(1), { replace: true });
  }, [hash, navigate]);
  return null;
};

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

const App = () => (
  <BrowserRouter basename={basename}>
    <LegacyHashRedirect />
    <Suspense fallback={<div className="min-h-screen bg-background" aria-busy="true" />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<CaseStudy />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* Former URLs */}
        <Route path="/skills" element={<Navigate to="/experience" replace />} />
        <Route path="/projects/mind-platform" element={<Navigate to="/projects/sicap" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
