import Layout from "@/components/portfolio/Layout";
import HeroSection from "@/components/portfolio/HeroSection";
import ImportantLinksSection from "@/components/portfolio/ImportantLinksSection";
import HireMeSection from "@/components/portfolio/HireMeSection";
import AboutSection from "@/components/portfolio/AboutSection";
import HighlightsSection from "@/components/portfolio/HighlightsSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ImportantLinksSection />
      <HireMeSection />
      <AboutSection />
      <HighlightsSection />
    </Layout>
  );
};

export default Index;
