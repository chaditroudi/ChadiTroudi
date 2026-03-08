import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Mic, MicOff, Volume2, VolumeX,
  MessageSquareText, AudioLines,
} from "lucide-react";
import AIAvatar from "./AIAvatar";
import robotImg from "@/assets/robot-avatar.jpg";

type Message = { role: "user" | "assistant"; content: string };
type Mode = "voice" | "text";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const WELCOME_MESSAGE =
  "Hello! 👋 Welcome to the coding tutor platform. I'm your AI assistant. I can help you learn programming, explore projects, or guide you through coding courses. What would you like to learn today?";

const QUICK_QUESTIONS = [
  "Explain OOP in Java",
  "What is Spring Boot?",
  "Tell me about Chadi's projects",
  "How do I start learning React?",
];

// ─── Speech helpers ─────────────────────────────────────────────
const getSpeechRecognition = (): any | null => {
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.continuous = false;
  r.interimResults = true;
  r.lang = "en-US";
  return r;
};

const speak = (text: string, onStart?: () => void, onEnd?: () => void) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const clean = text
    .replace(/```[\s\S]*?```/g, "code block")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  const u = new SpeechSynthesisUtterance(clean);
  u.rate = 1; u.pitch = 1; u.volume = 1; u.lang = "en-US";
  const voices = window.speechSynthesis.getVoices();
  const pref = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel")));
  if (pref) u.voice = pref;
  u.onstart = () => onStart?.();
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  window.speechSynthesis.speak(u);
};

