import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft, CheckCircle2, BookOpen, Swords, Play,
  Lock, Star, Trophy, Sparkles, MapPin
} from "lucide-react";

interface Island {
  id: string;
  name: string;
  description: string;
  icon: string;
  order_index: number;
  color: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  order_index: number;
  xp_reward: number;
  lesson_type: string;
  language: string;
  is_boss: boolean;
}

const IslandDetail = () => {
  const { islandId } = useParams();
  const navigate = useNavigate();
  const { user, loading, requireAuth } = usePlatformAuth();
  const [island, setIsland] = useState<Island | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [islandProgress, setIslandProgress] = useState<any>(null);

  useEffect(() => { requireAuth(); }, [loading, user]);

  useEffect(() => {
    if (!user || !islandId) return;
    loadIsland();
  }, [user, islandId]);

  const loadIsland = async () => {
    const [islandRes, levelsRes, progressRes, islandProgressRes] = await Promise.all([
      supabase.from("islands").select("*").eq("id", islandId!).single(),
      supabase.from("platform_levels").select("id, island_id").eq("island_id", islandId!),
      supabase.from("user_lesson_progress").select("lesson_id").eq("user_id", user!.id).eq("completed", true),
      supabase.from("island_progress").select("*").eq("user_id", user!.id).eq("island_id", islandId!).maybeSingle(),
    ]);

    if (islandRes.data) setIsland(islandRes.data as unknown as Island);
    if (islandProgressRes.data) setIslandProgress(islandProgressRes.data);

    // Get lessons for levels linked to this island
    if (levelsRes.data && levelsRes.data.length > 0) {
      const levelIds = levelsRes.data.map((l: any) => l.id);
      const { data: lessonsData } = await supabase
        .from("platform_lessons")
        .select("*")
        .in("level_id", levelIds)
        .order("order_index");
      if (lessonsData) setLessons(lessonsData as unknown as Lesson[]);
    } else {
      // If no levels linked yet, load all lessons for display
      const { data: allLessons } = await supabase
        .from("platform_lessons")
        .select("*")
        .order("order_index")
        .limit(10);
      if (allLessons) setLessons(allLessons as unknown as Lesson[]);
    }

    if (progressRes.data) {
      setCompletedIds(new Set(progressRes.data.map((p: any) => p.lesson_id)));
    }
  };

  const completionPct = lessons.length > 0
    ? Math.round((Array.from(completedIds).filter(id => lessons.some(l => l.id === id)).length / lessons.length) * 100)
    : 0;

  const bossReady = completionPct >= 80;
  const bossCompleted = islandProgress?.boss_completed || false;

  const handleBossComplete = async () => {
    if (!user || !islandId) return;

    // Upsert island progress
    await supabase.from("island_progress").upsert({
      user_id: user.id,
      island_id: islandId,
      completion_percentage: 100,
      boss_completed: true,
      unlocked: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,island_id" });

    // Award bonus XP
    await supabase.from("xp_logs").insert({
      user_id: user.id,
      amount: 200,
      source: "island_boss",
      description: `Boss defeated: ${island?.name}`,
    });

    const { data: profile } = await supabase
      .from("student_profiles")
      .select("total_xp")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      await supabase.from("student_profiles")
        .update({ total_xp: (profile as any).total_xp + 200, last_active_at: new Date().toISOString() })
        .eq("user_id", user.id);
    }

    toast.success(`🏆 Boss defeated! You've mastered ${island?.name}! +200 XP`);
    navigate("/platform/world-map");
  };

  if (loading || !island) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading island...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/platform/world-map" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-2xl">{island.icon}</span>
          <div>
            <h1 className="font-display font-bold text-foreground">Island {island.order_index}: {island.name}</h1>
            <p className="text-xs text-muted-foreground">{island.description}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Island Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{island.icon}</span>
              <div>
                <h2 className="font-bold text-foreground text-lg">{island.name}</h2>
                <p className="text-sm text-muted-foreground">{island.description}</p>
              </div>
            </div>
            {bossCompleted && (
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-bold">Mastered!</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>{completionPct}% Complete</span>
            <span>{Array.from(completedIds).filter(id => lessons.some(l => l.id === id)).length}/{lessons.length} lessons</span>
          </div>
          <Progress value={completionPct} className="h-3" />

          {bossReady && !bossCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  <Swords className="w-6 h-6 text-orange-500" />
                </motion.div>
                <div>
                  <p className="font-bold text-foreground text-sm">Boss Challenge Unlocked!</p>
                  <p className="text-xs text-muted-foreground">Defeat the boss to unlock the next island</p>
                </div>
              </div>
              <Button onClick={handleBossComplete} className="bg-orange-500 hover:bg-orange-600 text-white gap-1">
                <Swords className="w-4 h-4" /> Fight Boss
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Lessons List */}
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Island Lessons
        </h3>

        <div className="space-y-3">
          {lessons.length > 0 ? lessons.map((lesson, i) => {
            const completed = completedIds.has(lesson.id);
            const isBoss = (lesson as any).is_boss || lesson.lesson_type === "boss";

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
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
                      {completed ? <CheckCircle2 className="w-5 h-5" /> : isBoss ? <Swords className="w-5 h-5" /> : <span className="text-sm font-bold">{i + 1}</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground text-sm">{lesson.title}</h4>
                        {isBoss && <Badge variant="outline" className="text-[10px] text-orange-500 border-orange-500/30">BOSS</Badge>}
                        {completed && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{lesson.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] gap-0.5">
                      <Star className="w-2.5 h-2.5 text-yellow-500" /> +{lesson.xp_reward}
                    </Badge>
                    <Play className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              </motion.div>
            );
          }) : (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Lessons for this island are being prepared!</p>
              <p className="text-xs mt-1">Check back soon or explore other islands.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IslandDetail;
