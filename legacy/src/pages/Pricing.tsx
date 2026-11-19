import Layout from "@/components/portfolio/Layout";
import PageHeader from "@/components/portfolio/PageHeader";
import SubscriptionSection from "@/components/portfolio/SubscriptionSection";
import { useLang } from "@/hooks/use-lang";

const Pricing = () => {
  const { t } = useLang();
  return (
    <Layout>
      <PageHeader
        number="05"
        title={t.pages.pricingTitle}
        subtitle={t.pages.pricingSubtitle}
      />
      <SubscriptionSection />
    </Layout>
  );
};

export default Pricing;
