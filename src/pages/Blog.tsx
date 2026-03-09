import Layout from "@/components/portfolio/Layout";
import PageHeader from "@/components/portfolio/PageHeader";
import BlogSection from "@/components/portfolio/BlogSection";

const Blog = () => (
  <Layout>
    <PageHeader
      number="06"
      title="Blog & Insights"
      subtitle="Technical articles, career advice, and lessons from the trenches — sharing knowledge from building production systems at scale."
    />
    <BlogSection />
  </Layout>
);

export default Blog;
