import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowLeft, Lock, CheckCircle2, Star, Sparkles,
  Trophy, MapPin, Swords, Compass, Anchor
} from "lucide-react";

interface Island {
  id: string;
  name: string;
  description: string;
  icon: string;
  order_index: number;
  color: string;
  unlock_requirement_xp: number;
  unlock_requirement_completion: number;
}

interface IslandProgress {
  island_id: string;
  completion_percentage: number;
  boss_completed: boolean;
  unlocked: boolean;
}

const ISLAND_POSITIONS = [
  { x: 12, y: 80, curve: "right" },
  { x: 35, y: 70, curve: "left" },
  { x: 15, y: 56, curve: "right" },
  { x: 40, y: 44, curve: "left" },
  { x: 18, y: 32, curve: "right" },
  { x: 42, y: 20, curve: "left" },
  { x: 65, y: 14, curve: "right" },
  { x: 78, y: 6, curve: "end" },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; glow: string; gradient: string }> = {
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", glow: "shadow-emerald-500/25", gradient: "from-emerald-500/20 to-emerald-600/5" },
  green: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", glow: "shadow-green-500/25", gradient: "from-green-500/20 to-green-600/5" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-amber-500/25", gradient: "from-amber-500/20 to-amber-600/5" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/25", gradient: "from-blue-500/20 to-blue-600/5" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/25", gradient: "from-purple-500/20 to-purple-600/5" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", glow: "shadow-orange-500/25", gradient: "from-orange-500/20 to-orange-600/5" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", glow: "shadow-cyan-500/25", gradient: "from-cyan-500/20 to-cyan-600/5" },
  pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", glow: "shadow-pink-500/25", gradient: "from-pink-500/20 to-pink-600/5" },
  primary: { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary", glow: "shadow-primary/25", gradient: "from-primary/20 to-primary/5" },
};

