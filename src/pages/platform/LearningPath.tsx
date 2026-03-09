import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle2, ChevronRight } from "lucide-react";

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

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const [levelsRes, profileRes, lessonsRes, progressRes] = await Promise.all([
      supabase.from("platform_levels").select("*").order("number"),
      supabase.from("student_profiles").select("total_xp, current_level").eq("user_id", user!.id).single(),
      supabase.from("platform_lessons").select("id, level_id"),
      supabase.from("user_lesson_progress").select("lesson_id").eq("user_id", user!.id).eq("completed", true),
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

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/platform/dashboard" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-foreground">Learning Path</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="relative">
          {/* Vertical path line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          <div className="space-y-6">
            {levels.map((level, i) => {
              const unlocked = totalXp >= level.required_xp;
              const isCurrent = level.number === currentLevel;
              const counts = lessonCounts[level.id] || { total: 0, completed: 0 };
              const progress = counts.total > 0 ? (counts.completed / counts.total) * 100 : 0;

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={unlocked ? `/platform/level/${level.id}` : "#"}
                    className={`block relative md:ml-16 rounded-xl border p-6 transition-all ${
                      isCurrent
                        ? "bg-primary/5 border-primary shadow-lg"
                        : unlocked
                        ? "bg-card border-border hover:border-primary/40 hover:shadow-md"
                        : "bg-muted/20 border-border/50 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {/* Node on the path */}
                    <div className={`hidden md:flex absolute -left-[4.5rem] top-6 w-8 h-8 rounded-full items-center justify-center text-sm ${
                      progress === 100
                        ? "bg-primary text-primary-foreground"
                        : unlocked
                        ? "bg-card border-2 border-primary text-primary"
                        : "bg-muted border-2 border-border text-muted-foreground"
                    }`}>
                      {progress === 100 ? <CheckCircle2 className="w-4 h-4" /> : level.number}
                    </div>

                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{level.icon}</span>
                          <h3 className="font-bold text-foreground">Level {level.number}: {level.title}</h3>
                          {isCurrent && <Badge className="bg-primary text-primary-foreground text-[10px]">Current</Badge>}
                          {!unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                        {unlocked && counts.total > 0 && (
                          <div>
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>{counts.completed}/{counts.total} lessons</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        )}
                        {!unlocked && (
                          <p className="text-xs text-muted-foreground">🔒 Requires {level.required_xp} XP</p>
                        )}
                      </div>
                      {unlocked && <ChevronRight className="w-5 h-5 text-muted-foreground mt-1" />}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningPath;
