import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Star, Trophy, LogOut, BookOpen, Map,
  Zap, Target, ChevronRight, Award, Sparkles, Code2, MapPin
} from "lucide-react";
import level1Avatar from "@/assets/avatars/level-1-recruit.png";
import level2Avatar from "@/assets/avatars/level-2-junior.png";
import level3Avatar from "@/assets/avatars/level-3-explorer.png";
import level4Avatar from "@/assets/avatars/level-4-specialist.png";
import level5Avatar from "@/assets/avatars/level-5-builder.png";
import level6Avatar from "@/assets/avatars/level-6-ai-apprentice.png";
import level7Avatar from "@/assets/avatars/level-7-ai-engineer.png";
import level8Avatar from "@/assets/avatars/level-8-master.png";

const levelAvatars: Record<number, string> = {
  1: level1Avatar,
  2: level2Avatar,
  3: level3Avatar,
  4: level4Avatar,
  5: level5Avatar,
  6: level6Avatar,
  7: level7Avatar,
  8: level8Avatar,
};

interface StudentProfile {
  display_name: string;
  current_level: number;
  total_xp: number;
  streak_days: number;
}

interface Level {
  id: string;
  number: number;
  title: string;
  icon: string;
  required_xp: number;
}

const PlatformDashboard = () => {
  const { user, loading, requireAuth, signOut } = usePlatformAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [recentAchievements, setRecentAchievements] = useState<any[]>([]);

  useEffect(() => {
    requireAuth();
  }, [loading, user]);

  // Reset all state when user changes (e.g. sign out → sign in as different user)
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLevels([]);
      setCompletedLessons(0);
      setTotalLessons(0);
      setRecentAchievements([]);
      return;
    }
    loadDashboard();
  }, [user?.id]);

  const loadDashboard = async () => {
    if (!user) return;

    // Always fetch the profile for the CURRENT authenticated user
    let { data: profileData, error: profileError } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profileData && !profileError) {
      // Profile doesn't exist — create it from auth user metadata
      const displayName = user.user_metadata?.display_name || user.email || "Coder";
      const { data: newProfile } = await supabase
        .from("student_profiles")
        .insert({ user_id: user.id, display_name: displayName })
        .select()
        .single();
      profileData = newProfile;
    }

    // Redirect to onboarding if not completed
    if (profileData && !(profileData as any).onboarding_completed) {
      navigate("/platform/onboarding");
      return;
    }

    const [levelsRes, progressRes, lessonsRes, achievementsRes] = await Promise.all([
      supabase.from("platform_levels").select("*").order("number"),
      supabase.from("user_lesson_progress").select("*").eq("user_id", user.id).eq("completed", true),
      supabase.from("platform_lessons").select("id"),
      supabase.from("user_achievements").select("*, achievements(*)").eq("user_id", user.id).order("earned_at", { ascending: false }).limit(5),
    ]);

    if (profileData) setProfile(profileData as unknown as StudentProfile);
    if (levelsRes.data) setLevels(levelsRes.data as unknown as Level[]);
    if (progressRes.data) setCompletedLessons(progressRes.data.length);
    if (lessonsRes.data) setTotalLessons(lessonsRes.data.length);
    if (achievementsRes.data) setRecentAchievements(achievementsRes.data);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
<div className="flex items-center justify-center">
  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
    <div className="h-full w-1/2 bg-blue-500 animate-pulse"></div>
  </div>
