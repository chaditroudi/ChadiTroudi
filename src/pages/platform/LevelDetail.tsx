import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, BookOpen, Swords, Play,
  Star, Clock, Zap, Trophy, Sparkles, ChevronRight,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  order_index: number;
  xp_reward: number;
  lesson_type: string;
  language: string;
}

const LevelDetail = () => {
  const { levelId } = useParams();
  const { user, loading, requireAuth } = usePlatformAuth();
  const [level, setLevel] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [nextLevel, setNextLevel] = useState<any>(null);

  useEffect(() => { requireAuth(); }, [loading, user]);
  useEffect(() => { if (user && levelId) loadLevel(); }, [user, levelId]);

  const loadLevel = async () => {
    const [levelRes, lessonsRes, progressRes] = await Promise.all([
      supabase.from("platform_levels").select("*").eq("id", levelId!).single(),
      supabase.from("platform_lessons").select("*").eq("level_id", levelId!).order("order_index"),
      supabase.from("user_lesson_progress").select("lesson_id").eq("user_id", user!.id).eq("completed", true),
    ]);
    if (levelRes.data) {
      setLevel(levelRes.data);
      // Find the next level by number
      const { data: nextLvl } = await supabase
        .from("platform_levels")
        .select("id, number, title, icon")
        .gt("number", (levelRes.data as any).number)
        .order("number")
        .limit(1);
      if (nextLvl?.[0]) setNextLevel(nextLvl[0]);
    }
    if (lessonsRes.data) setLessons(lessonsRes.data as unknown as Lesson[]);
    if (progressRes.data) setCompletedIds(new Set(progressRes.data.map((p: any) => p.lesson_id)));
  };

  if (loading || !level) return (
    <div className="flex items-center justify-center py-32">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );

  const completedCount = lessons.filter(l => completedIds.has(l.id)).length;
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;
  const totalXp = lessons.reduce((sum, l) => sum + l.xp_reward, 0);
  const earnedXp = lessons.filter(l => completedIds.has(l.id)).reduce((sum, l) => sum + l.xp_reward, 0);
  const isAllComplete = progress === 100;

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HERO HEADER ─── */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-violet-500/5" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "24px 24px" }} />

        <motion.div animate={{ y: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-4 right-[10%] w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 py-8">
          <Link to="/platform/learn" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Journey
          </Link>
          {level.island_id && (
            <Link to={`/platform/island/${level.island_id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 ml-4 group">
              Back to Island
            </Link>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 border border-primary/20 flex items-center justify-center text-3xl shadow-lg">
                {level.icon}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">Level {level.number}</p>
                <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">{level.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{level.subtitle || level.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Stats chips */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-5">
            {[
              { icon: BookOpen, label: `${completedCount}/${lessons.length} lessons`, color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: Star, label: `${earnedXp}/${totalXp} XP earned`, color: "text-yellow-400", bg: "bg-yellow-500/10" },
              { icon: Clock, label: `~${lessons.length * 5} min`, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            ].map(s => (
              <div key={s.label} className={`flex items-center gap-1.5 ${s.bg} rounded-full px-3 py-1.5`}>
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                <span className="text-xs font-semibold text-foreground">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Progress bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground font-medium">Level progress</span>
              <span className={`font-bold ${isAllComplete ? "text-emerald-400" : "text-primary"}`}>{Math.round(progress)}%</span>
            </div>
            <div className="relative h-3 rounded-full bg-muted/30 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                className={`absolute inset-y-0 left-0 rounded-full ${
                  isAllComplete ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-primary to-violet-500"
                }`}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── LESSONS LIST ─── */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Section heading */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 rounded-full bg-primary" />
          <h2 className="text-lg font-bold text-foreground">Lessons</h2>
          {isAllComplete && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] ml-auto">
              <Trophy className="w-3 h-3 mr-1" /> Level Complete!
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          {lessons.map((lesson, i) => {
            const completed = completedIds.has(lesson.id);
            const isBoss = lesson.lesson_type === "boss";
            const isNext = !completed && (i === 0 || completedIds.has(lessons[i - 1]?.id));

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 120 }}
              >
                <Link
                  to={`/platform/lesson/${lesson.id}`}
                  className={`group block relative rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    isBoss
                      ? "border-orange-500/30 hover:border-orange-400 hover:shadow-orange-500/5"
                      : completed
                      ? "border-emerald-500/20 hover:border-emerald-400"
                      : isNext
                      ? "border-primary/30 hover:border-primary shadow-primary/5"
                      : "border-border/50 hover:border-primary/30"
                  }`}
                >
                  {/* Background */}
                  <div className={`absolute inset-0 ${
                    isBoss
                      ? "bg-gradient-to-r from-orange-500/5 via-red-500/5 to-yellow-500/5"
                      : completed
                      ? "bg-gradient-to-r from-emerald-500/5 to-teal-500/5"
                      : isNext
                      ? "bg-gradient-to-r from-primary/5 to-violet-500/5"
                      : "bg-card/50"
                  }`} />

                  {/* Next lesson indicator */}
                  {isNext && !completed && (
                    <motion.div
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-gradient-to-r from-primary/3 to-transparent"
                    />
                  )}

                  <div className="relative flex items-center gap-4 p-5">
                    {/* Order number / icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shrink-0 ${
                      completed
                        ? "bg-emerald-500/20 text-emerald-400"
                        : isBoss
                        ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-400"
                        : isNext
                        ? "bg-primary/15 text-primary ring-2 ring-primary/20"
                        : "bg-muted/50 text-muted-foreground"
                    }`}>
                      {completed ? <CheckCircle2 className="w-5 h-5" /> : isBoss ? <Swords className="w-6 h-6" /> : <span className="text-lg">{i + 1}</span>}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{lesson.title}</h3>
                        {isBoss && (
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[9px] font-bold">
                            <Swords className="w-2.5 h-2.5 mr-0.5" /> BOSS
                          </Badge>
                        )}
                        {completed && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[9px]">
                            <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Done
                          </Badge>
                        )}
                        {isNext && !completed && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] animate-pulse">
                            <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Next
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{lesson.description}</p>
                      {lesson.language && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-muted-foreground bg-muted/50 rounded px-1.5 py-0.5 font-mono">{lesson.language}</span>
                        </div>
                      )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 bg-yellow-500/10 rounded-full px-2.5 py-1">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span className="text-[11px] font-bold text-yellow-400">+{lesson.xp_reward}</span>
                      </div>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        completed ? "bg-emerald-500/10" : "bg-muted/30 group-hover:bg-primary/10"
                      }`}>
                        {completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Level complete celebration */}
        {isAllComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center py-10 rounded-2xl border-2 border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-emerald-500/5"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 8, delay: 0.7 }}
              className="text-5xl mb-3"
            >🎉</motion.div>
            <h3 className="text-xl font-black text-foreground mb-1">Level {level.number} Complete!</h3>
            <p className="text-sm text-muted-foreground mb-4">You've earned <strong className="text-yellow-400">{totalXp} XP</strong> from this level</p>
            <div className="flex gap-3 justify-center flex-wrap">
              {nextLevel ? (
                <Link
                  to={`/platform/level/${nextLevel.id}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-violet-600 text-primary-foreground font-bold px-6 py-2.5 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                >
                  Next Level: {nextLevel.icon} {nextLevel.title} <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/platform/learn"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-6 py-2.5 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-yellow-500/20"
                >
                  <Trophy className="w-4 h-4" /> All Levels Mastered!
                </Link>
              )}
              <Link
                to="/platform/learn"
                className="inline-flex items-center gap-2 bg-card border border-border text-foreground font-bold px-6 py-2.5 rounded-xl hover:bg-muted transition-all"
              >
                Learning Path
              </Link>
              {level.island_id && (
                <Link
                  to={`/platform/island/${level.island_id}`}
                  className="inline-flex items-center gap-2 bg-card border border-border text-foreground font-bold px-6 py-2.5 rounded-xl hover:bg-muted transition-all"
                >
                  Back to Island
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default LevelDetail;
