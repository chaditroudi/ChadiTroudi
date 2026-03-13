import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ArrowLeft, Clock, Zap, Star, CheckCircle2, Circle,
  Bookmark, BookmarkCheck, Trophy, ExternalLink,
  FileText, Video, Code2, FolderKanban, TrendingUp,
} from "lucide-react";
import {
  skills,
  skillCategories,
  getDifficultyColor,
} from "@/data/sharpen-skills-data";

const chartConfig: ChartConfig = {
  progress: { label: "Progress %", color: "hsl(var(--primary))" },
};

const resourceIcons: Record<string, typeof FileText> = {
  article: FileText,
  video: Video,
  exercise: Code2,
  project: FolderKanban,
};

const SkillDetail = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const skill = useMemo(() => skills.find(s => s.id === skillId), [skillId]);
  const [bookmarked, setBookmarked] = useState(() => skill?.bookmarked ?? false);

  if (!skill) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <Trophy className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-1">Skill not found</h2>
        <p className="text-sm text-muted-foreground mb-4">This skill doesn't exist or has been removed.</p>
        <Link to="/platform/sharpen">
          <Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" />Back to Skills</Button>
        </Link>
      </div>
    );
  }

  const category = skillCategories.find(c => c.id === skill.categoryId);
  const milestonesReached = skill.milestones.filter(m => m.reached).length;
  const totalMilestoneXP = skill.milestones.reduce((s, m) => s + m.xp, 0);
  const earnedMilestoneXP = skill.milestones.filter(m => m.reached).reduce((s, m) => s + m.xp, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* ─── Breadcrumb ─── */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/platform/sharpen" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Sharpen Your Skills
        </Link>
      </motion.div>

      {/* ─── Header ─── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {category && <span className="text-xl">{category.icon}</span>}
              <Badge variant="outline" className={`text-xs ${getDifficultyColor(skill.difficulty)}`}>{skill.difficulty}</Badge>
              {skill.completed && (
                <Badge className="text-xs bg-emerald-500 text-white border-0 gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">{skill.title}</h1>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{skill.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant={bookmarked ? "default" : "outline"}
              size="sm"
              onClick={() => setBookmarked(!bookmarked)}
              className="gap-1.5"
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {bookmarked ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        {/* Meta stats */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
          {[
            { icon: Clock, label: "Est. Time", value: `${skill.estimatedHours} hours` },
            { icon: Zap, label: "XP Reward", value: `${skill.xpReward} XP` },
            { icon: Star, label: "Milestones", value: `${milestonesReached}/${skill.milestones.length}` },
            { icon: TrendingUp, label: "Progress", value: `${skill.progress}%` },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2">
              <stat.icon className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                <p className="text-sm font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-bold text-primary">{skill.progress}%</span>
          </div>
          <Progress value={skill.progress} className="h-3" />
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Left column: Chart + Resources */}
        <div className="lg:col-span-3 space-y-5">
          {/* ─── Progress History Chart ─── */}
          {skill.progressHistory.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-4"><TrendingUp className="w-4 h-4 text-primary" />Progress History</h3>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <AreaChart data={skill.progressHistory}>
                  <defs>
                    <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-progress)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-progress)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="progress" stroke="var(--color-progress)" fill="url(#progressGrad)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </motion.div>
          )}

          {/* ─── Resources / Materials ─── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4"><FileText className="w-4 h-4 text-blue-500" />Resources & Materials</h3>
            {skill.resources.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No resources available yet.</p>
            ) : (
              <div className="space-y-2">
                {skill.resources.map(res => {
                  const Icon = resourceIcons[res.type] || FileText;
                  return (
                    <div key={res.id} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer">
                      <div className="shrink-0 rounded-lg bg-muted/50 p-2">
                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{res.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-[9px] capitalize">{res.type}</Badge>
                          <span className="text-[10px] text-muted-foreground">{res.duration}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right column: Milestones */}
        <div className="lg:col-span-2 space-y-5">
          {/* ─── Milestones ─── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-1"><Trophy className="w-4 h-4 text-yellow-500" />Milestones</h3>
            <p className="text-[10px] text-muted-foreground mb-4">{earnedMilestoneXP}/{totalMilestoneXP} XP earned</p>
            <div className="space-y-3">
              {skill.milestones.map((ms, i) => (
                <div key={ms.id} className="flex items-start gap-3">
                  {/* Vertical connector */}
                  <div className="flex flex-col items-center">
                    {ms.reached
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      : <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0" />}
                    {i < skill.milestones.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 ${ms.reached ? "bg-emerald-500/30" : "bg-border"}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${ms.reached ? "text-foreground" : "text-muted-foreground"}`}>{ms.title}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                      <Zap className="w-3 h-3" /> {ms.xp} XP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ─── Tags ─── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-foreground mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </motion.div>

          {/* ─── Quick Action ─── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button className="w-full gap-2" size="lg">
              {skill.completed ? (
                <><CheckCircle2 className="w-4 h-4" /> Review Skill</>
              ) : skill.progress > 0 ? (
                <><TrendingUp className="w-4 h-4" /> Continue Learning</>
              ) : (
                <><Star className="w-4 h-4" /> Start Learning</>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