</div>      </div>
    );
  }

  const currentLevel = levels.find(l => l.number === profile.current_level);
  const nextLevel = levels.find(l => l.number === profile.current_level + 1);
  const xpProgress = nextLevel
    ? ((profile.total_xp - (currentLevel?.required_xp || 0)) / (nextLevel.required_xp - (currentLevel?.required_xp || 0))) * 100
    : 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-lg text-foreground">
            <span className="text-primary">{'<'}</span>CodeCamp<span className="text-primary">{'/>'}</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/platform/world-map" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4" /> World Map
            </Link>
            <Link to="/platform/learn" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Map className="w-4 h-4" /> Learning Path
            </Link>
            <Link to="/platform/achievements" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Trophy className="w-4 h-4" /> Achievements
            </Link>
            <Link to="/platform/playground" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Code2 className="w-4 h-4" /> Playground
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome with Animated Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row items-center gap-6"
        >
          {/* Bouncing Avatar */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <motion.div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-primary/20 to-accent overflow-hidden border-2 border-primary/30 shadow-lg"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              <img src={levelAvatars[profile.current_level] || level1Avatar} alt="Coder Avatar" className="w-full h-full object-cover" />
            </motion.div>
            {/* XP sparkle effect */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
            {/* Level badge on avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -bottom-2 -right-2 bg-card border-2 border-primary rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-primary shadow"
            >
              {profile.current_level}
            </motion.div>
          </motion.div>

          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold font-display text-foreground mb-1"
            >
              Welcome back, {profile.display_name || "Coder"} 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="text-muted-foreground"
            >
              Level {profile.current_level} • {currentLevel?.title} • Keep coding to level up! 🎮
            </motion.p>
            {/* XP bar under welcome */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-2 max-w-xs origin-left"
            >
              <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                <span>{profile.total_xp} XP</span>
                <span>{nextLevel ? `${nextLevel.required_xp} XP` : "MAX"}</span>
              </div>
              <Progress value={Math.min(xpProgress, 100)} className="h-2" />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Star, label: "Total XP", value: profile.total_xp.toLocaleString(), color: "text-yellow-500" },
            { icon: Zap, label: "Level", value: `${profile.current_level} — ${currentLevel?.title}`, color: "text-primary" },
            { icon: Flame, label: "Streak", value: `${profile.streak_days} days`, color: "text-orange-500" },
            { icon: Target, label: "Lessons", value: `${completedLessons}/${totalLessons}`, color: "text-blue-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-foreground">Level {profile.current_level}: {currentLevel?.title}</h2>
              <p className="text-sm text-muted-foreground">
                {nextLevel ? `${nextLevel.required_xp - profile.total_xp} XP to Level ${nextLevel.number}` : "Max level reached! 🎉"}
              </p>
            </div>
            <span className="text-3xl">{currentLevel?.icon}</span>
          </div>
          <Progress value={Math.min(xpProgress, 100)} className="h-3" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{profile.total_xp} XP</span>
            <span>{nextLevel?.required_xp || profile.total_xp} XP</span>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link to="/platform/world-map">
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/40 transition-colors group">
              <MapPin className="w-8 h-8 text-emerald-500 mb-3" />
              <h3 className="font-bold text-foreground mb-1">World Map</h3>
              <p className="text-sm text-muted-foreground mb-3">Explore islands and conquer coding challenges</p>
              <span className="text-emerald-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Explore Map <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
          <Link to="/platform/learn">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-colors group">
              <BookOpen className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-bold text-foreground mb-1">Continue Learning</h3>
              <p className="text-sm text-muted-foreground mb-3">Pick up where you left off</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Learning Path <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
          <Link to="/platform/achievements">
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-colors group">
              <Award className="w-8 h-8 text-yellow-500 mb-3" />
              <h3 className="font-bold text-foreground mb-1">Achievements</h3>
              <p className="text-sm text-muted-foreground mb-3">{recentAchievements.length} badges earned</p>
              <span className="text-yellow-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                View Badges <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
          <Link to="/platform/playground">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-colors group">
              <Code2 className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-bold text-foreground mb-1">Playground</h3>
              <p className="text-sm text-muted-foreground mb-3">Code, run, and get AI feedback</p>
              <span className="text-blue-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Open Editor <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>

        {/* Level Map Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-4">Your Bootcamp Journey</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {levels.map((level) => {
              const isUnlocked = profile.total_xp >= level.required_xp;
              const isCurrent = level.number === profile.current_level;
              return (
                <motion.div
                  whileHover={isUnlocked ? { scale: 1.08, y: -4 } : {}}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    key={level.id}
                    to={isUnlocked ? `/platform/level/${level.id}` : "#"}
                    className={`relative block rounded-xl p-4 text-center border transition-all ${
                      isCurrent
                        ? "bg-primary/10 border-primary shadow-md"
                        : isUnlocked
                        ? "bg-card border-border hover:border-primary/40"
                        : "bg-muted/30 border-border/50 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-lg overflow-hidden bg-muted/30">
                      <img
                        src={levelAvatars[level.number] || level1Avatar}
                        alt={level.title}
                        className={`w-full h-full object-cover ${!isUnlocked ? "grayscale" : ""}`}
                      />
                    </div>
                    <p className="text-xs font-bold text-foreground">Lv.{level.number}</p>
                    <p className="text-[10px] text-muted-foreground">{level.title}</p>
                    {isCurrent && (
                      <Badge className="absolute -top-2 -right-2 text-[10px] bg-primary text-primary-foreground">
                        Current
                      </Badge>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PlatformDashboard;
