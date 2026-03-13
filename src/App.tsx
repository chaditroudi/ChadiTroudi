import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "@/hooks/use-lang";
import Index from "./pages/Index";
import About from "./pages/About";
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
import Onboarding from "./pages/platform/Onboarding";
import Assessment from "./pages/platform/Assessment";
import PlatformLayout from "./pages/platform/PlatformLayout";
import PlatformDashboard from "./pages/platform/PlatformDashboard";
import LearningPath from "./pages/platform/LearningPath";
import LevelDetail from "./pages/platform/LevelDetail";
import LessonPage from "./pages/platform/LessonPage";
import AchievementsPage from "./pages/platform/AchievementsPage";
import CodingPlayground from "./pages/platform/CodingPlayground";
import WorldMap from "./pages/platform/WorldMap";
import IslandDetail from "./pages/platform/IslandDetail";
import BossChallenge from "./pages/platform/BossChallenge";
import SharpenYourSkills from "./pages/platform/SharpenYourSkills";
import SkillDetail from "./pages/platform/SkillDetail";
import AI4ELearning from "./pages/platform/AI4ELearning";
import InterviewCoach from "./pages/platform/InterviewCoach";
import DebugDetective from "./pages/platform/DebugDetective";
import BillingPage from "./pages/platform/BillingPage";
import AIAssistantPage from "./pages/platform/AIAssistantPage";
import StudentHelp from "./pages/platform/StudentHelp";
import CoursesLibrary from "./pages/platform/CoursesLibrary";
import CourseDetail from "./pages/platform/CourseDetail";
import CourseLessonViewer from "./pages/platform/CourseLessonViewer";
import ResourceLibrary from "./pages/platform/ResourceLibrary";
import { AIAssistantProvider } from "@/features/ai-assistant/hooks/use-ai-assistant";
import { SubscriptionProvider } from "@/hooks/use-subscription";
// TODO: Re-enable FeatureGate wrappers on premium routes when ready for production
// import { FeatureGate } from "@/components/platform/SaasGate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LangProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/tutoring" element={<Tutoring />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/platform/login" element={<PlatformLogin />} />
            <Route path="/platform/signup" element={<PlatformSignup />} />
            <Route path="/platform/onboarding" element={<Onboarding />} />
            <Route path="/platform/assessment" element={<Assessment />} />
            <Route path="/platform" element={<SubscriptionProvider><AIAssistantProvider><PlatformLayout /></AIAssistantProvider></SubscriptionProvider>}>
              <Route path="dashboard" element={<PlatformDashboard />} />
              <Route path="learn" element={<LearningPath />} />
              <Route path="level/:levelId" element={<LevelDetail />} />
              <Route path="lesson/:lessonId" element={<LessonPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="playground" element={<CodingPlayground />} />
              <Route path="world-map" element={<WorldMap />} />
              <Route path="island/:islandId" element={<IslandDetail />} />
              <Route path="boss/:islandId" element={<BossChallenge />} />
              <Route path="sharpen" element={<SharpenYourSkills />} />
              <Route path="sharpen/skill/:skillId" element={<SkillDetail />} />
              <Route path="ai-courses" element={<AI4ELearning />} />
              <Route path="interview" element={<InterviewCoach />} />
              <Route path="debug" element={<DebugDetective />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="ai-assistant" element={<AIAssistantPage />} />
              <Route path="student-help" element={<StudentHelp />} />
              <Route path="courses" element={<CoursesLibrary />} />
              <Route path="courses/:courseId" element={<CourseDetail />} />
              <Route path="courses/:courseId/:moduleId/:lessonId" element={<CourseLessonViewer />} />
              <Route path="resources" element={<ResourceLibrary />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </LangProvider>
  </QueryClientProvider>
);

export default App;
