import Layout from "@/components/portfolio/Layout";
import HeroSection from "@/components/portfolio/HeroSection";
import StatsCounter from "@/components/portfolio/StatsCounter";
import AboutSection from "@/components/portfolio/AboutSection";
import HighlightsSection from "@/components/portfolio/HighlightsSection";
import TestimonialsSection from "@/components/portfolio/TestimonialsSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsCounter />
      <AboutSection />
      <HighlightsSection />
      <TestimonialsSection />
    </Layout>
  );
};

export default Index;
