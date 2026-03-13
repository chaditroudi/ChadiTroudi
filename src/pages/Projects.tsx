import Layout from "@/components/portfolio/Layout";
import PageHeader from "@/components/portfolio/PageHeader";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import { useLang } from "@/hooks/use-lang";

const Projects = () => {
  const { t } = useLang();
  return (
    <Layout>
      <PageHeader
        number="02"
        title={t.pages.projectsTitle}
        subtitle={t.pages.projectsSubtitle}
      />
      <ProjectsSection />
    </Layout>
  );
};

export default Projects;
