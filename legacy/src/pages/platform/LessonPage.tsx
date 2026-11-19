import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, Star, BookOpen, Code2, HelpCircle,
  Sparkles, Zap, Trophy, ChevronRight, Lightbulb, Eye, EyeOff,
  RotateCcw, Home,
} from "lucide-react";
import { XpPopup, playCorrectSound, playWrongSound } from "@/components/platform/XpPopup";

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
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [step, setStep] = useState<"theory" | "quiz" | "complete">("theory");
  const [nextLesson, setNextLesson] = useState<any>(null);
  const [levelComplete, setLevelComplete] = useState(false);
  const [nextLevel, setNextLevel] = useState<any>(null);

  useEffect(() => { requireAuth(); }, [loading, user]);
  useEffect(() => { if (user && lessonId) loadLesson(); }, [user, lessonId]);

  const loadLesson = async () => {
    const [lessonRes, progressRes] = await Promise.all([
      supabase.from("platform_lessons").select("*").eq("id", lessonId!).single(),
      supabase.from("user_lesson_progress").select("completed").eq("user_id", user!.id).eq("lesson_id", lessonId!).maybeSingle(),
    ]);
    if (lessonRes.data) {
      setLesson(lessonRes.data);
      // Load sibling lessons to find the next one
      const levelId = (lessonRes.data as any).level_id;
      const [siblingsRes, allProgressRes, levelRes] = await Promise.all([
        supabase.from("platform_lessons").select("id, order_index, title").eq("level_id", levelId).order("order_index"),
        supabase.from("user_lesson_progress").select("lesson_id").eq("user_id", user!.id).eq("completed", true),
        supabase.from("platform_levels").select("id, number").eq("id", levelId).single(),
      ]);
      const siblings = siblingsRes.data || [];
      const completedSet = new Set((allProgressRes.data || []).map((p: any) => p.lesson_id));
      const currentIdx = siblings.findIndex((l: any) => l.id === lessonId);
      // Find next uncompleted lesson in this level
      const next = siblings.find((l: any, i: number) => i > currentIdx && !completedSet.has(l.id));
      setNextLesson(next || null);
      // Check if all lessons in this level will be complete after this one
      const willBeComplete = siblings.every((l: any) => l.id === lessonId || completedSet.has(l.id));
      if (willBeComplete && levelRes.data) {
        setLevelComplete(true);
        // Find next level
        const { data: nextLvl } = await supabase
          .from("platform_levels")
          .select("id, number, title, icon")
          .gt("number", (levelRes.data as any).number)
          .order("number")
          .limit(1);
        if (nextLvl?.[0]) setNextLevel(nextLvl[0]);
      }
    }
    if (progressRes.data?.completed) {
      setCompleted(true);
      setStep("complete");
    }
  };

  const content = lesson?.content || {};
  const quiz = content.quiz?.[0];
  const steps = ["theory", ...(quiz ? ["quiz"] : []), "complete"] as const;
  const stepIndex = steps.indexOf(step);

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (quizAnswer === quiz?.correct) {
      playCorrectSound();
      toast.success("Correct! 🎉");
    } else {
      playWrongSound();
      toast.error("Not quite — try reviewing the lesson.");
    }
  };

  const handleComplete = async () => {
    if (!user || !lesson || completed) return;

    await supabase.from("user_lesson_progress").upsert({
      user_id: user.id,
      lesson_id: lesson.id,
      completed: true,
      score: quizAnswer === quiz?.correct ? 100 : 70,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" });

    const { data: existingXp } = await supabase
      .from("xp_logs")
      .select("id")
      .eq("user_id", user.id)
      .eq("source", "lesson")
      .eq("description", `Completed: ${lesson.title}`)
      .maybeSingle();

    if (!existingXp) {
      await supabase.from("xp_logs").insert({
        user_id: user.id,
        amount: lesson.xp_reward,
        source: "lesson",
        description: `Completed: ${lesson.title}`,
      });

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

      // Update island progress if this lesson is part of an island
      if (lesson.level_id) {
        const { data: levelData } = await supabase
          .from("platform_levels")
          .select("island_id")
          .eq("id", lesson.level_id)
          .single();
        if (levelData && (levelData as any).island_id) {
          const islandId = (levelData as any).island_id;
          // Count all lessons in that island
          const { data: islandLevels } = await supabase
            .from("platform_levels")
            .select("id")
            .eq("island_id", islandId);
          if (islandLevels) {
            const levelIds = islandLevels.map((l: any) => l.id);
            const { data: islandLessons } = await supabase
              .from("platform_lessons")
              .select("id")
              .in("level_id", levelIds);
            const { data: islandCompleted } = await supabase
              .from("user_lesson_progress")
              .select("lesson_id")
              .eq("user_id", user.id)
              .eq("completed", true);
            if (islandLessons && islandCompleted) {
              const completedSet = new Set((islandCompleted).map((p: any) => p.lesson_id));
              // +1 for the current lesson being completed now
              const countDone = islandLessons.filter((l: any) => l.id === lesson.id || completedSet.has(l.id)).length;
              const pct = Math.round((countDone / islandLessons.length) * 100);
              await supabase.from("island_progress").upsert({
                user_id: user.id,
                island_id: islandId,
                completion_percentage: pct,
                unlocked: true,
              }, { onConflict: "user_id,island_id" });
            }
          }
        }
      }

      setXpEarned(true);
      setShowXpPopup(true);
    }
    setCompleted(true);
    setStep("complete");
  };

  if (loading || !lesson) return (
    <div className="flex items-center justify-center py-32">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <XpPopup show={showXpPopup} xp={lesson?.xp_reward || 0} onComplete={() => setShowXpPopup(false)} />

      {/* ─── STICKY HEADER ─── */}
      <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="font-bold text-foreground text-sm truncate max-w-[200px] sm:max-w-none">{lesson.title}</h1>
            <div className="flex items-center gap-1.5 bg-yellow-500/10 rounded-full px-2.5 py-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-[11px] font-bold text-yellow-400">+{lesson.xp_reward} XP</span>
            </div>
          </div>

          {/* Step progress indicator */}
          <div className="flex items-center gap-2">
            {steps.map((s, i) => {
              const isActive = i === stepIndex;
              const isDone = i < stepIndex;
              const icons = { theory: BookOpen, quiz: HelpCircle, complete: CheckCircle2 };
              const labels = { theory: "Learn", quiz: "Quiz", complete: "Done" };
              const Icon = icons[s];

              return (
                <div key={s} className="flex items-center flex-1">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary/15 text-primary"
                      : isDone
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-muted-foreground/50"
                  }`}>
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{labels[s]}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 rounded-full ${isDone ? "bg-emerald-500/30" : "bg-border/50"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* ────── THEORY STEP ────── */}
          {step === "theory" && (
            <motion.div key="theory" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: "spring", stiffness: 200, damping: 25 }}>

              {/* Theory content card */}
              <div className="relative rounded-2xl border-2 border-border/50 overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-violet-500/3" />
                <div className="relative p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-xl font-black text-foreground">Lesson Content</h2>
                  </div>

                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap text-[15px]">{content.theory}</p>
                  </div>
                </div>
              </div>

              {/* Code example */}
              {content.example && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-foreground">Example Code</h3>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden border-2 border-border/30">
                    <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/30">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono uppercase">{lesson.language || "code"}</span>
                    </div>
                    <pre className="bg-sidebar text-sidebar-foreground p-5 overflow-x-auto text-sm font-mono leading-relaxed">
                      <code>{content.example}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Challenge */}
              {content.challenge && (
                <div className="mb-6">
                  <div className="relative rounded-2xl border-2 border-orange-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/3 to-yellow-500/5" />
                    <div className="relative p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-orange-400" />
                        </div>
                        <h3 className="font-bold text-foreground">Challenge</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{content.challenge}</p>
                      {content.starter_code && (
                        <div className="rounded-xl overflow-hidden border border-border/30">
                          <div className="flex items-center px-4 py-2 bg-muted/30 border-b border-border/30">
                            <span className="text-[10px] text-muted-foreground font-mono">starter code</span>
                          </div>
                          <pre className="bg-sidebar text-sidebar-foreground p-4 overflow-x-auto text-sm font-mono">
                            <code>{content.starter_code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action */}
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => quiz ? setStep("quiz") : handleComplete()}
                  className="group rounded-xl px-6 h-12 font-bold text-sm bg-gradient-to-r from-primary to-violet-600 hover:brightness-110 shadow-lg shadow-primary/20"
                >
                  {quiz ? (
                    <>Take Quiz <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></>
                  ) : (
                    <>Complete Lesson <CheckCircle2 className="w-4 h-4 ml-1" /></>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ────── QUIZ STEP ────── */}
          {step === "quiz" && quiz && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: "spring", stiffness: 200, damping: 25 }}>

              <div className="relative rounded-2xl border-2 border-border/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/3 via-transparent to-primary/3" />

                <div className="relative p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-violet-400" />
                    </div>
                    <h2 className="text-xl font-black text-foreground">Knowledge Check</h2>
                  </div>

                  <p className="font-semibold text-foreground text-lg mb-6 leading-relaxed">{quiz.question}</p>

                  <div className="space-y-3">
                    {quiz.options.map((opt: string, i: number) => {
                      const isCorrect = i === quiz.correct;
                      const isSelected = quizAnswer === i;
                      const showCorrect = quizSubmitted && isCorrect;
                      const showWrong = quizSubmitted && isSelected && !isCorrect;

                      return (
                        <motion.button
                          key={i}
                          whileHover={!quizSubmitted ? { scale: 1.01 } : {}}
                          whileTap={!quizSubmitted ? { scale: 0.99 } : {}}
                          onClick={() => !quizSubmitted && setQuizAnswer(i)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all text-sm flex items-center gap-3 ${
                            showCorrect
                              ? "bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/20"
                              : showWrong
                              ? "bg-destructive/10 border-destructive/40 ring-1 ring-destructive/20"
                              : isSelected
                              ? "bg-primary/10 border-primary/40 ring-1 ring-primary/20"
                              : "bg-card/50 border-border/40 hover:border-primary/30 hover:bg-primary/5"
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            showCorrect
                              ? "bg-emerald-500/20 text-emerald-400"
                              : showWrong
                              ? "bg-destructive/20 text-destructive"
                              : isSelected
                              ? "bg-primary/20 text-primary"
                              : "bg-muted/50 text-muted-foreground"
                          }`}>
                            {showCorrect ? <CheckCircle2 className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                          </div>
                          <span className="font-medium">{opt}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Hint toggle */}
                  {content.hint && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {showHint ? <EyeOff className="w-3.5 h-3.5" /> : <Lightbulb className="w-3.5 h-3.5" />}
                        {showHint ? "Hide hint" : "Show hint"}
                      </button>
                      <AnimatePresence>
                        {showHint && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-muted-foreground bg-muted/20 rounded-xl p-3 mt-2">{content.hint}</motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Quiz result feedback */}
                  {quizSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-6 rounded-2xl p-4 border ${
                        quizAnswer === quiz.correct
                          ? "bg-emerald-500/10 border-emerald-500/20"
                          : "bg-orange-500/10 border-orange-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {quizAnswer === quiz.correct ? (
                          <>
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-bold text-emerald-400">Perfect! You nailed it!</span>
                          </>
                        ) : (
                          <>
                            <Lightbulb className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-bold text-orange-400">Not quite — the correct answer is highlighted above.</span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-6">
                <Button variant="ghost" onClick={() => { setStep("theory"); setQuizAnswer(null); setQuizSubmitted(false); }}
                  className="rounded-xl">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Review Lesson
                </Button>
                {!quizSubmitted ? (
                  <Button onClick={handleQuizSubmit} disabled={quizAnswer === null}
                    className="rounded-xl px-6 h-11 font-bold bg-gradient-to-r from-violet-600 to-primary hover:brightness-110 shadow-lg shadow-violet-500/20">
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleComplete}
                    className="rounded-xl px-6 h-11 font-bold bg-gradient-to-r from-primary to-emerald-600 hover:brightness-110 shadow-lg shadow-primary/20">
                    Complete Lesson <CheckCircle2 className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* ────── COMPLETE STEP ────── */}
          {step === "complete" && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
              <div className="relative rounded-2xl border-2 border-emerald-500/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/3 to-primary/5" />

                {/* Animated sparkle dots */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.2, 0.6, 0.2] }}
                    transition={{ repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.3 }}
                    className="absolute w-1.5 h-1.5 bg-primary/40 rounded-full"
                    style={{ top: `${15 + (i * 15) % 70}%`, left: `${10 + (i * 20) % 80}%` }}
                  />
                ))}

                <div className="relative text-center py-16 px-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 8, delay: 0.2 }}
                    className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                    >
                      <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                    </motion.div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-black text-foreground mb-2"
                  >
                    Lesson Complete!
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground mb-6"
                  >
                    Outstanding work! Keep pushing forward.
                  </motion.p>

                  {xpEarned && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", delay: 0.5 }}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/15 to-orange-500/15 border border-yellow-500/30 text-yellow-500 px-6 py-3 rounded-2xl font-black text-lg mb-6"
                    >
                      <Star className="w-6 h-6 fill-yellow-400" />
                      +{lesson.xp_reward} XP
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-3 justify-center flex-wrap"
                  >
                    {nextLesson && !levelComplete ? (
                      <Button
                        asChild
                        className="rounded-xl h-11 px-6 bg-gradient-to-r from-primary to-violet-600 hover:brightness-110 shadow-lg shadow-primary/20 font-bold"
                      >
                        <Link to={`/platform/lesson/${nextLesson.id}`}>
                          Next Lesson <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    ) : levelComplete && nextLevel ? (
                      <Button
                        asChild
                        className="rounded-xl h-11 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 shadow-lg shadow-emerald-500/20 font-bold"
                      >
                        <Link to={`/platform/level/${nextLevel.id}`}>
                          <Trophy className="w-4 h-4 mr-1.5" /> Next Level: {nextLevel.icon} {nextLevel.title}
                        </Link>
                      </Button>
                    ) : levelComplete ? (
                      <Button
                        asChild
                        className="rounded-xl h-11 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:brightness-110 shadow-lg shadow-yellow-500/20 font-bold"
                      >
                        <Link to="/platform/learn">
                          <Trophy className="w-4 h-4 mr-1.5" /> All Levels Complete!
                        </Link>
                      </Button>
                    ) : null}
                    <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl h-11 px-5">
                      <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Level
                    </Button>
                    <Button asChild variant="outline" className="rounded-xl h-11 px-5">
                      <Link to="/platform/learn">
                        <Home className="w-4 h-4 mr-1.5" /> Learning Path
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LessonPage;
