import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "@/hooks/use-lang";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Tutoring from "./pages/Tutoring";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Docs from "./pages/Docs";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PlatformLogin from "./pages/platform/PlatformLogin";
import PlatformSignup from "./pages/platform/PlatformSignup";
import PlatformDashboard from "./pages/platform/PlatformDashboard";
import LearningPath from "./pages/platform/LearningPath";
import LevelDetail from "./pages/platform/LevelDetail";
import LessonPage from "./pages/platform/LessonPage";
import AchievementsPage from "./pages/platform/AchievementsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LangProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/tutoring" element={<Tutoring />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LangProvider>
  </QueryClientProvider>
);

export default App;
