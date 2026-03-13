import Layout from "@/components/portfolio/Layout";
import PageHeader from "@/components/portfolio/PageHeader";
import BlogSection from "@/components/portfolio/BlogSection";
import { useLang } from "@/hooks/use-lang";

const Blog = () => {
  const { t } = useLang();
  return (
    <Layout>
      <PageHeader
        number="06"
        title={t.pages.blogTitle}
        subtitle={t.pages.blogSubtitle}
      />
      <BlogSection />
    </Layout>
  );
};

export default Blog;
