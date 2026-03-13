import Layout from "@/components/portfolio/Layout";
import PageHeader from "@/components/portfolio/PageHeader";
import TutoringSection from "@/components/portfolio/TutoringSection";
import ChallengesSection from "@/components/portfolio/ChallengesSection";
import { useLang } from "@/hooks/use-lang";

const Tutoring = () => {
  const { t } = useLang();
  return (
    <Layout>
      <PageHeader
        number="04"
        title={t.pages.tutoringTitle}
        subtitle={t.pages.tutoringSubtitle}
      />
      <TutoringSection />
      <ChallengesSection />
    </Layout>
  );
};

export default Tutoring;