// ─── Component ──────────────────────────────────────────────────
const AIVoiceTutor = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("voice");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => { scrollRef.current && (scrollRef.current.scrollTop = scrollRef.current.scrollHeight); }, [messages]);
  useEffect(() => { if (open && mode === "text" && inputRef.current) inputRef.current.focus(); }, [open, mode]);

  // Auto welcome with voice on first open
  useEffect(() => {
    if (open && !hasWelcomed) {
      setHasWelcomed(true);
      const msg: Message = { role: "assistant", content: WELCOME_MESSAGE };
      setMessages([msg]);
      setTimeout(() => {
        speak(WELCOME_MESSAGE, () => setIsSpeaking(true), () => setIsSpeaking(false));
      }, 500);
    }
  }, [open, hasWelcomed]);

  useEffect(() => () => { window.speechSynthesis?.cancel(); recognitionRef.current?.abort(); }, []);

  const switchMode = (m: Mode) => {
    setMode(m);
    setVoiceEnabled(m === "voice");
    if (m === "text") { window.speechSynthesis?.cancel(); setIsSpeaking(false); setIsListening(false); }
  };

  // ─── Stream chat ────────────────────────────────────────────
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
      let buf = "", done = false;
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
      if (voiceEnabled && assistantSoFar) speak(assistantSoFar, () => setIsSpeaking(true), () => setIsSpeaking(false));
    } catch { upsert("Sorry, I'm having trouble right now. Please try again."); }
    finally { setIsLoading(false); }
  }, [voiceEnabled]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    setInput("");
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
        if (e.results[i].isFinal) finalT += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setInput(finalT + interim);
    };
    recognition.onend = () => {
      setIsListening(false);
      if (finalT.trim()) {
        setTimeout(() => {
          setInput("");
          const userMsg: Message = { role: "user", content: finalT.trim() };
          setMessages(prev => { const all = [...prev, userMsg]; streamChat(all); return all; });
        }, 300);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  }, [isListening, streamChat]);

  const stopSpeaking = () => { window.speechSynthesis?.cancel(); setIsSpeaking(false); };

  return (
    <>
      {/* Floating robot button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg flex items-center justify-center overflow-hidden"
        style={{
          border: "2px solid hsl(152 100% 50% / 0.6)",
          boxShadow: "0 0 20px hsl(152 100% 50% / 0.3), 0 0 40px hsl(152 100% 50% / 0.15)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Tutor"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="w-full h-full bg-primary flex items-center justify-center">
              <X className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="relative w-full h-full">
              <img src={robotImg} alt="AI Tutor" className="w-full h-full object-cover" />
              {!hasWelcomed && (
                <motion.span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-primary-foreground"
                  style={{ background: "hsl(0 80% 55%)", boxShadow: "0 0 8px hsl(0 80% 55% / 0.6)" }}
                  animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>!</motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[80vh] rounded-2xl bg-card shadow-2xl flex flex-col overflow-hidden"
            style={{
              border: "1px solid hsl(152 80% 50% / 0.2)",
              boxShadow: "0 0 30px hsl(152 100% 50% / 0.1), 0 25px 50px -12px rgba(0,0,0,0.4)",
            }}
          >
            {/* ═══ VOICE MODE ═══ */}
            {mode === "voice" && (
              <div className="flex-1 flex flex-col" style={{ background: "linear-gradient(180deg, hsl(210 20% 6%) 0%, hsl(210 15% 10%) 40%, hsl(210 20% 8%) 100%)" }}>
                {/* Top bar */}
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <h3 className="font-bold text-sm" style={{ color: "hsl(152 100% 60%)", textShadow: "0 0 12px hsl(152 100% 50% / 0.4)" }}>
                    🤖 AI Voice Tutor
                  </h3>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setVoiceEnabled(!voiceEnabled); if (isSpeaking) stopSpeaking(); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent/20 transition-colors text-muted-foreground">
                      {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    </button>
                    <button onClick={() => switchMode("text")}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ border: "1px solid hsl(152 80% 50% / 0.25)", color: "hsl(152 100% 60%)" }}>
                      <MessageSquareText size={12} />
                      Text Mode
                    </button>
                  </div>
                </div>

                {/* Robot avatar - big central stage */}
                <div className="flex-shrink-0 flex flex-col items-center pt-2 pb-3">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
                    <AIAvatar isSpeaking={isSpeaking} isListening={isListening} size="xl" />
                  </motion.div>
                  <motion.p
                    className="text-xs font-medium mt-3"
                    style={{
                      color: isSpeaking ? "hsl(152 100% 60%)" : isListening ? "hsl(200 100% 65%)" : isLoading ? "hsl(40 90% 60%)" : "hsl(210 10% 55%)",
                      textShadow: isSpeaking || isListening ? "0 0 10px currentColor" : "none",
                    }}
                    animate={isSpeaking || isListening ? { opacity: [0.7, 1, 0.7] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {isSpeaking ? "🔊 Speaking..." : isListening ? "🎤 Listening to you..." : isLoading ? "💭 Thinking..." : "Tap the mic to talk"}
                  </motion.p>
                </div>

                {/* Scrollable voice conversation */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 space-y-2 min-h-0">
                  {messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "assistant" && (
                        <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 mt-0.5 ring-1 ring-primary/30">
                          <img src={robotImg} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary/20 text-foreground rounded-br-sm"
                          : "bg-muted/50 text-foreground rounded-bl-sm"
                      }`} style={{ borderLeft: msg.role === "assistant" ? "2px solid hsl(152 80% 50% / 0.3)" : undefined }}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                    <div className="flex gap-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-primary/30">
                        <img src={robotImg} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="bg-muted/50 rounded-xl px-4 py-2">
                        <div className="flex gap-1">
                          {[0, 150, 300].map(d => <span key={d} className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Voice input area */}
                <div className="p-4 flex flex-col items-center gap-3">
                  {input && <p className="text-xs text-muted-foreground italic text-center max-w-[280px] truncate">"{input}"</p>}
                  <div className="flex items-center gap-4">
                    {/* Quick text input */}
                    <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                      <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Or type..."
                        className="w-[140px] bg-muted/30 rounded-full px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/50"
                        style={{ border: "1px solid hsl(210 10% 20%)" }}
                        disabled={isLoading || isListening}
                      />
                      <button type="submit" disabled={isLoading || !input.trim()}
                        className="w-8 h-8 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center disabled:opacity-30 text-xs">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    {/* Big mic button */}
                    <motion.button
                      onClick={toggleListening}
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: isListening
                          ? "linear-gradient(135deg, hsl(0 70% 50%), hsl(0 60% 40%))"
                          : "linear-gradient(135deg, hsl(200 80% 50%), hsl(220 80% 40%))",
                        boxShadow: isListening
                          ? "0 0 30px hsl(0 70% 50% / 0.5), 0 0 60px hsl(0 70% 50% / 0.2)"
                          : "0 0 25px hsl(200 80% 50% / 0.4), 0 0 50px hsl(200 80% 50% / 0.15)",
                      }}
                      animate={isListening ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                      transition={{ duration: 0.8, repeat: isListening ? Infinity : 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ TEXT MODE ═══ */}
            {mode === "text" && (
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="px-4 py-2.5 border-b flex items-center gap-3"
                  style={{ background: "linear-gradient(180deg, hsl(210 20% 8%) 0%, hsl(210 15% 11%) 100%)", borderColor: "hsl(152 80% 50% / 0.15)" }}>
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-1 flex-shrink-0" style={{ ringColor: "hsl(152 80% 50% / 0.3)" }}>
                    <img src={robotImg} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs" style={{ color: "hsl(152 100% 60%)", textShadow: "0 0 8px hsl(152 100% 50% / 0.3)" }}>
                      AI Coding Tutor
                    </h3>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {isLoading ? "💭 Thinking..." : "Text mode • Ask me anything"}
                    </p>
                  </div>
                  <button onClick={() => switchMode("voice")}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ border: "1px solid hsl(200 80% 55% / 0.25)", color: "hsl(200 100% 65%)" }}>
                    <AudioLines size={12} />
                    Voice
                  </button>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-1 ring-1 ring-primary/30">
                          <img src={robotImg} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
                      }`}>{msg.content}</div>
                    </div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-primary/30">
                        <img src={robotImg} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          {[0, 150, 300].map(d => <span key={d} className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick questions */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2">
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_QUESTIONS.map(q => (
                        <button key={q} onClick={() => sendMessage(q)}
                          className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted hover:bg-accent transition-colors">{q}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Text input */}
                <div className="p-3 border-t border-border">
                  <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                    <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                      disabled={isLoading} />
                    <button type="submit" disabled={isLoading || !input.trim()}
                      className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity flex-shrink-0">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIVoiceTutor;
