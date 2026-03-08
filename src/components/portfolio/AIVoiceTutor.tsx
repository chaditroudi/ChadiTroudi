import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Mic, MicOff, Volume2, VolumeX,
  MessageSquareText, AudioLines, BookOpen, FolderGit2,
  Code2, GraduationCap, Compass, Zap, Trophy, Brain,
  ChevronRight, Play, Pause, Square, Bot, Sparkles,
  BarChart3, Map, User,
} from "lucide-react";
import AIAvatar from "./AIAvatar";

type Message = { role: "user" | "assistant"; content: string };
type Tab = "chat" | "challenges" | "learning" | "portfolio";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const WELCOME_MESSAGE =
  "Hello and welcome! 🚀 I'm your AI Coding Tutor. I can help you discover projects, choose what to learn, and support you step by step in programming. What would you like to do?";

const QUICK_ACTIONS = [
  { label: "🎓 Start Learning", msg: "I want to start learning programming. Help me find the right path based on my level.", icon: BookOpen },
  { label: "💼 Explore Projects", msg: "Show me Chadi's coding projects and explain the technologies used.", icon: FolderGit2 },
  { label: "💻 Ask Coding Question", msg: "I have a coding question. Can you help me?", icon: Code2 },
  { label: "🗺️ Learning Path", msg: "Recommend a learning path for me. I'll tell you my level and goals.", icon: Compass },
];

const SUGGESTED_PROMPTS = [
  "Help me learn JavaScript",
  "Give me a coding challenge",
  "Explain Python basics",
  "Show me your projects",
  "Help me debug code",
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
  { label: "Beginner", icon: "🌱", color: "152 80% 50%" },
  { label: "Intermediate", icon: "🔧", color: "40 90% 55%" },
  { label: "Advanced", icon: "🚀", color: "0 70% 55%" },
];

