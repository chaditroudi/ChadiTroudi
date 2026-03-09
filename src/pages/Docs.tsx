import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Monitor, Bot, Code2, GraduationCap, CreditCard,
  ChevronRight, Clock, Sparkles, ArrowRight, CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/portfolio/Layout";
import PageHeader from "@/components/portfolio/PageHeader";

import platformOverview from "@/assets/videos/platform-overview.mp4";
import aiTutor from "@/assets/videos/ai-tutor.mp4";
import challenges from "@/assets/videos/challenges.mp4";
import bootcamp from "@/assets/videos/bootcamp.mp4";
import pricing from "@/assets/videos/pricing.mp4";

interface DocSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  video: string;
  icon: any;
  color: string;
  features: string[];
  cta?: { label: string; href: string };
  duration: string;
}

const sections: DocSection[] = [
  {
    id: "overview",
    title: "Platform Overview",
    subtitle: "Your all-in-one coding learning platform",
    description:
      "Chadi Troudi's platform combines a professional portfolio with an AI-powered learning ecosystem. Browse real-world projects, learn through interactive challenges, join intensive bootcamps, and get personalized mentorship — all in one place.",
    video: platformOverview,
    icon: Monitor,
    color: "from-primary to-emerald-400",
    duration: "2 min",
    features: [
      "Professional portfolio showcasing 10+ enterprise projects",
      "AI-powered coding tutor available 24/7",
      "Interactive coding challenges with instant feedback",
      "Intensive bootcamp programs (Java, Cloud, Networking, OS)",
      "Local Tunisian payment methods (D17, Bank Transfer, Mandat Minute)",
      "Blog with in-depth technical articles",
    ],
    cta: { label: "Explore the Platform", href: "/" },
  },
  {
    id: "ai-tutor",
    title: "AI Coding Tutor",
    subtitle: "Your personal AI mentor — always available",
    description:
      "Our AI Tutor uses advanced language models to provide real-time code analysis, debugging assistance, and step-by-step learning guidance. It understands your code context, identifies errors, suggests fixes, and explains concepts in a way that helps you truly learn — not just copy-paste.",
    video: aiTutor,
    icon: Bot,
    color: "from-violet-500 to-purple-500",
    duration: "3 min",
    features: [
      "Real-time code analysis with syntax highlighting",
      "Error detection and step-by-step debugging",
      "Personalized learning recommendations",
      "Supports Java, JavaScript, TypeScript, Python and more",
      "Ask questions in natural language — get code answers",
      "Available 24/7 with no waiting time",
    ],
    cta: { label: "Try the AI Tutor", href: "/" },
  },
  {
    id: "challenges",
    title: "Coding Challenges",
    subtitle: "Practice makes perfect — with AI evaluation",
    description:
      "Our challenge system offers curated coding problems across multiple difficulty levels. Write your solution in the built-in editor, submit it, and get instant AI-powered evaluation with a score, detailed feedback, and corrected code suggestions. Track your progress and level up your skills.",
    video: challenges,
    icon: Code2,
    color: "from-cyan-500 to-blue-500",
    duration: "2 min",
    features: [
      "10+ curated challenges from beginner to advanced",
      "Built-in code editor with syntax support",
      "AI-powered evaluation scoring 0–100",
      "Detailed feedback with corrected code",
      "Hint system for when you're stuck",
      "Filter by difficulty and category",
    ],
    cta: { label: "Start a Challenge", href: "/tutoring" },
  },
  {
    id: "bootcamp",
    title: "Bootcamp Programs",
    subtitle: "Intensive learning tracks — from zero to hero",
    description:
      "Choose from four specialized bootcamp tracks: Java + SQL, Cloud & DevOps, Networking, and Operating Systems. Each track is designed as an intensive 10–12 day program with daily live sessions, hands-on labs, a capstone project, and a certificate of completion. Small groups of max 8 students ensure personal attention.",
    video: bootcamp,
    icon: GraduationCap,
    color: "from-orange-500 to-amber-500",
    duration: "3 min",
    features: [
      "4 specialized tracks (Java, Cloud, Networking, OS)",
      "10–12 day intensive programs",
      "Daily live sessions with hands-on projects",
      "Small groups — max 8 students per cohort",
      "Capstone project for your portfolio",
      "Certificate of completion + career guidance",
    ],
    cta: { label: "Browse Bootcamps", href: "/tutoring" },
  },
  {
    id: "pricing",
    title: "Plans & Payment",
    subtitle: "Flexible pricing with local Tunisian payments",
    description:
      "We offer three subscription tiers to fit your learning goals and budget. All plans include AI tutor access and coding challenges. Payment is easy with local Tunisian methods — D17 mobile payment, bank transfer (virement bancaire), and Mandat Minute via La Poste. Register online and receive payment instructions instantly.",
    video: pricing,
    icon: CreditCard,
    color: "from-emerald-500 to-teal-500",
    duration: "2 min",
    features: [
      "Starter (49 TND/mo) — AI tutor + 10 evaluations/day",
      "Pro (129 TND/mo) — Unlimited + weekly 1-on-1 session",
      "Bootcamp (299 TND one-time) — Full intensive program",
      "D17 mobile payment",
      "Bank transfer (virement bancaire)",
      "Mandat Minute via La Poste Tunisienne",
    ],
    cta: { label: "View Pricing", href: "/pricing" },
  },
];

