import Layout from "@/components/portfolio/Layout";
import PageHeader from "@/components/portfolio/PageHeader";
import SubscriptionSection from "@/components/portfolio/SubscriptionSection";

const Pricing = () => (
  <Layout>
    <PageHeader
      number="05"
      title="Subscription Plans"
      subtitle="Flexible plans tailored for the Tunisian market — learn coding with AI-powered tutoring, local payment methods, and real mentorship."
    />
    <SubscriptionSection />
  </Layout>
);

export default Pricing;