const PORTFOLIO_SECTIONS = [
  { label: "About Me", hash: "#about", icon: User },
  { label: "My Projects", hash: "#projects", icon: FolderGit2 },
  { label: "Skills", hash: "#skills", icon: BarChart3 },
  { label: "Experience", hash: "#experience", icon: Trophy },
  { label: "Tutoring", hash: "#tutoring", icon: GraduationCap },
  { label: "Contact", hash: "#contact", icon: Send },
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
    .replace(/[🚀🎓💼💻🗺️☕🟨🐍🌐📚🏋️🛠️🌱🔧⚡🏆🧠✨]/g, "");

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
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => { scrollRef.current && (scrollRef.current.scrollTop = scrollRef.current.scrollHeight); }, [messages, onboardingStep]);
  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open, activeTab]);

  // Welcome on first open
  useEffect(() => {
    if (open && !hasWelcomed) {
      setHasWelcomed(true);
      setMessages([{ role: "assistant", content: WELCOME_MESSAGE }]);
      setOnboardingStep(0);
      setTimeout(() => {
        if (voiceEnabled) speakText(WELCOME_MESSAGE);
      }, 600);
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
      const contextMsg = `The student just completed onboarding. Their profile: Level: ${newProfile[0]}, Wants to learn: ${newProfile[1]}, Goal: ${newProfile[2]}. Give them a personalized welcome and suggest what to do next. Be warm and specific.`;
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
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: allMessages }),
      });
      if (!resp.ok || !resp.body) throw new Error("Stream failed");
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
  }, [voiceEnabled, speakText]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    setInput("");
    setOnboardingStep(-1);
    setActiveTab("chat");
    const userMsg: Message = { role: "user", content: msg };
    const all = [...messages, userMsg];
    setMessages(all);
    await streamChat(all);
  }, [input, isLoading, messages, streamChat]);

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

  const currentOnboarding = onboardingStep >= 0 && onboardingStep < ONBOARDING_STEPS.length ? ONBOARDING_STEPS[onboardingStep] : null;

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: "chat", label: "Chat", icon: MessageSquareText },
    { id: "challenges", label: "Challenges", icon: Zap },
    { id: "learning", label: "Learning", icon: Map },
    { id: "portfolio", label: "Portfolio", icon: FolderGit2 },
  ];

  return (
    <>
      {/* "Chat with AI Tutor" floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl font-semibold text-sm shadow-2xl"
        style={{
          background: "linear-gradient(135deg, hsl(152 68% 46%), hsl(172 66% 50%))",
          color: "hsl(222 22% 5%)",
          boxShadow: "0 0 30px hsl(152 100% 50% / 0.25), 0 8px 32px -4px rgba(0,0,0,0.4)",
        }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 40px hsl(152 100% 50% / 0.4), 0 12px 40px -4px rgba(0,0,0,0.5)" }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Chat with AI Tutor"
      >
        <Bot className="w-5 h-5" />
        <span>Chat with AI Tutor</span>
        <Sparkles className="w-4 h-4 opacity-70" />
      </motion.button>

      {/* Modal overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl h-[90vh] max-h-[700px] rounded-3xl overflow-hidden flex flex-col md:flex-row"
              style={{
                background: "hsl(222 22% 7%)",
                border: "1px solid hsl(152 80% 50% / 0.12)",
                boxShadow: "0 0 80px hsl(152 100% 50% / 0.08), 0 40px 80px -20px rgba(0,0,0,0.6)",
              }}
            >
              {/* Close button */}
              <button onClick={() => { setOpen(false); stopSpeaking(); }}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "hsl(210 15% 15%)", border: "1px solid hsl(210 10% 22%)" }}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* ═══ LEFT SIDE: Robot Character ═══ */}
              <div className="hidden md:flex w-[280px] flex-col items-center justify-between flex-shrink-0 relative overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, hsl(222 22% 6%) 0%, hsl(210 20% 8%) 50%, hsl(222 22% 5%) 100%)",
                  borderRight: "1px solid hsl(152 80% 50% / 0.08)",
                }}>
                {/* Top badge */}
                <div className="pt-5 pb-2 flex flex-col items-center gap-2 z-10">
                  <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: "hsl(152 80% 50% / 0.12)", color: "hsl(152 100% 60%)", border: "1px solid hsl(152 80% 50% / 0.2)" }}>
                    <Bot className="w-3 h-3 inline mr-1" />AI Coding Mentor
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center px-4">
                    {isSpeaking ? "🔊 Speaking..." : isListening ? "🎤 Listening..." : isLoading ? "💭 Thinking..." : "Ready to help you learn"}
                  </p>
                </div>

                {/* Robot avatar */}
                <div className="flex-1 flex items-center justify-center w-full px-4">
                  <AIAvatar isSpeaking={isSpeaking} isListening={isListening} size="full" />
                </div>

                {/* Voice controls */}
                <div className="pb-5 pt-2 flex flex-col items-center gap-3 z-10 w-full px-4">
                  {/* Play/Pause/Stop controls */}
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
                    {/* Mic button */}
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

                    {/* Mute/unmute */}
                    <button onClick={() => { setVoiceEnabled(!voiceEnabled); if (isSpeaking) stopSpeaking(); }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                      style={{ background: "hsl(210 15% 14%)", border: "1px solid hsl(210 10% 22%)" }}>
                      {voiceEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>

                  <p className="text-[8px] text-muted-foreground/50 text-center">🔒 Voice processed in-browser</p>
                </div>

                {/* Background decoration */}
                <div className="absolute inset-0 dot-pattern opacity-5" />
                <motion.div className="absolute top-[20%] left-[10%] w-40 h-40 rounded-full blur-[80px]"
                  style={{ background: "hsl(152 68% 46% / 0.06)" }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>

              {/* ═══ RIGHT SIDE: Chat & Tools ═══ */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Tab bar */}
                <div className="flex items-center border-b px-3 pt-3 pb-0 gap-1 flex-shrink-0"
                  style={{ borderColor: "hsl(210 10% 14%)", background: "hsl(222 22% 7%)" }}>
                  {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-xl text-xs font-semibold transition-all relative ${
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

                  {/* Mobile mic button */}
                  <div className="md:hidden ml-auto flex items-center gap-1 pb-2">
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

                {/* ═══ CHAT TAB ═══ */}
                {activeTab === "chat" && (
                  <div className="flex-1 flex flex-col min-h-0">
                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "hsl(210 10% 20%) transparent",
                      }}>
                      {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          {msg.role === "assistant" && (
                            <div className="w-8 h-8 rounded-xl flex-shrink-0 mt-1 flex items-center justify-center"
                              style={{ background: "hsl(152 80% 50% / 0.1)", border: "1px solid hsl(152 80% 50% / 0.15)" }}>
                              <Bot className="w-4 h-4 text-primary" />
                            </div>
                          )}
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === "user"
                              ? "rounded-br-md"
                              : "rounded-bl-md"
                          }`} style={{
                            background: msg.role === "user" ? "hsl(152 68% 46% / 0.15)" : "hsl(210 15% 12%)",
                            border: msg.role === "user" ? "1px solid hsl(152 68% 46% / 0.2)" : "1px solid hsl(210 10% 16%)",
                            color: "hsl(210 20% 88%)",
                          }}>
                            {msg.content}
                          </div>
                          {msg.role === "user" && (
                            <div className="w-8 h-8 rounded-xl flex-shrink-0 mt-1 flex items-center justify-center"
                              style={{ background: "hsl(200 80% 50% / 0.1)", border: "1px solid hsl(200 80% 50% / 0.15)" }}>
                              <User className="w-4 h-4" style={{ color: "hsl(200 100% 65%)" }} />
                            </div>
                          )}
                        </motion.div>
                      ))}

                      {/* Onboarding choices */}
                      {currentOnboarding && !isLoading && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pl-11">
                          <p className="text-xs text-muted-foreground mb-2">{currentOnboarding.question}</p>
                          <div className="flex flex-wrap gap-2">
                            {currentOnboarding.options.map(opt => (
                              <button key={opt.value} onClick={() => handleOnboardingChoice(opt.value)}
                                className="px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                                style={{
                                  background: "hsl(210 15% 13%)",
                                  border: "1px solid hsl(152 80% 50% / 0.2)",
                                  color: "hsl(152 100% 65%)",
                                }}>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Quick actions */}
                      {onboardingStep === -1 && messages.length <= 2 && !isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pl-11 space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            {QUICK_ACTIONS.map(a => (
                              <button key={a.label} onClick={() => sendMessage(a.msg)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all hover:scale-[1.02]"
                                style={{
                                  background: "hsl(210 15% 11%)",
                                  border: "1px solid hsl(210 10% 18%)",
                                  color: "hsl(210 10% 75%)",
                                }}>
                                <a.icon size={14} className="text-primary flex-shrink-0" />
                                <span>{a.label}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Loading indicator */}
                      {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
                            style={{ background: "hsl(152 80% 50% / 0.1)", border: "1px solid hsl(152 80% 50% / 0.15)" }}>
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                          <div className="rounded-2xl rounded-bl-md px-4 py-3"
                            style={{ background: "hsl(210 15% 12%)", border: "1px solid hsl(210 10% 16%)" }}>
                            <div className="flex gap-1.5 items-center">
                              {[0, 150, 300].map(d => (
                                <span key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: `${d}ms`, background: "hsl(152 68% 46% / 0.5)" }} />
                              ))}
                              <span className="text-[10px] text-muted-foreground ml-2">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Voice speaking feedback with controls */}
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

                    {/* Suggested prompts */}
                    {messages.length > 2 && messages.length < 8 && !isLoading && (
                      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                        {SUGGESTED_PROMPTS.slice(0, 3).map(prompt => (
                          <button key={prompt} onClick={() => sendMessage(prompt)}
                            className="text-[10px] px-3 py-1.5 rounded-full transition-all hover:scale-105"
                            style={{ background: "hsl(210 15% 12%)", border: "1px solid hsl(210 10% 18%)", color: "hsl(210 10% 65%)" }}>
                            {prompt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input area */}
                    <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid hsl(210 10% 14%)" }}>
                      {input && isListening && (
                        <p className="text-[10px] text-muted-foreground italic text-center mb-2 truncate">🎤 "{input}"</p>
                      )}
                      <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                          placeholder="Ask me anything about coding..."
                          className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/50"
                          style={{
                            background: "hsl(210 15% 10%)",
                            border: "1px solid hsl(210 10% 18%)",
                            color: "hsl(210 20% 88%)",
                          }}
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

                {/* ═══ CHALLENGES TAB ═══ */}
                {activeTab === "challenges" && (
                  <div className="flex-1 overflow-y-auto p-5 space-y-5" style={{ scrollbarWidth: "thin", scrollbarColor: "hsl(210 10% 20%) transparent" }}>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-foreground mb-1">⚡ Coding Challenges</h3>
                      <p className="text-xs text-muted-foreground">Pick a difficulty and sharpen your skills</p>
                    </div>

                    {/* Progress */}
                    <div className="rounded-2xl p-4" style={{ background: "hsl(210 15% 10%)", border: "1px solid hsl(210 10% 16%)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Challenges Completed</span>
                        <span className="text-sm font-bold text-primary">{challengesCompleted}</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ background: "hsl(210 15% 15%)" }}>
                        <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, hsl(152 68% 46%), hsl(172 66% 50%))" }}
                          animate={{ width: `${Math.min((challengesCompleted / 10) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Difficulty selection */}
                    <div className="space-y-2">
                      {CHALLENGE_LEVELS.map(level => (
                        <button key={level.label} onClick={() => { requestChallenge(level.label); setChallengesCompleted(p => p + 1); }}
                          className="w-full flex items-center justify-between rounded-2xl p-4 transition-all hover:scale-[1.01]"
                          style={{
                            background: "hsl(210 15% 10%)",
                            border: `1px solid hsl(${level.color} / 0.2)`,
                          }}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{level.icon}</span>
                            <div className="text-left">
                              <p className="text-sm font-semibold text-foreground">{level.label}</p>
                              <p className="text-[10px] text-muted-foreground">{
                                level.label === "Beginner" ? "Variables, loops, basic logic" :
                                level.label === "Intermediate" ? "Data structures, algorithms, OOP" :
                                "System design, optimization, advanced patterns"
                              }</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>

                    {/* Quick challenge buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => sendMessage("Give me a quick debugging challenge. Show me buggy code and let me find the error.")}
                        className="rounded-xl p-3 text-left transition-all hover:scale-[1.02]"
                        style={{ background: "hsl(210 15% 10%)", border: "1px solid hsl(210 10% 16%)" }}>
                        <Brain className="w-5 h-5 text-primary mb-1" />
                        <p className="text-xs font-semibold text-foreground">Debug Challenge</p>
                        <p className="text-[10px] text-muted-foreground">Find the bug</p>
                      </button>
                      <button onClick={() => sendMessage("Give me a logic puzzle / algorithm exercise. Include examples and expected output.")}
                        className="rounded-xl p-3 text-left transition-all hover:scale-[1.02]"
                        style={{ background: "hsl(210 15% 10%)", border: "1px solid hsl(210 10% 16%)" }}>
                        <Zap className="w-5 h-5 text-primary mb-1" />
                        <p className="text-xs font-semibold text-foreground">Logic Puzzle</p>
                        <p className="text-[10px] text-muted-foreground">Test your thinking</p>
                      </button>
                      <button onClick={() => sendMessage("Give me a quick quiz with 3 multiple-choice coding questions. Wait for my answers before showing solutions.")}
                        className="rounded-xl p-3 text-left transition-all hover:scale-[1.02]"
                        style={{ background: "hsl(210 15% 10%)", border: "1px solid hsl(210 10% 16%)" }}>
                        <Trophy className="w-5 h-5 text-primary mb-1" />
                        <p className="text-xs font-semibold text-foreground">Quick Quiz</p>
                        <p className="text-[10px] text-muted-foreground">3 questions</p>
                      </button>
                      <button onClick={() => sendMessage("Explain the solution to the last coding challenge you gave me. Be detailed and educational.")}
                        className="rounded-xl p-3 text-left transition-all hover:scale-[1.02]"
                        style={{ background: "hsl(210 15% 10%)", border: "1px solid hsl(210 10% 16%)" }}>
                        <BookOpen className="w-5 h-5 text-primary mb-1" />
                        <p className="text-xs font-semibold text-foreground">Explain Solution</p>
                        <p className="text-[10px] text-muted-foreground">Learn why</p>
                      </button>
                    </div>

                    {/* Daily tip */}
                    <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg, hsl(152 68% 46% / 0.08), hsl(172 66% 50% / 0.05))", border: "1px solid hsl(152 80% 50% / 0.15)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-primary">Daily Coding Tip</span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed">
                        "Always name your variables descriptively. <code className="px-1 py-0.5 rounded text-primary" style={{ background: "hsl(210 15% 14%)" }}>userAge</code> is better than <code className="px-1 py-0.5 rounded text-primary" style={{ background: "hsl(210 15% 14%)" }}>x</code>. Your future self will thank you!"
                      </p>
                    </div>
                  </div>
                )}

                {/* ═══ LEARNING PATH TAB ═══ */}
                {activeTab === "learning" && (
                  <div className="flex-1 overflow-y-auto p-5 space-y-5" style={{ scrollbarWidth: "thin", scrollbarColor: "hsl(210 10% 20%) transparent" }}>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-foreground mb-1">🗺️ Learning Path</h3>
                      <p className="text-xs text-muted-foreground">Choose your journey</p>
                    </div>

                    {studentProfile.length > 0 && (
                      <div className="rounded-2xl p-4" style={{ background: "hsl(152 80% 50% / 0.06)", border: "1px solid hsl(152 80% 50% / 0.12)" }}>
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

                    {/* Learning paths */}
                    {[
                      { title: "Java Bootcamp", desc: "10-day intensive: Java + SQL + Project", icon: "☕", msg: "Tell me about Chadi's Java Bootcamp. What will I learn and how can I join?" },
                      { title: "Web Development", desc: "HTML, CSS, JavaScript, React", icon: "🌐", msg: "Create a learning path for web development from scratch to building full apps." },
                      { title: "Python Fundamentals", desc: "Variables to data structures", icon: "🐍", msg: "Create a beginner Python learning path with exercises for each topic." },
                      { title: "Data Structures & Algorithms", desc: "Essential CS concepts", icon: "🧮", msg: "Guide me through the most important data structures and algorithms for interviews." },
                    ].map(path => (
                      <button key={path.title} onClick={() => sendMessage(path.msg)}
                        className="w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-all hover:scale-[1.01]"
                        style={{ background: "hsl(210 15% 10%)", border: "1px solid hsl(210 10% 16%)" }}>
                        <span className="text-2xl">{path.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{path.title}</p>
                          <p className="text-[10px] text-muted-foreground">{path.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </button>
                    ))}

                    {/* Start Learning CTA */}
                    <button onClick={() => sendMessage("I want to start learning programming right now. Help me pick the best starting point based on what I know.")}
                      className="w-full rounded-2xl p-4 text-center transition-all hover:scale-[1.01]"
                      style={{
                        background: "linear-gradient(135deg, hsl(152 68% 46% / 0.15), hsl(172 66% 50% / 0.1))",
                        border: "1px solid hsl(152 80% 50% / 0.2)",
                      }}>
                      <GraduationCap className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-bold text-primary">🚀 Start Learning Now</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Get a personalized recommendation</p>
                    </button>
                  </div>
                )}

                {/* ═══ PORTFOLIO GUIDE TAB ═══ */}
                {activeTab === "portfolio" && (
                  <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ scrollbarWidth: "thin", scrollbarColor: "hsl(210 10% 20%) transparent" }}>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-foreground mb-1">💼 Portfolio Guide</h3>
                      <p className="text-xs text-muted-foreground">Let me show you around Chadi's platform</p>
                    </div>

                    {/* Navigate to sections */}
                    <div className="space-y-2">
                      {PORTFOLIO_SECTIONS.map(section => (
                        <button key={section.hash} onClick={() => navigateTo(section.hash)}
                          className="w-full flex items-center gap-3 rounded-2xl p-4 text-left transition-all hover:scale-[1.01]"
                          style={{ background: "hsl(210 15% 10%)", border: "1px solid hsl(210 10% 16%)" }}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "hsl(152 80% 50% / 0.1)" }}>
                            <section.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">{section.label}</p>
                            <p className="text-[10px] text-muted-foreground">Navigate to {section.label.toLowerCase()}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>

                    {/* Ask about projects */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ask the AI about:</p>
                      {[
                        { label: "Explain TenderFlow Project", msg: "Tell me about the TenderFlow project. What technologies were used and what problem does it solve?" },
                        { label: "What makes Chadi unique?", msg: "What makes Chadi Troudi stand out as a developer and tutor? Present his profile professionally." },
                        { label: "Tutoring & Bootcamp info", msg: "Tell me about Chadi's tutoring services and the Java Bootcamp. How can I enroll?" },
                      ].map(item => (
                        <button key={item.label} onClick={() => sendMessage(item.msg)}
                          className="w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all hover:scale-[1.01]"
                          style={{
                            background: "hsl(152 80% 50% / 0.06)",
                            border: "1px solid hsl(152 80% 50% / 0.12)",
                            color: "hsl(152 100% 65%)",
                          }}>
                          {item.label} →
                        </button>
                      ))}
                    </div>
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
