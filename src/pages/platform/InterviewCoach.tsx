import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mic, Video, Code2, Layout, MessageSquare, Play, Pause,
  ChevronRight, Clock, Star, Trophy, Target, BarChart3,
  CheckCircle2, XCircle, AlertCircle, ArrowRight, RotateCcw,
  Loader2, Brain, Zap, Users, Shield, TrendingUp, Timer,
  Lightbulb, ThumbsUp, ThumbsDown, Send, Bot, User,
  Sparkles, Award, BookOpen, ChevronDown, ChevronUp,
  CircleDot, Boxes, History, GraduationCap,
} from "lucide-react";

// ─── Types ───
type InterviewMode = "coding" | "system-design" | "behavioral";
type Difficulty = "easy" | "medium" | "hard";
type InterviewState = "select" | "briefing" | "active" | "scorecard";

interface ChatMessage {
  id: string;
  role: "interviewer" | "candidate";
  content: string;
  timestamp: Date;
}

interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
  icon: typeof Code2;
}

interface InterviewQuestion {
  id: string;
  title: string;
  mode: InterviewMode;
  difficulty: Difficulty;
  company: string;
  timeLimit: number; // minutes
  description: string;
  tags: string[];
  hints: string[];
}

// ─── Mock Data ───
const QUESTIONS: InterviewQuestion[] = [
  // Coding
  { id: "c1", title: "Two Sum", mode: "coding", difficulty: "easy", company: "Google", timeLimit: 25, description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.", tags: ["Array", "Hash Map"], hints: ["Think about what complement you need for each number", "A hash map can give O(1) lookups"] },
  { id: "c2", title: "LRU Cache", mode: "coding", difficulty: "medium", company: "Amazon", timeLimit: 35, description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get and put methods with O(1) time complexity.", tags: ["Hash Map", "Linked List", "Design"], hints: ["Combine a hash map with a doubly linked list", "The head of the list is most recently used"] },
  { id: "c3", title: "Merge K Sorted Lists", mode: "coding", difficulty: "hard", company: "Meta", timeLimit: 45, description: "You are given an array of k linked lists, each sorted in ascending order. Merge all the linked lists into one sorted linked list and return it.", tags: ["Heap", "Linked List", "Divide & Conquer"], hints: ["A min-heap can efficiently find the smallest element", "Consider divide and conquer approach"] },
  { id: "c4", title: "Valid Parentheses", mode: "coding", difficulty: "easy", company: "Microsoft", timeLimit: 20, description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", tags: ["Stack", "String"], hints: ["Use a stack to keep track of opening brackets", "Each closing bracket should match the top of the stack"] },
  { id: "c5", title: "Binary Tree Level Order", mode: "coding", difficulty: "medium", company: "Apple", timeLimit: 30, description: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).", tags: ["Tree", "BFS", "Queue"], hints: ["BFS with a queue, processing one level at a time"] },

  // System Design
  { id: "s1", title: "Design URL Shortener", mode: "system-design", difficulty: "medium", company: "Google", timeLimit: 40, description: "Design a URL shortening service like bit.ly. The service should generate a short URL for a given long URL and redirect users when they visit the short URL.", tags: ["Distributed Systems", "Database", "Caching"], hints: ["Consider base62 encoding", "How do you handle collisions?", "Think about read vs write ratio"] },
  { id: "s2", title: "Design Chat System", mode: "system-design", difficulty: "hard", company: "Meta", timeLimit: 50, description: "Design a real-time messaging system that supports 1:1 and group chat, message delivery status, and offline message storage.", tags: ["WebSocket", "Message Queue", "Database"], hints: ["WebSocket for real-time, message queue for async", "Consider message ordering guarantees"] },
  { id: "s3", title: "Design Rate Limiter", mode: "system-design", difficulty: "medium", company: "Stripe", timeLimit: 35, description: "Design a rate limiter that can limit the number of requests a user can make to an API within a time window.", tags: ["Algorithms", "Redis", "Middleware"], hints: ["Token bucket vs sliding window", "How to make it distributed?"] },
  { id: "s4", title: "Design News Feed", mode: "system-design", difficulty: "hard", company: "Twitter", timeLimit: 45, description: "Design a social media news feed system. Users should see posts from people they follow, sorted by relevance and recency.", tags: ["Fan-out", "Caching", "Ranking"], hints: ["Fan-out on write vs fan-out on read", "Consider celebrity users with millions of followers"] },

  // Behavioral
  { id: "b1", title: "Conflict Resolution", mode: "behavioral", difficulty: "medium", company: "Amazon", timeLimit: 20, description: "Tell me about a time you disagreed with a teammate on a technical decision. How did you handle it and what was the outcome?", tags: ["Leadership", "Communication", "Teamwork"], hints: ["Use the STAR method", "Focus on the resolution, not the conflict"] },
  { id: "b2", title: "Failure & Learning", mode: "behavioral", difficulty: "medium", company: "Google", timeLimit: 20, description: "Describe a project that failed or didn't meet expectations. What did you learn from it?", tags: ["Growth Mindset", "Accountability"], hints: ["Be honest about what went wrong", "Emphasize what you learned and changed"] },
  { id: "b3", title: "Leading Under Pressure", mode: "behavioral", difficulty: "hard", company: "Netflix", timeLimit: 25, description: "Tell me about a time you had to lead a critical project with tight deadlines and limited resources. How did you prioritize?", tags: ["Leadership", "Prioritization", "Decision Making"], hints: ["Show how you made trade-offs", "Quantify the impact of your decisions"] },
  { id: "b4", title: "Cross-Team Collaboration", mode: "behavioral", difficulty: "easy", company: "Microsoft", timeLimit: 15, description: "Give an example of when you worked with another team to deliver a feature. What challenges came up?", tags: ["Collaboration", "Communication"], hints: ["Focus on communication strategies", "Highlight how you aligned different priorities"] },
];

const MOCK_INTERVIEW_FLOW: Record<InterviewMode, ChatMessage[]> = {
  coding: [
    { id: "1", role: "interviewer", content: "Welcome! I'll be your interviewer today. Let's start with the problem. Take a moment to read through it, then talk me through your initial thoughts.", timestamp: new Date() },
  ],
  "system-design": [
    { id: "1", role: "interviewer", content: "Welcome! Today we'll work through a system design problem together. I'd like you to start by clarifying the requirements — what questions do you have about scope and constraints?", timestamp: new Date() },
  ],
  behavioral: [
    { id: "1", role: "interviewer", content: "Thanks for joining! I'd like to learn about your experiences through some behavioral questions. Take your time, and try to use specific examples from your past work. Ready to begin?", timestamp: new Date() },
  ],
};

const FOLLOW_UP_RESPONSES: Record<InterviewMode, string[]> = {
  coding: [
    "Good start. What's the time complexity of that approach?",
    "Can you think of any edge cases we should handle?",
    "Interesting. Is there a way to optimize that further?",
    "Walk me through what happens when the input is empty.",
    "How would you test this solution?",
    "That makes sense. Can you code it up now?",
    "What data structure would be most efficient here?",
    "Nice! What's the space complexity?",
  ],
  "system-design": [
    "Good question. Let's assume 100M daily active users. How does that change your design?",
    "How would you handle the database at that scale?",
    "What happens if one of your services goes down?",
    "Where would you add caching and why?",
    "How do you ensure data consistency?",
    "What trade-offs are you making with this approach?",
    "How would you monitor this system in production?",
    "Let's talk about the API design. What endpoints do you need?",
  ],
  behavioral: [
    "That's a good example. What specifically was your role in that situation?",
    "How did the rest of the team react?",
    "Looking back, is there anything you would have done differently?",
    "What was the measurable outcome?",
    "How did that experience shape your approach going forward?",
    "Can you be more specific about the timeline?",
    "What was the most challenging part for you personally?",
    "How did you communicate this to stakeholders?",
  ],
};

const MODE_CONFIG: Record<InterviewMode, { icon: typeof Code2; label: string; color: string; bg: string; description: string }> = {
  coding: { icon: Code2, label: "Coding", color: "text-emerald-500", bg: "bg-emerald-500/10", description: "Solve algorithmic problems with live AI evaluation of your approach, not just the answer" },
  "system-design": { icon: Boxes, label: "System Design", color: "text-blue-500", bg: "bg-blue-500/10", description: "Architect scalable systems while AI probes your design decisions and trade-offs" },
  behavioral: { icon: MessageSquare, label: "Behavioral", color: "text-purple-500", bg: "bg-purple-500/10", description: "Practice STAR-method responses with real-time feedback on clarity and impact" },
};

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bg: string }> = {
  easy: { label: "Easy", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  medium: { label: "Medium", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  hard: { label: "Hard", color: "text-red-500", bg: "bg-red-500/10" },
};

const InterviewCoach = () => {
  const [interviewState, setInterviewState] = useState<InterviewState>("select");
  const [selectedMode, setSelectedMode] = useState<InterviewMode>("coding");
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [codeValue, setCodeValue] = useState("// Write your solution here\n\nfunction solution() {\n  \n}");
  const [scores, setScores] = useState<ScoreCategory[]>([]);
  const [interviewHistory, setInterviewHistory] = useState<{ question: string; score: number; date: Date; mode: InterviewMode }[]>([
    { question: "Two Sum", score: 82, date: new Date(Date.now() - 86400000 * 3), mode: "coding" },
    { question: "Design Rate Limiter", score: 71, date: new Date(Date.now() - 86400000 * 5), mode: "system-design" },
    { question: "Conflict Resolution", score: 88, date: new Date(Date.now() - 86400000 * 7), mode: "behavioral" },
  ]);
  const [activeTab, setActiveTab] = useState("questions");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((t) => {
          if (t <= 1) {
            setTimerActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeRemaining]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startInterview = (question: InterviewQuestion) => {
    setSelectedQuestion(question);
    setInterviewState("briefing");
  };

  const beginInterview = () => {
    if (!selectedQuestion) return;
    setInterviewState("active");
    setMessages([...MOCK_INTERVIEW_FLOW[selectedQuestion.mode]]);
    setTimeRemaining(selectedQuestion.timeLimit * 60);
    setTimerActive(true);
    setHintsUsed(0);
    setShowHints(false);
    setCodeValue("// Write your solution here\n\nfunction solution() {\n  \n}");
  };

  const sendMessage = useCallback(() => {
    if (!userInput.trim() || !selectedQuestion) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "candidate",
      content: userInput,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsAiTyping(true);

    // Simulate AI response
    const responses = FOLLOW_UP_RESPONSES[selectedQuestion.mode];
    const responseIdx = (messages.length - 1) % responses.length;
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "interviewer",
        content: responses[responseIdx],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsAiTyping(false);
    }, 1200 + Math.random() * 1500);
  }, [userInput, selectedQuestion, messages.length]);

  const endInterview = () => {
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const modeScores: Record<InterviewMode, ScoreCategory[]> = {
      coding: [
        { name: "Problem Solving", score: 78 + Math.floor(Math.random() * 15), maxScore: 100, feedback: "Good approach to breaking down the problem. Consider discussing multiple approaches before coding.", icon: Brain },
        { name: "Code Quality", score: 72 + Math.floor(Math.random() * 20), maxScore: 100, feedback: "Clean variable naming. Add more edge case handling and consider input validation.", icon: Code2 },
        { name: "Communication", score: 80 + Math.floor(Math.random() * 15), maxScore: 100, feedback: "You explained your thought process well. Try to verbalize more while coding.", icon: MessageSquare },
        { name: "Time Management", score: 65 + Math.floor(Math.random() * 25), maxScore: 100, feedback: "Spent appropriate time on planning. Watch for getting stuck on optimizations too early.", icon: Timer },
      ],
      "system-design": [
        { name: "Requirements Gathering", score: 75 + Math.floor(Math.random() * 18), maxScore: 100, feedback: "Good clarifying questions. Dig deeper into non-functional requirements like latency.", icon: Target },
        { name: "Architecture", score: 70 + Math.floor(Math.random() * 22), maxScore: 100, feedback: "Solid high-level design. Consider more about data partitioning strategies.", icon: Boxes },
        { name: "Scalability", score: 68 + Math.floor(Math.random() * 20), maxScore: 100, feedback: "Addressed horizontal scaling. Think more about database sharding and caching layers.", icon: TrendingUp },
        { name: "Trade-offs Discussion", score: 73 + Math.floor(Math.random() * 18), maxScore: 100, feedback: "Mentioned CAP theorem. Elaborate more on specific trade-offs for each component.", icon: BarChart3 },
      ],
      behavioral: [
        { name: "STAR Method Usage", score: 82 + Math.floor(Math.random() * 12), maxScore: 100, feedback: "Good structure. Make the 'Result' section more specific with metrics.", icon: Target },
        { name: "Specificity", score: 74 + Math.floor(Math.random() * 18), maxScore: 100, feedback: "Include more concrete numbers, timelines, and team sizes.", icon: CircleDot },
        { name: "Self-Awareness", score: 80 + Math.floor(Math.random() * 15), maxScore: 100, feedback: "Good reflection on lessons learned. Show more growth mindset in failures.", icon: Brain },
        { name: "Impact Communication", score: 76 + Math.floor(Math.random() * 16), maxScore: 100, feedback: "Clearly communicated your role. Quantify the business impact more.", icon: TrendingUp },
      ],
    };

    const finalScores = modeScores[selectedQuestion!.mode];
    setScores(finalScores);

    const avgScore = Math.round(finalScores.reduce((sum, s) => sum + s.score, 0) / finalScores.length);
    setInterviewHistory((prev) => [
      { question: selectedQuestion!.title, score: avgScore, date: new Date(), mode: selectedQuestion!.mode },
      ...prev,
    ]);

    setInterviewState("scorecard");
  };

  const restartFlow = () => {
    setInterviewState("select");
    setSelectedQuestion(null);
    setMessages([]);
    setScores([]);
    setTimeRemaining(0);
    setTimerActive(false);
    setShowHints(false);
    setHintsUsed(0);
  };

  const filteredQuestions = QUESTIONS.filter((q) => q.mode === selectedMode);
  const overallScore = scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length) : 0;
  const timeWarning = timeRemaining > 0 && timeRemaining < 120;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              AI Interview Coach
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              Practice real technical interviews with AI — coding, system design, and behavioral
            </p>
          </div>
          {interviewState !== "select" && (
            <Button variant="outline" size="sm" onClick={restartFlow} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> New Interview
            </Button>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ═══════════════ SELECT MODE & QUESTION ═══════════════ */}
        {interviewState === "select" && (
          <motion.div key="select" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            {/* Mode Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {(Object.keys(MODE_CONFIG) as InterviewMode[]).map((mode) => {
                const cfg = MODE_CONFIG[mode];
                return (
                  <motion.button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    whileHover={{ y: -3 }}
                    className={`text-left rounded-xl border p-5 transition-all ${
                      selectedMode === mode
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className={`${cfg.bg} rounded-xl p-2.5 w-fit mb-3`}>
                      <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{cfg.label} Interview</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{cfg.description}</p>
                  </motion.button>
                );
              })}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-[280px]">
                <TabsTrigger value="questions" className="gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Questions</TabsTrigger>
                <TabsTrigger value="history" className="gap-1.5"><History className="w-3.5 h-3.5" /> History</TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="mt-4">
                <div className="space-y-3">
                  {filteredQuestions.map((q, i) => {
                    const diff = DIFFICULTY_CONFIG[q.difficulty];
                    return (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:bg-primary/[0.02] transition-all group cursor-pointer"
                        onClick={() => startInterview(q)}
                      >
                        <div className={`shrink-0 ${diff.bg} rounded-lg p-2`}>
                          {MODE_CONFIG[q.mode].icon && <Code2 className={`w-4 h-4 ${diff.color}`} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-bold text-foreground">{q.title}</p>
                            <Badge variant="secondary" className={`text-[9px] py-0 ${diff.bg} ${diff.color} border-0`}>{diff.label}</Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{q.description}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {q.timeLimit} min</span>
                            <span className="flex items-center gap-0.5"><Users className="w-3 h-3" /> {q.company}</span>
                            {q.tags.slice(0, 2).map((t) => (
                              <Badge key={t} variant="outline" className="text-[9px] py-0">{t}</Badge>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                {interviewHistory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No interviews completed yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {interviewHistory.map((h, i) => {
                      const modeCfg = MODE_CONFIG[h.mode];
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-center gap-3 bg-card border border-border rounded-xl p-3.5"
                        >
                          <div className={`${modeCfg.bg} rounded-lg p-2 shrink-0`}>
                            <modeCfg.icon className={`w-4 h-4 ${modeCfg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{h.question}</p>
                            <p className="text-[10px] text-muted-foreground">{h.date.toLocaleDateString()}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={`text-lg font-bold ${h.score >= 80 ? "text-emerald-500" : h.score >= 60 ? "text-yellow-500" : "text-red-500"}`}>{h.score}</p>
                            <p className="text-[10px] text-muted-foreground">/100</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* ═══════════════ BRIEFING ═══════════════ */}
        {interviewState === "briefing" && selectedQuestion && (
          <motion.div key="briefing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className={`${MODE_CONFIG[selectedQuestion.mode].bg} rounded-xl p-3`}>
                  {(() => { const Icon = MODE_CONFIG[selectedQuestion.mode].icon; return <Icon className={`w-6 h-6 ${MODE_CONFIG[selectedQuestion.mode].color}`} />; })()}
                </div>
                <div>
                  <Badge variant="secondary" className="text-[10px] mb-1">{selectedQuestion.company}</Badge>
                  <h2 className="text-xl font-bold text-foreground">{selectedQuestion.title}</h2>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{selectedQuestion.description}</p>

              <div className="flex flex-wrap gap-2">
                {selectedQuestion.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-muted/50 rounded-lg p-3">
                  <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-bold text-foreground">{selectedQuestion.timeLimit} min</p>
                  <p className="text-[10px] text-muted-foreground">Time Limit</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <BarChart3 className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-bold text-foreground capitalize">{selectedQuestion.difficulty}</p>
                  <p className="text-[10px] text-muted-foreground">Difficulty</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <Lightbulb className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-bold text-foreground">{selectedQuestion.hints.length}</p>
                  <p className="text-[10px] text-muted-foreground">Hints Available</p>
                </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-4">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> Interview Tips
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  {selectedQuestion.mode === "coding" && (
                    <>
                      <li>• Think out loud — explain your approach before coding</li>
                      <li>• Discuss time/space complexity of your solution</li>
                      <li>• Handle edge cases (empty input, single element, etc.)</li>
                    </>
                  )}
                  {selectedQuestion.mode === "system-design" && (
                    <>
                      <li>• Start with requirements clarification</li>
                      <li>• Estimate scale: QPS, storage, bandwidth</li>
                      <li>• Draw high-level architecture before diving into details</li>
                    </>
                  )}
                  {selectedQuestion.mode === "behavioral" && (
                    <>
                      <li>• Use the STAR method: Situation, Task, Action, Result</li>
                      <li>• Be specific — use real examples with numbers</li>
                      <li>• Show self-awareness and growth from challenges</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={restartFlow}>Back to Questions</Button>
              <Button size="lg" onClick={beginInterview} className="gap-2">
                <Play className="w-4 h-4" /> Start Interview
              </Button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════ ACTIVE INTERVIEW ═══════════════ */}
        {interviewState === "active" && selectedQuestion && (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Timer Bar */}
            <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs">{selectedQuestion.company}</Badge>
                <span className="text-sm font-bold text-foreground">{selectedQuestion.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => { setShowHints(true); setHintsUsed((h) => Math.min(h + 1, selectedQuestion.hints.length)); }}
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      <Lightbulb className="w-3.5 h-3.5" /> Hint ({hintsUsed}/{selectedQuestion.hints.length})
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Using hints may reduce your score</TooltipContent>
                </Tooltip>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-sm font-bold ${
                  timeWarning ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-muted text-foreground"
                }`}>
                  <Timer className="w-4 h-4" />
                  {formatTime(timeRemaining)}
                </div>
                <Button size="sm" variant="destructive" onClick={endInterview} className="text-xs">
                  End Interview
                </Button>
              </div>
            </div>

            {/* Hints Panel */}
            <AnimatePresence>
              {showHints && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5"><Lightbulb className="w-4 h-4 text-amber-500" /> Hints</h4>
                    <button onClick={() => setShowHints(false)} className="text-muted-foreground hover:text-foreground"><ChevronUp className="w-4 h-4" /></button>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedQuestion.hints.slice(0, hintsUsed).map((hint, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-amber-500 shrink-0">💡</span> {hint}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`grid gap-4 ${selectedQuestion.mode === "coding" ? "lg:grid-cols-2" : ""}`}>
              {/* Code Editor (coding mode only) */}
              {selectedQuestion.mode === "coding" && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Code Editor</span>
                    <Badge variant="outline" className="text-[10px]">JavaScript</Badge>
                  </div>
                  <textarea
                    value={codeValue}
                    onChange={(e) => setCodeValue(e.target.value)}
                    className="w-full h-[400px] bg-[#1e1e2e] text-emerald-400 font-mono text-sm p-4 resize-none outline-none"
                    spellCheck={false}
                  />
                </div>
              )}

              {/* Chat Panel */}
              <div className="bg-card border border-border rounded-xl flex flex-col" style={{ height: selectedQuestion.mode === "coding" ? "472px" : "500px" }}>
                <div className="bg-muted/50 border-b border-border px-4 py-2">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5" /> AI Interviewer
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2.5 ${msg.role === "candidate" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                        msg.role === "interviewer" ? "bg-amber-500/10" : "bg-primary/10"
                      }`}>
                        {msg.role === "interviewer" ? <Bot className="w-4 h-4 text-amber-500" /> : <User className="w-4 h-4 text-primary" />}
                      </div>
                      <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm ${
                        msg.role === "interviewer"
                          ? "bg-muted text-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {isAiTyping && (
                    <div className="flex gap-2.5">
                      <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500/10">
                        <Bot className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="bg-muted rounded-xl px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-border p-3">
                  <div className="flex gap-2">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                      placeholder="Type your response…"
                      className="flex-1 text-sm"
                    />
                    <Button size="icon" onClick={sendMessage} disabled={!userInput.trim() || isAiTyping}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════ SCORECARD ═══════════════ */}
        {interviewState === "scorecard" && selectedQuestion && (
          <motion.div key="scorecard" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto space-y-6">
            {/* Overall Score */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 text-center">
              <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-4 ${
                overallScore >= 80 ? "border-emerald-500 bg-emerald-500/10" :
                overallScore >= 60 ? "border-yellow-500 bg-yellow-500/10" :
                "border-red-500 bg-red-500/10"
              }`}>
                <span className={`text-3xl font-bold ${
                  overallScore >= 80 ? "text-emerald-500" : overallScore >= 60 ? "text-yellow-500" : "text-red-500"
                }`}>{overallScore}</span>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">Interview Complete!</h2>
              <p className="text-sm text-muted-foreground mb-3">{selectedQuestion.title} — {selectedQuestion.company}</p>
              <div className="flex items-center justify-center gap-2">
                {overallScore >= 80 ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1"><ThumbsUp className="w-3 h-3" /> Strong Hire Signal</Badge>
                ) : overallScore >= 60 ? (
                  <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 gap-1"><AlertCircle className="w-3 h-3" /> Needs Practice</Badge>
                ) : (
                  <Badge className="bg-red-500/10 text-red-500 border-red-500/20 gap-1"><ThumbsDown className="w-3 h-3" /> Keep Practicing</Badge>
                )}
                {hintsUsed > 0 && (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground gap-1"><Lightbulb className="w-3 h-3" /> {hintsUsed} hint{hintsUsed > 1 ? "s" : ""} used</Badge>
                )}
              </div>
            </div>

            {/* Category Scores */}
            <div className="grid sm:grid-cols-2 gap-3">
              {scores.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${s.score >= 80 ? "bg-emerald-500/10" : s.score >= 60 ? "bg-yellow-500/10" : "bg-red-500/10"}`}>
                        <s.icon className={`w-4 h-4 ${s.score >= 80 ? "text-emerald-500" : s.score >= 60 ? "text-yellow-500" : "text-red-500"}`} />
                      </div>
                      <span className="text-sm font-bold text-foreground">{s.name}</span>
                    </div>
                    <span className={`text-lg font-bold ${s.score >= 80 ? "text-emerald-500" : s.score >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                      {s.score}<span className="text-xs text-muted-foreground">/{s.maxScore}</span>
                    </span>
                  </div>
                  <Progress value={s.score} className="h-1.5 mb-2" />
                  <p className="text-[11px] text-muted-foreground">{s.feedback}</p>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={restartFlow} className="gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" /> New Interview
              </Button>
              <Button onClick={() => { restartFlow(); startInterview(selectedQuestion); }} className="gap-2">
                <RotateCcw className="w-4 h-4" /> Retry Same Question
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewCoach;
