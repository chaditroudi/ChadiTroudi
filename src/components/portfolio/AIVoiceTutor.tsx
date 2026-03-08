import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Mic, MicOff, Volume2, VolumeX, GraduationCap,
  MessageSquareText, AudioLines,
} from "lucide-react";
import AIAvatar from "./AIAvatar";
import robotImg from "@/assets/robot-avatar.jpg";

type Message = { role: "user" | "assistant"; content: string };
type Mode = "welcome" | "text" | "voice";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const WELCOME_MESSAGE =
  "Hello! 👋 Welcome to the coding tutor platform. I'm your AI assistant. I can help you learn programming, explore projects, or guide you through coding courses. What would you like to learn today?";

const QUICK_QUESTIONS = [
  "Explain OOP in Java",
  "What is Spring Boot?",
  "Tell me about Chadi's projects",
  "How do I start learning React?",
  "What's the Java Bootcamp?",
];

// ─── Speech helpers ─────────────────────────────────────────────
const getSpeechRecognition = (): any | null => {
  const SR =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  if (!SR) return null;
  const recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  return recognition;
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

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  utterance.lang = "en-US";

  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel"))
  );
  if (preferred) utterance.voice = preferred;

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
};

// ─── Component ──────────────────────────────────────────────────
const AIVoiceTutor = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("welcome");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (open && mode === "text" && inputRef.current) inputRef.current.focus();
  }, [open, mode]);

  // Welcome speech when opening
  useEffect(() => {
    if (open && !hasWelcomed) {
      setHasWelcomed(true);
      // Speak welcome on the welcome screen
      setTimeout(() => {
        speak(
          "Hello! Welcome to the coding tutor platform. I'm your AI assistant. Choose how you'd like to interact with me.",
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }, 600);
    }
  }, [open, hasWelcomed]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.abort();
    };
  }, []);

  // When selecting a mode
  const selectMode = (m: "text" | "voice") => {
    setMode(m);
    setVoiceEnabled(m === "voice");
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

    if (messages.length === 0) {
      const welcomeMsg: Message = { role: "assistant", content: WELCOME_MESSAGE };
      setMessages([welcomeMsg]);
      if (m === "voice") {
        setTimeout(() => {
          speak(WELCOME_MESSAGE, () => setIsSpeaking(true), () => setIsSpeaking(false));
        }, 300);
      }
    }
  };

  // ─── Stream chat ────────────────────────────────────────────
  const streamChat = useCallback(
    async (allMessages: Message[]) => {
      setIsLoading(true);
      let assistantSoFar = "";

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last.content !== WELCOME_MESSAGE || (prev.length > 1 && last?.role === "assistant")) {
            const isStreaming = prev.length >= 2;
            if (isStreaming && last?.role === "assistant") {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
              );
            }
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
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
            let line = buf.slice(0, nl);
            buf = buf.slice(nl + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") {
              done = true;
              break;
            }
            try {
              const parsed = JSON.parse(json);
              const c = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (c) upsert(c);
            } catch {
              buf = line + "\n" + buf;
              break;
            }
          }
        }

        if (voiceEnabled && assistantSoFar) {
          speak(assistantSoFar, () => setIsSpeaking(true), () => setIsSpeaking(false));
        }
      } catch (err) {
        console.error("Chat error:", err);
        upsert("Sorry, I'm having trouble right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [voiceEnabled]
  );

  const sendMessage = useCallback(
    async (text?: string) => {
      const msg = text || input.trim();
      if (!msg || isLoading) return;
      setInput("");
      const userMsg: Message = { role: "user", content: msg };
      const allMessages = [...messages, userMsg];
      setMessages(allMessages);
      await streamChat(allMessages);
    },
    [input, isLoading, messages, streamChat]
  );

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = getSpeechRecognition();
    if (!recognition) {
      alert("Your browser does not support speech recognition. Try Chrome.");
      return;
    }

    recognitionRef.current = recognition;
    let finalTranscript = "";

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript;
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      setInput(finalTranscript + interim);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (finalTranscript.trim()) {
        setTimeout(() => {
          setInput("");
          const userMsg: Message = { role: "user", content: finalTranscript.trim() };
          setMessages((prev) => {
            const all = [...prev, userMsg];
            streamChat(all);
            return all;
          });
        }, 300);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  }, [isListening, streamChat]);

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => { setOpen(!open); if (open) { setMode("welcome"); } }}
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
            <motion.div key="tutor" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="relative w-full h-full">
              <img src={robotImg} alt="AI Tutor" className="w-full h-full object-cover" />
              {!hasWelcomed && (
                <motion.span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-primary-foreground"
                  style={{ background: "hsl(0 80% 55%)", boxShadow: "0 0 8px hsl(0 80% 55% / 0.6)" }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  !
                </motion.span>
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
            className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[75vh] rounded-2xl bg-card shadow-2xl flex flex-col overflow-hidden"
            style={{
              border: "1px solid hsl(152 80% 50% / 0.2)",
              boxShadow: "0 0 30px hsl(152 100% 50% / 0.1), 0 25px 50px -12px rgba(0,0,0,0.4)",
            }}
          >
            <AnimatePresence mode="wait">
              {/* ═══════ WELCOME SCREEN ═══════ */}
              {mode === "welcome" && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col items-center justify-center px-6"
                  style={{
                    background: "linear-gradient(180deg, hsl(210 20% 6%) 0%, hsl(210 15% 10%) 50%, hsl(210 20% 6%) 100%)",
                  }}
                >
                  {/* Robot avatar - big theatrical presentation */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                  >
                    <AIAvatar isSpeaking={isSpeaking} isListening={false} size="xl" />
                  </motion.div>

                  {/* Welcome text */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-4 mb-8"
                  >
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{
                        color: "hsl(152 100% 60%)",
                        textShadow: "0 0 15px hsl(152 100% 50% / 0.4)",
                      }}
                    >
                      Hello! I'm your AI Tutor 🤖
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                      I can help you learn programming, explore projects, or guide you through coding courses.
                    </p>
                  </motion.div>

                  {/* Mode selection buttons */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-4 w-full max-w-[300px]"
                  >
                    {/* Text mode */}
                    <button
                      onClick={() => selectMode("text")}
                      className="flex-1 flex flex-col items-center gap-3 py-5 px-4 rounded-xl transition-all duration-300 group"
                      style={{
                        background: "hsl(210 15% 12%)",
                        border: "1px solid hsl(152 80% 50% / 0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "hsl(152 100% 50% / 0.6)";
                        e.currentTarget.style.boxShadow = "0 0 20px hsl(152 100% 50% / 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "hsl(152 80% 50% / 0.2)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: "hsl(152 80% 50% / 0.1)",
                          border: "1px solid hsl(152 80% 50% / 0.3)",
                        }}
                      >
                        <MessageSquareText size={22} style={{ color: "hsl(152 100% 60%)" }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">Text Chat</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Type your questions</p>
                      </div>
                    </button>

                    {/* Voice mode */}
                    <button
                      onClick={() => selectMode("voice")}
                      className="flex-1 flex flex-col items-center gap-3 py-5 px-4 rounded-xl transition-all duration-300 group"
                      style={{
                        background: "hsl(210 15% 12%)",
                        border: "1px solid hsl(200 80% 55% / 0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "hsl(200 100% 60% / 0.6)";
                        e.currentTarget.style.boxShadow = "0 0 20px hsl(200 100% 60% / 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "hsl(200 80% 55% / 0.2)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: "hsl(200 80% 55% / 0.1)",
                          border: "1px solid hsl(200 80% 55% / 0.3)",
                        }}
                      >
                        <AudioLines size={22} style={{ color: "hsl(200 100% 65%)" }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">Voice Chat</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Speak with AI</p>
                      </div>
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* ═══════ CHAT SCREEN (text or voice) ═══════ */}
              {(mode === "text" || mode === "voice") && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 flex flex-col"
                >
                  {/* Header */}
                  <div
                    className="px-4 py-2.5 border-b flex items-center gap-3"
                    style={{
                      background: "linear-gradient(180deg, hsl(210 20% 8%) 0%, hsl(210 15% 11%) 100%)",
                      borderColor: "hsl(152 80% 50% / 0.15)",
                    }}
                  >
                    {/* Back to welcome */}
                    <button
                      onClick={() => { setMode("welcome"); window.speechSynthesis?.cancel(); setIsSpeaking(false); setIsListening(false); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent/20 transition-colors text-muted-foreground"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>

                    {/* Mini avatar */}
                    <AIAvatar isSpeaking={isSpeaking} isListening={isListening} size="sm" />

                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold text-xs"
                        style={{ color: "hsl(152 100% 60%)", textShadow: "0 0 8px hsl(152 100% 50% / 0.3)" }}
                      >
                        AI Coding Tutor
                      </h3>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {isSpeaking ? "🔊 Speaking..." : isListening ? "🎤 Listening..." : isLoading ? "💭 Thinking..." : mode === "voice" ? "Voice mode" : "Text mode"}
                      </p>
                    </div>

                    {/* Mode switch */}
                    <div
                      className="flex rounded-lg overflow-hidden"
                      style={{ border: "1px solid hsl(210 10% 25%)" }}
                    >
                      <button
                        onClick={() => { setMode("text"); setVoiceEnabled(false); stopSpeaking(); }}
                        className="px-2 py-1.5 transition-all"
                        style={{
                          background: mode === "text" ? "hsl(152 80% 50% / 0.2)" : "transparent",
                          color: mode === "text" ? "hsl(152 100% 60%)" : "hsl(210 10% 50%)",
                        }}
                        title="Text mode"
                      >
                        <MessageSquareText size={13} />
                      </button>
                      <button
                        onClick={() => { setMode("voice"); setVoiceEnabled(true); }}
                        className="px-2 py-1.5 transition-all"
                        style={{
                          background: mode === "voice" ? "hsl(200 80% 55% / 0.2)" : "transparent",
                          color: mode === "voice" ? "hsl(200 100% 65%)" : "hsl(210 10% 50%)",
                        }}
                        title="Voice mode"
                      >
                        <AudioLines size={13} />
                      </button>
                    </div>

                    {/* Mute/unmute in voice mode */}
                    {mode === "voice" && (
                      <button
                        onClick={() => { setVoiceEnabled(!voiceEnabled); if (isSpeaking) stopSpeaking(); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent/20 transition-colors text-muted-foreground"
                      >
                        {voiceEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                      </button>
                    )}
                  </div>

                  {/* Messages */}
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 && (
                      <div className="text-center text-muted-foreground text-sm mt-4 space-y-2">
                        <p className="font-medium text-foreground">Hi! I'm your AI Coding Tutor 👋</p>
                        <p className="text-xs">Ask me about programming, Chadi's projects, or start learning something new.</p>
                      </div>
                    )}

                    {messages.map((msg, i) => (
                      <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "assistant" && (
                          <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-1 ring-1 ring-primary/30">
                            <img src={robotImg} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}

                    {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-primary/30">
                          <img src={robotImg} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick questions */}
                  {messages.length <= 1 && (
                    <div className="px-4 pb-2">
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_QUESTIONS.map((q) => (
                          <button
                            key={q}
                            onClick={() => sendMessage(q)}
                            className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted hover:bg-accent transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input area */}
                  <div className="p-3 border-t border-border">
                    {mode === "voice" ? (
                      /* Voice mode: big mic button */
                      <div className="flex flex-col items-center gap-2">
                        {input && (
                          <p className="text-xs text-muted-foreground italic text-center">{input}</p>
                        )}
                        <div className="flex items-center gap-3">
                          <motion.button
                            onClick={toggleListening}
                            className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                            style={{
                              background: isListening
                                ? "hsl(0 70% 50%)"
                                : "linear-gradient(135deg, hsl(200 80% 50%), hsl(200 90% 40%))",
                              boxShadow: isListening
                                ? "0 0 25px hsl(0 70% 50% / 0.5)"
                                : "0 0 20px hsl(200 80% 50% / 0.3)",
                            }}
                            animate={isListening ? { scale: [1, 1.08, 1] } : {}}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            {isListening ? (
                              <MicOff className="w-6 h-6 text-white" />
                            ) : (
                              <Mic className="w-6 h-6 text-white" />
                            )}
                          </motion.button>
                          {/* Also allow typing in voice mode */}
                          <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="flex gap-2 flex-1"
                          >
                            <input
                              ref={inputRef}
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              placeholder="Or type here..."
                              className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                              disabled={isLoading || isListening}
                            />
                            <button
                              type="submit"
                              disabled={isLoading || !input.trim()}
                              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity flex-shrink-0"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </div>
                    ) : (
                      /* Text mode */
                      <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                        className="flex gap-2"
                      >
                        <input
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Ask me anything..."
                          className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                          disabled={isLoading}
                        />
                        <button
                          type="submit"
                          disabled={isLoading || !input.trim()}
                          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity flex-shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIVoiceTutor;
