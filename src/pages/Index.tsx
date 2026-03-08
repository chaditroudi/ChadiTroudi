import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import StatsCounter from "@/components/portfolio/StatsCounter";
import AboutSection from "@/components/portfolio/AboutSection";
import HighlightsSection from "@/components/portfolio/HighlightsSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import TestimonialsSection from "@/components/portfolio/TestimonialsSection";
import TutoringSection from "@/components/portfolio/TutoringSection";
import BlogSection from "@/components/portfolio/BlogSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";
import ScrollProgress from "@/components/portfolio/ScrollProgress";
import BackToTop from "@/components/portfolio/BackToTop";
import AIVoiceTutor from "@/components/portfolio/AIVoiceTutor";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        <StatsCounter />
        <AboutSection />
        <HighlightsSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <TestimonialsSection />
        <TutoringSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
      <AIVoiceTutor />
    </div>
  );
};

export default Index;
