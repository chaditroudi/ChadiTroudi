import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Code2, Play, CheckCircle2, XCircle, Lightbulb, ChevronDown, Trophy, Zap, Brain,
  Filter, Search, Sparkles, BookOpen, Bug, Send, Bot, Coffee, Terminal,
  Braces, FileCode, Loader2, RotateCcw, Copy, Check, GraduationCap,
  TrendingUp, Target, ArrowRight
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

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const difficultyConfig = {
  beginner: { icon: Zap, color: "text-green-500", bg: "bg-green-500/10 border-green-500/20", label: "Beginner", emoji: "🌱" },
  intermediate: { icon: Brain, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Intermediate", emoji: "⚡" },
  advanced: { icon: Trophy, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20", label: "Advanced", emoji: "🔥" },
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
  const [activeTab, setActiveTab] = useState<"challenges" | "paths" | "tips">("challenges");

  // AI Tutor inline
  const [tutorMessages, setTutorMessages] = useState<Message[]>([]);
  const [tutorInput, setTutorInput] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);
  const [showTutor, setShowTutor] = useState(false);
  const tutorScrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (tutorScrollRef.current) {
      tutorScrollRef.current.scrollTop = tutorScrollRef.current.scrollHeight;
    }
  }, [tutorMessages]);

  const selectChallenge = (c: Challenge) => {
    setSelectedChallenge(c);
    setCode(c.starter_code);
    setEvaluation(null);
    setShowHints(false);
    setTutorMessages([]);
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
      if (result.passed) toast.success("🎉 Challenge passed! Great work!");
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

  return (
    <section id="challenges" className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Code2 className="w-4 h-4" />
            Interactive Coding Arena
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Sharpen Your Skills</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Dive into {stats.total}+ coding challenges across {stats.languages} languages. Get instant AI feedback, hints on demand, and level up from beginner to advanced.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: Code2, value: `${stats.total}+`, label: "Challenges" },
              { icon: GraduationCap, value: `${stats.languages}`, label: "Languages" },
              { icon: Sparkles, value: "AI", label: "Powered Feedback" },
              { icon: TrendingUp, value: "3", label: "Difficulty Levels" },
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
            { key: "tips" as const, label: "Pro Tips", icon: Lightbulb },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                activeTab === tab.key ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card border-border text-muted-foreground hover:border-primary/50"
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
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

            <div className="grid lg:grid-cols-5 gap-6">
              {/* Challenge List — 2 cols */}
              <div className="lg:col-span-2 space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />Loading challenges...</div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">No challenges match your filters.</div>
                ) : (
                  filtered.map((c, i) => {
                    const diff = difficultyConfig[c.difficulty as keyof typeof difficultyConfig] || difficultyConfig.beginner;
                    const lang = languageConfig[c.language] || { icon: Code2, label: c.language, color: "text-muted-foreground", bgColor: "bg-muted/50" };
                    const DiffIcon = diff.icon;
                    return (
                      <motion.button key={c.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                        onClick={() => selectChallenge(c)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                          selectedChallenge?.id === c.id ? "bg-primary/5 border-primary shadow-md" : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                        }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-lg border ${diff.bg}`}>
                            <DiffIcon className={`w-3.5 h-3.5 ${diff.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-foreground leading-tight">{c.title}</h3>
                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{c.description}</p>
                            <div className="flex gap-1.5 mt-1.5">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${lang.bgColor} ${lang.color} font-medium`}>
                                {lang.label}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${diff.bg} ${diff.color}`}>
                                {diff.emoji} {diff.label}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border">
                                {c.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })
                )}
              </div>

              {/* Editor + Results — 3 cols */}
              <div className="lg:col-span-3 space-y-4">
                {selectedChallenge ? (
                  <>
                    {/* Challenge Info */}
                    <div className="bg-card rounded-xl border border-border p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {(() => { const L = languageConfig[selectedChallenge.language]; return L ? <L.icon className={`w-4 h-4 ${L.color}`} /> : null; })()}
                            <h3 className="font-bold text-lg text-foreground">{selectedChallenge.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{selectedChallenge.description}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${difficultyConfig[selectedChallenge.difficulty as keyof typeof difficultyConfig]?.bg} ${difficultyConfig[selectedChallenge.difficulty as keyof typeof difficultyConfig]?.color}`}>
                          {difficultyConfig[selectedChallenge.difficulty as keyof typeof difficultyConfig]?.label}
                        </div>
                      </div>
                      {selectedChallenge.expected_output && (
                        <div className="mt-3 text-xs bg-muted/50 rounded-lg p-3 font-mono text-muted-foreground">
                          <span className="font-semibold text-foreground">Expected: </span>{selectedChallenge.expected_output}
                        </div>
                      )}
                    </div>

                    {/* Code Editor */}
                    <div className="relative">
                      <div className="flex items-center justify-between bg-foreground/5 rounded-t-xl px-4 py-2 border border-border border-b-0">
                        <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                          {(() => { const L = languageConfig[selectedChallenge.language]; return L ? <L.icon className={`w-3 h-3 ${L.color}`} /> : null; })()}
                          {languageConfig[selectedChallenge.language]?.label || selectedChallenge.language}
                        </span>
                        <div className="flex items-center gap-2">
                          <button onClick={copyCode} className="text-muted-foreground hover:text-foreground transition-colors p-1" title="Copy code">
                            {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => { setCode(selectedChallenge.starter_code); setEvaluation(null); }} className="text-muted-foreground hover:text-foreground transition-colors p-1" title="Reset code">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex gap-1.5 ml-2">
                            <span className="w-3 h-3 rounded-full bg-red-400/60" />
                            <span className="w-3 h-3 rounded-full bg-yellow-400/60" />
                            <span className="w-3 h-3 rounded-full bg-green-400/60" />
                          </div>
                        </div>
                      </div>
                      <textarea value={code} onChange={(e) => setCode(e.target.value)}
                        className="w-full h-52 bg-card border border-border rounded-b-xl p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                        spellCheck={false} placeholder="Write your solution here..." style={{ tabSize: 2 }} />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button onClick={evaluateCode} disabled={isEvaluating || !code.trim()}
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                        {isEvaluating ? <><Loader2 className="w-4 h-4 animate-spin" />Evaluating...</> : <><Play className="w-4 h-4" />Submit</>}
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
                    <Code2 className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Pick a Challenge</h3>
                    <p className="text-sm text-muted-foreground">Choose from {filtered.length} challenges on the left to start coding!</p>
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
                  if (count === 0) return null;
                  return (
                    <button key={key} onClick={() => { setActiveTab("challenges"); setLanguageFilter(key); }}
                      className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/40 hover:shadow-md transition-all group">
                      <div className={`w-10 h-10 rounded-xl ${cfg.bgColor} flex items-center justify-center mx-auto mb-2`}>
                        <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                      </div>
                      <p className="font-semibold text-sm text-foreground">{cfg.label}</p>
                      <p className="text-xs text-muted-foreground">{count} challenges</p>
                      <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-0.5 mt-1">
                        Start <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
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
  );
};

export default ChallengesSection;
