import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Code2, Play, CheckCircle2, XCircle, Lightbulb, ChevronDown, Trophy, Zap, Brain,
  Filter, Search, Sparkles, BookOpen, Bug, Send, Bot, Coffee, Terminal,
  Braces, FileCode, Loader2, RotateCcw, Copy, Check, GraduationCap,
  TrendingUp, Target, ArrowRight, Timer, Bookmark, BookmarkCheck, Maximize2,
  Minimize2, Award, Flame, Star, Hash, Keyboard, ChevronRight,
  History, Clock, BarChart3, Shield, Heart, Swords, Crown, Medal,
  CircleDot, Gauge, Activity, Percent
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type Challenge = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  language: string;
  category: string;
  starter_code: string;
  hints: string[];
  expected_output: string | null;
};

type Evaluation = {
  passed: boolean;
  score: number;
  feedback: string;
  errors: string[];
  suggestions: string[];
  correctedCode: string | null;
};

type Message = { role: "user" | "assistant"; content: string };

type Submission = {
  challengeId: string;
  code: string;
  score: number;
  passed: boolean;
  timestamp: number;
};

type UserProgress = {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  solvedIds: string[];
  attemptedIds: string[];
  bookmarkedIds: string[];
  submissions: Submission[];
  achievements: string[];
  totalTime: number;
};

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0, level: 1, streak: 0, lastActiveDate: "",
  solvedIds: [], attemptedIds: [], bookmarkedIds: [],
  submissions: [], achievements: [], totalTime: 0,
};

const STORAGE_KEY = "chadiTroudi_challengeProgress";

const loadProgress = (): UserProgress => {
  try { return { ...DEFAULT_PROGRESS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; }
  catch { return { ...DEFAULT_PROGRESS }; }
};
const saveProgress = (p: UserProgress) => localStorage.setItem(STORAGE_KEY, JSON.stringify(p));

const XP_PER_DIFFICULTY: Record<string, number> = { beginner: 25, intermediate: 50, advanced: 100 };
const LEVELS = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 20000];
const getLevelFromXP = (xp: number) => { let l = 1; for (let i = 1; i < LEVELS.length; i++) { if (xp >= LEVELS[i]) l = i + 1; } return l; };
const getXPForNextLevel = (level: number) => LEVELS[Math.min(level, LEVELS.length - 1)] || LEVELS[LEVELS.length - 1];
const getXPForCurrentLevel = (level: number) => LEVELS[Math.max(0, level - 1)] || 0;