const WorldMap = () => {
  const { user, loading, requireAuth } = usePlatformAuth();
  const [islands, setIslands] = useState<Island[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, IslandProgress>>({});
  const [totalXp, setTotalXp] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => { requireAuth(); }, [loading, user]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const [islandsRes, progressRes, profileRes] = await Promise.all([
      supabase.from("islands").select("*").order("order_index"),
      supabase.from("island_progress").select("*").eq("user_id", user!.id),
      supabase.from("student_profiles").select("total_xp").eq("user_id", user!.id).single(),
    ]);

    if (islandsRes.data) setIslands(islandsRes.data as unknown as Island[]);
    if (profileRes.data) setTotalXp((profileRes.data as any).total_xp || 0);

    if (progressRes.data) {
      const map: Record<string, IslandProgress> = {};
      let completed = 0;
      (progressRes.data as any[]).forEach(p => {
        map[p.island_id] = p;
        if (p.boss_completed) completed++;
      });
      setProgressMap(map);
      setCompletedCount(completed);
    }
  };

  const isIslandUnlocked = (island: Island, idx: number) => {
    if (idx === 0) return true;
    if (totalXp < island.unlock_requirement_xp) return false;
    const prevIsland = islands[idx - 1];
    if (prevIsland) {
      const prevProgress = progressMap[prevIsland.id];
      if (!prevProgress?.boss_completed && island.unlock_requirement_completion > 0) {
        return (prevProgress?.completion_percentage || 0) >= island.unlock_requirement_completion;
      }
    }
    return true;
  };

  const getCurrentIslandIdx = () => {
    for (let i = islands.length - 1; i >= 0; i--) {
      if (isIslandUnlocked(islands[i], i)) {
        const progress = progressMap[islands[i].id];
        if (!progress?.boss_completed) return i;
      }
    }
    return 0;
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;

  const currentIdx = getCurrentIslandIdx();
  const overallProgress = islands.length > 0 ? Math.round((completedCount / islands.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-sky-950/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/platform/dashboard">
              <Button variant="ghost" size="sm" className="gap-1"><ArrowLeft className="w-4 h-4" /> Dashboard</Button>
            </Link>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground font-display">World Map</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1">
              <Trophy className="w-3 h-3 text-yellow-500" /> {completedCount}/{islands.length}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Star className="w-3 h-3 text-yellow-500" /> {totalXp.toLocaleString()} XP
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-2">
            🗺️ Your Coding Adventure
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Conquer islands, defeat bosses, and become a coding master!
          </p>
          {/* Overall progress */}
          <div className="max-w-xs mx-auto mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </motion.div>

        {/* Map Container */}
        <div className="relative w-full min-h-[750px] rounded-3xl border border-border/40 overflow-hidden bg-gradient-to-b from-sky-500/3 via-blue-500/2 to-emerald-500/3">
          {/* Animated ocean background */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute h-px bg-sky-400/10"
              style={{ top: `${10 + i * 12}%`, left: 0, right: 0 }}
              animate={{ x: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 5 + i * 0.8, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          {/* Decorative floating elements */}
          <motion.div className="absolute top-[5%] right-[8%] text-4xl opacity-15" animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity }}>☁️</motion.div>
          <motion.div className="absolute top-[18%] left-[5%] text-3xl opacity-10" animate={{ y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}>☁️</motion.div>
          <motion.div className="absolute bottom-[5%] right-[10%] text-5xl opacity-10" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }}>🌊</motion.div>
          <motion.div className="absolute bottom-[12%] left-[8%] text-3xl opacity-10" animate={{ y: [0, -3, 0] }} transition={{ duration: 4, repeat: Infinity }}>⛵</motion.div>
          <motion.div className="absolute top-[40%] right-[5%] text-2xl opacity-10" animate={{ rotate: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }}>🐠</motion.div>

          {/* Path SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {islands.slice(0, -1).map((_, i) => {
              const from = ISLAND_POSITIONS[i];
              const to = ISLAND_POSITIONS[i + 1];
              if (!from || !to) return null;
              const completed = progressMap[islands[i]?.id]?.boss_completed;
              const nextUnlocked = isIslandUnlocked(islands[i + 1], i + 1);
              const midX = (from.x + to.x) / 2 + (i % 2 === 0 ? 8 : -8);
              const midY = (from.y + to.y) / 2;

              return (
                <motion.path
                  key={i}
                  d={`M ${from.x + 5} ${from.y} Q ${midX} ${midY} ${to.x + 5} ${to.y}`}
                  fill="none"
                  stroke={completed ? "hsl(var(--primary))" : nextUnlocked ? "hsl(var(--muted-foreground))" : "hsl(var(--border))"}
                  strokeWidth={completed ? "0.5" : "0.3"}
                  strokeDasharray={completed ? "0" : "1.5 1"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                />
              );
            })}
          </svg>

          {/* Ship indicator on current island */}
          {islands[currentIdx] && (
            <motion.div
              className="absolute z-20 text-2xl pointer-events-none"
              style={{
                left: `${(ISLAND_POSITIONS[currentIdx]?.x || 50) + 12}%`,
                top: `${(ISLAND_POSITIONS[currentIdx]?.y || 50) - 5}%`,
              }}
              animate={{ y: [0, -6, 0], x: [0, 3, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🚀
            </motion.div>
          )}

          {/* Islands */}
          {islands.map((island, i) => {
            const pos = ISLAND_POSITIONS[i];
            if (!pos) return null;
            const unlocked = isIslandUnlocked(island, i);
            const progress = progressMap[island.id];
            const pct = progress?.completion_percentage || 0;
            const bossComplete = progress?.boss_completed || false;
            const isCurrent = i === currentIdx;
            const colors = COLOR_MAP[island.color] || COLOR_MAP.primary;

            return (
              <motion.div
                key={island.id}
                className="absolute"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              >
                {/* Current island ring pulse */}
                {isCurrent && unlocked && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-primary/30 -m-2"
                      animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.15, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-2xl border border-primary/20 -m-4"
                      animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.05, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </>
                )}

                <Link
                  to={unlocked ? `/platform/island/${island.id}` : "#"}
                  className={`block relative w-32 sm:w-40 transition-all duration-300 ${!unlocked ? "cursor-not-allowed" : "hover:scale-110 hover:-translate-y-1"}`}
                >
                  <div className={`rounded-2xl border-2 p-3 sm:p-4 text-center transition-all duration-300 ${
                    bossComplete
                      ? `bg-gradient-to-br ${colors.gradient} ${colors.border} shadow-xl ${colors.glow}`
                      : isCurrent && unlocked
                      ? `bg-card/90 backdrop-blur-sm ${colors.border} shadow-2xl ring-2 ring-primary/20`
                      : unlocked
                      ? `bg-card/80 backdrop-blur-sm border-border/60 hover:${colors.border} shadow-lg hover:shadow-xl`
                      : "bg-muted/20 border-border/20 opacity-40"
                  }`}>
                    {/* Completed checkmark */}
                    {bossComplete && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                      </motion.div>
                    )}

                    {/* Current badge */}
                    {isCurrent && unlocked && !bossComplete && (
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2"
                      >
                        <Badge className="text-[9px] bg-primary text-primary-foreground shadow-lg px-2.5">
                          <Sparkles className="w-2.5 h-2.5 mr-0.5" /> YOU ARE HERE
                        </Badge>
                      </motion.div>
                    )}

                    {/* Lock overlay */}
                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/40 rounded-2xl backdrop-blur-sm z-10">
                        <Lock className="w-7 h-7 text-muted-foreground/50" />
                      </div>
                    )}

                    {/* Island icon */}
                    <motion.span
                      className="text-3xl sm:text-4xl block mb-1.5"
                      animate={isCurrent ? { y: [0, -5, 0], scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {island.icon}
                    </motion.span>

                    {/* Island label */}
                    <p className={`text-[10px] font-bold ${colors.text} mb-0.5 tracking-wider`}>ISLAND {island.order_index}</p>
                    <h3 className="font-bold text-foreground text-xs sm:text-sm leading-tight">{island.name}</h3>

                    {/* Progress */}
                    {unlocked && (
                      <div className="mt-2">
                        <Progress value={Number(pct)} className="h-1.5" />
                        <p className="text-[9px] text-muted-foreground mt-0.5 font-medium">{Math.round(Number(pct))}% complete</p>
                      </div>
                    )}

                    {/* Boss ready */}
                    {unlocked && !bossComplete && Number(pct) >= 80 && (
                      <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="mt-1.5"
                      >
                        <Badge variant="outline" className="text-[8px] border-orange-500/40 text-orange-500 gap-0.5 bg-orange-500/5">
                          <Swords className="w-2.5 h-2.5" /> BOSS READY
                        </Badge>
                      </motion.div>
                    )}

                    {/* Completed treasure */}
                    {bossComplete && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-1.5"
                      >
                        <Badge variant="outline" className="text-[8px] border-primary/40 text-primary gap-0.5 bg-primary/5">
                          <Trophy className="w-2.5 h-2.5" /> MASTERED
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* Start flag */}
          <motion.div
            className="absolute text-xl opacity-30"
            style={{ left: `${(ISLAND_POSITIONS[0]?.x || 12) - 3}%`, top: `${(ISLAND_POSITIONS[0]?.y || 80) + 5}%` }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏁
          </motion.div>

          {/* End trophy */}
          <motion.div
            className="absolute text-2xl opacity-20"
            style={{ left: `${(ISLAND_POSITIONS[7]?.x || 78) + 6}%`, top: `${(ISLAND_POSITIONS[7]?.y || 6)}%` }}
            animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            👑
          </motion.div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-primary" /> Current</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-primary" /> Completed</span>
          <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Locked</span>
          <span className="flex items-center gap-1.5"><Swords className="w-3 h-3 text-orange-500" /> Boss Ready</span>
          <span className="flex items-center gap-1.5"><Anchor className="w-3 h-3 text-muted-foreground" /> {islands.length} Islands</span>
        </div>
      </main>
    </div>
  );
};

export default WorldMap;
