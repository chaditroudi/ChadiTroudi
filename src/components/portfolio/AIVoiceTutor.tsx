import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Mic, MicOff, Volume2, VolumeX, GraduationCap,
} from "lucide-react";
import AIAvatar from "./AIAvatar";
import robotImg from "@/assets/robot-avatar.jpg";

type Message = { role: "user" | "assistant"; content: string };

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
  // Strip markdown
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

  // Try to pick a nice English voice
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

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Welcome message on first open
  useEffect(() => {
    if (open && !hasWelcomed) {
      setHasWelcomed(true);
      const welcomeMsg: Message = { role: "assistant", content: WELCOME_MESSAGE };
      setMessages([welcomeMsg]);

      // Speak welcome after a short delay
      if (voiceEnabled) {
        setTimeout(() => {
          speak(
            WELCOME_MESSAGE,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false)
          );
        }, 500);
      }
    }
  }, [open, hasWelcomed, voiceEnabled]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.abort();
    };
  }, []);

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
            // Check if this is the streaming assistant message (not welcome)
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

        // Speak the full response
        if (voiceEnabled && assistantSoFar) {
          speak(
            assistantSoFar,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false)
          );
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

  // ─── Send text message ─────────────────────────────────────
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

  // ─── Voice input ───────────────────────────────────────────
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
        // Auto-send after speech ends
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

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  }, [isListening, streamChat]);

  // Stop speaking
  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  return (
    <>
      {/* Floating button - neon robot */}
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

      {/* Chat panel - neon theme */}
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
            {/* Header with robot avatar - neon theatrical */}
            <div
              className="px-4 pt-3 pb-2 border-b"
              style={{
                background: "linear-gradient(180deg, hsl(210 20% 8%) 0%, hsl(210 15% 12%) 100%)",
                borderColor: "hsl(152 80% 50% / 0.15)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3
                  className="font-bold text-sm"
                  style={{
                    color: "hsl(152 100% 60%)",
                    textShadow: "0 0 10px hsl(152 100% 50% / 0.4)",
                  }}
                >
                  🤖 AI Coding Tutor
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setVoiceEnabled(!voiceEnabled);
                      if (isSpeaking) stopSpeaking();
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground"
                    title={voiceEnabled ? "Mute voice" : "Enable voice"}
                  >
                    {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  </button>
                </div>
              </div>
              {/* Robot stage with neon backdrop */}
              <div className="flex justify-center py-1">
                <AIAvatar isSpeaking={isSpeaking} isListening={isListening} size="lg" />
              </div>
              <p
                className="text-center text-xs mt-2 pb-1 font-medium"
                style={{
                  color: isSpeaking
                    ? "hsl(152 100% 60%)"
                    : isListening
                    ? "hsl(200 100% 65%)"
                    : "hsl(210 10% 55%)",
                  textShadow: isSpeaking || isListening ? "0 0 8px currentColor" : "none",
                }}
              >
                {isSpeaking
                  ? "🔊 Speaking to you..."
                  : isListening
                  ? "🎤 I'm listening..."
                  : isLoading
                  ? "💭 Thinking..."
                  : "Your friendly coding mentor"}
              </p>
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
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <GraduationCap className="w-4 h-4 text-primary" />
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
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4 text-primary" />
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

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2"
              >
                {/* Mic button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                    isListening
                      ? "bg-destructive text-destructive-foreground animate-pulse"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  title={isListening ? "Stop listening" : "Speak to tutor"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Ask me anything..."}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIVoiceTutor;
