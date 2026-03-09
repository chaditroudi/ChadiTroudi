import Layout from "@/components/portfolio/Layout";
import PageHeader from "@/components/portfolio/PageHeader";
import ProjectsSection from "@/components/portfolio/ProjectsSection";

const Projects = () => (
  <Layout>
    <PageHeader
      number="02"
      title="Featured Work"
      subtitle="A curated selection of projects I've built — from AI-powered platforms to enterprise-scale retail systems, each solving real-world problems."
    />
    <ProjectsSection />
  </Layout>
);

export default Projects;
