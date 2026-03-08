import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  X, Send, Mic, MicOff, Volume2, VolumeX,
  MessageSquareText, BookOpen, FolderGit2,
  Code2, GraduationCap, Compass, Zap, Trophy, Brain,
  ChevronRight, Play, Pause, Square, Bot, Sparkles,
  BarChart3, Map, User, History, Lightbulb, RotateCcw,
  CheckCircle2, Target, TrendingUp, Trash2, Clock,
} from "lucide-react";
import { lazy, Suspense } from "react";
const HumanAvatar3D = lazy(() => import("./HumanAvatar3D"));

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */
type Message = { role: "user" | "assistant"; content: string };
type Tab = "chat" | "challenges" | "learning" | "portfolio" | "progress" | "memory";

interface LearningMemory {
  lessonsCompleted: string[];
  topicsStudied: string[];
  challengesFinished: number;
  weakTopics: string[];
  frequentMistakes: string[];
  preferredLanguage: string;
  difficultyLevel: string;
  history: { date: string; topic: string; type: string }[];
  lastSession: { topic: string; date: string } | null;
}

const DEFAULT_MEMORY: LearningMemory = {
  lessonsCompleted: [],
  topicsStudied: [],
  challengesFinished: 0,
  weakTopics: [],
  frequentMistakes: [],
  preferredLanguage: "",
  difficultyLevel: "",
  history: [],
  lastSession: null,
};

/* ═══════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════ */
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const WELCOME_MESSAGE =
  "Hello and welcome! 🚀 I'm your AI Coding Tutor. I can help you learn programming, practice coding challenges, review your progress, and guide you through the platform. What would you like to do?";

const RETURNING_WELCOME = (mem: LearningMemory) => {
  const last = mem.lastSession;
  if (!last) return WELCOME_MESSAGE;
  return `Welcome back! 🎉 Last time you studied **${last.topic}** and completed **${mem.challengesFinished}** challenges. Would you like to continue where you left off or explore something new?`;
};

const QUICK_ACTIONS = [
  { label: "🎓 Start Learning", msg: "I want to start learning programming. Help me find the right path based on my level.", icon: BookOpen },
  { label: "💼 Explore Projects", msg: "Show me Chadi's coding projects and explain the technologies used.", icon: FolderGit2 },
  { label: "💻 Coding Question", msg: "I have a coding question. Can you help me?", icon: Code2 },
  { label: "🗺️ Learning Path", msg: "Recommend a learning path for me. I'll tell you my level and goals.", icon: Compass },
  { label: "⚡ Challenge Me", msg: "Give me a coding challenge! Something fun and educational.", icon: Zap },
  { label: "🧠 Review Progress", msg: "Show me what I've learned so far and suggest what to study next.", icon: Brain },
];

const SUGGESTED_PROMPTS = [
  "Help me learn JavaScript",
  "Give me a coding challenge",
  "Explain Python basics",
  "Show me your projects",
  "Help me debug code",
  "Recommend a learning path",
];

const ONBOARDING_STEPS = [
  {
    question: "What's your coding level?",
    options: [
      { label: "🌱 Beginner", value: "beginner" },
      { label: "🔧 Intermediate", value: "intermediate" },
      { label: "🚀 Advanced", value: "advanced" },
    ],
  },
  {
    question: "What do you want to learn?",
    options: [
      { label: "☕ Java", value: "Java" },
      { label: "🟨 JavaScript", value: "JavaScript" },
      { label: "🐍 Python", value: "Python" },
      { label: "🌐 Web Dev", value: "Web Development" },
    ],
  },
  {
    question: "How can I help you best?",
    options: [
      { label: "📚 Tutoring", value: "tutoring sessions" },
      { label: "🏋️ Exercises", value: "coding exercises" },
      { label: "🛠️ Projects", value: "project guidance" },
      { label: "🗺️ Career", value: "career guidance" },
    ],
  },
];

const CHALLENGE_LEVELS = [
  { label: "Beginner", icon: "🌱", desc: "Variables, loops, basic logic" },
  { label: "Intermediate", icon: "🔧", desc: "Data structures, algorithms, OOP" },
  { label: "Advanced", icon: "🚀", desc: "System design, optimization, advanced patterns" },
];

const PORTFOLIO_SECTIONS = [
  { label: "About Me", hash: "#about", icon: User, desc: "Background and story" },
  { label: "My Projects", hash: "#projects", icon: FolderGit2, desc: "TenderFlow, CatalogAI, Bonial apps" },
  { label: "Skills", hash: "#skills", icon: BarChart3, desc: "Technical stack" },
  { label: "Experience", hash: "#experience", icon: Trophy, desc: "Professional timeline" },
  { label: "Tutoring", hash: "#tutoring", icon: GraduationCap, desc: "Java Bootcamp & services" },
  { label: "Contact", hash: "#contact", icon: Send, desc: "Get in touch" },
];

// Speech helpers
const getSpeechRecognition = (): any | null => {
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.continuous = false; r.interimResults = true; r.lang = "en-US";
  return r;
};

