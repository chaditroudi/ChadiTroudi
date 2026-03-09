import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, BookOpen, Swords, Play,
  Star, Trophy, Sparkles, MapPin, Lock, Zap, Code2
} from "lucide-react";

interface Island {
  id: string;
  name: string;
  description: string;
  icon: string;
  order_index: number;
  color: string;
}

interface Level {
  id: string;
  number: number;
  title: string;
  icon: string;
  is_boss: boolean;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  order_index: number;
  xp_reward: number;
  lesson_type: string;
  language: string;
  level_id: string;
}

const IslandDetail = () => {
  const { islandId } = useParams();
  const navigate = useNavigate();
  const { user, loading, requireAuth } = usePlatformAuth();
  const [island, setIsland] = useState<Island | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [islandProgress, setIslandProgress] = useState<any>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => { requireAuth(); }, [loading, user]);

  useEffect(() => {
    if (!user || !islandId) return;
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(islandId)) {
      setLoadError(true);
      return;
    }
    loadIsland();
  }, [user, islandId]);

  const loadIsland = async () => {
    const [islandRes, levelsRes, progressRes, islandProgressRes] = await Promise.all([
      supabase.from("islands").select("*").eq("id", islandId!).single(),
      supabase.from("platform_levels").select("*").eq("island_id", islandId!).order("number"),
      supabase.from("user_lesson_progress").select("lesson_id").eq("user_id", user!.id).eq("completed", true),
      supabase.from("island_progress").select("*").eq("user_id", user!.id).eq("island_id", islandId!).maybeSingle(),
    ]);

    if (islandRes.error || !islandRes.data) {
      setLoadError(true);
      return;
    }
    setIsland(islandRes.data as unknown as Island);
    if (islandProgressRes.data) setIslandProgress(islandProgressRes.data);
    if (levelsRes.data) setLevels(levelsRes.data as unknown as Level[]);

    // Get lessons for linked levels
    if (levelsRes.data && levelsRes.data.length > 0) {
      const levelIds = levelsRes.data.map((l: any) => l.id);
      const { data: lessonsData } = await supabase
        .from("platform_lessons")
        .select("*")
        .in("level_id", levelIds)
        .order("order_index");
      if (lessonsData) setLessons(lessonsData as unknown as Lesson[]);
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
  const completedLessonCount = Array.from(completedIds).filter(id => lessons.some(l => l.id === id)).length;
  const totalXpAvailable = lessons.reduce((sum, l) => sum + l.xp_reward, 0);

  if (loadError) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-muted-foreground gap-4">
      <p>Island not found.</p>
      <Link to="/platform/world-map"><Button variant="outline">Back to World Map</Button></Link>
    </div>
  );

  if (loading || !island) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading island...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/platform/world-map" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-3xl">{island.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-foreground">Island {island.order_index}: {island.name}</h1>
              {bossCompleted && (
                <Badge className="bg-primary/10 text-primary border-primary/20 gap-1 text-[10px]">
                  <Trophy className="w-3 h-3" /> Mastered
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{island.description}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Island Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/60 rounded-2xl p-6 mb-8 relative overflow-hidden"
        >
          {/* Subtle gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <motion.span
                  className="text-5xl"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {island.icon}
                </motion.span>
                <div>
                  <h2 className="font-bold text-foreground text-xl">{island.name}</h2>
                  <p className="text-sm text-muted-foreground">{island.description}</p>
                </div>
              </div>
              {bossCompleted && (
                <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-2 rounded-full">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-bold">Mastered!</span>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-muted/30 rounded-xl p-3 text-center">
                <BookOpen className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{lessons.length}</p>
                <p className="text-[10px] text-muted-foreground">Lessons</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-3 text-center">
                <Zap className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{totalXpAvailable}</p>
                <p className="text-[10px] text-muted-foreground">Total XP</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-3 text-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{completedLessonCount}/{lessons.length}</p>
                <p className="text-[10px] text-muted-foreground">Completed</p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span className="font-medium">Island Progress</span>
              <span className="font-bold text-foreground">{completionPct}%</span>
            </div>
            <Progress value={completionPct} className="h-3" />
          </div>
        </motion.div>

        {/* Boss Challenge Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl border p-5 mb-8 ${
            bossCompleted
              ? "bg-primary/5 border-primary/20"
              : bossReady
              ? "bg-gradient-to-r from-orange-500/5 to-red-500/5 border-orange-500/30"
              : "bg-muted/20 border-border/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={bossReady && !bossCompleted ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  bossCompleted ? "bg-primary/10" : bossReady ? "bg-orange-500/10" : "bg-muted/30"
                }`}
              >
                {bossCompleted ? (
                  <Trophy className="w-6 h-6 text-primary" />
                ) : (
                  <Swords className={`w-6 h-6 ${bossReady ? "text-orange-500" : "text-muted-foreground"}`} />
                )}
              </motion.div>
              <div>
                <p className="font-bold text-foreground">
                  {bossCompleted ? "🏆 Boss Defeated!" : bossReady ? "⚔️ Boss Challenge Ready!" : "🔒 Boss Challenge Locked"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {bossCompleted
                    ? `You've mastered ${island.name}!`
                    : bossReady
                    ? "Defeat the boss to unlock the next island"
                    : `Complete 80% of lessons to unlock (${completionPct}%/80%)`
                  }
                </p>
              </div>
            </div>
            {bossReady && !bossCompleted && (
              <Button
                onClick={() => navigate(`/platform/boss/${islandId}`)}
                className="bg-orange-500 hover:bg-orange-600 text-white gap-1.5 shadow-lg shadow-orange-500/20"
              >
                <Swords className="w-4 h-4" /> Fight Boss
              </Button>
            )}
          </div>
        </motion.div>

        {/* Lessons List */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Island Lessons
          </h3>
          <Badge variant="secondary" className="text-xs">
            {completedLessonCount}/{lessons.length} done
          </Badge>
        </div>

        <div className="space-y-3">
          {lessons.length > 0 ? lessons.map((lesson, i) => {
            const completed = completedIds.has(lesson.id);
            const level = levels.find(l => l.id === lesson.level_id);

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/platform/lesson/${lesson.id}`}
                  className={`block rounded-xl border p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                    completed
                      ? "bg-primary/5 border-primary/20 hover:border-primary/40"
                      : "bg-card border-border/60 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      completed ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                    }`}>
                      {completed ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{i + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-foreground text-sm truncate">{lesson.title}</h4>
                        {completed && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{lesson.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[9px] border-border/40">
                          <Code2 className="w-2.5 h-2.5 mr-0.5" /> {lesson.language || "js"}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] border-border/40">
                          {lesson.lesson_type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="secondary" className="text-[10px] gap-0.5">
                        <Star className="w-2.5 h-2.5 text-yellow-500" /> +{lesson.xp_reward}
                      </Badge>
                      <Play className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          }) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-card/50 border border-border/30 rounded-2xl"
            >
              <MapPin className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground font-medium">Lessons for this island are being prepared!</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Check back soon or explore other islands.</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IslandDetail;
