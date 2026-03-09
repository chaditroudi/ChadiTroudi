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
  Trophy, MapPin, Flag, Swords
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

// Island positions on the map (zigzag path)
const ISLAND_POSITIONS = [
  { x: 15, y: 82 },
  { x: 38, y: 68 },
  { x: 18, y: 52 },
  { x: 42, y: 38 },
  { x: 20, y: 24 },
  { x: 45, y: 12 },
  { x: 70, y: 28 },
  { x: 75, y: 8 },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  emerald: { bg: "bg-emerald-500/15", border: "border-emerald-500/40", text: "text-emerald-500", glow: "shadow-emerald-500/20" },
  green: { bg: "bg-green-500/15", border: "border-green-500/40", text: "text-green-500", glow: "shadow-green-500/20" },
  amber: { bg: "bg-amber-500/15", border: "border-amber-500/40", text: "text-amber-500", glow: "shadow-amber-500/20" },
  blue: { bg: "bg-blue-500/15", border: "border-blue-500/40", text: "text-blue-500", glow: "shadow-blue-500/20" },
  purple: { bg: "bg-purple-500/15", border: "border-purple-500/40", text: "text-purple-500", glow: "shadow-purple-500/20" },
  orange: { bg: "bg-orange-500/15", border: "border-orange-500/40", text: "text-orange-500", glow: "shadow-orange-500/20" },
  cyan: { bg: "bg-cyan-500/15", border: "border-cyan-500/40", text: "text-cyan-500", glow: "shadow-cyan-500/20" },
  pink: { bg: "bg-pink-500/15", border: "border-pink-500/40", text: "text-pink-500", glow: "shadow-pink-500/20" },
  primary: { bg: "bg-primary/15", border: "border-primary/40", text: "text-primary", glow: "shadow-primary/20" },
};

const WorldMap = () => {
  const { user, loading, requireAuth } = usePlatformAuth();
  const [islands, setIslands] = useState<Island[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, IslandProgress>>({});
  const [totalXp, setTotalXp] = useState(0);

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
      (progressRes.data as any[]).forEach(p => { map[p.island_id] = p; });
      setProgressMap(map);
    }
  };

  const isIslandUnlocked = (island: Island, idx: number) => {
    if (idx === 0) return true; // First island always unlocked
    if (totalXp < island.unlock_requirement_xp) return false;
    // Check if previous island boss is completed
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/platform/dashboard">
              <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Dashboard</Button>
            </Link>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground font-display">World Map</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1">
              <Star className="w-3 h-3 text-yellow-500" /> {totalXp} XP
            </Badge>
          </div>
        </div>
      </header>

      {/* Map Area */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Island Journey Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold font-display text-foreground mb-2">🗺️ Your Coding Adventure</h1>
          <p className="text-muted-foreground">Travel through islands, master coding skills, defeat bosses, and become a coding master!</p>
        </motion.div>

        {/* Map Container */}
        <div className="relative w-full min-h-[700px] bg-gradient-to-b from-sky-500/5 via-blue-500/3 to-emerald-500/5 rounded-3xl border border-border overflow-hidden">
          {/* Ocean waves decoration */}
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px bg-foreground/20"
                style={{ top: `${15 + i * 15}%`, left: 0, right: 0 }}
                animate={{ x: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* Path lines connecting islands */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {islands.slice(0, -1).map((_, i) => {
              const from = ISLAND_POSITIONS[i] || { x: 50, y: 50 };
              const to = ISLAND_POSITIONS[i + 1] || { x: 50, y: 50 };
              const unlocked = isIslandUnlocked(islands[i + 1], i + 1);
              const completed = progressMap[islands[i]?.id]?.boss_completed;

              return (
                <motion.line
                  key={i}
                  x1={from.x + 5}
                  y1={from.y}
                  x2={to.x + 5}
                  y2={to.y}
                  stroke={completed ? "hsl(var(--primary))" : unlocked ? "hsl(var(--muted-foreground))" : "hsl(var(--border))"}
                  strokeWidth="0.4"
                  strokeDasharray={completed ? "0" : "1.5 1"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: i * 0.2, duration: 0.8 }}
                />
              );
            })}
          </svg>

          {/* Islands */}
          {islands.map((island, i) => {
            const pos = ISLAND_POSITIONS[i] || { x: 50, y: 50 };
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
                transition={{ delay: i * 0.12, type: "spring", stiffness: 200 }}
              >
                {/* Current island pulse */}
                {isCurrent && unlocked && (
                  <motion.div
                    className={`absolute inset-0 rounded-2xl ${colors.bg} -m-3`}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <Link
                  to={unlocked ? `/platform/island/${island.id}` : "#"}
                  className={`block relative w-28 sm:w-36 transition-all ${!unlocked ? "cursor-not-allowed" : "hover:scale-105"}`}
                >
                  {/* Island Card */}
                  <div className={`rounded-2xl border-2 p-3 sm:p-4 text-center transition-all ${
                    bossComplete
                      ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
                      : isCurrent && unlocked
                      ? `bg-card ${colors.border} shadow-xl ${colors.glow} ring-2 ring-primary/20`
                      : unlocked
                      ? `bg-card border-border hover:${colors.border} shadow-md`
                      : "bg-muted/30 border-border/30 opacity-50"
                  }`}>
                    {/* Completion flag */}
                    {bossComplete && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    )}

                    {/* Current badge */}
                    {isCurrent && unlocked && !bossComplete && (
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-3 left-1/2 -translate-x-1/2"
                      >
                        <Badge className="text-[9px] bg-primary text-primary-foreground shadow-md">
                          YOU ARE HERE
                        </Badge>
                      </motion.div>
                    )}

                    {/* Lock icon */}
                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-2xl backdrop-blur-sm z-10">
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}

                    {/* Island icon */}
                    <motion.span
                      className="text-3xl sm:text-4xl block mb-1"
                      animate={isCurrent ? { y: [0, -4, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {island.icon}
                    </motion.span>

                    {/* Island number */}
                    <p className={`text-[10px] font-bold ${colors.text} mb-0.5`}>ISLAND {island.order_index}</p>

                    {/* Island name */}
                    <h3 className="font-bold text-foreground text-xs sm:text-sm leading-tight">{island.name}</h3>

                    {/* Progress bar */}
                    {unlocked && (
                      <div className="mt-2">
                        <Progress value={Number(pct)} className="h-1.5" />
                        <p className="text-[9px] text-muted-foreground mt-0.5">{Math.round(Number(pct))}%</p>
                      </div>
                    )}

                    {/* Boss indicator */}
                    {unlocked && !bossComplete && Number(pct) >= 80 && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="mt-1"
                      >
                        <Badge variant="outline" className="text-[8px] border-orange-500/40 text-orange-500 gap-0.5">
                          <Swords className="w-2.5 h-2.5" /> Boss Ready
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* Decorative elements */}
          <motion.div
            className="absolute bottom-4 right-4 text-muted-foreground/20 text-6xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            🌊
          </motion.div>
          <motion.div
            className="absolute top-8 right-12 text-muted-foreground/15 text-4xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ☁️
          </motion.div>
          <motion.div
            className="absolute top-20 left-8 text-muted-foreground/15 text-3xl"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          >
            ☁️
          </motion.div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> Current</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> Completed</span>
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>
          <span className="flex items-center gap-1"><Swords className="w-3 h-3 text-orange-500" /> Boss Ready</span>
          <span className="flex items-center gap-1"><Flag className="w-3 h-3 text-yellow-500" /> Reward</span>
        </div>
      </main>
    </div>
  );
};

export default WorldMap;
