import Layout from "@/components/portfolio/Layout";
import PageHeader from "@/components/portfolio/PageHeader";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";

const Skills = () => (
  <Layout>
    <PageHeader
      number="03"
      title="Skills & Experience"
      subtitle="5+ years of building full-stack applications across frontend, backend, and DevOps — with a deep focus on Java, React, and cloud infrastructure."
    />
    <SkillsSection />
    <ExperienceSection />
  </Layout>
);

export default Skills;
