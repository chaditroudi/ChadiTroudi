import Layout from "@/components/portfolio/Layout";
import AboutSection from "@/components/portfolio/AboutSection";
import HighlightsSection from "@/components/portfolio/HighlightsSection";
import StatsCounter from "@/components/portfolio/StatsCounter";

const About = () => {
  return (
    <Layout>
      <div className="pt-20">
        <AboutSection />
        <HighlightsSection />
      </div>
    </Layout>
  );
};

export default About;