const ACHIEVEMENTS = [
  { id: "first_solve", title: "First Blood", desc: "Solve your first challenge", icon: Swords, check: (p: UserProgress) => p.solvedIds.length >= 1 },
  { id: "five_solves", title: "Getting Serious", desc: "Solve 5 challenges", icon: Flame, check: (p: UserProgress) => p.solvedIds.length >= 5 },
  { id: "ten_solves", title: "On a Roll", desc: "Solve 10 challenges", icon: Trophy, check: (p: UserProgress) => p.solvedIds.length >= 10 },
  { id: "twenty_solves", title: "Challenge Machine", desc: "Solve 20 challenges", icon: Crown, check: (p: UserProgress) => p.solvedIds.length >= 20 },
  { id: "perfect_score", title: "Perfectionist", desc: "Score 100/100 on a challenge", icon: Star, check: (_p: UserProgress, s?: Submission) => s?.score === 100 },
  { id: "streak_3", title: "Hot Streak", desc: "3-day coding streak", icon: Flame, check: (p: UserProgress) => p.streak >= 3 },
  { id: "streak_7", title: "Unstoppable", desc: "7-day coding streak", icon: Shield, check: (p: UserProgress) => p.streak >= 7 },
  { id: "advanced_solve", title: "Boss Slayer", desc: "Solve an advanced challenge", icon: Medal, check: (_p: UserProgress, s?: Submission, c?: Challenge) => s?.passed && c?.difficulty === "advanced" },
  { id: "polyglot", title: "Polyglot", desc: "Solve challenges in 3+ languages", icon: Shield, check: (p: UserProgress, _s?: Submission, _c?: Challenge, all?: Challenge[]) => { const langs = new Set(p.solvedIds.map(id => all?.find(ch => ch.id === id)?.language).filter(Boolean)); return langs.size >= 3; } },
  { id: "speed_demon", title: "Speed Demon", desc: "Solve a challenge under 2 minutes", icon: Timer, check: (_p: UserProgress, _s?: Submission, _c?: Challenge, _all?: Challenge[], time?: number) => time !== undefined && time < 120 },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const difficultyConfig = {
  beginner: { icon: Zap, color: "text-green-500", bg: "bg-green-500/10 border-green-500/20", label: "Beginner", emoji: "🌱", xp: 25 },
  intermediate: { icon: Brain, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Intermediate", emoji: "⚡", xp: 50 },
  advanced: { icon: Trophy, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20", label: "Advanced", emoji: "🔥", xp: 100 },
};

const languageConfig: Record<string, { icon: any; label: string; color: string; bgColor: string }> = {
  javascript: { icon: Braces, label: "JavaScript", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  java: { icon: Coffee, label: "Java", color: "text-orange-500", bgColor: "bg-orange-500/10" },
  python: { icon: Terminal, label: "Python", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  csharp: { icon: Code2, label: "C#", color: "text-violet-500", bgColor: "bg-violet-500/10" },
  php: { icon: FileCode, label: "PHP", color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
  typescript: { icon: Braces, label: "TypeScript", color: "text-sky-500", bgColor: "bg-sky-500/10" },
};

const learningPaths = [
  { title: "Algorithmic Thinking", desc: "Master problem-solving patterns from brute force to optimal solutions", icon: Brain, topics: ["Binary Search", "Two Pointers", "Sliding Window", "Recursion"], color: "from-purple-500/10 to-indigo-500/10", borderColor: "border-purple-500/20" },
  { title: "Data Structures", desc: "Build and manipulate fundamental data structures hands-on", icon: Target, topics: ["Arrays & Strings", "Stacks & Queues", "Trees", "Hash Maps"], color: "from-blue-500/10 to-cyan-500/10", borderColor: "border-blue-500/20" },
  { title: "Design Patterns", desc: "Apply proven OOP patterns to write cleaner, scalable code", icon: Sparkles, topics: ["Singleton", "Factory", "Observer", "Strategy"], color: "from-amber-500/10 to-orange-500/10", borderColor: "border-amber-500/20" },
  { title: "Clean Code", desc: "Write readable, maintainable code that teams love to work with", icon: CheckCircle2, topics: ["Naming", "Functions", "Error Handling", "Testing"], color: "from-green-500/10 to-emerald-500/10", borderColor: "border-green-500/20" },
];

/* ═══════════════════════════════════════════════
   TIMER HOOK
   ═══════════════════════════════════════════════ */
const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const start = () => { setSeconds(0); setRunning(true); };
  const stop = () => setRunning(false);
  const reset = () => { setRunning(false); setSeconds(0); };
  const formatTime = () => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return { seconds, running, start, stop, reset, formatTime };
};

/* ═══════════════════════════════════════════════
   CONFETTI COMPONENT
   ═══════════════════════════════════════════════ */
const Confetti = ({ show }: { show: boolean }) => {
  if (!show) return null;
  const colors = ["#f43f5e", "#8b5cf6", "#3b82f6", "#22c55e", "#f59e0b", "#ec4899"];
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: -10,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: Math.random() * 720 - 360,
            x: Math.random() * 200 - 100,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2.5 + Math.random() * 2,
            delay: Math.random() * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   XP BAR COMPONENT
   ═══════════════════════════════════════════════ */
const XPBar = ({ progress }: { progress: UserProgress }) => {
  const nextLevelXP = getXPForNextLevel(progress.level);
  const currentLevelXP = getXPForCurrentLevel(progress.level);
  const progressInLevel = progress.xp - currentLevelXP;
  const levelRange = nextLevelXP - currentLevelXP;
  const pct = Math.min((progressInLevel / levelRange) * 100, 100);

  return (
    <div className="flex-1 max-w-[200px]">
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
        <span>Level {progress.level}</span>
        <span>{progress.xp}/{nextLevelXP} XP</span>
      </div>
      <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   LINE-NUMBERED EDITOR
   ═══════════════════════════════════════════════ */
const LineNumberEditor = ({
  code,
  onChange,
  language,
  onSubmit,
  readOnly = false,
}: {
  code: string;
  onChange: (v: string) => void;
  language: string;
  onSubmit: () => void;
  readOnly?: boolean;
}) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const lineCountRef = useRef<HTMLDivElement>(null);
  const lines = code.split("\n");

  const syncScroll = () => {
    if (textRef.current && lineCountRef.current) {
      lineCountRef.current.scrollTop = textRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmit();
      return;
    }
    // Tab to indent 
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;
      onChange(val.substring(0, start) + "  " + val.substring(end));
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2; });
    }
  };

  return (
    <div className="relative flex border border-border rounded-b-xl overflow-hidden bg-[#0d1117]">
      <div
        ref={lineCountRef}
        className="flex-shrink-0 w-12 py-4 overflow-hidden select-none bg-[#0d1117] border-r border-border/30"
        style={{ lineHeight: "1.5rem" }}
      >
        {lines.map((_, i) => (
          <div key={i} className="px-2 text-right text-[11px] text-muted-foreground/40 font-mono leading-6">
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        ref={textRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        className="flex-1 h-64 py-4 px-4 font-mono text-sm text-[#c9d1d9] bg-transparent resize-none focus:outline-none leading-6 placeholder:text-muted-foreground/30"
        spellCheck={false}
        placeholder="// Write your solution here..."
        style={{ tabSize: 2 }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
const ChallengesSection = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"challenges" | "paths" | "tips" | "progress">("challenges");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [xpGain, setXpGain] = useState<{ amount: number; show: boolean }>({ amount: 0, show: false });
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  // Progress tracking
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  // AI Tutor inline
  const [tutorMessages, setTutorMessages] = useState<Message[]>([]);
  const [tutorInput, setTutorInput] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);
  const [showTutor, setShowTutor] = useState(false);
  const tutorScrollRef = useRef<HTMLDivElement>(null);
  const editorSectionRef = useRef<HTMLDivElement>(null);

  // Timer
  const timer = useTimer();

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data, error } = await supabase
        .from("coding_challenges")
        .select("*")
        .order("difficulty");
      if (error) {
        console.error("Error fetching challenges:", error);
        toast.error("Failed to load challenges");
      } else {
        setChallenges(data || []);
      }
      setLoading(false);
    };
    fetchChallenges();
  }, []);

  // Streak tracker
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setProgress(prev => {
      if (prev.lastActiveDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const newStreak = prev.lastActiveDate === yesterday ? prev.streak + 1 : (prev.lastActiveDate ? 1 : prev.streak);
      const updated = { ...prev, streak: newStreak, lastActiveDate: today };
      saveProgress(updated);
      return updated;
    });
  }, []);

  useEffect(() => {
    if (tutorScrollRef.current) {
      tutorScrollRef.current.scrollTop = tutorScrollRef.current.scrollHeight;
    }
  }, [tutorMessages]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setShowShortcuts(s => !s); }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [isFullscreen]);

  const updateProgress = useCallback((updates: Partial<UserProgress>) => {
    setProgress(prev => {
      const next = { ...prev, ...updates };
      next.level = getLevelFromXP(next.xp);
      saveProgress(next);
      return next;
    });
  }, []);

  const checkAchievements = useCallback((p: UserProgress, submission?: Submission, challenge?: Challenge, timeInSeconds?: number) => {
    const newUnlocked: string[] = [];
    ACHIEVEMENTS.forEach(a => {
      if (!p.achievements.includes(a.id) && a.check(p, submission, challenge, challenges, timeInSeconds)) {
        newUnlocked.push(a.id);
      }
    });
    if (newUnlocked.length > 0) {
      setNewAchievements(newUnlocked);
      setTimeout(() => setNewAchievements([]), 4000);
      updateProgress({ achievements: [...p.achievements, ...newUnlocked] });
      newUnlocked.forEach(id => {
        const a = ACHIEVEMENTS.find(x => x.id === id);
        if (a) toast.success(`🏆 Achievement Unlocked: ${a.title}`);
      });
    }
  }, [challenges, updateProgress]);

  const toggleBookmark = (id: string) => {
    setProgress(prev => {
      const bookmarked = prev.bookmarkedIds.includes(id)
        ? prev.bookmarkedIds.filter(x => x !== id)
        : [...prev.bookmarkedIds, id];
      const next = { ...prev, bookmarkedIds: bookmarked };
      saveProgress(next);
      return next;
    });
  };

  const selectChallenge = (c: Challenge) => {
    setSelectedChallenge(c);
    setCode(c.starter_code);
    setEvaluation(null);
    setShowHints(false);
    setTutorMessages([]);
    setShowHistory(false);
    timer.start();
    // Track attempted
    if (!progress.attemptedIds.includes(c.id)) {
      updateProgress({ attemptedIds: [...progress.attemptedIds, c.id] });
    }
  };

  const evaluateCode = async () => {
    if (!selectedChallenge || !code.trim()) return;
    setIsEvaluating(true);
    setEvaluation(null);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evaluate-challenge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ code, challenge: selectedChallenge }),
        }
      );
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Evaluation failed");
      }
      const result: Evaluation = await resp.json();
      setEvaluation(result);

      const submission: Submission = {
        challengeId: selectedChallenge.id,
        code,
        score: result.score,
        passed: result.passed,
        timestamp: Date.now(),
      };

      const newSubmissions = [...progress.submissions, submission].slice(-100); // keep last 100

      if (result.passed) {
        timer.stop();
        const xpEarned = XP_PER_DIFFICULTY[selectedChallenge.difficulty] || 25;
        const bonusXP = result.score === 100 ? 25 : 0;
        const totalXP = xpEarned + bonusXP;

        // Show XP gain animation
        setXpGain({ amount: totalXP, show: true });
        setTimeout(() => setXpGain({ amount: 0, show: false }), 2500);

        // Confetti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3500);

        const newSolvedIds = progress.solvedIds.includes(selectedChallenge.id)
          ? progress.solvedIds
          : [...progress.solvedIds, selectedChallenge.id];

        const newProgress = {
          ...progress,
          xp: progress.xp + totalXP,
          solvedIds: newSolvedIds,
          submissions: newSubmissions,
          totalTime: progress.totalTime + timer.seconds,
        };
        newProgress.level = getLevelFromXP(newProgress.xp);
        updateProgress(newProgress);

        toast.success(`🎉 Challenge passed! +${totalXP} XP`);
        checkAchievements(newProgress, submission, selectedChallenge, timer.seconds);
      } else {
        updateProgress({ submissions: newSubmissions });
        toast.error("Keep trying — you'll get it!");
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      toast.error("Failed to evaluate. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // AI Tutor streaming
  const sendTutorMessage = async (msgOverride?: string) => {
    const content = msgOverride || tutorInput.trim();
    if (!content || tutorLoading) return;
    const userMsg: Message = { role: "user", content };
    const all = [...tutorMessages, userMsg];
    setTutorMessages(all);
    setTutorInput("");
    setTutorLoading(true);
    setShowTutor(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setTutorMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: all }),
      });
      if (!resp.ok || !resp.body) throw new Error("Stream failed");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || !line.trim() || !line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try { const p = JSON.parse(json); const c = p.choices?.[0]?.delta?.content; if (c) upsert(c); }
          catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch { upsert("Sorry, I'm having trouble right now. Please try again."); }
    finally { setTutorLoading(false); }
  };

  const requestHint = () => {
    if (!selectedChallenge) return;
    sendTutorMessage(`Give me a hint for this ${selectedChallenge.language} challenge "${selectedChallenge.title}". Don't give the full answer, just nudge me in the right direction.\n\n\`\`\`${selectedChallenge.language}\n${code}\n\`\`\``);
  };

  const requestReview = () => {
    if (!selectedChallenge) return;
    sendTutorMessage(`Review my ${selectedChallenge.language} code for the "${selectedChallenge.title}" challenge. Check for bugs, style, and best practices:\n\n\`\`\`${selectedChallenge.language}\n${code}\n\`\`\``);
  };

  const requestDebug = () => {
    if (!selectedChallenge) return;
    const ctx = evaluation ? `\n\nEvaluation feedback: ${evaluation.feedback}\nErrors: ${evaluation.errors.join(", ")}` : "";
    sendTutorMessage(`Help me debug this ${selectedChallenge.language} code:${ctx}\n\n\`\`\`${selectedChallenge.language}\n${code}\n\`\`\``);
  };

  // Filtering
  const filtered = challenges.filter(c => {
    if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter) return false;
    if (languageFilter !== "all" && c.language !== languageFilter) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) && !c.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const availableLanguages = [...new Set(challenges.map(c => c.language))];
  const stats = {
    total: challenges.length,
    languages: availableLanguages.length,
    beginner: challenges.filter(c => c.difficulty === "beginner").length,
    advanced: challenges.filter(c => c.difficulty === "advanced").length,
  };

  // Challenge-specific history
  const challengeHistory = selectedChallenge
    ? progress.submissions.filter(s => s.challengeId === selectedChallenge.id).reverse().slice(0, 10)
    : [];

  // Suggested next challenges
  const suggestedChallenges = challenges
    .filter(c => !progress.solvedIds.includes(c.id))
    .sort((a, b) => {
      const order = { beginner: 0, intermediate: 1, advanced: 2 };
      return (order[a.difficulty as keyof typeof order] || 0) - (order[b.difficulty as keyof typeof order] || 0);
    })
    .slice(0, 3);

  const completionRate = challenges.length > 0 ? Math.round((progress.solvedIds.length / challenges.length) * 100) : 0;
  const avgScore = progress.submissions.length > 0
    ? Math.round(progress.submissions.reduce((sum, s) => sum + s.score, 0) / progress.submissions.length)
    : 0;

  return (
    <>
    <Confetti show={showConfetti} />

    {/* Achievement Popup */}
    <AnimatePresence>
      {newAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-[99] bg-card border-2 border-primary/40 rounded-2xl p-5 shadow-2xl shadow-primary/20 max-w-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-primary font-semibold uppercase tracking-wider">Achievement Unlocked!</p>
              {newAchievements.map(id => {
                const a = ACHIEVEMENTS.find(x => x.id === id);
                return a ? <p key={id} className="text-sm font-bold text-foreground">{a.title}</p> : null;
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* XP Gain Popup */}
    <AnimatePresence>
      {xpGain.show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          exit={{ opacity: 0, y: -80 }}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 z-[99] text-3xl font-black text-primary pointer-events-none"
          style={{ textShadow: "0 0 20px hsl(var(--primary) / 0.5)" }}
        >
          +{xpGain.amount} XP
        </motion.div>
      )}
    </AnimatePresence>

    {/* Keyboard Shortcuts Modal */}
    <AnimatePresence>
      {showShortcuts && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowShortcuts(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">Keyboard Shortcuts</h3>
            </div>
            <div className="space-y-3">
              {[
                { keys: ["Ctrl", "Enter"], desc: "Submit solution" },
                { keys: ["Tab"], desc: "Insert indent" },
                { keys: ["Ctrl", "K"], desc: "Toggle shortcuts" },
                { keys: ["Esc"], desc: "Exit fullscreen" },
              ].map(s => (
                <div key={s.desc} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{s.desc}</span>
                  <div className="flex gap-1">
                    {s.keys.map(k => (
                      <kbd key={k} className="px-2 py-1 rounded-md bg-muted border border-border text-xs font-mono text-foreground">{k}</kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <section id="challenges" className={`py-20 px-4 bg-muted/30 ${isFullscreen ? "fixed inset-0 z-50 bg-background overflow-y-auto" : ""}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with progress bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Code2 className="w-4 h-4" />
            Interactive Coding Arena
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 font-bold">v2.0</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Sharpen Your Skills</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Dive into {stats.total}+ coding challenges across {stats.languages} languages. Earn XP, unlock achievements, track your streak, and level up with AI feedback.
          </p>

          {/* Player Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex flex-wrap items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border shadow-sm mb-6"
          >
            <div className="flex items-center gap-2 pr-3 border-r border-border">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xs font-black text-primary-foreground">
                {progress.level}
              </div>
              <XPBar progress={progress} />
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Flame className={`w-4 h-4 ${progress.streak >= 3 ? "text-orange-500" : "text-muted-foreground"}`} />
              <span className="font-bold text-foreground">{progress.streak}</span>
              <span className="text-muted-foreground text-xs">day streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="font-bold text-foreground">{progress.solvedIds.length}</span>
              <span className="text-muted-foreground text-xs">solved</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-foreground">{progress.achievements.length}</span>
              <span className="text-muted-foreground text-xs">badges</span>
            </div>
            <button onClick={() => setShowShortcuts(true)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Keyboard shortcuts">
              <Keyboard className="w-4 h-4 text-muted-foreground" />
            </button>
          </motion.div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: Code2, value: `${stats.total}+`, label: "Challenges" },
              { icon: GraduationCap, value: `${stats.languages}`, label: "Languages" },
              { icon: Sparkles, value: "AI", label: "Powered Feedback" },
              { icon: TrendingUp, value: "3", label: "Difficulty Levels" },
              { icon: Award, value: `${ACHIEVEMENTS.length}`, label: "Achievements" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
                <s.icon className="w-4 h-4 text-primary" />
                <span className="font-bold text-foreground">{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { key: "challenges" as const, label: "Challenges", icon: Code2 },
            { key: "paths" as const, label: "Learning Paths", icon: BookOpen },
            { key: "progress" as const, label: "My Progress", icon: BarChart3 },
            { key: "tips" as const, label: "Pro Tips", icon: Lightbulb },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                activeTab === tab.key ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card border-border text-muted-foreground hover:border-primary/50"
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.key === "progress" && progress.solvedIds.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary-foreground/20 text-[10px] font-bold flex items-center justify-center">
                  {progress.solvedIds.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══ CHALLENGES TAB ═══ */}
        {activeTab === "challenges" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search challenges..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground" />
              </div>

              {/* Bookmark filter */}
              <button
                onClick={() => setLanguageFilter(languageFilter === "bookmarked" ? "all" : "bookmarked" as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  languageFilter === "bookmarked" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600" : "bg-card border-border text-muted-foreground hover:border-yellow-500/50"
                }`}
              >
                <BookmarkCheck className="w-3 h-3" />
                Bookmarked ({progress.bookmarkedIds.length})
              </button>

              {/* Language filter */}
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setLanguageFilter("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${languageFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"}`}>
                  All Languages
                </button>
                {availableLanguages.map(lang => {
                  const cfg = languageConfig[lang] || { icon: Code2, label: lang, color: "text-muted-foreground", bgColor: "bg-muted/50" };
                  return (
                    <button key={lang} onClick={() => setLanguageFilter(lang)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${languageFilter === lang ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"}`}>
                      <cfg.icon className="w-3 h-3" />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Difficulty filter */}
              <div className="flex gap-1.5 ml-auto">
                {["all", "beginner", "intermediate", "advanced"].map(d => (
                  <button key={d} onClick={() => setDifficultyFilter(d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${difficultyFilter === d ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"}`}>
                    {d === "all" ? "All" : difficultyConfig[d as keyof typeof difficultyConfig].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6" ref={editorSectionRef}>
              {/* Challenge List — 2 cols */}
              <div className={`lg:col-span-2 space-y-2.5 max-h-[700px] overflow-y-auto pr-1 ${isFullscreen ? "hidden" : ""}`}>
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />Loading challenges...</div>
                ) : (filtered.length === 0 && languageFilter !== "bookmarked") ? (
                  <div className="text-center py-12 text-muted-foreground">No challenges match your filters.</div>
                ) : (
                  (languageFilter === "bookmarked"
                    ? challenges.filter(c => progress.bookmarkedIds.includes(c.id))
                    : filtered
                  ).map((c, i) => {
                    const diff = difficultyConfig[c.difficulty as keyof typeof difficultyConfig] || difficultyConfig.beginner;
                    const lang = languageConfig[c.language] || { icon: Code2, label: c.language, color: "text-muted-foreground", bgColor: "bg-muted/50" };
                    const DiffIcon = diff.icon;
                    const isSolved = progress.solvedIds.includes(c.id);
                    const isBookmarked = progress.bookmarkedIds.includes(c.id);
                    const bestScore = Math.max(0, ...progress.submissions.filter(s => s.challengeId === c.id).map(s => s.score));
                    return (
                      <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                        className={`relative group w-full text-left p-3.5 rounded-xl border transition-all ${
                          selectedChallenge?.id === c.id ? "bg-primary/5 border-primary shadow-md" : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                        } ${isSolved ? "border-l-4 border-l-green-500" : ""}`}
                      >
                        <button onClick={() => selectChallenge(c)} className="w-full text-left">
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded-lg border ${diff.bg} relative`}>
                              <DiffIcon className={`w-3.5 h-3.5 ${diff.color}`} />
                              {isSolved && (
                                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center">
                                  <Check className="w-2 h-2 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm text-foreground leading-tight">{c.title}</h3>
                              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{c.description}</p>
                              <div className="flex gap-1.5 mt-1.5 items-center">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${lang.bgColor} ${lang.color} font-medium`}>
                                  {lang.label}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${diff.bg} ${diff.color}`}>
                                  {diff.emoji} {diff.label}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border">
                                  {c.category}
                                </span>
                                {bestScore > 0 && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold ml-auto">
                                    Best: {bestScore}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                        {/* Bookmark button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(c.id); }}
                          className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                        >
                          {isBookmarked
                            ? <BookmarkCheck className="w-3.5 h-3.5 text-yellow-500" />
                            : <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                          }
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Editor + Results — 3 cols (or full on fullscreen) */}
              <div className={`space-y-4 ${isFullscreen ? "lg:col-span-5" : "lg:col-span-3"}`}>
                {selectedChallenge ? (
                  <>
                    {/* Challenge Info Bar */}
                    <div className="bg-card rounded-xl border border-border p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {(() => { const L = languageConfig[selectedChallenge.language]; return L ? <L.icon className={`w-4 h-4 ${L.color}`} /> : null; })()}
                            <h3 className="font-bold text-lg text-foreground">{selectedChallenge.title}</h3>
                            {progress.solvedIds.includes(selectedChallenge.id) && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" /> Solved
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{selectedChallenge.description}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Timer */}
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono ${
                            timer.running ? "border-primary/30 bg-primary/5 text-primary" : "border-border bg-muted/30 text-muted-foreground"
                          }`}>
                            <Timer className="w-3.5 h-3.5" />
                            {timer.formatTime()}
                          </div>
                          {/* XP reward badge */}
                          <div className={`px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap bg-primary/5 border-primary/20 text-primary`}>
                            +{XP_PER_DIFFICULTY[selectedChallenge.difficulty] || 25} XP
                          </div>
                          {/* Fullscreen toggle */}
                          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors" title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
                            {isFullscreen ? <Minimize2 className="w-4 h-4 text-muted-foreground" /> : <Maximize2 className="w-4 h-4 text-muted-foreground" />}
                          </button>
                        </div>
                      </div>
                      {selectedChallenge.expected_output && (
                        <div className="mt-3 text-xs bg-[#0d1117] rounded-lg p-3 font-mono text-[#c9d1d9] border border-border/30">
                          <span className="font-semibold text-primary">Expected output → </span>{selectedChallenge.expected_output}
                        </div>
                      )}
                    </div>

                    {/* Code Editor with line numbers */}
                    <div className="relative">
                      <div className="flex items-center justify-between bg-[#161b22] rounded-t-xl px-4 py-2.5 border border-border border-b-0">
                        <span className="text-xs font-mono text-[#8b949e] flex items-center gap-1.5">
                          {(() => { const L = languageConfig[selectedChallenge.language]; return L ? <L.icon className={`w-3 h-3 ${L.color}`} /> : null; })()}
                          {languageConfig[selectedChallenge.language]?.label || selectedChallenge.language}
                          <span className="text-[10px] text-muted-foreground/50 ml-2">{code.split("\n").length} lines</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button onClick={copyCode} className="text-[#8b949e] hover:text-white transition-colors p-1" title="Copy code">
                            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => { setCode(selectedChallenge.starter_code); setEvaluation(null); }} className="text-[#8b949e] hover:text-white transition-colors p-1" title="Reset code">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setShowHistory(!showHistory)} className="text-[#8b949e] hover:text-white transition-colors p-1" title="Submission history">
                            <History className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex gap-1.5 ml-2">
                            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                          </div>
                        </div>
                      </div>
                      <LineNumberEditor
                        code={code}
                        onChange={setCode}
                        language={selectedChallenge.language}
                        onSubmit={evaluateCode}
                      />
                    </div>

                    {/* Submission History */}
                    <AnimatePresence>
                      {showHistory && challengeHistory.length > 0 && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <History className="w-4 h-4 text-primary" />
                              <span className="text-sm font-semibold text-foreground">Submission History</span>
                              <span className="text-xs text-muted-foreground ml-auto">{challengeHistory.length} submissions</span>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {challengeHistory.map((s, i) => (
                                <button
                                  key={i}
                                  onClick={() => setCode(s.code)}
                                  className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${s.passed ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                    {s.score}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-foreground">{s.passed ? "Passed" : "Failed"}</div>
                                    <div className="text-[10px] text-muted-foreground">{new Date(s.timestamp).toLocaleString()}</div>
                                  </div>
                                  <span className="text-[10px] text-primary">Load →</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button onClick={evaluateCode} disabled={isEvaluating || !code.trim()}
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                        {isEvaluating ? <><Loader2 className="w-4 h-4 animate-spin" />Evaluating...</> : <><Play className="w-4 h-4" />Submit <kbd className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-primary-foreground/20 font-mono ml-1">⌘↵</kbd></>}
                      </button>
                      <button onClick={requestHint} disabled={tutorLoading}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:border-yellow-500/50 hover:text-yellow-600 transition-colors disabled:opacity-50">
                        <Lightbulb className="w-4 h-4" /> Hint
                      </button>
                      <button onClick={requestReview} disabled={tutorLoading}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50">
                        <BookOpen className="w-4 h-4" /> Review
                      </button>
                      <button onClick={requestDebug} disabled={tutorLoading}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:border-red-500/50 hover:text-red-500 transition-colors disabled:opacity-50">
                        <Bug className="w-4 h-4" /> Debug
                      </button>
                      {selectedChallenge.hints.length > 0 && (
                        <button onClick={() => setShowHints(!showHints)}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:border-primary/50 transition-colors">
                          <ChevronDown className={`w-3 h-3 transition-transform ${showHints ? "rotate-180" : ""}`} />
                          Built-in Hints
                        </button>
                      )}
                    </div>

                    {/* Hints */}
                    <AnimatePresence>
                      {showHints && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 space-y-2">
                            {selectedChallenge.hints.map((hint, i) => (
                              <div key={i} className="flex gap-2 text-sm"><Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" /><span className="text-muted-foreground">{hint}</span></div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Evaluation Results */}
                    <AnimatePresence>
                      {evaluation && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className={`rounded-xl border p-5 space-y-4 ${evaluation.passed ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                          <div className="flex items-center gap-3">
                            {evaluation.passed ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                            <div>
                              <h4 className="font-bold text-foreground">{evaluation.passed ? "Passed! 🎉" : "Not quite — keep going!"}</h4>
                              <p className="text-sm text-muted-foreground">Score: {evaluation.score}/100</p>
                            </div>
                            <div className="ml-auto w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-sm"
                              style={{ borderColor: evaluation.score >= 80 ? "hsl(var(--primary))" : evaluation.score >= 50 ? "hsl(40, 90%, 50%)" : "hsl(0, 72%, 50%)", color: evaluation.score >= 80 ? "hsl(var(--primary))" : evaluation.score >= 50 ? "hsl(40, 90%, 50%)" : "hsl(0, 72%, 50%)" }}>
                              {evaluation.score}
                            </div>
                          </div>
                          <p className="text-sm text-foreground">{evaluation.feedback}</p>
                          {evaluation.errors.length > 0 && (
                            <div><h5 className="text-xs font-semibold text-red-500 uppercase mb-2">Issues Found</h5>
                              <ul className="space-y-1">{evaluation.errors.map((err, i) => <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-red-400">•</span>{err}</li>)}</ul></div>
                          )}
                          {evaluation.suggestions.length > 0 && (
                            <div><h5 className="text-xs font-semibold text-primary uppercase mb-2">Suggestions</h5>
                              <ul className="space-y-1">{evaluation.suggestions.map((s, i) => <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-primary">→</span>{s}</li>)}</ul></div>
                          )}
                          {evaluation.correctedCode && (
                            <div><h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Corrected Code</h5>
                              <pre className="bg-foreground/5 rounded-lg p-3 text-xs font-mono text-foreground overflow-x-auto">{evaluation.correctedCode}</pre></div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* AI Tutor Chat (collapsible) */}
                    <AnimatePresence>
                      {showTutor && tutorMessages.length > 0 && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-primary/5">
                              <Bot className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium text-foreground">AI Tutor</span>
                              <button onClick={() => setShowTutor(false)} className="ml-auto text-xs text-muted-foreground hover:text-foreground">Hide</button>
                            </div>
                            <div ref={tutorScrollRef} className="max-h-64 overflow-y-auto p-3 space-y-2.5">
                              {tutorMessages.map((msg, i) => (
                                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                  {msg.role === "assistant" && <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1"><Bot className="w-3 h-3 text-primary" /></div>}
                                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
                                    {msg.role === "assistant" ? (
                                      <div className="prose prose-xs dark:prose-invert max-w-none [&_pre]:bg-foreground/10 [&_pre]:rounded-md [&_pre]:p-2 [&_pre]:text-[10px] [&_pre]:overflow-x-auto [&_code]:bg-foreground/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[10px] [&_code]:font-mono [&_p]:m-0 [&_ul]:m-0">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                      </div>
                                    ) : <span className="line-clamp-3">{msg.content}</span>}
                                  </div>
                                </div>
                              ))}
                              {tutorLoading && tutorMessages[tutorMessages.length - 1]?.role !== "assistant" && (
                                <div className="flex gap-2">
                                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Bot className="w-3 h-3 text-primary" /></div>
                                  <div className="bg-muted rounded-xl rounded-bl-sm px-3 py-2"><div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                  </div></div>
                                </div>
                              )}
                            </div>
                            <div className="p-2 border-t border-border">
                              <form onSubmit={(e) => { e.preventDefault(); sendTutorMessage(); }} className="flex gap-2">
                                <input value={tutorInput} onChange={(e) => setTutorInput(e.target.value)} placeholder="Ask about this challenge..."
                                  className="flex-1 bg-muted rounded-full px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground" disabled={tutorLoading} />
                                <button type="submit" disabled={tutorLoading || !tutorInput.trim()}
                                  className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"><Send className="w-3 h-3" /></button>
                              </form>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Code2 className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
                    </motion.div>
                    <h3 className="font-bold text-lg text-foreground mb-2">Ready to Code?</h3>
                    <p className="text-sm text-muted-foreground mb-6">Choose a challenge from the list to start coding and earning XP!</p>

                    {/* Suggested Challenges */}
                    {suggestedChallenges.length > 0 && (
                      <div className="text-left max-w-sm mx-auto">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Suggested for you</p>
                        <div className="space-y-2">
                          {suggestedChallenges.map(c => {
                            const diff = difficultyConfig[c.difficulty as keyof typeof difficultyConfig] || difficultyConfig.beginner;
                            const lang = languageConfig[c.language] || { icon: Code2, label: c.language, color: "", bgColor: "" };
                            return (
                              <button
                                key={c.id}
                                onClick={() => selectChallenge(c)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                              >
                                <div className={`p-1.5 rounded-lg ${diff.bg}`}>
                                  <diff.icon className={`w-3.5 h-3.5 ${diff.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-foreground truncate">{c.title}</div>
                                  <div className="text-[10px] text-muted-foreground">{lang.label} · {diff.label} · +{XP_PER_DIFFICULTY[c.difficulty] || 25} XP</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ LEARNING PATHS TAB ═══ */}
        {activeTab === "paths" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-foreground mb-2">Structured Learning Paths</h3>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">Follow curated paths from foundations to mastery. Each path guides you through concepts with hands-on challenges.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {learningPaths.map((path, i) => (
                <motion.div key={path.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`bg-gradient-to-br ${path.color} border ${path.borderColor} rounded-xl p-6 hover:shadow-lg transition-shadow`}>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-card/80 border border-border">
                      <path.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground mb-1">{path.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{path.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {path.topics.map(t => (
                          <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-card/60 border border-border text-muted-foreground font-medium">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Language tracks */}
            <div className="mt-10">
              <h3 className="text-lg font-bold text-foreground mb-4 text-center">Language-Specific Tracks</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(languageConfig).map(([key, cfg]) => {
                  const count = challenges.filter(c => c.language === key).length;
                  const solved = challenges.filter(c => c.language === key && progress.solvedIds.includes(c.id)).length;
                  if (count === 0) return null;
                  return (
                    <button key={key} onClick={() => { setActiveTab("challenges"); setLanguageFilter(key); }}
                      className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/40 hover:shadow-md transition-all group">
                      <div className={`w-10 h-10 rounded-xl ${cfg.bgColor} flex items-center justify-center mx-auto mb-2`}>
                        <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                      </div>
                      <p className="font-semibold text-sm text-foreground">{cfg.label}</p>
                      <p className="text-xs text-muted-foreground">{solved}/{count} solved</p>
                      {/* Progress bar */}
                      <div className="h-1 rounded-full bg-muted/50 mt-2 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(solved / count) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-0.5 mt-1.5">
                        Start <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ PROGRESS TAB ═══ */}
        {activeTab === "progress" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Star, label: "Total XP", value: progress.xp.toLocaleString(), color: "text-primary", bg: "bg-primary/10" },
                { icon: CheckCircle2, label: "Solved", value: `${progress.solvedIds.length}/${challenges.length}`, color: "text-green-500", bg: "bg-green-500/10" },
                { icon: Flame, label: "Streak", value: `${progress.streak} days`, color: "text-orange-500", bg: "bg-orange-500/10" },
                { icon: Gauge, label: "Avg Score", value: `${avgScore}/100`, color: "text-blue-500", bg: "bg-blue-500/10" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-5 text-center"
                >
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-3`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Level Progress */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl font-black text-primary-foreground">
                  {progress.level}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">Level {progress.level} Coder</h3>
                  <p className="text-xs text-muted-foreground">{progress.xp} / {getXPForNextLevel(progress.level)} XP to next level</p>
                  <div className="h-3 rounded-full bg-muted/50 mt-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/60"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(((progress.xp - getXPForCurrentLevel(progress.level)) / (getXPForNextLevel(progress.level) - getXPForCurrentLevel(progress.level))) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Completion by Difficulty */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Completion by Difficulty</h3>
              <div className="space-y-4">
                {(["beginner", "intermediate", "advanced"] as const).map(d => {
                  const total = challenges.filter(c => c.difficulty === d).length;
                  const solved = challenges.filter(c => c.difficulty === d && progress.solvedIds.includes(c.id)).length;
                  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
                  const cfg = difficultyConfig[d];
                  return (
                    <div key={d}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                          <span className="text-sm font-medium text-foreground">{cfg.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{solved}/{total} ({pct}%)</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted/50 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${d === "beginner" ? "bg-green-500" : d === "intermediate" ? "bg-yellow-500" : "bg-red-500"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Achievements
                <span className="text-xs text-muted-foreground ml-auto">{progress.achievements.length}/{ACHIEVEMENTS.length} unlocked</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {ACHIEVEMENTS.map(a => {
                  const unlocked = progress.achievements.includes(a.id);
                  return (
                    <motion.div
                      key={a.id}
                      whileHover={{ scale: 1.05 }}
                      className={`relative p-4 rounded-xl border text-center transition-all ${
                        unlocked
                          ? "bg-primary/5 border-primary/30 shadow-sm"
                          : "bg-muted/20 border-border opacity-50 grayscale"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${unlocked ? "bg-primary/10" : "bg-muted/30"}`}>
                        <a.icon className={`w-5 h-5 ${unlocked ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <p className="text-xs font-bold text-foreground">{a.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{a.desc}</p>
                      {unlocked && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Recent Submissions */}
            {progress.submissions.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><History className="w-5 h-5 text-primary" /> Recent Submissions</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {[...progress.submissions].reverse().slice(0, 20).map((s, i) => {
                    const ch = challenges.find(c => c.id === s.challengeId);
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/50">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${s.passed ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                          {s.score}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{ch?.title || "Unknown"}</div>
                          <div className="text-[10px] text-muted-foreground">{new Date(s.timestamp).toLocaleString()}</div>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${s.passed ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                          {s.passed ? "Passed" : "Failed"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══ PRO TIPS TAB ═══ */}
        {activeTab === "tips" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-foreground mb-2">Pro Tips & Best Practices</h3>
              <p className="text-muted-foreground text-sm">Common pitfalls, language insights, and patterns every developer should know.</p>
            </div>
            {[
              { lang: "Java", tips: ["Always close resources with try-with-resources", "Prefer `List.of()` over `new ArrayList<>()` for immutable lists", "Use StringBuilder for string concatenation in loops", "Override equals() AND hashCode() together — never one without the other"], color: "border-orange-500/20", icon: Coffee, iconColor: "text-orange-500" },
              { lang: "JavaScript", tips: ["Use `const` by default, `let` when mutation is needed, never `var`", "Understand closures — they're the secret behind callbacks and React hooks", "Always handle Promise rejections with `.catch()` or try/catch", "Use optional chaining `?.` to avoid 'Cannot read property of undefined'"], color: "border-yellow-500/20", icon: Braces, iconColor: "text-yellow-500" },
              { lang: "Python", tips: ["Use list comprehensions — they're faster AND more readable", "f-strings are the cleanest way to format strings since Python 3.6", "Use `enumerate()` instead of manual index tracking", "Virtual environments aren't optional — always use one per project"], color: "border-blue-500/20", icon: Terminal, iconColor: "text-blue-500" },
              { lang: "C#", tips: ["Use `var` for obvious types, explicit types when clarity matters", "LINQ is incredibly powerful — learn `.Select()`, `.Where()`, `.GroupBy()`", "Async/await all the way up — don't mix sync and async code", "Null-conditional operators `?.` and `??` save you from NullReferenceException"], color: "border-violet-500/20", icon: Code2, iconColor: "text-violet-500" },
              { lang: "PHP", tips: ["Always use PDO with prepared statements — never concatenate SQL", "Type declarations (int, string, array) make your code more reliable", "Composer is essential — learn it like npm for JavaScript", "Use `===` (strict comparison) to avoid type juggling surprises"], color: "border-indigo-500/20", icon: FileCode, iconColor: "text-indigo-500" },
            ].map((section, i) => (
              <motion.div key={section.lang} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`bg-card border ${section.color} rounded-xl p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <section.icon className={`w-5 h-5 ${section.iconColor}`} />
                  <h4 className="font-bold text-foreground">{section.lang} Tips</h4>
                </div>
                <ul className="space-y-2">
                  {section.tips.map((tip, j) => (
                    <li key={j} className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <div className="text-center pt-4">
              <button onClick={() => setActiveTab("challenges")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                <Code2 className="w-4 h-4" /> Start Practicing Now
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
    </>
  );
};

export default ChallengesSection;
