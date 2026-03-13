import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Rocket, ChevronRight, ChevronLeft, Sparkles, Target,
  Code2, Clock, BookOpen, Briefcase, GraduationCap, Brain, Cpu
} from "lucide-react";

const STEPS = ["welcome", "goal", "experience", "languages", "hours", "style"] as const;
type Step = typeof STEPS[number];

const CAREER_GOALS = [
  { id: "software_engineer", label: "Software Engineer", icon: Code2, desc: "Build robust backend & frontend systems" },
  { id: "web_developer", label: "Web Developer", icon: BookOpen, desc: "Create modern websites and web apps" },
  { id: "ai_engineer", label: "AI Engineer", icon: Cpu, desc: "Build intelligent systems with ML & AI" },
  { id: "data_scientist", label: "Data Scientist", icon: Brain, desc: "Analyze data and extract insights" },
  { id: "interview_prep", label: "Interview Prep", icon: Briefcase, desc: "Ace coding interviews at top companies" },
  { id: "student_support", label: "School / University", icon: GraduationCap, desc: "Support for coursework & exams" },
];

const EXPERIENCE_LEVELS = [
  { id: "complete_beginner", label: "Complete Beginner", desc: "Never written code before", emoji: "🌱" },
  { id: "beginner", label: "Beginner", desc: "Know basic syntax, written small programs", emoji: "🌿" },
  { id: "intermediate", label: "Intermediate", desc: "Built projects, comfortable with core concepts", emoji: "🌳" },
  { id: "advanced", label: "Advanced", desc: "Professional experience, looking to sharpen skills", emoji: "🏔️" },
];

