import { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, BookOpen, Swords, Play,
  Star, Trophy, Sparkles, MapPin, Lock, Zap, Code2,
  Waves, TreePine, Mountain, Anchor
} from "lucide-react";

// Island images
import island1 from "@/assets/islands/island-1-village.png";
import island2 from "@/assets/islands/island-2-forest.png";
import island3 from "@/assets/islands/island-3-mountains.png";
import island4 from "@/assets/islands/island-4-valley.png";
import island5 from "@/assets/islands/island-5-harbor.png";
import island6 from "@/assets/islands/island-6-algorithm.png";
import island7 from "@/assets/islands/island-7-project.png";
import island8 from "@/assets/islands/island-8-ai.png";

const ISLAND_IMAGES = [island1, island2, island3, island4, island5, island6, island7, island8];

// Theme configs per island
const ISLAND_THEMES: Record<number, {
  gradient: string;
  accent: string;
  particleEmoji: string[];
  bgEmoji: string[];
}> = {
  1: { gradient: "from-emerald-900 via-green-800 to-teal-900", accent: "#10b981", particleEmoji: ["🌿", "🍃", "🌱"], bgEmoji: ["🏠", "🌳", "🪵"] },
  2: { gradient: "from-green-900 via-emerald-900 to-lime-900", accent: "#22c55e", particleEmoji: ["🍂", "🌲", "🍄"], bgEmoji: ["🦊", "🐿️", "🌲"] },
  3: { gradient: "from-slate-900 via-blue-900 to-indigo-900", accent: "#6366f1", particleEmoji: ["❄️", "⛰️", "🪨"], bgEmoji: ["🦅", "⛰️", "🏔️"] },
  4: { gradient: "from-amber-900 via-orange-900 to-yellow-900", accent: "#f59e0b", particleEmoji: ["🌾", "🌻", "🦋"], bgEmoji: ["🌅", "🌻", "🏕️"] },
  5: { gradient: "from-cyan-900 via-blue-800 to-sky-900", accent: "#06b6d4", particleEmoji: ["⚓", "🐚", "🌊"], bgEmoji: ["⛵", "🐠", "🏖️"] },
  6: { gradient: "from-purple-900 via-violet-900 to-fuchsia-900", accent: "#a855f7", particleEmoji: ["⚡", "💎", "🔮"], bgEmoji: ["🧩", "⚙️", "💡"] },
  7: { gradient: "from-orange-900 via-red-900 to-rose-900", accent: "#ef4444", particleEmoji: ["🔥", "⚒️", "🛠️"], bgEmoji: ["🏗️", "📐", "🔧"] },
  8: { gradient: "from-indigo-900 via-purple-900 to-blue-900", accent: "#818cf8", particleEmoji: ["🤖", "✨", "💫"], bgEmoji: ["🧠", "🚀", "🌟"] },
};

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
  const [hoveredLesson, setHoveredLesson] = useState<string | null>(null);
  const [nextIsland, setNextIsland] = useState<Island | null>(null);

  useEffect(() => { requireAuth(); }, [loading, user]);

  useEffect(() => {
    if (!user || !islandId) return;
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

    // Find the next island
    const { data: nextIslandData } = await supabase
      .from("islands")
      .select("*")
      .gt("order_index", (islandRes.data as any).order_index)
      .order("order_index")
      .limit(1);
    if (nextIslandData?.[0]) setNextIsland(nextIslandData[0] as unknown as Island);

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

  const theme = island ? (ISLAND_THEMES[island.order_index] || ISLAND_THEMES[1]) : ISLAND_THEMES[1];
  const islandImg = island ? ISLAND_IMAGES[(island.order_index - 1) % ISLAND_IMAGES.length] : "";

  if (loadError) return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
      <p>Island not found.</p>
      <Link to="/platform/world-map"><Button variant="outline">Back to World Map</Button></Link>
    </div>
  );

  if (loading || !island) return (
    <div className={`flex items-center justify-center py-20 bg-gradient-to-b ${ISLAND_THEMES[1].gradient}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-4xl"
      >
        🧭
      </motion.div>
    </div>
  );

  return (
    <div className={`h-full bg-gradient-to-b ${theme.gradient} relative overflow-hidden`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Floating theme particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute text-lg opacity-15"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: 12 + Math.random() * 20,
            }}
            animate={{
              y: [0, -30 - Math.random() * 40, 0],
              x: [0, (Math.random() - 0.5) * 30, 0],
              rotate: [0, 360],
              opacity: [0.08, 0.2, 0.08],
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          >
            {theme.particleEmoji[i % theme.particleEmoji.length]}
          </motion.div>
        ))}

        {/* Ambient light orbs */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              width: 200 + i * 100,
              height: 200 + i * 100,
              background: `radial-gradient(circle, ${theme.accent}15 0%, transparent 70%)`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 25}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Decorative background emojis */}
        {theme.bgEmoji.map((emoji, i) => (
          <motion.div
            key={`bg-${i}`}
            className="absolute opacity-[0.06]"
            style={{
              fontSize: 60 + i * 20,
              right: `${5 + i * 15}%`,
              bottom: `${10 + i * 20}%`,
            }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: i * 2 }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/platform/world-map" className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {island.icon}
          </motion.span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-white">Island {island.order_index}: {island.name}</h1>
              {bossCompleted && (
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 gap-1 text-[10px]">
                  <Trophy className="w-3 h-3" /> Mastered
                </Badge>
              )}
            </div>
            <p className="text-xs text-white/50">{island.description}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Hero Island Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative rounded-3xl overflow-hidden mb-8"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(20px)", border: `1px solid ${theme.accent}30` }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(135deg, ${theme.accent}10, transparent 60%)` }}
          />

          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Island image */}
              <motion.div
                className="relative w-40 h-40 sm:w-48 sm:h-48 shrink-0"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src={islandImg}
                  alt={island.name}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  style={{ filter: `drop-shadow(0 0 30px ${theme.accent}40)` }}
                />
                {/* Sparkle ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ boxShadow: `0 0 40px ${theme.accent}20, 0 0 80px ${theme.accent}10` }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>

              <div className="flex-1 text-center sm:text-left">
                <motion.h2
                  className="font-bold text-white text-2xl sm:text-3xl font-display mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {island.icon} {island.name}
                </motion.h2>
                <p className="text-white/60 text-sm mb-4">{island.description}</p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { icon: <BookOpen className="w-4 h-4" />, value: lessons.length, label: "Lessons", color: theme.accent },
                    { icon: <Zap className="w-4 h-4" />, value: totalXpAvailable, label: "Total XP", color: "#fbbf24" },
                    { icon: <CheckCircle2 className="w-4 h-4" />, value: `${completedLessonCount}/${lessons.length}`, label: "Done", color: "#10b981" },
                  ].map((stat, si) => (
                    <motion.div
                      key={si}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + si * 0.1 }}
                      className="rounded-xl p-3 text-center"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <div className="mx-auto mb-1 w-fit" style={{ color: stat.color }}>{stat.icon}</div>
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                      <p className="text-[10px] text-white/40">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Progress */}
                <div className="flex items-center justify-between text-sm text-white/50 mb-2">
                  <span className="font-medium">Island Progress</span>
                  <span className="font-bold text-white">{completionPct}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}cc)` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPct}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Boss Challenge Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-5 mb-8 relative overflow-hidden"
          style={{
            background: bossCompleted
              ? "rgba(250, 204, 21, 0.08)"
              : bossReady
              ? "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(239,68,68,0.1))"
              : "rgba(255,255,255,0.03)",
            border: `1px solid ${bossCompleted ? "rgba(250,204,21,0.3)" : bossReady ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.08)"}`,
          }}
        >
          {bossReady && !bossCompleted && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.05), transparent)" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <motion.div
                animate={bossReady && !bossCompleted ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: bossCompleted ? "rgba(250,204,21,0.15)" : bossReady ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.05)",
                }}
              >
                {bossCompleted ? (
                  <Trophy className="w-7 h-7 text-yellow-400" />
                ) : (
                  <Swords className={`w-7 h-7 ${bossReady ? "text-orange-400" : "text-white/30"}`} />
                )}
              </motion.div>
              <div>
                <p className="font-bold text-white text-sm">
                  {bossCompleted ? "🏆 Boss Defeated!" : bossReady ? "⚔️ Boss Challenge Ready!" : "🔒 Boss Challenge Locked"}
                </p>
                <p className="text-xs text-white/40">
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
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white gap-1.5 shadow-lg shadow-orange-500/30"
              >
                <Swords className="w-4 h-4" /> Fight Boss
              </Button>
            )}
            {bossCompleted && nextIsland && (
              <Button
                onClick={() => navigate(`/platform/island/${nextIsland.id}`)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white gap-1.5 shadow-lg shadow-emerald-500/30"
              >
                {nextIsland.icon} Next Island
              </Button>
            )}
          </div>
        </motion.div>

        {/* Lessons List */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: theme.accent }} /> Island Lessons
          </h3>
          <Badge className="bg-white/10 text-white/60 border-white/10 text-xs">
            {completedLessonCount}/{lessons.length} done
          </Badge>
        </div>

        {/* Path connector */}
        <div className="relative">
          {/* Vertical path line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-0.5 z-0" style={{ background: `${theme.accent}20` }} />

          <div className="space-y-3 relative z-10">
            {lessons.length > 0 ? lessons.map((lesson, i) => {
              const completed = completedIds.has(lesson.id);
              const isHovered = hoveredLesson === lesson.id;
              const level = levels.find(l => l.id === lesson.level_id);

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 120 }}
                >
                  <Link
                    to={`/platform/lesson/${lesson.id}`}
                    className="block rounded-xl p-4 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: completed
                        ? `linear-gradient(135deg, ${theme.accent}12, ${theme.accent}06)`
                        : "rgba(255,255,255,0.04)",
                      border: `1px solid ${completed ? `${theme.accent}30` : "rgba(255,255,255,0.06)"}`,
                      boxShadow: isHovered ? `0 8px 30px ${theme.accent}15` : "none",
                    }}
                    onMouseEnter={() => setHoveredLesson(lesson.id)}
                    onMouseLeave={() => setHoveredLesson(null)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Step indicator */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm relative"
                        style={{
                          background: completed ? theme.accent : "rgba(255,255,255,0.06)",
                          color: completed ? "white" : "rgba(255,255,255,0.4)",
                          boxShadow: completed ? `0 0 20px ${theme.accent}40` : "none",
                        }}
                      >
                        {completed ? <CheckCircle2 className="w-5 h-5" /> : <span>{i + 1}</span>}
                        {/* Completed glow */}
                        {completed && (
                          <motion.div
                            className="absolute inset-0 rounded-xl"
                            style={{ boxShadow: `0 0 15px ${theme.accent}30` }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-white text-sm truncate">{lesson.title}</h4>
                          {completed && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-xs"
                            >
                              ✅
                            </motion.span>
                          )}
                        </div>
                        <p className="text-xs text-white/40 truncate">{lesson.description}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge className="bg-white/5 text-white/40 border-white/10 text-[9px]">
                            <Code2 className="w-2.5 h-2.5 mr-0.5" /> {lesson.language || "js"}
                          </Badge>
                          <Badge className="bg-white/5 text-white/40 border-white/10 text-[9px]">
                            {lesson.lesson_type}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Badge className="bg-yellow-500/10 text-yellow-300 border-yellow-500/20 text-[10px] gap-0.5">
                          <Star className="w-2.5 h-2.5" /> +{lesson.xp_reward}
                        </Badge>
                        <motion.div
                          animate={isHovered ? { x: [0, 4, 0] } : {}}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        >
                          <Play className="w-4 h-4 text-white/30" />
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            }) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  🏝️
                </motion.div>
                <p className="text-white/60 font-medium">Lessons for this island are being prepared!</p>
                <p className="text-xs text-white/30 mt-1">Check back soon or explore other islands.</p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default IslandDetail;
