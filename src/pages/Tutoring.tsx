import Layout from "@/components/portfolio/Layout";
import PageHeader from "@/components/portfolio/PageHeader";
import TutoringSection from "@/components/portfolio/TutoringSection";
import ChallengesSection from "@/components/portfolio/ChallengesSection";

const Tutoring = () => (
  <Layout>
    <PageHeader
      number="04"
      title="Learn & Practice"
      subtitle="Intensive bootcamp programs and interactive coding challenges — level up your skills with structured learning paths and AI-powered feedback."
    />
    <TutoringSection />
    <ChallengesSection />
  </Layout>
);

export default Tutoring;
