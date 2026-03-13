import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Lock, CheckCircle2, ChevronRight, Star, Flame, Trophy,
  Sparkles, BookOpen, Zap, TrendingUp, Target,
} from "lucide-react";

/* ── gradient palettes per level tier ── */
const tierGradients = [
  "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
  "from-blue-500/20 via-indigo-500/10 to-violet-500/20",
  "from-violet-500/20 via-purple-500/10 to-fuchsia-500/20",
  "from-amber-500/20 via-orange-500/10 to-red-500/20",
];

const tierBorders = [
  "border-emerald-500/30 hover:border-emerald-400",
  "border-blue-500/30 hover:border-blue-400",
  "border-violet-500/30 hover:border-violet-400",
  "border-amber-500/30 hover:border-amber-400",
];

const tierAccents = [
  "text-emerald-400",
  "text-blue-400",
  "text-violet-400",
  "text-amber-400",
];

const tierNodeBg = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-amber-500",
];

interface Level {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  required_xp: number;
}

const LearningPath = () => {
  const { user, loading, requireAuth } = usePlatformAuth();
  const [levels, setLevels] = useState<Level[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [lessonCounts, setLessonCounts] = useState<Record<string, { total: number; completed: number }>>({});

  useEffect(() => { requireAuth(); }, [loading, user]);
  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    const [levelsRes, profileRes, lessonsRes, progressRes] = await Promise.all([
      supabase.from("platform_levels").select("*").order("number"),
      supabase.from("student_profiles").select("total_xp, current_level").eq("user_id", user.id).single(),
      supabase.from("platform_lessons").select("id, level_id"),
      supabase.from("user_lesson_progress").select("lesson_id").eq("user_id", user.id).eq("completed", true),
    ]);

    if (levelsRes.data) setLevels(levelsRes.data as unknown as Level[]);
    if (profileRes.data) {
      setTotalXp((profileRes.data as any).total_xp);
      setCurrentLevel((profileRes.data as any).current_level);
    }
    if (lessonsRes.data && progressRes.data) {
      const completedIds = new Set(progressRes.data.map((p: any) => p.lesson_id));
      const counts: Record<string, { total: number; completed: number }> = {};
      lessonsRes.data.forEach((l: any) => {
        if (!counts[l.level_id]) counts[l.level_id] = { total: 0, completed: 0 };
        counts[l.level_id].total++;
        if (completedIds.has(l.id)) counts[l.level_id].completed++;
      });
      setLessonCounts(counts);
    }
  };

  /* ── computed stats ── */
  const stats = useMemo(() => {
    let totalLessons = 0, completedLessons = 0, completedLevels = 0;
    Object.values(lessonCounts).forEach(c => {
      totalLessons += c.total;
      completedLessons += c.completed;
      if (c.total > 0 && c.completed === c.total) completedLevels++;
    });
    return { totalLessons, completedLessons, completedLevels };
  }, [lessonCounts]);

  const nextLevelXp = useMemo(() => {
    const next = levels.find(l => l.required_xp > totalXp);
    return next ? next.required_xp : totalXp;
  }, [levels, totalXp]);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HERO BANNER ─── */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-violet-500/5" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        {/* Floating orbs */}
        <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-8 right-[15%] w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <motion.div animate={{ y: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute -bottom-10 left-[10%] w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 py-10 md:py-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Learning Journey</h1>
                <p className="text-sm text-muted-foreground">Master each level to unlock the next chapter</p>
              </div>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { icon: Star, label: "Total XP", value: totalXp.toLocaleString(), color: "text-yellow-400", bg: "bg-yellow-500/10" },
              { icon: Target, label: "Current Level", value: `Level ${currentLevel}`, color: "text-primary", bg: "bg-primary/10" },
              { icon: BookOpen, label: "Lessons Done", value: `${stats.completedLessons}/${stats.totalLessons}`, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { icon: Trophy, label: "Levels Cleared", value: `${stats.completedLevels}/${levels.length}`, color: "text-violet-400", bg: "bg-violet-500/10" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }}
                className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-4 hover:border-primary/20 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className="text-xl font-black text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* XP progress to next level */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-5 bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" /> Progress to next level
              </span>
              <span className="text-xs font-bold text-primary">{totalXp} / {nextLevelXp} XP</span>
            </div>
            <div className="relative h-3 rounded-full bg-muted/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalXp / nextLevelXp) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 rounded-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── LEVEL ROADMAP ─── */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="relative">
          {/* Animated vertical path line */}
          <div className="absolute left-[27px] md:left-[39px] top-0 bottom-0 w-[3px] rounded-full overflow-hidden hidden md:block">
            <div className="w-full h-full bg-border/40" />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${levels.length > 0 ? ((currentLevel - 1) / levels.length) * 100 : 0}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-violet-500 to-primary/30 rounded-full"
            />
          </div>

          <div className="space-y-4">
            {levels.map((level, i) => {
              // A level is unlocked if:
              // 1. It's the first level, OR
              // 2. The user has enough XP, OR
              // 3. The user's current_level is >= this level's number, OR
              // 4. The previous level's lessons are all completed
              const prevLevel = i > 0 ? levels[i - 1] : null;
              const prevComplete = prevLevel ? (lessonCounts[prevLevel.id]?.total > 0 && lessonCounts[prevLevel.id]?.completed === lessonCounts[prevLevel.id]?.total) : true;
              const unlocked = i === 0 || totalXp >= level.required_xp || currentLevel >= level.number || prevComplete;
              const isCurrent = level.number === currentLevel;
              const counts = lessonCounts[level.id] || { total: 0, completed: 0 };
              const progress = counts.total > 0 ? (counts.completed / counts.total) * 100 : 0;
              const isComplete = counts.total > 0 && progress === 100;
              const tier = Math.min(Math.floor(i / 2), 3);
              // Show "NEXT" badge on the first unlocked, non-complete level that is not current
              const isNext = unlocked && !isComplete && !isCurrent && (i === 0 || (prevComplete && level.number > currentLevel));

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, x: -30, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                >
                  <Link
                    to={unlocked ? `/platform/level/${level.id}` : "#"}
                    className={`group block relative md:ml-20 rounded-2xl border-2 p-0 overflow-hidden transition-all duration-300 ${
                      !unlocked ? "opacity-40 cursor-not-allowed grayscale" : ""
                    } ${isCurrent ? `${tierBorders[tier]} shadow-lg shadow-primary/5 ring-1 ring-primary/10` : unlocked ? `${tierBorders[tier]} hover:shadow-xl hover:shadow-primary/5` : "border-border/30"}`}
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${unlocked ? tierGradients[tier] : "from-muted/10 to-muted/5"} opacity-60 group-hover:opacity-100 transition-opacity`} />

                    {/* Animated glow for current level */}
                    {isCurrent && (
                      <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
                      />
                    )}

                    {/* Path node */}
                    <div className={`hidden md:flex absolute -left-[4.75rem] top-8 w-12 h-12 rounded-2xl items-center justify-center text-sm font-bold shadow-lg transition-all duration-300 ${
                      isComplete
                        ? `${tierNodeBg[tier]} text-white shadow-lg`
                        : isCurrent
                        ? "bg-card border-2 border-primary text-primary ring-4 ring-primary/20"
                        : unlocked
                        ? "bg-card border-2 border-border text-muted-foreground group-hover:border-primary/40"
                        : "bg-muted/50 border-2 border-border/30 text-muted-foreground/50"
                    }`}>
                      {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-lg">{level.icon}</span>}
                    </div>

                    {/* Pulse ring on current */}
                    {isCurrent && (
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="hidden md:block absolute -left-[4.75rem] top-8 w-12 h-12 rounded-2xl border-2 border-primary"
                      />
                    )}

                    <div className="relative p-5 md:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Level header */}
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-2xl md:hidden">{level.icon}</span>
                            <span className={`text-[11px] font-bold uppercase tracking-widest ${unlocked ? tierAccents[tier] : "text-muted-foreground/50"}`}>
                              Level {level.number}
                            </span>
                            {isCurrent && (
                              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold animate-pulse">
                                <Sparkles className="w-3 h-3 mr-1" /> CURRENT
                              </Badge>
                            )}
                            {isComplete && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> COMPLETE
                              </Badge>
                            )}
                            {!unlocked && (
                              <Badge variant="outline" className="text-[10px] text-muted-foreground/50 border-border/30">
                                <Lock className="w-3 h-3 mr-1" /> LOCKED
                              </Badge>
                            )}
                            {isNext && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] font-bold animate-pulse">
                                <ChevronRight className="w-3 h-3 mr-1" /> UP NEXT
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg md:text-xl font-black text-foreground mb-1 group-hover:text-primary transition-colors">
                            {level.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{level.description}</p>

                          {/* Progress bar for unlocked levels */}
                          {unlocked && counts.total > 0 && (
                            <div className="mt-4">
                              <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-muted-foreground font-medium flex items-center gap-1">
                                  <BookOpen className="w-3 h-3" /> {counts.completed}/{counts.total} lessons
                                </span>
                                <span className={`font-bold ${isComplete ? "text-emerald-400" : tierAccents[tier]}`}>
                                  {Math.round(progress)}%
                                </span>
                              </div>
                              <div className="relative h-2.5 rounded-full bg-muted/30 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                                  className={`absolute inset-y-0 left-0 rounded-full ${
                                    isComplete ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-primary to-violet-500"
                                  }`}
                                />
                              </div>
                            </div>
                          )}

                          {/* XP requirement for locked */}
                          {!unlocked && (
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground/60 bg-muted/20 rounded-full px-3 py-1">
                                <Lock className="w-3 h-3" />
                                <span>Requires <strong>{level.required_xp.toLocaleString()} XP</strong> or complete previous level</span>
                              </div>
                              {level.required_xp > totalXp && (
                                <div className="text-xs text-muted-foreground/40">
                                  ({(level.required_xp - totalXp).toLocaleString()} XP to go)
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Right side chevron / indicator */}
                        {unlocked && (
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            isCurrent ? "bg-primary/10 group-hover:bg-primary/20" : "bg-muted/30 group-hover:bg-primary/10"
                          }`}>
                            <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-0.5 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Journey end marker */}
          {levels.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: levels.length * 0.1 + 0.3 }}
              className="md:ml-20 mt-6 text-center py-8 rounded-2xl border-2 border-dashed border-border/30"
            >
              <div className="text-4xl mb-2">🏆</div>
              <p className="font-bold text-foreground">Journey Master</p>
              <p className="text-xs text-muted-foreground">Complete all levels to earn the ultimate badge</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LearningPath;