const VideoCard = ({ section, index }: { section: DocSection; index: number }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const Icon = section.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative"
    >
      {/* Section number */}
      <div className="absolute -left-4 md:-left-12 top-0 text-6xl md:text-8xl font-black text-primary/[0.04] select-none hidden lg:block">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className={`grid lg:grid-cols-2 gap-8 lg:gap-14 items-center ${!isEven ? "lg:direction-rtl" : ""}`}>
        {/* Video */}
        <div className={`${!isEven ? "lg:order-2" : ""}`}>
          <div className="relative group rounded-2xl overflow-hidden border border-border/50 shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <video
              src={section.video}
              className="w-full aspect-video object-cover"
              loop
              muted
              playsInline
              autoPlay
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={(e) => {
                const video = e.currentTarget;
                if (video.paused) {
                  video.play();
                } else {
                  video.pause();
                }
              }}
            />

            {/* Play overlay */}
            <div className={`absolute inset-0 bg-background/20 flex items-center justify-center transition-opacity duration-300 cursor-pointer ${isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"}`}>
              <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                {isPlaying ? <Pause size={24} className="text-primary-foreground" /> : <Play size={24} className="text-primary-foreground ml-1" />}
              </div>
            </div>

            {/* Duration badge */}
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-mono text-foreground flex items-center gap-1.5">
              <Clock size={10} />
              {section.duration}
            </div>

            {/* Gradient border glow */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
          </div>
        </div>

        {/* Content */}
        <div className={`${!isEven ? "lg:order-1" : ""}`}>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${section.color} mb-4`}>
            <Icon size={14} className="text-white" />
            <span className="text-white text-xs font-semibold uppercase tracking-wider">
              {section.subtitle}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
            {section.title}
          </h3>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {section.description}
          </p>

          {/* Features */}
          <ul className="space-y-2.5 mb-8">
            {section.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>

          {section.cta && (
            <Link
              to={section.cta.href}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 rounded-full hover:opacity-90 hover:shadow-[0_8px_25px_-4px_hsl(152_68%_46%/0.4)] transition-all group"
            >
              {section.cta.label}
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Docs = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <Layout>
      <PageHeader
        number="📹"
        title="How It Works"
        subtitle="A complete video guide to every feature of the platform — from AI tutoring to bootcamp programs. Watch, learn, and get started."
      />

      {/* Quick nav */}
      <section className="py-8 border-b border-border/30 sticky top-14 z-40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <Icon size={14} />
                  {s.title}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video sections */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="space-y-32">
            {sections.map((section, i) => (
              <div key={section.id} id={section.id}>
                <VideoCard section={section} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 page-header-bg" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[150px] pointer-events-none"
          style={{ background: "hsl(var(--primary))" }}
        />
        <div className="container mx-auto px-6 max-w-3xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to Start <span className="text-gradient">Learning</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join hundreds of students already leveling up their coding skills with AI-powered tutoring and intensive bootcamps.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-8 py-3.5 rounded-full hover:opacity-90 hover:shadow-[0_8px_25px_-4px_hsl(152_68%_46%/0.4)] transition-all"
              >
                Get Started
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/tutoring"
                className="inline-flex items-center gap-2 border border-border text-foreground font-medium text-sm px-8 py-3.5 rounded-full hover:border-primary/30 hover:bg-accent/50 transition-all"
              >
                Try Free Challenges
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Docs;
