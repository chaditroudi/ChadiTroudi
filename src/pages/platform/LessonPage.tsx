import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Star, BookOpen, Code2, HelpCircle } from "lucide-react";

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user, loading, requireAuth } = usePlatformAuth();
  const [lesson, setLesson] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);
  const [step, setStep] = useState<"theory" | "quiz" | "complete">("theory");

  useEffect(() => { requireAuth(); }, [loading, user]);

  useEffect(() => {
    if (!user || !lessonId) return;
    loadLesson();
  }, [user, lessonId]);

  const loadLesson = async () => {
    const [lessonRes, progressRes] = await Promise.all([
      supabase.from("platform_lessons").select("*").eq("id", lessonId!).single(),
      supabase.from("user_lesson_progress").select("completed").eq("user_id", user!.id).eq("lesson_id", lessonId!).maybeSingle(),
    ]);
    if (lessonRes.data) setLesson(lessonRes.data);
    if (progressRes.data?.completed) {
      setCompleted(true);
      setStep("complete");
    }
  };

  const content = lesson?.content || {};
  const quiz = content.quiz?.[0];

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (quizAnswer === quiz?.correct) {
      toast.success("Correct! 🎉");
    } else {
      toast.error("Not quite — try reviewing the lesson.");
    }
  };

  const handleComplete = async () => {
    if (!user || !lesson || completed) return;

    // Upsert progress
    await supabase.from("user_lesson_progress").upsert({
      user_id: user.id,
      lesson_id: lesson.id,
      completed: true,
      score: quizAnswer === quiz?.correct ? 100 : 70,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" });

    // Add XP
    await supabase.from("xp_logs").insert({
      user_id: user.id,
      amount: lesson.xp_reward,
      source: "lesson",
      description: `Completed: ${lesson.title}`,
    });

    // Update profile XP
    const { data: profile } = await supabase
      .from("student_profiles")
      .select("total_xp")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      const newXp = (profile as any).total_xp + lesson.xp_reward;
      await supabase
        .from("student_profiles")
        .update({ total_xp: newXp, last_active_at: new Date().toISOString() })
        .eq("user_id", user.id);

      // Check level up
      const { data: levels } = await supabase
        .from("platform_levels")
        .select("number, required_xp")
        .lte("required_xp", newXp)
        .order("number", { ascending: false })
        .limit(1);

      if (levels?.[0]) {
        await supabase
          .from("student_profiles")
          .update({ current_level: (levels[0] as any).number })
          .eq("user_id", user.id);
      }
    }

    setXpEarned(true);
    setCompleted(true);
    setStep("complete");
    toast.success(`+${lesson.xp_reward} XP earned! 🌟`);
  };

  if (loading || !lesson) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading lesson...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display font-bold text-foreground text-sm">{lesson.title}</h1>
          <Badge variant="secondary" className="text-[10px]">+{lesson.xp_reward} XP</Badge>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Step navigation */}
        <div className="flex gap-2 mb-8">
          {["theory", quiz ? "quiz" : null, "complete"].filter(Boolean).map((s, i) => (
            <div key={s!} className={`h-1.5 flex-1 rounded-full ${step === s ? "bg-primary" : i < ["theory", "quiz", "complete"].indexOf(step) ? "bg-primary/50" : "bg-muted"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === "theory" && (
            <motion.div key="theory" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Lesson</h2>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{content.theory}</p>
              </div>

              {content.example && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-foreground text-sm">Example Code</h3>
                  </div>
                  <pre className="bg-sidebar text-sidebar-foreground rounded-xl p-4 overflow-x-auto text-sm font-mono">
                    <code>{content.example}</code>
                  </pre>
                </div>
              )}

              {content.challenge && (
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-foreground mb-2">🏆 Challenge</h3>
                  <p className="text-sm text-muted-foreground mb-4">{content.challenge}</p>
                  {content.starter_code && (
                    <pre className="bg-sidebar text-sidebar-foreground rounded-xl p-4 overflow-x-auto text-sm font-mono">
                      <code>{content.starter_code}</code>
                    </pre>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => quiz ? setStep("quiz") : handleComplete()}>
                  {quiz ? "Take Quiz →" : "Complete Lesson ✓"}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "quiz" && quiz && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Quick Quiz</h2>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <p className="font-medium text-foreground mb-4">{quiz.question}</p>
                <div className="space-y-2">
                  {quiz.options.map((opt: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => !quizSubmitted && setQuizAnswer(i)}
                      disabled={quizSubmitted}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                        quizSubmitted && i === quiz.correct
                          ? "bg-primary/10 border-primary text-foreground"
                          : quizSubmitted && i === quizAnswer && i !== quiz.correct
                          ? "bg-destructive/10 border-destructive text-foreground"
                          : quizAnswer === i
                          ? "bg-primary/5 border-primary"
                          : "bg-card border-border hover:border-primary/30"
                      }`}
                    >
                      <span className="font-mono text-xs text-muted-foreground mr-2">{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep("theory")}>← Back</Button>
                {!quizSubmitted ? (
                  <Button onClick={handleQuizSubmit} disabled={quizAnswer === null}>Submit Answer</Button>
                ) : (
                  <Button onClick={handleComplete}>Complete Lesson ✓</Button>
                )}
              </div>
            </motion.div>
          )}

          {step === "complete" && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Lesson Complete! 🎉</h2>
              {xpEarned && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-4 py-2 rounded-full font-bold mb-4"
                >
                  <Star className="w-5 h-5" /> +{lesson.xp_reward} XP
                </motion.div>
              )}
              <p className="text-muted-foreground mb-6">Great work! Keep going to level up.</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate(-1)}>Back to Level</Button>
                <Button asChild>
                  <Link to="/platform/dashboard">Dashboard</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LessonPage;
