import Layout from "@/components/portfolio/Layout";
import PageHeader from "@/components/portfolio/PageHeader";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import { useLang } from "@/hooks/use-lang";

const Skills = () => {
  const { t } = useLang();
  return (
    <Layout>
      <PageHeader
        number="03"
        title={t.pages.skillsTitle}
        subtitle={t.pages.skillsSubtitle}
      />
      <SkillsSection />
      <ExperienceSection />
    </Layout>
  );
};

export default Skills;