const LANGUAGES = [
  { id: "javascript", label: "JavaScript", color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-600" },
  { id: "python", label: "Python", color: "bg-blue-500/10 border-blue-500/30 text-blue-600" },
  { id: "java", label: "Java", color: "bg-orange-500/10 border-orange-500/30 text-orange-600" },
  { id: "csharp", label: "C#", color: "bg-purple-500/10 border-purple-500/30 text-purple-600" },
  { id: "php", label: "PHP", color: "bg-indigo-500/10 border-indigo-500/30 text-indigo-600" },
  { id: "typescript", label: "TypeScript", color: "bg-sky-500/10 border-sky-500/30 text-sky-600" },
  { id: "cpp", label: "C++", color: "bg-red-500/10 border-red-500/30 text-red-600" },
  { id: "none", label: "None yet", color: "bg-muted border-border text-muted-foreground" },
];

const WEEKLY_HOURS = [
  { id: 3, label: "1–3 hours", desc: "Casual pace", emoji: "🐢" },
  { id: 5, label: "3–5 hours", desc: "Steady learner", emoji: "🚶" },
  { id: 10, label: "5–10 hours", desc: "Dedicated grind", emoji: "🏃" },
  { id: 20, label: "10+ hours", desc: "Full-time learner", emoji: "🚀" },
];

const LEARNING_STYLES = [
  { id: "visual", label: "Visual", desc: "Diagrams, videos, and examples", emoji: "👁️" },
  { id: "hands_on", label: "Hands-on", desc: "Code first, learn by doing", emoji: "🛠️" },
  { id: "reading", label: "Reading", desc: "Documentation and articles", emoji: "📖" },
  { id: "guided", label: "Guided", desc: "Step-by-step with an AI tutor", emoji: "🤖" },
];

const Onboarding = () => {
  const { user, loading, requireAuth } = usePlatformAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [careerGoal, setCareerGoal] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [knownLanguages, setKnownLanguages] = useState<string[]>([]);
  const [weeklyHours, setWeeklyHours] = useState(5);
  const [learningStyle, setLearningStyle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    requireAuth();
  }, [loading, user]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const next = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };
  const prev = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const toggleLanguage = (lang: string) => {
    if (lang === "none") {
      setKnownLanguages(["none"]);
      return;
    }
    setKnownLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev.filter(l => l !== "none"), lang]
    );
  };

  const canProceed = () => {
    switch (step) {
      case "goal": return !!careerGoal;
      case "experience": return !!experienceLevel;
      case "languages": return knownLanguages.length > 0;
      case "style": return !!learningStyle;
      default: return true;
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("student_profiles")
      .update({
        onboarding_completed: true,
        career_goal: careerGoal,
        experience_level: experienceLevel,
        known_languages: knownLanguages,
        weekly_hours: weeklyHours,
        learning_style: learningStyle,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to save preferences");
      console.error(error);
    } else {
      toast.success("Welcome aboard! Let's assess your skills 🎯");
      navigate("/platform/assessment");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {/* Welcome */}
            {step === "welcome" && (
              <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-6">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mx-auto">
                  <Rocket className="w-10 h-10 text-primary" />
                </motion.div>
                <h1 className="text-3xl font-bold font-display text-foreground">Welcome to CodeCamp! 🎮</h1>
                <p className="text-muted-foreground max-w-sm mx-auto">Let's personalize your learning journey. We'll ask a few quick questions to build the perfect roadmap for you.</p>
                <p className="text-xs text-muted-foreground">Takes about 1 minute ⚡</p>
                <Button size="lg" onClick={next} className="gap-2">
                  Let's Go <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* Career Goal */}
            {step === "goal" && (
              <motion.div key="goal" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
                <div className="text-center">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h2 className="text-2xl font-bold text-foreground">What's your goal?</h2>
                  <p className="text-muted-foreground text-sm">What do you want to become?</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {CAREER_GOALS.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setCareerGoal(g.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        careerGoal === g.id ? "bg-primary/10 border-primary shadow-md" : "bg-card border-border hover:border-primary/30"
                      }`}
                    >
                      <g.icon className={`w-5 h-5 mb-2 ${careerGoal === g.id ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="font-semibold text-foreground text-sm">{g.label}</p>
                      <p className="text-[11px] text-muted-foreground">{g.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Experience Level */}
            {step === "experience" && (
              <motion.div key="experience" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h2 className="text-2xl font-bold text-foreground">What's your level?</h2>
                  <p className="text-muted-foreground text-sm">Be honest — we'll place you right!</p>
                </div>
                <div className="space-y-3">
                  {EXPERIENCE_LEVELS.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setExperienceLevel(l.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                        experienceLevel === l.id ? "bg-primary/10 border-primary shadow-md" : "bg-card border-border hover:border-primary/30"
                      }`}
                    >
                      <span className="text-2xl">{l.emoji}</span>
                      <div>
                        <p className="font-semibold text-foreground">{l.label}</p>
                        <p className="text-xs text-muted-foreground">{l.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Known Languages */}
            {step === "languages" && (
              <motion.div key="languages" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
                <div className="text-center">
                  <Code2 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h2 className="text-2xl font-bold text-foreground">Languages you know?</h2>
                  <p className="text-muted-foreground text-sm">Select all that apply</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.id}
                      onClick={() => toggleLanguage(l.id)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        knownLanguages.includes(l.id) ? `${l.color} border-2 shadow-md` : "bg-card border-border hover:border-primary/30 text-foreground"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Weekly Hours */}
            {step === "hours" && (
              <motion.div key="hours" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h2 className="text-2xl font-bold text-foreground">How much time per week?</h2>
                  <p className="text-muted-foreground text-sm">We'll pace your roadmap accordingly</p>
                </div>
                <div className="space-y-3">
                  {WEEKLY_HOURS.map(h => (
                    <button
                      key={h.id}
                      onClick={() => setWeeklyHours(h.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                        weeklyHours === h.id ? "bg-primary/10 border-primary shadow-md" : "bg-card border-border hover:border-primary/30"
                      }`}
                    >
                      <span className="text-2xl">{h.emoji}</span>
                      <div>
                        <p className="font-semibold text-foreground">{h.label}</p>
                        <p className="text-xs text-muted-foreground">{h.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Learning Style */}
            {step === "style" && (
              <motion.div key="style" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
                <div className="text-center">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h2 className="text-2xl font-bold text-foreground">How do you learn best?</h2>
                  <p className="text-muted-foreground text-sm">We'll adapt the content to your style</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {LEARNING_STYLES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setLearningStyle(s.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        learningStyle === s.id ? "bg-primary/10 border-primary shadow-md" : "bg-card border-border hover:border-primary/30"
                      }`}
                    >
                      <span className="text-2xl block mb-2">{s.emoji}</span>
                      <p className="font-semibold text-foreground text-sm">{s.label}</p>
                      <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {step !== "welcome" && (
            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={prev} className="gap-1">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              {step === "style" ? (
                <Button onClick={handleFinish} disabled={!canProceed() || saving} className="gap-1">
                  {saving ? "Saving..." : "Continue to Assessment"} <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={next} disabled={!canProceed()} className="gap-1">
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {/* Step dots */}
          <div className="flex justify-center gap-2 mt-6">
            {STEPS.map((s, i) => (
              <div key={s} className={`w-2 h-2 rounded-full transition-all ${i <= stepIndex ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
