import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, BookOpen, Swords, Play } from "lucide-react";

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

  useEffect(() => { requireAuth(); }, [loading, user]);

  useEffect(() => {
    if (!user || !levelId) return;
    loadLevel();
  }, [user, levelId]);

  const loadLevel = async () => {
    const [levelRes, lessonsRes, progressRes] = await Promise.all([
      supabase.from("platform_levels").select("*").eq("id", levelId!).single(),
      supabase.from("platform_lessons").select("*").eq("level_id", levelId!).order("order_index"),
      supabase.from("user_lesson_progress").select("lesson_id").eq("user_id", user!.id).eq("completed", true),
    ]);

    if (levelRes.data) setLevel(levelRes.data);
    if (lessonsRes.data) setLessons(lessonsRes.data as unknown as Lesson[]);
    if (progressRes.data) setCompletedIds(new Set(progressRes.data.map((p: any) => p.lesson_id)));
  };

  if (loading || !level) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/platform/learn" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-foreground">{level.icon} Level {level.number}: {level.title}</h1>
            <p className="text-xs text-muted-foreground">{level.subtitle}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-muted-foreground mb-8">{level.description}</p>

        <div className="space-y-3">
          {lessons.map((lesson, i) => {
            const completed = completedIds.has(lesson.id);
            const isBoss = lesson.lesson_type === "boss";

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/platform/lesson/${lesson.id}`}
                  className={`block rounded-xl border p-5 transition-all hover:shadow-md ${
                    isBoss
                      ? "bg-gradient-to-r from-orange-500/5 to-red-500/5 border-orange-500/20 hover:border-orange-500/40"
                      : completed
                      ? "bg-primary/5 border-primary/20"
                      : "bg-card border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      completed ? "bg-primary text-primary-foreground" : isBoss ? "bg-orange-500/10 text-orange-500" : "bg-muted text-muted-foreground"
                    }`}>
                      {completed ? <CheckCircle2 className="w-5 h-5" /> : isBoss ? <Swords className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground text-sm">{lesson.title}</h3>
                        {isBoss && <Badge variant="outline" className="text-[10px] text-orange-500 border-orange-500/30">BOSS</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{lesson.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-[10px]">+{lesson.xp_reward} XP</Badge>
                    </div>
                    <Play className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default LevelDetail;
