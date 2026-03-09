import Layout from "@/components/portfolio/Layout";
import ContactSection from "@/components/portfolio/ContactSection";
import TestimonialsSection from "@/components/portfolio/TestimonialsSection";
import SubmitReviewForm from "@/components/portfolio/SubmitReviewForm";

const Contact = () => (
  <Layout>
    <div className="pt-20">
      <ContactSection />
      <TestimonialsSection />
      <SubmitReviewForm />
    </div>
  </Layout>
);

export default Contact;
