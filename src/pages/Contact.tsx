import Layout from "@/components/portfolio/Layout";
import PageHeader from "@/components/portfolio/PageHeader";
import ContactSection from "@/components/portfolio/ContactSection";
import TestimonialsSection from "@/components/portfolio/TestimonialsSection";

const Contact = () => (
  <Layout>
    <PageHeader
      number="07"
      title="Get In Touch"
      subtitle="I'm always open to discussing new opportunities, challenging full-stack projects, and interesting collaborations."
    />
    <ContactSection />
    <TestimonialsSection />
  </Layout>
);

export default Contact;
