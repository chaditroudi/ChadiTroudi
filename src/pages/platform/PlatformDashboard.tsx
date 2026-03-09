import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Flame, Star, Trophy, LogOut, BookOpen, Map,
  Zap, Target, ChevronRight, Award
} from "lucide-react";

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
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [recentAchievements, setRecentAchievements] = useState<any[]>([]);

  useEffect(() => {
    requireAuth();
  }, [loading, user]);

  useEffect(() => {
    if (!user) return;
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    const [profileRes, levelsRes, progressRes, lessonsRes, achievementsRes] = await Promise.all([
      supabase.from("student_profiles").select("*").eq("user_id", user!.id).single(),
      supabase.from("platform_levels").select("*").order("number"),
      supabase.from("user_lesson_progress").select("*").eq("user_id", user!.id).eq("completed", true),
      supabase.from("platform_lessons").select("id"),
      supabase.from("user_achievements").select("*, achievements(*)").eq("user_id", user!.id).order("earned_at", { ascending: false }).limit(5),
    ]);

    if (profileRes.data) setProfile(profileRes.data as unknown as StudentProfile);
    if (levelsRes.data) setLevels(levelsRes.data as unknown as Level[]);
    if (progressRes.data) setCompletedLessons(progressRes.data.length);
    if (lessonsRes.data) setTotalLessons(lessonsRes.data.length);
    if (achievementsRes.data) setRecentAchievements(achievementsRes.data);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading your dashboard...</div>
      </div>
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
            <Link to="/platform/learn" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Map className="w-4 h-4" /> Learning Path
            </Link>
            <Link to="/platform/achievements" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Trophy className="w-4 h-4" /> Achievements
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome & Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold font-display text-foreground mb-1">
            Welcome back, {profile.display_name || "Coder"} 👋
          </h1>
          <p className="text-muted-foreground">Keep coding — you're doing great!</p>
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
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link to="/platform/learn">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-colors group">
              <BookOpen className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-bold text-foreground mb-1">Continue Learning</h3>
              <p className="text-sm text-muted-foreground mb-3">Pick up where you left off in your learning path</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Go to Learning Path <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
          <Link to="/platform/achievements">
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-colors group">
              <Award className="w-8 h-8 text-yellow-500 mb-3" />
              <h3 className="font-bold text-foreground mb-1">Achievements</h3>
              <p className="text-sm text-muted-foreground mb-3">{recentAchievements.length} badges earned — collect them all!</p>
              <span className="text-yellow-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                View Achievements <ChevronRight className="w-4 h-4" />
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
                <Link
                  key={level.id}
                  to={isUnlocked ? `/platform/level/${level.id}` : "#"}
                  className={`relative rounded-xl p-4 text-center border transition-all ${
                    isCurrent
                      ? "bg-primary/10 border-primary shadow-md"
                      : isUnlocked
                      ? "bg-card border-border hover:border-primary/40"
                      : "bg-muted/30 border-border/50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span className="text-2xl block mb-1">{level.icon}</span>
                  <p className="text-xs font-bold text-foreground">Lv.{level.number}</p>
                  <p className="text-[10px] text-muted-foreground">{level.title}</p>
                  {isCurrent && (
                    <Badge className="absolute -top-2 -right-2 text-[10px] bg-primary text-primary-foreground">
                      Current
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PlatformDashboard;
