import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Area, AreaChart, CartesianGrid } from "recharts";
import {
  Search, Filter, Bookmark, BookmarkCheck, Star, Flame, Zap,
  Trophy, Target, Clock, ChevronRight, Sparkles, Brain, TrendingUp,
  CheckCircle2, Circle, Lock, ArrowUpRight, Calendar, Award,
  BarChart3, Activity, Crown, Medal, Users, Swords,
} from "lucide-react";
import {
  skills,
  skillCategories,
  challenges,
  sharpenAchievements,
  leaderboard,
  recentActivity,
  weeklyStats,
  aiRecommendations,
  getDifficultyColor,
  getRarityColor,
  getCategoryColor,
  type Skill,
} from "@/data/sharpen-skills-data";

const chartConfig: ChartConfig = {
  xp: { label: "XP Earned", color: "hsl(var(--primary))" },
  minutes: { label: "Minutes", color: "hsl(var(--chart-2))" },
};

const SharpenYourSkills = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    () => new Set(skills.filter(s => s.bookmarked).map(s => s.id))
  );

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredSkills = useMemo(() => {
    return skills.filter(s => {
      if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase()) && !s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
      if (selectedCategory && s.categoryId !== selectedCategory) return false;
      if (difficultyFilter && s.difficulty !== difficultyFilter) return false;
      if (showBookmarked && !bookmarkedIds.has(s.id)) return false;
      return true;
    });
  }, [searchQuery, selectedCategory, difficultyFilter, showBookmarked, bookmarkedIds]);

  // Aggregate stats
  const totalXP = skills.reduce((sum, s) => sum + Math.round(s.xpReward * s.progress / 100), 0);
  const completedCount = skills.filter(s => s.completed).length;
  const inProgressCount = skills.filter(s => s.progress > 0 && !s.completed).length;
  const avgProgress = Math.round(skills.reduce((sum, s) => sum + s.progress, 0) / skills.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* ─── Page Header ─── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground flex items-center gap-2">
              <Swords className="w-7 h-7 text-primary" />
              Sharpen Your Skills
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Track progress, take challenges, and level up your expertise
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 text-yellow-600 border-yellow-500/20 bg-yellow-500/10">
              <Star className="w-3 h-3" /> {totalXP.toLocaleString()} Skill XP
            </Badge>
            <Badge variant="outline" className="gap-1.5 text-orange-600 border-orange-500/20 bg-orange-500/10">
              <Flame className="w-3 h-3" /> 7-day streak
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* ─── Stats Overview ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Target, label: "In Progress", value: inProgressCount, color: "text-primary", bg: "from-primary/10 to-primary/5" },
          { icon: CheckCircle2, label: "Completed", value: completedCount, color: "text-emerald-500", bg: "from-emerald-500/10 to-emerald-500/5" },
          { icon: TrendingUp, label: "Avg Progress", value: `${avgProgress}%`, color: "text-blue-500", bg: "from-blue-500/10 to-blue-500/5" },
          { icon: Zap, label: "Challenges Done", value: challenges.filter(c => c.completed).length, color: "text-orange-500", bg: "from-orange-500/10 to-orange-500/5" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.06 }}
            className={`bg-gradient-to-br ${stat.bg} border border-border rounded-xl p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-background/60 p-1.5"><stat.icon className={`w-4 h-4 ${stat.color}`} /></div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ─── Tab Navigation ─── */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 w-full sm:w-auto flex flex-wrap gap-0.5">
          <TabsTrigger value="overview" className="text-xs sm:text-sm gap-1"><BarChart3 className="w-3.5 h-3.5" />Overview</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs sm:text-sm gap-1"><Brain className="w-3.5 h-3.5" />Skills</TabsTrigger>
          <TabsTrigger value="challenges" className="text-xs sm:text-sm gap-1"><Swords className="w-3.5 h-3.5" />Challenges</TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs sm:text-sm gap-1"><Trophy className="w-3.5 h-3.5" />Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-xs sm:text-sm gap-1"><Crown className="w-3.5 h-3.5" />Leaderboard</TabsTrigger>
        </TabsList>

        {/* ═══════════════ OVERVIEW TAB ═══════════════ */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Weekly XP Chart */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" />Weekly Growth</h3>
                <Badge variant="secondary" className="text-[10px]">This Week</Badge>
              </div>
              <ChartContainer config={chartConfig} className="h-[220px] w-full">
                <BarChart data={weeklyStats} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="xp" fill="var(--color-xp)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />AI Recommends
              </h3>
              <div className="space-y-3">
                {aiRecommendations.slice(0, 3).map(rec => {
                  const skill = skills.find(s => s.id === rec.skillId);
                  if (!skill) return null;
                  return (
                    <Link key={rec.skillId} to={`/platform/sharpen/skill/${skill.id}`} className="block group">
                      <div className="rounded-lg border border-border p-3 hover:border-primary/40 hover:bg-primary/5 transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{skill.title}</p>
                          <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">{rec.reason}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className={`text-[10px] ${getDifficultyColor(skill.difficulty)}`}>{skill.difficulty}</Badge>
                          <span className="text-[10px] text-muted-foreground">{skill.estimatedHours}h</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link to="/platform/ai-assistant" className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:underline">
                <Brain className="w-3.5 h-3.5" /> Deep AI Analysis & Study Plan
              </Link>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* Top Skills in Progress */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-4"><TrendingUp className="w-4 h-4 text-blue-500" />Top In Progress</h3>
              <div className="space-y-3">
                {skills.filter(s => s.progress > 0 && !s.completed).sort((a, b) => b.progress - a.progress).slice(0, 4).map(skill => (
                  <Link key={skill.id} to={`/platform/sharpen/skill/${skill.id}`} className="block group">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{skill.title}</p>
                        <Progress value={skill.progress} className="h-1.5 mt-1.5" />
                      </div>
                      <span className="text-xs font-bold text-primary shrink-0">{skill.progress}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-emerald-500" />Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map(act => (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground"><span className="font-medium">{act.action}</span> — {act.skillTitle}</p>
                      <p className="text-[10px] text-muted-foreground">{act.timestamp}</p>
                    </div>
                    {act.xpEarned > 0 && <span className="text-[10px] font-bold text-yellow-600 shrink-0">+{act.xpEarned} XP</span>}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Challenges */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-4"><Calendar className="w-4 h-4 text-orange-500" />Upcoming Challenges</h3>
              <div className="space-y-3">
                {challenges.filter(c => !c.completed).slice(0, 4).map(ch => (
                  <div key={ch.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground">{ch.title}</p>
                      <Badge variant="outline" className={`text-[10px] ${getDifficultyColor(ch.difficulty)}`}>{ch.difficulty}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{ch.type === "daily" ? "Expires today" : "This week"}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-yellow-600 font-bold">
                      <Zap className="w-3 h-3" /> +{ch.xpReward} XP
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Suggested Next Steps */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/15 rounded-xl p-5">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-primary" />Suggested Next Steps</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { text: "Finish CSS Animations milestone", sub: "HTML & CSS Mastery — 15% left", to: "/platform/sharpen/skill/html-css" },
                { text: "Start today's daily challenge", sub: "CSS Flexbox Puzzle — 50 XP", to: "/platform/sharpen" },
                { text: "Explore React Advanced Patterns", sub: "React & Modern UI — next milestone", to: "/platform/sharpen/skill/react" },
              ].map((step, i) => (
                <Link key={i} to={step.to}>
                  <div className="rounded-lg border border-border bg-card/60 p-3 hover:border-primary/40 transition-all group">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{step.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{step.sub}</p>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary mt-1.5 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* ═══════════════ SKILLS TAB ═══════════════ */}
        <TabsContent value="skills" className="space-y-5">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search skills, tags…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-card"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={showBookmarked ? "default" : "outline"}
                size="sm"
                onClick={() => setShowBookmarked(!showBookmarked)}
                className="gap-1.5"
              >
                {showBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                Saved
              </Button>
              {(["beginner", "intermediate", "advanced"] as const).map(d => (
                <Button
                  key={d}
                  variant={difficultyFilter === d ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}
                  className="capitalize text-xs"
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="text-xs"
            >
              All
            </Button>
            {skillCategories.map(cat => {
              const c = getCategoryColor(cat.color);
              return (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className="text-xs gap-1"
                >
                  {cat.icon} {cat.name}
                </Button>
              );
            })}
          </div>

          {/* Skill Cards Grid */}
          <AnimatePresence mode="popLayout">
            {filteredSkills.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-lg font-semibold text-muted-foreground">No skills found</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your filters or search</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedCategory(null); setDifficultyFilter(null); setShowBookmarked(false); }}>
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSkills.map((skill, i) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    index={i}
                    bookmarked={bookmarkedIds.has(skill.id)}
                    onToggleBookmark={() => toggleBookmark(skill.id)}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* ═══════════════ CHALLENGES TAB ═══════════════ */}
        <TabsContent value="challenges" className="space-y-5">
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Daily Challenges */}
            <div>
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-3"><Flame className="w-4 h-4 text-orange-500" />Daily Challenges</h3>
              <div className="space-y-3">
                {challenges.filter(c => c.type === "daily").map(ch => (
                  <ChallengeCard key={ch.id} challenge={ch} />
                ))}
              </div>
            </div>
            {/* Weekly Challenges */}
            <div>
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-3"><Calendar className="w-4 h-4 text-blue-500" />Weekly Challenges</h3>
              <div className="space-y-3">
                {challenges.filter(c => c.type === "weekly").map(ch => (
                  <ChallengeCard key={ch.id} challenge={ch} />
                ))}
              </div>
            </div>
          </div>

          {/* Challenge streak */}
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500/20 rounded-2xl p-3">
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Challenge Streak: 5 days 🔥</h3>
                <p className="text-sm text-muted-foreground">Complete today's challenge to keep your streak alive!</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════ ACHIEVEMENTS TAB ═══════════════ */}
        <TabsContent value="achievements" className="space-y-5">
          {/* Earned */}
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-yellow-500" />
              Earned ({sharpenAchievements.filter(a => a.earned).length}/{sharpenAchievements.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {sharpenAchievements.filter(a => a.earned).map((ach, i) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative rounded-xl border border-border bg-gradient-to-br from-yellow-500/10 to-orange-500/5 p-4 text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-2">{ach.icon}</div>
                  <p className="text-xs font-bold text-foreground">{ach.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{ach.description}</p>
                  <Badge className={`mt-2 text-[9px] bg-gradient-to-r ${getRarityColor(ach.rarity)} text-white border-0`}>{ach.rarity}</Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Locked */}
          <div>
            <h3 className="font-bold text-muted-foreground flex items-center gap-2 mb-3"><Lock className="w-4 h-4" />Locked</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {sharpenAchievements.filter(a => !a.earned).map((ach, i) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="rounded-xl border border-border bg-muted/30 p-4 text-center opacity-60"
                >
                  <div className="text-3xl mb-2 grayscale">{ach.icon}</div>
                  <p className="text-xs font-bold text-foreground">{ach.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{ach.description}</p>
                  <Badge variant="outline" className="mt-2 text-[9px]">{ach.rarity}</Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════ LEADERBOARD TAB ═══════════════ */}
        <TabsContent value="leaderboard" className="space-y-5">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4"><Users className="w-4 h-4 text-primary" />Community Leaderboard</h3>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {leaderboard.map((entry, i) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 ${
                    entry.isCurrentUser ? "bg-primary/5 border-l-2 border-l-primary" : ""
                  }`}
                >
                  <span className={`text-lg font-bold w-8 text-center ${i < 3 ? "text-yellow-500" : "text-muted-foreground"}`}>
                    {entry.rank}
                  </span>
                  <span className="text-2xl">{entry.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${entry.isCurrentUser ? "text-primary" : "text-foreground"}`}>
                      {entry.name} {entry.isCurrentUser && <Badge className="ml-1 text-[9px]">You</Badge>}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Level {entry.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{entry.xp.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">XP</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ─── Skill Card Component ─── */
const SkillCard = ({ skill, index, bookmarked, onToggleBookmark }: {
  skill: Skill;
  index: number;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}) => {
  const category = skillCategories.find(c => c.id === skill.categoryId);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link to={`/platform/sharpen/skill/${skill.id}`} className="block h-full group">
        <div className={`relative h-full rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:border-primary/40 ${skill.completed ? "border-emerald-500/30 bg-emerald-500/5" : "border-border"}`}>
          {/* Bookmark */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleBookmark(); }}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            {bookmarked
              ? <BookmarkCheck className="w-4 h-4 text-primary" />
              : <Bookmark className="w-4 h-4 text-muted-foreground" />}
          </button>

          {/* Category + Difficulty */}
          <div className="flex items-center gap-2 mb-3">
            {category && <span className="text-sm">{category.icon}</span>}
            <Badge variant="outline" className={`text-[10px] ${getDifficultyColor(skill.difficulty)}`}>{skill.difficulty}</Badge>
            {skill.completed && (
              <Badge className="text-[10px] bg-emerald-500 text-white border-0 gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Done
              </Badge>
            )}
          </div>

          <h4 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{skill.title}</h4>
          <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3">{skill.description}</p>

          {/* Progress */}
          <div className="mt-auto">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-bold text-foreground">{skill.progress}%</span>
            </div>
            <Progress value={skill.progress} className="h-1.5" />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {skill.estimatedHours}h</span>
            <span className="flex items-center gap-0.5"><Zap className="w-3 h-3" /> {skill.xpReward} XP</span>
            <span className="flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> {skill.milestones.filter(m => m.reached).length}/{skill.milestones.length}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ─── Challenge Card Component ─── */
const ChallengeCard = ({ challenge }: { challenge: typeof challenges[number] }) => {
  const skill = skills.find(s => s.id === challenge.skillId);
  return (
    <div className={`rounded-xl border p-4 transition-all ${
      challenge.completed ? "bg-emerald-500/5 border-emerald-500/30" : "bg-card border-border hover:border-primary/40"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {challenge.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />}
            <h4 className={`text-sm font-semibold ${challenge.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{challenge.title}</h4>
          </div>
          <p className="text-[11px] text-muted-foreground ml-6">{challenge.description}</p>
          {skill && <p className="text-[10px] text-muted-foreground ml-6 mt-1">Skill: {skill.title}</p>}
        </div>
        <div className="text-right shrink-0">
          <Badge variant="outline" className={`text-[10px] mb-1 ${getDifficultyColor(challenge.difficulty)}`}>{challenge.difficulty}</Badge>
          <p className="text-[10px] font-bold text-yellow-600 flex items-center gap-0.5 justify-end"><Zap className="w-3 h-3" />{challenge.xpReward} XP</p>
        </div>
      </div>
    </div>
  );
};

export default SharpenYourSkills;
