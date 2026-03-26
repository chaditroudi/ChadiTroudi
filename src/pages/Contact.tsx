import Layout from "@/components/portfolio/Layout";
import PageHeader from "@/components/portfolio/PageHeader";
import ContactSection from "@/components/portfolio/ContactSection";
import { useLang } from "@/hooks/use-lang";

const Contact = () => {
  const { t } = useLang();
  return (
    <Layout>
      <PageHeader
        number="07"
        title={t.pages.contactTitle}
        subtitle={t.pages.contactSubtitle}
      />
      <ContactSection />
    </Layout>
  );
};

export default Contact;