const cleanTextForSpeech = (text: string) =>
  text.replace(/```[\s\S]*?```/g, "code block").replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1")
    .replace(/#{1,6}\s/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[🚀🎓💼💻🗺️☕🟨🐍🌐📚🏋️🛠️🌱🔧⚡🏆🧠✨🎉]/g, "");

/* ═══════════════════════════════════════════════════
   MEMORY PERSISTENCE
   ═══════════════════════════════════════════════════ */
const MEMORY_KEY = "ai-tutor-memory";
const loadMemory = (): LearningMemory => {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    return raw ? { ...DEFAULT_MEMORY, ...JSON.parse(raw) } : DEFAULT_MEMORY;
  } catch { return DEFAULT_MEMORY; }
};
const saveMemory = (mem: LearningMemory) => {
  localStorage.setItem(MEMORY_KEY, JSON.stringify(mem));
};

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */
const AIVoiceTutor = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(-1);
  const [studentProfile, setStudentProfile] = useState<string[]>([]);
  const [memory, setMemory] = useState<LearningMemory>(loadMemory);
  const [codeInput, setCodeInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Persist memory
  useEffect(() => { saveMemory(memory); }, [memory]);

  useEffect(() => { scrollRef.current && (scrollRef.current.scrollTop = scrollRef.current.scrollHeight); }, [messages, onboardingStep]);
  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open, activeTab]);

  // Welcome on first open
  useEffect(() => {
    if (open && !hasWelcomed) {
      setHasWelcomed(true);
      const isReturning = memory.lastSession !== null;
      const welcomeMsg = isReturning ? RETURNING_WELCOME(memory) : WELCOME_MESSAGE;
      setMessages([{ role: "assistant", content: welcomeMsg }]);
      if (!isReturning) setOnboardingStep(0);
      setTimeout(() => { if (voiceEnabled) speakText(welcomeMsg); }, 600);
    }
  }, [open, hasWelcomed]);

  useEffect(() => () => { window.speechSynthesis?.cancel(); recognitionRef.current?.abort(); }, []);

  const speakText = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = cleanTextForSpeech(text);
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 1; u.pitch = 1; u.volume = 1; u.lang = "en-US";
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel")));
    if (pref) u.voice = pref;
    u.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
    u.onend = () => { setIsSpeaking(false); setIsPaused(false); };
    u.onerror = () => { setIsSpeaking(false); setIsPaused(false); };
    window.speechSynthesis.speak(u);
  }, []);

  const stopSpeaking = () => { window.speechSynthesis?.cancel(); setIsSpeaking(false); setIsPaused(false); };
  const pauseSpeaking = () => { window.speechSynthesis?.pause(); setIsPaused(true); };
  const resumeSpeaking = () => { window.speechSynthesis?.resume(); setIsPaused(false); };

  // Update memory helper
  const updateMemory = useCallback((update: Partial<LearningMemory>) => {
    setMemory(prev => ({ ...prev, ...update }));
  }, []);

  const trackTopic = useCallback((topic: string, type: string) => {
    setMemory(prev => ({
      ...prev,
      topicsStudied: [...new Set([...prev.topicsStudied, topic])],
      history: [...prev.history, { date: new Date().toISOString(), topic, type }].slice(-50),
      lastSession: { topic, date: new Date().toISOString() },
    }));
  }, []);

  const handleOnboardingChoice = (value: string) => {
    const newProfile = [...studentProfile, value];
    setStudentProfile(newProfile);
    const step = ONBOARDING_STEPS[onboardingStep];
    setMessages(prev => [...prev, { role: "user", content: `${step.question} → ${value}` }]);

    if (onboardingStep < ONBOARDING_STEPS.length - 1) {
      setOnboardingStep(onboardingStep + 1);
      const nextQ = ONBOARDING_STEPS[onboardingStep + 1].question;
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: nextQ }]);
        if (voiceEnabled) speakText(nextQ);
      }, 400);
    } else {
      setOnboardingStep(-1);
      updateMemory({
        difficultyLevel: newProfile[0],
        preferredLanguage: newProfile[1],
      });
      const contextMsg = `The student completed onboarding. Profile: Level: ${newProfile[0]}, Wants to learn: ${newProfile[1]}, Goal: ${newProfile[2]}. Give a personalized welcome and suggest what to do next.`;
      const allMsgs: Message[] = [...messages, { role: "user", content: contextMsg }];
      setTimeout(() => streamChat(allMsgs), 300);
    }
  };

  const streamChat = useCallback(async (allMessages: Message[]) => {
    setIsLoading(true);
    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (prev.length >= 2 && last?.role === "assistant") {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };
    try {
      // Include memory context in system
      const memoryContext = memory.topicsStudied.length > 0
        ? `\n\n[Student Memory: Topics studied: ${memory.topicsStudied.join(", ")}. Challenges completed: ${memory.challengesFinished}. Level: ${memory.difficultyLevel}. Language: ${memory.preferredLanguage}. Weak topics: ${memory.weakTopics.join(", ") || "none identified yet"}.]`
        : "";

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          messages: [
            ...(memoryContext ? [{ role: "system" as const, content: memoryContext }] : []),
            ...allMessages,
          ]
        }),
      });
      if (!resp.ok || !resp.body) {
        if (resp.status === 429) { upsert("I'm getting a lot of requests right now. Please try again in a moment! 🙏"); return; }
        if (resp.status === 402) { upsert("Service is temporarily unavailable. Please try again later."); return; }
        throw new Error("Stream failed");
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: rd, value } = await reader.read();
        if (rd) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl); buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || !line.trim() || !line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try { const p = JSON.parse(json); const c = p.choices?.[0]?.delta?.content; if (c) upsert(c); }
          catch { buf = line + "\n" + buf; break; }
        }
      }
      if (voiceEnabled && assistantSoFar) speakText(assistantSoFar);
    } catch { upsert("Sorry, I'm having trouble right now. Please try again."); }
    finally { setIsLoading(false); }
  }, [voiceEnabled, speakText, memory]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    setInput("");
    setOnboardingStep(-1);
    setActiveTab("chat");
    const userMsg: Message = { role: "user", content: msg };
    const all = [...messages, userMsg];
    setMessages(all);

    // Track topic
    const lowerMsg = msg.toLowerCase();
    if (lowerMsg.includes("challenge") || lowerMsg.includes("exercise")) {
      trackTopic(msg.slice(0, 40), "challenge");
      updateMemory({ challengesFinished: memory.challengesFinished + 1 });
    } else if (lowerMsg.includes("learn") || lowerMsg.includes("explain") || lowerMsg.includes("teach")) {
      trackTopic(msg.slice(0, 40), "lesson");
    } else {
      trackTopic(msg.slice(0, 40), "chat");
    }

    await streamChat(all);
  }, [input, isLoading, messages, streamChat, trackTopic, updateMemory, memory]);

  const toggleListening = useCallback(() => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const recognition = getSpeechRecognition();
    if (!recognition) { alert("Speech recognition not supported. Try Chrome."); return; }
    recognitionRef.current = recognition;
    let finalT = "";
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalT += e.results[i][0].transcript; else interim += e.results[i][0].transcript;
      }
      setInput(finalT + interim);
    };
    recognition.onend = () => {
      setIsListening(false);
      if (finalT.trim()) {
        setTimeout(() => {
          setInput("");
          setOnboardingStep(-1);
          const userMsg: Message = { role: "user", content: finalT.trim() };
          setMessages(prev => { const all = [...prev, userMsg]; streamChat(all); return all; });
        }, 300);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start(); setIsListening(true);
  }, [isListening, streamChat]);

  const navigateTo = (hash: string) => {
    setOpen(false);
    setTimeout(() => { const el = document.querySelector(hash); el?.scrollIntoView({ behavior: "smooth" }); }, 200);
  };

  const requestChallenge = (level: string) => {
    sendMessage(`Give me a ${level.toLowerCase()} coding challenge. Include a clear problem statement, expected input/output, and hints. Make it educational and fun.`);
  };

  const clearMemory = () => {
    setMemory(DEFAULT_MEMORY);
    localStorage.removeItem(MEMORY_KEY);
  };

  const currentOnboarding = onboardingStep >= 0 && onboardingStep < ONBOARDING_STEPS.length ? ONBOARDING_STEPS[onboardingStep] : null;

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: "chat", label: "Chat", icon: MessageSquareText },
    { id: "challenges", label: "Challenges", icon: Zap },
    { id: "learning", label: "Path", icon: Map },
    { id: "portfolio", label: "Portfolio", icon: FolderGit2 },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "memory", label: "Memory", icon: History },
  ];

  /* ═══════════════════════════════════════════════════
     STYLES
     ═══════════════════════════════════════════════════ */
  const cardStyle = { background: "hsl(210 15% 10%)", border: "1px solid hsl(210 10% 16%)" };
  const accentCardStyle = { background: "hsl(152 80% 50% / 0.06)", border: "1px solid hsl(152 80% 50% / 0.12)" };
  const scrollStyle = { scrollbarWidth: "thin" as const, scrollbarColor: "hsl(210 10% 20%) transparent" };

  return (
    <>
      {/* ═══ Floating CTA Button ═══ */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl font-semibold text-sm shadow-2xl"
        style={{
          background: "linear-gradient(135deg, hsl(152 68% 46%), hsl(172 66% 50%))",
          color: "hsl(222 22% 5%)",
          boxShadow: "0 0 30px hsl(152 100% 50% / 0.25), 0 8px 32px -4px rgba(0,0,0,0.4)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Chat with AI Tutor"
      >
        <Bot className="w-5 h-5" />
        <span>Chat with AI Tutor</span>
        <Sparkles className="w-4 h-4 opacity-70" />
      </motion.button>

      {/* ═══ Modal ═══ */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-6xl h-[92vh] max-h-[780px] rounded-3xl overflow-hidden flex flex-col md:flex-row"
              style={{
                background: "hsl(222 22% 7%)",
                border: "1px solid hsl(152 80% 50% / 0.12)",
                boxShadow: "0 0 80px hsl(152 100% 50% / 0.08), 0 40px 80px -20px rgba(0,0,0,0.6)",
              }}
            >
              {/* Close */}
              <button onClick={() => { setOpen(false); stopSpeaking(); }}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "hsl(210 15% 15%)", border: "1px solid hsl(210 10% 22%)" }}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* ═══ LEFT: Human Avatar + Controls ═══ */}
              <div className="hidden md:flex w-[280px] flex-col items-center justify-between flex-shrink-0 relative overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, hsl(222 22% 6%) 0%, hsl(210 20% 8%) 50%, hsl(222 22% 5%) 100%)",
                  borderRight: "1px solid hsl(152 80% 50% / 0.08)",
                }}>
                {/* Status badge */}
                <div className="pt-4 pb-1 flex flex-col items-center gap-2 z-10">
                  <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: "hsl(152 80% 50% / 0.12)", color: "hsl(152 100% 60%)", border: "1px solid hsl(152 80% 50% / 0.2)" }}>
                    👨‍🏫 AI Coding Mentor
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center px-4">
                    {isSpeaking ? "🔊 Speaking..." : isListening ? "🎤 Listening..." : isLoading ? "💭 Thinking..." : "Ready to help"}
                  </p>
                </div>

                {/* 3D Human Avatar */}
                <div className="flex-1 w-full min-h-0">
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                    </div>
                  }>
                    <HumanAvatar3D isSpeaking={isSpeaking} isListening={isListening} isThinking={isLoading} />
                  </Suspense>
                </div>

                {/* Voice controls */}
                <div className="pb-4 pt-2 flex flex-col items-center gap-3 z-10 w-full px-4">
                  {isSpeaking && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2">
                      <button onClick={isPaused ? resumeSpeaking : pauseSpeaking}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                        style={{ background: "hsl(210 15% 14%)", border: "1px solid hsl(152 80% 50% / 0.2)" }}>
                        {isPaused ? <Play className="w-4 h-4 text-primary" /> : <Pause className="w-4 h-4 text-primary" />}
                      </button>
                      <button onClick={stopSpeaking}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                        style={{ background: "hsl(210 15% 14%)", border: "1px solid hsl(0 70% 50% / 0.2)" }}>
                        <Square className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </motion.div>
                  )}
                  <div className="flex items-center gap-2">
                    <motion.button onClick={toggleListening}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: isListening ? "linear-gradient(135deg, hsl(0 70% 50%), hsl(0 60% 40%))" : "linear-gradient(135deg, hsl(200 80% 50%), hsl(220 80% 40%))",
                        boxShadow: isListening ? "0 0 25px hsl(0 70% 50% / 0.4)" : "0 0 20px hsl(200 80% 50% / 0.3)",
                      }}
                      animate={isListening ? { scale: [1, 1.08, 1] } : {}}
                      transition={{ duration: 0.8, repeat: isListening ? Infinity : 0 }}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                    </motion.button>
                    <button onClick={() => { setVoiceEnabled(!voiceEnabled); if (isSpeaking) stopSpeaking(); }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                      style={{ background: "hsl(210 15% 14%)", border: "1px solid hsl(210 10% 22%)" }}>
                      {voiceEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                  <p className="text-[8px] text-muted-foreground/50 text-center">🔒 Voice processed in-browser</p>
                </div>
              </div>

              {/* ═══ RIGHT: Tabs + Content ═══ */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Tab bar */}
                <div className="flex items-center border-b px-2 pt-3 pb-0 gap-0.5 flex-shrink-0 overflow-x-auto"
                  style={{ borderColor: "hsl(210 10% 14%)", background: "hsl(222 22% 7%)", scrollbarWidth: "none" }}>
                  {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-[11px] font-semibold transition-all relative whitespace-nowrap ${
                        activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={activeTab === tab.id ? {
                        background: "hsl(210 15% 11%)",
                        borderTop: "2px solid hsl(152 68% 46%)",
                        borderLeft: "1px solid hsl(210 10% 16%)",
                        borderRight: "1px solid hsl(210 10% 16%)",
                      } : {}}>
                      <tab.icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                  {/* Mobile voice controls */}
                  <div className="md:hidden ml-auto flex items-center gap-1 pb-2 pl-2">
                    <button onClick={toggleListening}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: isListening ? "hsl(0 70% 50%)" : "hsl(200 80% 50%)" }}>
                      {isListening ? <MicOff className="w-3.5 h-3.5 text-white" /> : <Mic className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <button onClick={() => { setVoiceEnabled(!voiceEnabled); if (isSpeaking) stopSpeaking(); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "hsl(210 15% 14%)" }}>
                      {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-primary" /> : <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                  </div>
                </div>

                {/* ═══════════ CHAT TAB ═══════════ */}
                {activeTab === "chat" && (
                  <div className="flex-1 flex flex-col min-h-0">
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" style={scrollStyle}>
                      {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          {msg.role === "assistant" && (
                            <div className="w-8 h-8 rounded-xl flex-shrink-0 mt-1 flex items-center justify-center"
                              style={{ background: "hsl(152 80% 50% / 0.1)", border: "1px solid hsl(152 80% 50% / 0.15)" }}>
                              <Bot className="w-4 h-4 text-primary" />
                            </div>
                          )}
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                          }`} style={{
                            background: msg.role === "user" ? "hsl(152 68% 46% / 0.15)" : "hsl(210 15% 12%)",
                            border: msg.role === "user" ? "1px solid hsl(152 68% 46% / 0.2)" : "1px solid hsl(210 10% 16%)",
                            color: "hsl(210 20% 88%)",
                          }}>
                            {msg.role === "assistant" ? (
                              <div className="prose prose-sm prose-invert max-w-none [&_pre]:bg-[hsl(210_15%_8%)] [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:text-xs [&_pre]:overflow-x-auto [&_code]:text-primary [&_code]:text-xs [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mb-2 [&_ol]:mb-2 [&_li]:mb-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_a]:text-primary">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </div>
                            ) : msg.content}
                          </div>
                          {msg.role === "user" && (
                            <div className="w-8 h-8 rounded-xl flex-shrink-0 mt-1 flex items-center justify-center"
                              style={{ background: "hsl(200 80% 50% / 0.1)", border: "1px solid hsl(200 80% 50% / 0.15)" }}>
                              <User className="w-4 h-4" style={{ color: "hsl(200 100% 65%)" }} />
                            </div>
                          )}
                        </motion.div>
                      ))}

                      {/* Onboarding */}
                      {currentOnboarding && !isLoading && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pl-11">
                          <p className="text-xs text-muted-foreground mb-2">{currentOnboarding.question}</p>
                          <div className="flex flex-wrap gap-2">
                            {currentOnboarding.options.map(opt => (
                              <button key={opt.value} onClick={() => handleOnboardingChoice(opt.value)}
                                className="px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                                style={{ background: "hsl(210 15% 13%)", border: "1px solid hsl(152 80% 50% / 0.2)", color: "hsl(152 100% 65%)" }}>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Quick actions on start */}
                      {onboardingStep === -1 && messages.length <= 2 && !isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pl-11 space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            {QUICK_ACTIONS.map(a => (
                              <button key={a.label} onClick={() => sendMessage(a.msg)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all hover:scale-[1.02]"
                                style={cardStyle}>
                                <a.icon size={14} className="text-primary flex-shrink-0" />
                                <span style={{ color: "hsl(210 10% 75%)" }}>{a.label}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Loading */}
                      {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
                            style={{ background: "hsl(152 80% 50% / 0.1)", border: "1px solid hsl(152 80% 50% / 0.15)" }}>
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                          <div className="rounded-2xl rounded-bl-md px-4 py-3" style={cardStyle}>
                            <div className="flex gap-1.5 items-center">
                              {[0, 150, 300].map(d => (
                                <span key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: `${d}ms`, background: "hsl(152 68% 46% / 0.5)" }} />
                              ))}
                              <span className="text-[10px] text-muted-foreground ml-2">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Voice wave */}
                      {isSpeaking && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="flex items-center gap-2 pl-11">
                          <div className="flex gap-[2px]">
                            {[0, 1, 2, 3, 4, 5, 6].map(i => (
                              <motion.div key={i} className="w-[3px] rounded-full"
                                style={{ background: "hsl(152 68% 46%)" }}
                                animate={{ height: [3, 14, 3] }}
                                transition={{ duration: 0.35, repeat: Infinity, delay: i * 0.06 }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-primary ml-1">{isPaused ? "Paused" : "Speaking..."}</span>
                          <div className="flex gap-1 ml-2 md:hidden">
                            <button onClick={isPaused ? resumeSpeaking : pauseSpeaking}
                              className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "hsl(210 15% 14%)" }}>
                              {isPaused ? <Play className="w-3 h-3 text-primary" /> : <Pause className="w-3 h-3 text-primary" />}
                            </button>
                            <button onClick={stopSpeaking}
                              className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "hsl(210 15% 14%)" }}>
                              <Square className="w-2.5 h-2.5 text-destructive" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Suggestions */}
                    {messages.length > 2 && messages.length < 10 && !isLoading && (
                      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                        {SUGGESTED_PROMPTS.slice(0, 4).map(prompt => (
                          <button key={prompt} onClick={() => sendMessage(prompt)}
                            className="text-[10px] px-3 py-1.5 rounded-full transition-all hover:scale-105"
                            style={{ background: "hsl(210 15% 12%)", border: "1px solid hsl(210 10% 18%)", color: "hsl(210 10% 65%)" }}>
                            {prompt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input */}
                    <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid hsl(210 10% 14%)" }}>
                      {input && isListening && (
                        <p className="text-[10px] text-muted-foreground italic text-center mb-2 truncate">🎤 "{input}"</p>
                      )}
                      <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                          placeholder="Ask me anything about coding..."
                          className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/50"
                          style={{ background: "hsl(210 15% 10%)", border: "1px solid hsl(210 10% 18%)", color: "hsl(210 20% 88%)" }}
                          disabled={isLoading} />
                        <button type="submit" disabled={isLoading || !input.trim()}
                          className="w-11 h-11 rounded-xl flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105 flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, hsl(152 68% 46%), hsl(172 66% 50%))" }}>
                          <Send className="w-4 h-4 text-primary-foreground" />
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* ═══════════ CHALLENGES TAB ═══════════ */}
                {activeTab === "challenges" && (
                  <div className="flex-1 overflow-y-auto p-5 space-y-4" style={scrollStyle}>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-foreground mb-1">⚡ Coding Challenges</h3>
                      <p className="text-xs text-muted-foreground">Pick a difficulty and sharpen your skills</p>
                    </div>

                    {/* Progress bar */}
                    <div className="rounded-2xl p-4" style={cardStyle}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Challenges Completed</span>
                        <span className="text-sm font-bold text-primary">{memory.challengesFinished}</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ background: "hsl(210 15% 15%)" }}>
                        <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, hsl(152 68% 46%), hsl(172 66% 50%))" }}
                          animate={{ width: `${Math.min((memory.challengesFinished / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="space-y-2">
                      {CHALLENGE_LEVELS.map(level => (
                        <button key={level.label} onClick={() => requestChallenge(level.label)}
                          className="w-full flex items-center justify-between rounded-2xl p-4 transition-all hover:scale-[1.01]"
                          style={cardStyle}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{level.icon}</span>
                            <div className="text-left">
                              <p className="text-sm font-semibold text-foreground">{level.label}</p>
                              <p className="text-[10px] text-muted-foreground">{level.desc}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>

                    {/* Quick challenge buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: Brain, label: "Debug Challenge", desc: "Find the bug", msg: "Give me a quick debugging challenge. Show me buggy code and let me find the error." },
                        { icon: Zap, label: "Logic Puzzle", desc: "Test your thinking", msg: "Give me a logic puzzle / algorithm exercise. Include examples." },
                        { icon: Trophy, label: "Quick Quiz", desc: "3 questions", msg: "Give me a quiz with 3 multiple-choice coding questions. Wait for my answers." },
                        { icon: Lightbulb, label: "Show Hint", desc: "Get help", msg: "Give me a hint for the last challenge without revealing the full solution." },
                        { icon: BookOpen, label: "Explain Solution", desc: "Learn why", msg: "Explain the solution to the last coding challenge you gave me. Be detailed." },
                        { icon: RotateCcw, label: "New Challenge", desc: "Try another", msg: "Generate a new coding challenge, different from the previous one." },
                      ].map(btn => (
                        <button key={btn.label} onClick={() => sendMessage(btn.msg)}
                          className="rounded-xl p-3 text-left transition-all hover:scale-[1.02]"
                          style={cardStyle}>
                          <btn.icon className="w-5 h-5 text-primary mb-1" />
                          <p className="text-xs font-semibold text-foreground">{btn.label}</p>
                          <p className="text-[10px] text-muted-foreground">{btn.desc}</p>
                        </button>
                      ))}
                    </div>

                    {/* Code Practice Area */}
                    <div className="rounded-2xl p-4 space-y-3" style={cardStyle}>
                      <div className="flex items-center gap-2 mb-1">
                        <Code2 className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-foreground">Code Practice</span>
                      </div>
                      <textarea
                        value={codeInput}
                        onChange={e => setCodeInput(e.target.value)}
                        placeholder="// Paste or write your code here..."
                        className="w-full h-32 rounded-xl px-4 py-3 text-xs font-mono outline-none resize-none"
                        style={{ background: "hsl(210 15% 8%)", border: "1px solid hsl(210 10% 14%)", color: "hsl(152 100% 70%)" }}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => sendMessage(`Please review and explain this code:\n\`\`\`\n${codeInput}\n\`\`\``)}
                          disabled={!codeInput.trim()}
                          className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold disabled:opacity-30 transition-all hover:scale-[1.02]"
                          style={{ background: "linear-gradient(135deg, hsl(152 68% 46% / 0.2), hsl(172 66% 50% / 0.15))", border: "1px solid hsl(152 80% 50% / 0.2)", color: "hsl(152 100% 65%)" }}>
                          Explain Code
                        </button>
                        <button onClick={() => sendMessage(`Find bugs and suggest improvements for this code:\n\`\`\`\n${codeInput}\n\`\`\``)}
                          disabled={!codeInput.trim()}
                          className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold disabled:opacity-30 transition-all hover:scale-[1.02]"
                          style={{ background: "hsl(210 15% 12%)", border: "1px solid hsl(210 10% 18%)", color: "hsl(210 10% 75%)" }}>
                          Debug Code
                        </button>
                      </div>
                    </div>

                    {/* Daily tip */}
                    <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg, hsl(152 68% 46% / 0.08), hsl(172 66% 50% / 0.05))", border: "1px solid hsl(152 80% 50% / 0.15)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-primary">Daily Coding Tip</span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed">
                        "Always name your variables descriptively. <code className="px-1 py-0.5 rounded text-primary" style={{ background: "hsl(210 15% 14%)" }}>userAge</code> is better than <code className="px-1 py-0.5 rounded text-primary" style={{ background: "hsl(210 15% 14%)" }}>x</code>."
                      </p>
                    </div>
                  </div>
                )}

                {/* ═══════════ LEARNING PATH TAB ═══════════ */}
                {activeTab === "learning" && (
                  <div className="flex-1 overflow-y-auto p-5 space-y-4" style={scrollStyle}>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-foreground mb-1">🗺️ Learning Path</h3>
                      <p className="text-xs text-muted-foreground">Choose your journey</p>
                    </div>

                    {studentProfile.length > 0 && (
                      <div className="rounded-2xl p-4" style={accentCardStyle}>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Your Profile</p>
                        <div className="flex flex-wrap gap-2">
                          {studentProfile.map((p, i) => (
                            <span key={i} className="px-3 py-1 rounded-full text-[10px] font-medium"
                              style={{ background: "hsl(152 80% 50% / 0.12)", color: "hsl(152 100% 65%)", border: "1px solid hsl(152 80% 50% / 0.2)" }}>
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {[
                      { title: "Java Bootcamp", desc: "10-day intensive: Java + SQL + Project", icon: "☕", msg: "Tell me about Chadi's Java Bootcamp. What will I learn and how can I join?" },
                      { title: "Web Development", desc: "HTML, CSS, JavaScript, React", icon: "🌐", msg: "Create a learning path for web development from scratch to building full apps." },
                      { title: "Python Fundamentals", desc: "Variables to data structures", icon: "🐍", msg: "Create a beginner Python learning path with exercises for each topic." },
                      { title: "Data Structures & Algorithms", desc: "Essential CS concepts", icon: "🧮", msg: "Guide me through the most important data structures and algorithms for interviews." },
                    ].map(path => (
                      <button key={path.title} onClick={() => sendMessage(path.msg)}
                        className="w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-all hover:scale-[1.01]"
                        style={cardStyle}>
                        <span className="text-2xl">{path.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{path.title}</p>
                          <p className="text-[10px] text-muted-foreground">{path.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </button>
                    ))}

                    <button onClick={() => sendMessage("I want to start learning right now. Help me pick the best starting point based on my level.")}
                      className="w-full rounded-2xl p-4 text-center transition-all hover:scale-[1.01]"
                      style={{ background: "linear-gradient(135deg, hsl(152 68% 46% / 0.15), hsl(172 66% 50% / 0.1))", border: "1px solid hsl(152 80% 50% / 0.2)" }}>
                      <GraduationCap className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-bold text-primary">🚀 Start Learning Now</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Get a personalized recommendation</p>
                    </button>
                  </div>
                )}

                {/* ═══════════ PORTFOLIO TAB ═══════════ */}
                {activeTab === "portfolio" && (
                  <div className="flex-1 overflow-y-auto p-5 space-y-4" style={scrollStyle}>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-foreground mb-1">💼 Portfolio Guide</h3>
                      <p className="text-xs text-muted-foreground">Let me show you around</p>
                    </div>

                    <div className="space-y-2">
                      {PORTFOLIO_SECTIONS.map(section => (
                        <button key={section.hash} onClick={() => navigateTo(section.hash)}
                          className="w-full flex items-center gap-3 rounded-2xl p-4 text-left transition-all hover:scale-[1.01]"
                          style={cardStyle}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "hsl(152 80% 50% / 0.1)" }}>
                            <section.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">{section.label}</p>
                            <p className="text-[10px] text-muted-foreground">{section.desc}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ask the AI about:</p>
                      {[
                        { label: "Explain TenderFlow Project", msg: "Tell me about the TenderFlow project. What technologies were used?" },
                        { label: "What makes Chadi unique?", msg: "What makes Chadi Troudi stand out as a developer and tutor?" },
                        { label: "Tutoring & Bootcamp info", msg: "Tell me about Chadi's tutoring services and the Java Bootcamp." },
                      ].map(item => (
                        <button key={item.label} onClick={() => sendMessage(item.msg)}
                          className="w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all hover:scale-[1.01]"
                          style={{ ...accentCardStyle, color: "hsl(152 100% 65%)" }}>
                          {item.label} →
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ═══════════ PROGRESS TAB ═══════════ */}
                {activeTab === "progress" && (
                  <div className="flex-1 overflow-y-auto p-5 space-y-4" style={scrollStyle}>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-foreground mb-1">📊 My Progress</h3>
                      <p className="text-xs text-muted-foreground">Track your learning journey</p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Topics Studied", value: memory.topicsStudied.length, icon: BookOpen, color: "152" },
                        { label: "Challenges Done", value: memory.challengesFinished, icon: Zap, color: "40" },
                        { label: "Sessions", value: memory.history.length, icon: Clock, color: "200" },
                        { label: "Level", value: memory.difficultyLevel || "Not set", icon: Target, color: "280" },
                      ].map(stat => (
                        <div key={stat.label} className="rounded-2xl p-4" style={cardStyle}>
                          <stat.icon className="w-5 h-5 text-primary mb-2" />
                          <p className="text-xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Topics studied */}
                    {memory.topicsStudied.length > 0 && (
                      <div className="rounded-2xl p-4" style={cardStyle}>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold text-foreground">Topics Explored</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {memory.topicsStudied.slice(-10).map((topic, i) => (
                            <span key={i} className="px-3 py-1 rounded-full text-[10px] font-medium truncate max-w-[180px]"
                              style={{ background: "hsl(152 80% 50% / 0.1)", color: "hsl(152 100% 65%)", border: "1px solid hsl(152 80% 50% / 0.15)" }}>
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preferred language */}
                    {memory.preferredLanguage && (
                      <div className="rounded-2xl p-4" style={accentCardStyle}>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Preferred Language</p>
                        <p className="text-sm font-semibold text-primary">{memory.preferredLanguage}</p>
                      </div>
                    )}

                    {/* Suggested actions */}
                    <div className="space-y-2">
                      <button onClick={() => sendMessage("Based on what I've learned so far, what should I study next? Give me personalized suggestions.")}
                        className="w-full rounded-2xl p-4 text-center transition-all hover:scale-[1.01]"
                        style={{ background: "linear-gradient(135deg, hsl(152 68% 46% / 0.12), hsl(172 66% 50% / 0.08))", border: "1px solid hsl(152 80% 50% / 0.2)" }}>
                        <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-xs font-bold text-primary">Get Next Step Recommendation</p>
                      </button>
                      <button onClick={() => sendMessage("Review my weakest areas and create a focused practice plan for me.")}
                        className="w-full rounded-2xl p-4 text-center transition-all hover:scale-[1.01]"
                        style={cardStyle}>
                        <Target className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-xs font-bold text-foreground">Practice Weak Topics</p>
                      </button>
                    </div>

                    {memory.topicsStudied.length === 0 && (
                      <div className="text-center py-8">
                        <Brain className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">No progress yet. Start chatting to track your learning!</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ═══════════ MEMORY TAB ═══════════ */}
                {activeTab === "memory" && (
                  <div className="flex-1 overflow-y-auto p-5 space-y-4" style={scrollStyle}>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-foreground mb-1">🧠 Learning Memory</h3>
                      <p className="text-xs text-muted-foreground">Your tutor remembers your journey</p>
                    </div>

                    {/* Memory stats */}
                    <div className="rounded-2xl p-4 space-y-3" style={cardStyle}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Last Session</span>
                        <span className="text-xs text-foreground">{memory.lastSession ? new Date(memory.lastSession.date).toLocaleDateString() : "None"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Last Topic</span>
                        <span className="text-xs text-primary truncate max-w-[150px]">{memory.lastSession?.topic || "None"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Total Topics</span>
                        <span className="text-xs font-bold text-foreground">{memory.topicsStudied.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Challenges Done</span>
                        <span className="text-xs font-bold text-foreground">{memory.challengesFinished}</span>
                      </div>
                    </div>

                    {/* Recent history */}
                    {memory.history.length > 0 && (
                      <div className="rounded-2xl p-4" style={cardStyle}>
                        <p className="text-xs font-bold text-foreground mb-3">Recent Activity</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto" style={scrollStyle}>
                          {[...memory.history].reverse().slice(0, 15).map((entry, i) => (
                            <div key={i} className="flex items-center gap-3 text-[11px]">
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                entry.type === "challenge" ? "bg-yellow-400" :
                                entry.type === "lesson" ? "bg-green-400" : "bg-blue-400"
                              }`} />
                              <span className="text-muted-foreground truncate flex-1">{entry.topic}</span>
                              <span className="text-muted-foreground/50 flex-shrink-0">{new Date(entry.date).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="space-y-2">
                      <button onClick={() => sendMessage("Welcome me back and summarize what I've been learning. Suggest what to do next based on my history.")}
                        className="w-full rounded-2xl p-3 text-xs font-semibold transition-all hover:scale-[1.01]"
                        style={{ ...accentCardStyle, color: "hsl(152 100% 65%)" }}>
                        📚 Resume Last Lesson
                      </button>
                      <button onClick={() => sendMessage("Review everything I've studied and give me a summary of my strengths and areas for improvement.")}
                        className="w-full rounded-2xl p-3 text-xs font-semibold transition-all hover:scale-[1.01]"
                        style={{ ...cardStyle, color: "hsl(210 10% 75%)" }}>
                        📝 What Did I Learn?
                      </button>
                      <button onClick={() => sendMessage("Show me my overall progress. What am I good at? What should I focus on improving?")}
                        className="w-full rounded-2xl p-3 text-xs font-semibold transition-all hover:scale-[1.01]"
                        style={{ ...cardStyle, color: "hsl(210 10% 75%)" }}>
                        📊 Show My Progress
                      </button>
                      <button onClick={clearMemory}
                        className="w-full rounded-2xl p-3 text-xs font-semibold transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                        style={{ background: "hsl(0 70% 50% / 0.08)", border: "1px solid hsl(0 70% 50% / 0.15)", color: "hsl(0 70% 60%)" }}>
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear Learning Memory
                      </button>
                    </div>

                    {memory.history.length === 0 && (
                      <div className="text-center py-6">
                        <History className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No memory yet. Start learning and I'll remember everything!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIVoiceTutor;
