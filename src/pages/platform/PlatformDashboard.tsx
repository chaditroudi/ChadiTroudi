import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformAuth } from "@/hooks/use-platform-auth";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Flame, Star, BookOpen, FolderOpen,
  Zap, Target, ChevronRight, Award, Sparkles, Code2, MapPin, Swords, Wand2, GraduationCap, Bug, Bot, Users,
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
  const { user, loading } = usePlatformAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [recentAchievements, setRecentAchievements] = useState<any[]>([]);

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

    let { data: profileData, error: profileError } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profileData && !profileError) {
      const displayName = user.user_metadata?.display_name || user.email || "Coder";
      const { data: newProfile } = await supabase
        .from("student_profiles")
        .insert({ user_id: user.id, display_name: displayName })
        .select()
        .single();
      profileData = newProfile;
    }

    // Onboarding check is handled by PlatformLayout — no need to duplicate here

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
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const currentLevel = levels.find(l => l.number === profile.current_level);
  const nextLevel = levels.find(l => l.number === profile.current_level + 1);
  const xpProgress = nextLevel
    ? ((profile.total_xp - (currentLevel?.required_xp || 0)) / (nextLevel.required_xp - (currentLevel?.required_xp || 0))) * 100
    : 100;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/15 p-5 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative shrink-0"
          >
            <motion.div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent overflow-hidden border-2 border-primary/30 shadow-lg"
              whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
              transition={{ duration: 0.4 }}
            >
              <img src={levelAvatars[profile.current_level] || level1Avatar} alt="Coder Avatar" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground rounded-full p-1 shadow-md"
            >
              <Sparkles className="w-3 h-3" />
            </motion.div>
          </motion.div>

          <div className="flex-1 min-w-0">
            <motion.h1
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-1"
            >
              Welcome back, {profile.display_name || "Coder"} 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-sm"
            >
              Level {profile.current_level} • {currentLevel?.title} • Keep coding to level up! 🎮
            </motion.p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-full px-3 py-1.5 text-xs font-bold">
              <Star className="w-3.5 h-3.5" /> {profile.total_xp.toLocaleString()} XP
            </div>
            <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-600 border border-orange-500/20 rounded-full px-3 py-1.5 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" /> {profile.streak_days} days
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { icon: Star, label: "Total XP", value: profile.total_xp.toLocaleString(), color: "text-yellow-500", bg: "from-yellow-500/10 to-yellow-500/5" },
          { icon: Zap, label: "Level", value: `${profile.current_level} — ${currentLevel?.title}`, color: "text-primary", bg: "from-primary/10 to-primary/5" },
          { icon: Flame, label: "Streak", value: `${profile.streak_days} days`, color: "text-orange-500", bg: "from-orange-500/10 to-orange-500/5" },
          { icon: Target, label: "Lessons", value: `${completedLessons}/${totalLessons}`, color: "text-blue-500", bg: "from-blue-500/10 to-blue-500/5" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className={`bg-gradient-to-br ${stat.bg} border border-border rounded-xl p-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-background/60 p-1.5">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Level Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-5 sm:p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-foreground flex items-center gap-2">
              Level {profile.current_level}: {currentLevel?.title}
              <span className="text-2xl">{currentLevel?.icon}</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {nextLevel ? `${nextLevel.required_xp - profile.total_xp} XP to Level ${nextLevel.number}` : "Max level reached! 🎉"}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-bold text-foreground">{Math.round(Math.min(xpProgress, 100))}%</p>
            <p className="text-[10px] text-muted-foreground">complete</p>
          </div>
        </div>
        <Progress value={Math.min(xpProgress, 100)} className="h-3" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{profile.total_xp} XP</span>
          <span>{nextLevel?.required_xp || profile.total_xp} XP</span>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          { to: "/platform/world-map", icon: MapPin, title: "World Map", desc: "Explore islands and conquer coding challenges", color: "emerald" },
          { to: "/platform/learn", icon: BookOpen, title: "Continue Learning", desc: "Pick up where you left off", color: "primary" },
          { to: "/platform/sharpen", icon: Swords, title: "Sharpen Skills", desc: "Challenges, progress, and skill mastery", color: "violet" },
          { to: "/platform/achievements", icon: Award, title: "Achievements", desc: `${recentAchievements.length} badges earned`, color: "yellow" },
          { to: "/platform/playground", icon: Code2, title: "Playground", desc: "Code, run, and get AI feedback", color: "blue" },
          { to: "/platform/ai-courses", icon: Wand2, title: "AI Courses", desc: "Generate e-learning courses from your content", color: "rose" },
          { to: "/platform/interview", icon: GraduationCap, title: "Interview Coach", desc: "Practice coding, system design & behavioral interviews", color: "amber" },
          { to: "/platform/debug", icon: Bug, title: "Debug Detective", desc: "Hunt bugs in broken codebases under pressure", color: "red" },
          { to: "/platform/ai-assistant", icon: Bot, title: "AI Assistant", desc: "Your personal AI study coach — chat, learn, practice", color: "indigo" },
          { to: "/platform/student-help", icon: Users, title: "Student Help", desc: "Help peers, get answers, and collaborate", color: "teal" },
          { to: "/platform/courses", icon: BookOpen, title: "Courses", desc: "Structured courses with lessons, quizzes & exercises", color: "cyan" },
          { to: "/platform/resources", icon: FolderOpen, title: "Resources", desc: "PDFs, notes, and recorded sessions", color: "slate" },
        ].map((action, i) => {
          const colorMap: Record<string, { gradient: string; border: string; text: string; iconBg: string }> = {
            emerald: { gradient: "from-emerald-500/10 to-teal-500/5", border: "border-emerald-500/20 hover:border-emerald-500/40", text: "text-emerald-500", iconBg: "bg-emerald-500/15" },
            primary: { gradient: "from-primary/10 to-primary/5", border: "border-primary/20 hover:border-primary/40", text: "text-primary", iconBg: "bg-primary/15" },
            violet: { gradient: "from-violet-500/10 to-purple-500/5", border: "border-violet-500/20 hover:border-violet-500/40", text: "text-violet-500", iconBg: "bg-violet-500/15" },
            yellow: { gradient: "from-yellow-500/10 to-orange-500/5", border: "border-yellow-500/20 hover:border-yellow-500/40", text: "text-yellow-600", iconBg: "bg-yellow-500/15" },
            blue: { gradient: "from-blue-500/10 to-cyan-500/5", border: "border-blue-500/20 hover:border-blue-500/40", text: "text-blue-500", iconBg: "bg-blue-500/15" },
            rose: { gradient: "from-rose-500/10 to-pink-500/5", border: "border-rose-500/20 hover:border-rose-500/40", text: "text-rose-500", iconBg: "bg-rose-500/15" },
            amber: { gradient: "from-amber-500/10 to-orange-500/5", border: "border-amber-500/20 hover:border-amber-500/40", text: "text-amber-500", iconBg: "bg-amber-500/15" },
            red: { gradient: "from-red-500/10 to-rose-500/5", border: "border-red-500/20 hover:border-red-500/40", text: "text-red-500", iconBg: "bg-red-500/15" },
            indigo: { gradient: "from-indigo-500/10 to-violet-500/5", border: "border-indigo-500/20 hover:border-indigo-500/40", text: "text-indigo-500", iconBg: "bg-indigo-500/15" },
            teal: { gradient: "from-teal-500/10 to-cyan-500/5", border: "border-teal-500/20 hover:border-teal-500/40", text: "text-teal-500", iconBg: "bg-teal-500/15" },
            cyan: { gradient: "from-cyan-500/10 to-blue-500/5", border: "border-cyan-500/20 hover:border-cyan-500/40", text: "text-cyan-500", iconBg: "bg-cyan-500/15" },
            slate: { gradient: "from-slate-500/10 to-gray-500/5", border: "border-slate-500/20 hover:border-slate-500/40", text: "text-slate-400", iconBg: "bg-slate-500/15" },
          };
          const c = colorMap[action.color];
          return (
            <motion.div
              key={action.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              whileHover={{ y: -3 }}
            >
              <Link to={action.to} className="block h-full">
                <div className={`bg-gradient-to-br ${c.gradient} border ${c.border} rounded-xl p-5 h-full transition-all group`}>
                  <div className={`${c.iconBg} rounded-xl p-2.5 w-fit mb-3`}>
                    <action.icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{action.desc}</p>
                  <span className={`${c.text} text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all`}>
                    Open <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Bootcamp Journey */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Your Bootcamp Journey</h2>
          <Link to="/platform/learn" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {levels.map((level) => {
            const isUnlocked = profile.total_xp >= level.required_xp || profile.current_level >= level.number;
            const isCurrent = level.number === profile.current_level;
            return (
              <motion.div
                key={level.id}
                whileHover={isUnlocked ? { scale: 1.05, y: -3 } : {}}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  to={isUnlocked ? `/platform/level/${level.id}` : "#"}
                  className={`relative block rounded-xl p-4 text-center border transition-all ${
                    isCurrent
                      ? "bg-primary/10 border-primary shadow-md ring-1 ring-primary/20"
                      : isUnlocked
                      ? "bg-card border-border hover:border-primary/40 hover:shadow-sm"
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
    </div>
  );
};

export default PlatformDashboard;
